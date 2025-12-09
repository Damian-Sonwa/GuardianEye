'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@security-app/ui'
import { Fingerprint, Mail, Lock, LogIn, Eye, EyeOff, User, Shield, UserPlus } from 'lucide-react'
import {
  isBiometricAvailable,
  getBiometricType,
  authenticateBiometric,
  getStoredCredentialId,
} from '@/lib/webauthn'
import { getAuthToken, storeAuthToken, storeUserData, getUserData, isAuthenticated, refreshUserData } from '@/lib/auth-storage'

// Photography-style background images from local assets
const backgroundImages = [
  {
    url: '/images/StockCake-villagers_Images_and_Photos_1764630710.jpg',
    alt: 'Rural African villagers',
  },
  {
    url: '/images/StockCake-security_personnels_with_map_Images_and_Photos_1764630771.jpg',
    alt: 'Security personnel with map',
  },
  {
    url: '/images/StockCake-security_emergency_Images_and_Photos_1764630511.jpg',
    alt: 'Security emergency response',
  },
] as const

type AuthMode = 'login' | 'signup'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('login')
  
  // Check URL params for mode and messages
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const modeParam = params.get('mode')
      if (modeParam === 'signup') {
        setMode('signup')
      }
      
      // Check for role update message
      const message = params.get('message')
      if (message === 'role-updated') {
        alert('Your role has been updated. Please log in again to access new features.')
        // Clean up URL
        window.history.replaceState({}, '', '/auth')
      }
    }
  }, [])
  
  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPin, setShowPin] = useState(false)
  
  // Signup state
  const [name, setName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'USER' | 'SECURITY_OFFICER'>('USER')
  const [invitationCode, setInvitationCode] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricType, setBiometricType] = useState('Biometric')
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Redirect if already authenticated (but only if user is actually logged in, not just after logout)
  useEffect(() => {
    // Small delay to ensure logout has cleared data
    const timer = setTimeout(async () => {
      if (isAuthenticated()) {
        // Refresh user data from backend to get latest role
        const userData = await refreshUserData()
        if (!userData) {
          return
        }
        
        const userRole = userData.role
        
        if (userRole === 'SUPER_ADMIN') {
          router.replace('/admin/dashboard')
        } else if (userRole === 'SECURITY_OFFICER') {
          // Only check verification if user is actually authenticated
          // Don't redirect to verification if they just logged out
          checkSecurityVerificationAndRedirect()
        } else {
          router.replace('/home')
        }
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  const checkSecurityVerificationAndRedirect = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        // No token means user logged out, don't redirect to verification
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/security-verification/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data && data.status === 'approved') {
          router.replace('/security/dashboard')
        } else {
          // Only redirect to verification if user is actually trying to access security features
          // Not if they just logged out
          router.replace('/security/verify')
        }
        // Set a timeout to clear loading if navigation doesn't happen within 2 seconds
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      } else if (response.status === 401) {
        // Unauthorized - user is not authenticated, don't redirect to verification
        setIsLoading(false)
        return
      } else {
        // Other error - only redirect if we have a valid token
        if (token) {
          router.replace('/security/verify')
          setTimeout(() => {
            setIsLoading(false)
          }, 2000)
        } else {
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.error('Error checking verification:', error)
      // On error, don't redirect to verification if user just logged out
      const token = getAuthToken()
      if (token) {
        router.replace('/security/verify')
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      } else {
        setIsLoading(false)
      }
    }
  }

  const handleEmailLogin = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!email || !password) {
      alert('Please enter both email and password')
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      if (response.ok) {
        const data = await response.json()
        storeAuthToken(data.access_token || data.token || 'demo-token')
        if (data.user) {
          storeUserData(data.user)
          
          // Check if security personnel needs verification
          if (data.user.role === 'SECURITY_OFFICER') {
            try {
              const verifyResponse = await fetch('/api/security-verification/status', {
                headers: {
                  'Authorization': `Bearer ${data.access_token || data.token || 'demo-token'}`,
                },
              })
              
              if (verifyResponse.ok) {
                const verifyData = await verifyResponse.json()
                if (!verifyData || verifyData.status !== 'approved') {
                  router.replace('/security/verify')
                  return
                }
              } else {
                router.replace('/security/verify')
                return
              }
            } catch (error) {
              console.error('Error checking verification status:', error)
              router.replace('/security/verify')
              return
            }
          }
        }
        
        // Redirect based on role - keep loading until navigation
        if (data.user?.role === 'SUPER_ADMIN') {
          router.replace('/admin/dashboard')
          // Keep loading state active during navigation
          // It will be cleared when the new page loads
        } else if (data.user?.role === 'SECURITY_OFFICER') {
          router.replace('/security/dashboard')
          // Keep loading state active during navigation
        } else {
          router.replace('/home')
          // Keep loading state active during navigation
        }
        // Don't clear loading immediately - let the router handle navigation
        // The loading state will persist until the new page renders
      } else {
        setIsLoading(false)
        alert('Invalid email or password')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Login error:', error)
      alert('Login failed. Please check your connection and try again.')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !signupEmail || !signupPassword || !confirmPassword) {
      alert('Please fill in all fields')
      return
    }

    if (signupPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (signupPassword.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    if (selectedRole === 'SECURITY_OFFICER' && !invitationCode) {
      alert('Invitation code is required for security officer registration')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email: signupEmail, 
          password: signupPassword,
          role: selectedRole,
          ...(invitationCode && { invitationCode: invitationCode.trim() })
        }),
      })
      
      const contentType = response.headers.get('content-type')
      const isJson = contentType?.includes('application/json')
      
      if (response.ok) {
        const data = isJson ? await response.json() : {}
        
        // If security personnel, auto-login and redirect to verification
        if (selectedRole === 'SECURITY_OFFICER' && data.access_token) {
          storeAuthToken(data.access_token)
          if (data.user) {
            storeUserData(data.user)
          }
          router.replace('/security/verify')
          // Keep loading state until navigation completes
          // Don't clear loading - let router handle it
          return
        }
        
        // For regular users, show success message and switch to login
        setIsLoading(false)
        if (data.emailSent) {
          alert('Registration successful! Please check your email to verify your account before signing in.')
        } else {
          alert('Registration successful! Please sign in.')
        }
        setMode('login')
        setEmail(signupEmail)
      } else {
        setIsLoading(false)
        const errorData = isJson ? await response.json() : {}
        alert(errorData.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Registration error:', error)
      alert('Registration failed. Please check your connection and try again.')
    }
  }

  const handlePinLogin = async () => {
    if (pin.length !== 4) {
      return
    }
    setIsLoading(true)
    try {
      const userData = getUserData()
      if (!userData?.id) {
        alert('Please sign in with email first to use PIN login')
        setShowPin(false)
        return
      }

      const response = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userData.id, pin }),
      })
      
      if (response.ok) {
        const data = await response.json()
        storeAuthToken(data.access_token || data.token)
        if (data.user) {
          storeUserData(data.user)
        }
        
        // Redirect based on role - keep loading until navigation
        if (data.user?.role === 'SUPER_ADMIN') {
          router.replace('/admin/dashboard')
        } else if (data.user?.role === 'SECURITY_OFFICER') {
          checkSecurityVerificationAndRedirect()
        } else {
          router.replace('/home')
        }
        // Set a timeout to clear loading if navigation doesn't happen within 2 seconds
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      } else {
        setIsLoading(false)
        alert('Invalid PIN')
        setPin('')
      }
    } catch (error) {
      setIsLoading(false)
      console.error('PIN login error:', error)
      alert('PIN login failed')
    }
  }

  const handleBiometricAuth = async () => {
    setIsLoading(true)
    setShowBiometricPrompt(false)
    
    try {
      const userData = getUserData()
      const userId = userData?.id || email
      
      if (!userId) {
        throw new Error('Please sign in with email first to enable biometric login')
      }

      const credentialId = getStoredCredentialId(userId)
      const credential = await authenticateBiometric(credentialId || undefined)
      
      if (credential) {
        const credentialIdBase64 = btoa(
          String.fromCharCode(...new Uint8Array(credential.rawId))
        )
        const assertionResponse = credential.response as {
          authenticatorData: ArrayBuffer
          clientDataJSON: ArrayBuffer
          signature: ArrayBuffer
        }
        const responseData = new Uint8Array(assertionResponse.authenticatorData)
        const authenticatorDataBase64 = btoa(
          String.fromCharCode(...responseData)
        )
        const clientDataJSON = new TextDecoder().decode(assertionResponse.clientDataJSON)
        const signature = new Uint8Array(assertionResponse.signature)
        const signatureBase64 = btoa(String.fromCharCode(...signature))

        const response = await fetch('/api/auth/biometric', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credentialId: credentialIdBase64,
            authenticatorData: authenticatorDataBase64,
            clientDataJSON,
            signature: signatureBase64,
            userId,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          storeAuthToken(data.token)
          if (data.user) {
            storeUserData(data.user)
          }
          
          // Redirect based on role - keep loading until navigation
          if (data.user?.role === 'SUPER_ADMIN') {
            router.replace('/admin/dashboard')
          } else if (data.user?.role === 'SECURITY_OFFICER') {
            checkSecurityVerificationAndRedirect()
          } else {
            router.replace('/home')
          }
          // Set a timeout to clear loading if navigation doesn't happen within 2 seconds
          setTimeout(() => {
            setIsLoading(false)
          }, 2000)
        } else {
          setIsLoading(false)
          throw new Error('Biometric authentication failed')
        }
      }
    } catch (error: any) {
      setIsLoading(false)
      console.error('Biometric auth error:', error)
      if (!error.message.includes('cancelled')) {
        alert(`Biometric authentication failed: ${error.message}`)
      }
    }
  }

  // Background image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  // Check biometric availability
  useEffect(() => {
    const checkBiometric = async () => {
      const available = await isBiometricAvailable()
      setBiometricAvailable(available)
      
      if (available) {
        const type = await getBiometricType()
        setBiometricType(type)
        
        const userData = getUserData()
        if (userData?.id && getStoredCredentialId(userData.id)) {
          setTimeout(() => {
            setShowBiometricPrompt(true)
          }, 500)
        }
      }
    }
    
    checkBiometric()
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Photography-style background images with flip animation */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {backgroundImages.map((image, index) => {
            if (index !== currentImageIndex) return null
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {/* Semi-transparent overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-emerald-900/60 to-slate-900/70"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/40 dark:border-white/20"
        >
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LogIn className="inline-block mr-2 h-4 w-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <UserPlus className="inline-block mr-2 h-4 w-4" />
              Sign Up
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mb-6"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-emerald-200 dark:border-emerald-800">
                {mode === 'login' ? (
                  <LogIn className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <UserPlus className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </motion.div>
            <h1 className="text-[28px] font-bold text-slate-900 dark:text-slate-50 mb-2 leading-[120%]">
              {mode === 'login' ? 'Welcome back' : 'Create Account'}
            </h1>
            <p className="text-base font-medium text-slate-700 dark:text-slate-300">
              {mode === 'login' ? 'Securely sign in to your account' : 'Sign up to get started'}
            </p>
          </div>

          {/* Biometric Prompt Modal */}
          <AnimatePresence>
            {showBiometricPrompt && biometricAvailable && mode === 'login' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                onClick={() => setShowBiometricPrompt(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 max-w-sm w-full mx-4 border border-white/30 shadow-2xl"
                >
                  <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                      <Fingerprint className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                      Confirm {biometricType}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Use {biometricType.toLowerCase()} to sign in to your account
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowBiometricPrompt(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleBiometricAuth}
                      disabled={isLoading}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                    >
                      {isLoading ? 'Authenticating...' : 'Continue'}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleEmailLogin} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {!showPin ? (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="password" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              required
                              className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 pr-12 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
                          disabled={isLoading || !email || !password}
                        >
                          {isLoading ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Signing in...
                            </>
                          ) : (
                            <>
                              <LogIn className="mr-2 h-5 w-5" />
                              Sign In
                            </>
                          )}
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="pin"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <label htmlFor="pin" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                            4-Digit PIN
                          </label>
                          <div className="flex gap-3">
                            <input
                              id="pin"
                              type="password"
                              value={pin}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 4)
                                setPin(value)
                                if (value.length === 4) {
                                  setTimeout(() => handlePinLogin(), 100)
                                }
                              }}
                              placeholder="0000"
                              maxLength={4}
                              required
                              className="flex-1 h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-center text-2xl tracking-widest font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                            />
                            <Button
                              type="button"
                              size="lg"
                              variant="outline"
                              onClick={() => setShowPin(!showPin)}
                              className="min-w-[120px] h-14"
                            >
                              <Lock className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPin(!showPin)
                        setPin('')
                        setEmail('')
                        setPassword('')
                      }}
                      className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline transition-colors dark:text-slate-300 dark:hover:text-slate-50"
                    >
                      {showPin ? 'Use email and password instead' : 'Use 4-digit PIN instead'}
                    </button>
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white dark:bg-slate-900 px-4 text-slate-700 dark:text-slate-300">or continue with</span>
                    </div>
                  </div>

                  <div className={`grid gap-3 ${biometricAvailable ? 'grid-cols-2' : 'grid-cols-1'}`}>
                    <Button
                      type="button"
                      size="lg"
                      variant="outline"
                      onClick={() => {}}
                      disabled={isLoading}
                      className="w-full h-14"
                    >
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </Button>

                    {biometricAvailable && (
                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={handleBiometricAuth}
                        disabled={isLoading}
                        className="w-full h-14"
                      >
                        <Fingerprint className="mr-2 h-5 w-5" />
                        {biometricType}
                      </Button>
                    )}
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="signupEmail" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Email
                    </label>
                    <input
                      id="signupEmail"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="signupPassword" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="signupPassword"
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        minLength={6}
                        className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 pr-12 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        minLength={6}
                        className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 pr-12 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Select Your Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRole('USER')
                          setInvitationCode('')
                        }}
                        className={`h-14 rounded-xl border-2 transition-all ${
                          selectedRole === 'USER'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <User className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-sm font-medium">User</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedRole('SECURITY_OFFICER')}
                        className={`h-14 rounded-xl border-2 transition-all ${
                          selectedRole === 'SECURITY_OFFICER'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <Shield className="h-5 w-5 mx-auto mb-1" />
                        <span className="text-sm font-medium">Security</span>
                      </button>
                    </div>
                  </div>

                  {/* Invitation Code for Security Officers */}
                  {selectedRole === 'SECURITY_OFFICER' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label htmlFor="invitationCode" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Invitation Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="invitationCode"
                        type="text"
                        value={invitationCode}
                        onChange={(e) => setInvitationCode(e.target.value)}
                        placeholder="Enter your invitation code"
                        required
                        className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Security officers require an invitation code to register
                      </p>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg mt-6"
                    disabled={isLoading || !name || !signupEmail || !signupPassword || !confirmPassword}
                  >
                    {isLoading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@security-app/ui'
import { Fingerprint, Mail, LogIn, Eye, EyeOff, User, Shield, UserPlus, Lock, ArrowRight } from 'lucide-react'
import {
  isBiometricAvailable,
  getBiometricType,
  authenticateBiometric,
  getStoredCredentialId,
} from '@/lib/webauthn'
import { getAuthToken, storeAuthToken, storeUserData, getUserData, isAuthenticated, refreshUserData } from '@/lib/auth-storage'

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
        window.history.replaceState({}, '', '/auth')
      }
    }
  }, [])
  
  // Login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
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

  // Redirect if already authenticated
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (isAuthenticated()) {
        const userData = await refreshUserData()
        if (!userData) {
          return
        }
        
        const userRole = userData.role
        
        if (userRole === 'SUPER_ADMIN') {
          router.replace('/admin/dashboard')
        } else if (userRole === 'SECURITY_OFFICER') {
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
          router.replace('/security/verify')
        }
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      } else if (response.status === 401) {
        setIsLoading(false)
        return
      } else {
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
        
        if (data.user?.role === 'SUPER_ADMIN') {
          router.replace('/admin/dashboard')
        } else if (data.user?.role === 'SECURITY_OFFICER') {
          router.replace('/security/dashboard')
        } else {
          router.replace('/home')
        }
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
        
        if (selectedRole === 'SECURITY_OFFICER' && data.access_token) {
          storeAuthToken(data.access_token)
          if (data.user) {
            storeUserData(data.user)
          }
          router.replace('/security/verify')
          return
        }
        
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
          
          if (data.user?.role === 'SUPER_ADMIN') {
            router.replace('/admin/dashboard')
          } else if (data.user?.role === 'SECURITY_OFFICER') {
            checkSecurityVerificationAndRedirect()
          } else {
            router.replace('/home')
          }
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#F8FAFC] via-[#DBEAFE] to-[#F8FAFC]">
      {/* Soft background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2563EB]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden">
          {/* Header with Branding */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">GuardianEye</h1>
            <p className="text-sm text-white/90">Security Alerts Made Instant</p>
          </div>

          <div className="p-8">
            {/* Mode Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#2563EB] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="inline-block mr-2 h-4 w-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-[#2563EB] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="inline-block mr-2 h-4 w-4" />
                Sign Up
              </button>
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
                    className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 border border-slate-200 shadow-2xl"
                  >
                    <div className="text-center mb-6">
                      <div className="mx-auto w-16 h-16 rounded-full bg-[#DBEAFE] flex items-center justify-center mb-4">
                        <Fingerprint className="h-8 w-8 text-[#2563EB]" />
                      </div>
                      <h3 className="text-xl font-bold text-[#0F172A] mb-2">
                        Confirm {biometricType}
                      </h3>
                      <p className="text-sm text-slate-600">
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
                        className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
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
                  <form onSubmit={handleEmailLogin} className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#2563EB]" />
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-base text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#2563EB]" />
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
                          className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 pr-12 text-base text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A]"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 bg-[#2563EB] hover:bg-[#1E40AF] text-white shadow-lg rounded-xl font-semibold"
                      disabled={isLoading || !email || !password}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>

                  {biometricAvailable && (
                    <>
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-white px-4 text-slate-500">or continue with</span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="lg"
                        variant="outline"
                        onClick={handleBiometricAuth}
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl border-2 border-slate-200 hover:bg-slate-50"
                      >
                        <Fingerprint className="mr-2 h-5 w-5" />
                        {biometricType}
                      </Button>
                    </>
                  )}
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
                      <label htmlFor="name" className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                        <User className="h-4 w-4 text-[#2563EB]" />
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-base text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="signupEmail" className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#2563EB]" />
                        Email
                      </label>
                      <input
                        id="signupEmail"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-base text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="signupPassword" className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#2563EB]" />
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
                          className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 pr-12 text-base text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A]"
                        >
                          {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="text-sm font-semibold text-[#0F172A] flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#2563EB]" />
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
                          className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 pr-12 text-base text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0F172A]"
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-[#0F172A]">
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
                              ? 'border-[#2563EB] bg-[#DBEAFE]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
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
                              ? 'border-[#2563EB] bg-[#DBEAFE]'
                              : 'border-slate-200 bg-white hover:border-slate-300'
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
                        <label htmlFor="invitationCode" className="text-sm font-semibold text-[#0F172A]">
                          Invitation Code <span className="text-[#EF4444]">*</span>
                        </label>
                        <input
                          id="invitationCode"
                          type="text"
                          value={invitationCode}
                          onChange={(e) => setInvitationCode(e.target.value)}
                          placeholder="Enter your invitation code"
                          required
                          className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-base text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                        />
                        <p className="text-xs text-slate-500">
                          Security officers require an invitation code to register
                        </p>
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 bg-[#2563EB] hover:bg-[#1E40AF] text-white shadow-lg rounded-xl font-semibold mt-6"
                      disabled={isLoading || !name || !signupEmail || !signupPassword || !confirmPassword}
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

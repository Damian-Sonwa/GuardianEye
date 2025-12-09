'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@security-app/ui'
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('No verification token provided')
      return
    }

    verifyEmail(token)
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: verificationToken }),
      })

      const contentType = response.headers.get('content-type')
      const isJson = contentType?.includes('application/json')

      if (response.ok && isJson) {
        const data = await response.json()
        setStatus('success')
        setMessage(data.message || 'Email verified successfully!')
        if (data.user?.email) {
          setEmail(data.user.email)
        }
      } else {
        let errorMessage = 'Verification failed'
        if (isJson) {
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.message || errorMessage
          } catch {
            // If JSON parsing fails, use default message
          }
        }
        setStatus('error')
        setMessage(errorMessage)
      }
    } catch (error) {
      console.error('Verification error:', error)
      setStatus('error')
      setMessage(
        error instanceof Error 
          ? `Verification error: ${error.message}` 
          : 'Failed to verify email. Please try again.'
      )
    }
  }

  const resendVerification = async () => {
    if (!email) {
      alert('Please enter your email address')
      return
    }

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (response.ok) {
        alert('Verification email sent! Please check your inbox.')
      } else {
        alert(data.error || 'Failed to resend verification email')
      }
    } catch (error) {
      console.error('Resend error:', error)
      alert('Failed to resend verification email. Please try again.')
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-400 via-sky-400 to-violet-400 dark:from-emerald-600 dark:via-sky-600 dark:to-violet-600 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/20 dark:bg-slate-900/30 backdrop-blur-xl rounded-[20px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/30 dark:border-white/10"
        >
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-white/30 dark:bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 border border-white/40 dark:border-white/20">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                </div>
                <h1 className="text-[28px] font-bold text-slate-900 dark:text-slate-50 mb-2">
                  Verifying Email...
                </h1>
                <p className="text-base font-medium text-slate-700 dark:text-slate-300">
                  Please wait while we verify your email address
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h1 className="text-[28px] font-bold text-slate-900 dark:text-slate-50 mb-2">
                  Email Verified!
                </h1>
                <p className="text-base font-medium text-slate-700 dark:text-slate-300 mb-6">
                  {message}
                </p>
                <Button
                  onClick={() => router.push('/auth')}
                  className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg"
                >
                  Continue to Login
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-[28px] font-bold text-slate-900 dark:text-slate-50 mb-2">
                  Verification Failed
                </h1>
                <p className="text-base font-medium text-slate-700 dark:text-slate-300 mb-6">
                  {message}
                </p>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full h-12 rounded-xl border-2 border-white/30 bg-white/40 backdrop-blur-sm px-4 text-base font-medium text-slate-900 placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:bg-white/60 focus:ring-4 focus:ring-emerald-500/20 dark:bg-white/20 dark:text-slate-50 dark:placeholder:text-slate-400"
                    />
                  </div>
                  
                  <Button
                    onClick={resendVerification}
                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Resend Verification Email
                  </Button>
                  
                  <Link href="/auth" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-white/30 bg-white/20 backdrop-blur-sm text-slate-900 hover:bg-white/40 dark:text-slate-50"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}


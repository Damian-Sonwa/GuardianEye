'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { ArrowLeft, Mail, Shield, CheckCircle, AlertCircle, Loader2, Copy } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'
import { getAuthToken } from '@/lib/auth-storage'

export default function GenerateCodePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)

  // Only super admin can generate codes
  useRoleGuard(['SUPER_ADMIN'], '/unauthorized')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleGenerateClick = () => {
    if (!email.trim()) {
      setError('Please enter an email address')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setError(null)
    setShowConfirmDialog(true)
  }

  const handleConfirm = async () => {
    setShowConfirmDialog(false)
    setLoading(true)
    setError(null)
    setSuccess(false)
    setEmailSent(false)

    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('You must be logged in to generate invitation codes')
      }

      const response = await fetch('/api/invitation-codes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          role: 'SECURITY_OFFICER',
          expiresInDays: 30,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to generate code')
      }

      const data = await response.json()
      setEmailSent(data.emailSent || false)
      setGeneratedCode(data.code || null)
      setSuccess(true)
      
      // Don't reset form if email failed - user needs to see the code
      if (data.emailSent) {
        setTimeout(() => {
          setEmail('')
          setSuccess(false)
          setEmailSent(false)
          setGeneratedCode(null)
        }, 5000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate invitation code')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmDialog(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] pb-20">
      <header className="sticky top-0 z-10 border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Generate Invitation Code</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card className="rounded-2xl max-w-2xl mx-auto border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">Security Personnel Invitation</CardTitle>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Generate an invitation code for security personnel registration
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Recipient Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                placeholder="security.officer@example.com"
                className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-base text-[#0F172A] placeholder:text-slate-400 transition-all focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10"
                disabled={loading}
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The invitation code will be sent to this email address
              </p>
            </div>

            {/* Generate Button */}
            <Button
              size="lg"
              onClick={handleGenerateClick}
              disabled={loading || !email.trim()}
              className="w-full h-14"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-5 w-5" />
                  Generate & Send Invitation Code
                </>
              )}
            </Button>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#EF4444]">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border-2 ${
                  emailSent
                    ? 'bg-[#10B981]/10 border-[#10B981]/20'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  {emailSent ? (
                    <CheckCircle className="h-6 w-6 text-[#10B981] flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-semibold mb-1 ${
                      emailSent
                        ? 'text-[#10B981]'
                        : 'text-amber-900'
                    }`}>
                      {emailSent ? 'Invitation Code Sent Successfully!' : 'Email Not Sent - Code Generated'}
                    </p>
                    <p className={`text-sm ${
                      emailSent
                        ? 'text-[#10B981]'
                        : 'text-amber-700'
                    }`}>
                      {emailSent 
                        ? `The invitation code has been sent to ${email}. The recipient can now register using the code from their email.`
                        : `Email service is not configured or failed to send. The invitation code has been generated and is shown below. Please share it manually with ${email}.`}
                    </p>
                  </div>
                </div>

                {/* Show Code if Email Failed */}
                {!emailSent && generatedCode && (
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 mb-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                      Invitation Code:
                    </p>
                    <div className="flex items-center gap-3">
                      <code className="flex-1 text-xl font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 px-4 py-3 rounded-lg border-2 border-amber-300 dark:border-amber-700 text-center">
                        {generatedCode}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedCode)
                          setSuccess(false)
                          setTimeout(() => setSuccess(true), 100)
                        }}
                        className="h-12 w-12"
                      >
                        <Copy className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      ⚠️ Copy this code and share it manually with the recipient
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    What happens next:
                  </p>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
                    {emailSent ? (
                      <>
                        <li>The recipient will receive an email with the invitation code</li>
                        <li>They should click the registration link in the email</li>
                      </>
                    ) : (
                      <>
                        <li>Share the invitation code above with the recipient</li>
                        <li>They should visit the registration page</li>
                      </>
                    )}
                    <li>They will select "Security" as their role during registration</li>
                    <li>They will enter the invitation code</li>
                    <li>After registration, they will have SECURITY_OFFICER role</li>
                  </ol>
                </div>

                {!emailSent && (
                  <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      💡 To enable email sending:
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Configure SMTP settings in <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">apps/api/.env</code>. 
                      See <code className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded">EMAIL_SETUP.md</code> for details.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={handleCancel}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                      Confirm Email Address
                    </h3>
                  </div>
                  
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Are you sure you want to send an invitation code to:
                  </p>
                  
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
                    <p className="text-base font-semibold text-slate-900 dark:text-slate-50 text-center">
                      {email}
                    </p>
                  </div>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                    The invitation code will be sent to this email address. The recipient will use it to register as a Security Officer.
                  </p>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1"
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Code
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}



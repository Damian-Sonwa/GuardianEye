'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { ArrowLeft, Copy, Check, Shield } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'

export default function GenerateCodePage() {
  const router = useRouter()
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [secret, setSecret] = useState('')

  // Allow both admin and security officers to generate codes in dev mode
  useRoleGuard(['SECURITY_OFFICER', 'SUPER_ADMIN'], '/unauthorized')

  const generateCode = async () => {
    setLoading(true)
    setError(null)
    setCode(null)

    try {
      const response = await fetch('/api/invitation-codes/generate-dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'SECURITY_OFFICER',
          expiresInDays: 30,
          secret: secret || process.env.NEXT_PUBLIC_DEV_SECRET || 'dev-secret-change-me',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || 'Failed to generate code')
      }

      const data = await response.json()
      setCode(data.code)
    } catch (err: any) {
      setError(err.message || 'Failed to generate invitation code')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
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
        <Card className="rounded-2xl max-w-2xl mx-auto">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-lg">Security Personnel Invitation</CardTitle>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Generate an invitation code for security personnel registration
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            {/* Dev Secret Input */}
            <div className="space-y-2">
              <label htmlFor="secret" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Development Secret Key
              </label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter dev secret (optional in dev mode)"
                className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Default: dev-secret-change-me (for development only)
              </p>
            </div>

            {/* Generate Button */}
            <Button
              size="lg"
              onClick={generateCode}
              disabled={loading}
              className="w-full h-14"
            >
              {loading ? 'Generating...' : 'Generate Invitation Code'}
            </Button>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Generated Code */}
            {code && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                    Invitation Code Generated:
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 text-2xl font-mono font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 px-4 py-3 rounded-lg border-2 border-emerald-300 dark:border-emerald-700">
                      {code}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-12 w-12"
                    >
                      {copied ? (
                        <Check className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    Instructions:
                  </p>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside">
                    <li>Share this code with the person who should register as security personnel</li>
                    <li>They should go to the registration page</li>
                    <li>Fill in their details and enter this code in the "Security Invitation Code" field</li>
                    <li>After registration, they will have SECURITY_OFFICER role</li>
                  </ol>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}



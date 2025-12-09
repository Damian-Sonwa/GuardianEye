'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import { getAuthToken, getUserData } from '@/lib/auth-storage'

export default function SetupPinPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isSetting, setIsSetting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const currentUser = getUserData()
    if (!currentUser) {
      router.push('/auth')
      return
    }
    setUser(currentUser)
  }, [router])

  const handlePinChange = (value: string, index: number) => {
    const newPin = pin.split('')
    newPin[index] = value.slice(-1) // Only take last character
    const updatedPin = newPin.join('').slice(0, 4)
    setPin(updatedPin)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleConfirmPinChange = (value: string, index: number) => {
    const newPin = confirmPin.split('')
    newPin[index] = value.slice(-1)
    const updatedPin = newPin.join('').slice(0, 4)
    setConfirmPin(updatedPin)

    if (value && index < 3) {
      inputRefs.current[index + 4 + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number, isConfirm: boolean) => {
    if (e.key === 'Backspace' && !(isConfirm ? confirmPin : pin)[index] && index > 0) {
      const prevIndex = isConfirm ? index + 4 : index
      inputRefs.current[prevIndex - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (pin.length !== 4) {
      alert('Please enter a 4-digit PIN')
      return
    }

    if (pin !== confirmPin) {
      alert('PINs do not match')
      setConfirmPin('')
      return
    }

    setIsSetting(true)

    try {
      const token = getAuthToken()
      const response = await fetch('/api/auth/setup-pin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      })

      if (response.ok) {
        alert('PIN set successfully! You can now use PIN for quick login.')
        router.push('/security/dashboard')
      } else {
        const error = await response.json().catch(() => ({}))
        alert(error.message || 'Failed to set PIN')
      }
    } catch (error: any) {
      console.error('Error setting PIN:', error)
      alert(`Error: ${error.message || 'Failed to set PIN'}`)
    } finally {
      setIsSetting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-lg">Set Up PIN</CardTitle>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Create a 4-digit PIN for quick and secure login
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* PIN Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Enter 4-Digit PIN
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={pin[index] || ''}
                      onChange={(e) => handlePinChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index, false)}
                      className="flex-1 h-16 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-2xl font-bold text-slate-900 dark:text-slate-50 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  ))}
                </div>
              </div>

              {/* Confirm PIN Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Confirm PIN
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((index) => (
                    <input
                      key={index}
                      ref={(el) => { inputRefs.current[index + 4] = el }}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={confirmPin[index] || ''}
                      onChange={(e) => handleConfirmPinChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index, true)}
                      className="flex-1 h-16 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center text-2xl font-bold text-slate-900 dark:text-slate-50 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSetting || pin.length !== 4 || confirmPin.length !== 4 || pin !== confirmPin}
                className="w-full h-14"
              >
                {isSetting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Setting PIN...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Set PIN
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/security/dashboard')}
                className="w-full"
              >
                Skip for now
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}


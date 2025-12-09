'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@security-app/ui'
import { AlertTriangle, Phone, MapPin, Clock } from 'lucide-react'
import BottomNav from '@/components/bottom-nav'

export default function PanicPage() {
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  const handlePanic = async () => {
    if (countdown > 0) {
      setCountdown(countdown - 1)
      return
    }

    setIsActive(true)
    
    // Send panic alert
    try {
      if (navigator.onLine) {
        const response = await fetch('/api/panic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location,
            timestamp: new Date().toISOString(),
          }),
        })

        if (response.ok) {
          return
        }
      }
      
      // Save to IndexedDB if offline or if request failed
      const { savePanicAlert } = await import('@/lib/offline-db')
      await savePanicAlert(location)
      
      // Try SMS fallback
      await sendSMSFallback()
    } catch (error) {
      console.error('Error sending panic alert:', error)
      // Still save to IndexedDB
      try {
        const { savePanicAlert } = await import('@/lib/offline-db')
        await savePanicAlert(location)
      } catch (dbError) {
        console.error('Error saving to IndexedDB:', dbError)
      }
      await sendSMSFallback()
    }
  }

  const sendSMSFallback = async () => {
    // TODO: Implement SMS via Termii/Africa's Talking
    console.log('Sending SMS fallback...')
  }

  const handleCancel = () => {
    setIsActive(false)
    setCountdown(3)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Panic Button</h1>
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            ×
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {!isActive ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-48 w-48 items-center justify-center rounded-full bg-red-600 shadow-[0_4px_16px_rgba(220,38,38,0.3)]"
                >
                  <AlertTriangle className="h-24 w-24 text-white" />
                </motion.div>
              </div>

              <div className="space-y-4 text-center">
                <h2 className="text-[26px] font-bold text-slate-900 dark:text-slate-50">Emergency Alert</h2>
                <p className="text-base font-medium text-slate-600 dark:text-slate-400 max-w-sm">
                  Press the button below to send an emergency alert with your location
                </p>
              </div>

              <Button
                size="xl"
                variant="panic"
                onClick={handlePanic}
                className="w-full max-w-xs h-16 rounded-2xl text-lg font-bold"
              >
                {countdown > 0 ? `Press to Activate (${countdown})` : 'ACTIVATE PANIC'}
              </Button>

              {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Location ready</span>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-48 w-48 items-center justify-center rounded-full bg-red-600 shadow-[0_4px_16px_rgba(220,38,38,0.4)]"
              >
                <AlertTriangle className="h-24 w-24 text-white" />
              </motion.div>

              <div className="space-y-4 text-center">
                <h2 className="text-[32px] font-bold text-red-600">ALERT SENT!</h2>
                <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                  Your emergency alert has been sent to security agencies
                </p>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span>Help is on the way</span>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-xs">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={() => window.open('tel:911')}
                  className="flex-1"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call 911
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  )
}


'use client'

import { useState, useEffect, useRef } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showBackOnline, setShowBackOnline] = useState(false)
  const wasOfflineRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      const wasOffline = wasOfflineRef.current
      setIsOnline(true)
      
      // Only show "back online" message if we were previously offline
      if (wasOffline) {
        setShowBackOnline(true)
        wasOfflineRef.current = false
        
        // Trigger sync when coming back online
        import('@/lib/sync').then(({ syncOfflineData }) => {
          syncOfflineData()
        })
        
        // Auto-dismiss after 3 seconds
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
          setShowBackOnline(false)
        }, 3000)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      wasOfflineRef.current = true
      setShowBackOnline(false)
      
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium"
        >
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span>You are offline. Reports will be saved locally and synced when online.</span>
          </div>
        </motion.div>
      )}
      {showBackOnline && isOnline && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-emerald-500 text-white px-4 py-2 text-center text-sm font-medium"
        >
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-4 w-4" />
            <span>Back online. Syncing data...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


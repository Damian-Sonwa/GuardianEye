'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, refreshUserData } from '@/lib/auth-storage'

export default function RootPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        // Check if user is already authenticated
        if (isAuthenticated()) {
          // Refresh user data from backend to get latest role
          const userData = await refreshUserData()
          if (!userData) {
            router.replace('/auth')
            return
          }
          
          const userRole = userData.role
          
          // Redirect based on role
          if (userRole === 'SUPER_ADMIN') {
            router.replace('/admin/dashboard')
          } else if (userRole === 'SECURITY_OFFICER') {
            router.replace('/security/dashboard')
          } else {
            router.replace('/home')
          }
          return
        }

        // Not authenticated, immediately redirect to auth page
        router.replace('/auth')
      } catch (error) {
        console.error('Error in root page redirect:', error)
        router.replace('/auth')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAndRedirect()
  }, [router])

  // Show loading state while redirecting
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}

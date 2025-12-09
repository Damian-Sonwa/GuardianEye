'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth-storage'
import { checkAndHandleTokenInvalidation } from '@/lib/token-validator'

/**
 * Provider component that periodically checks token validity
 * and forces logout if token version doesn't match
 */
export function TokenValidatorProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip validation for public routes
    const publicRoutes = ['/auth', '/login', '/register', '/verify-email', '/unauthorized']
    if (publicRoutes.includes(pathname)) {
      return
    }

    // Only check if user is authenticated
    if (!isAuthenticated()) {
      return
    }

    // Check token version every 120 seconds to reduce API calls
    const interval = setInterval(async () => {
      const isValid = await checkAndHandleTokenInvalidation()
      if (!isValid) {
        // Token invalidated - will redirect in checkAndHandleTokenInvalidation
        clearInterval(interval)
      }
    }, 120000) // Check every 120 seconds (2 minutes)

    // Also check immediately on mount
    checkAndHandleTokenInvalidation()

    return () => clearInterval(interval)
  }, [pathname, router])

  return <>{children}</>
}


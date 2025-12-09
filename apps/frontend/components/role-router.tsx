'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getUserData, isAuthenticated, refreshUserData } from '@/lib/auth-storage'
import { getUserRole, getUserRoleFromBackend } from '@/lib/role-guard'
import { checkAndHandleTokenInvalidation } from '@/lib/token-validator'

type UserRole = 'USER' | 'SECURITY_OFFICER' | 'SUPER_ADMIN' | 'COMMUNITY_ADMIN'

// Define which routes are accessible by which roles
const roleRoutes: Record<string, UserRole[]> = {
  // User routes - accessible to all authenticated users
  '/home': ['USER', 'SECURITY_OFFICER', 'SUPER_ADMIN', 'COMMUNITY_ADMIN'],
  '/report': ['USER', 'SECURITY_OFFICER', 'SUPER_ADMIN', 'COMMUNITY_ADMIN'],
  '/map': ['USER', 'SECURITY_OFFICER', 'SUPER_ADMIN', 'COMMUNITY_ADMIN'],
  '/profile': ['USER', 'SECURITY_OFFICER', 'SUPER_ADMIN', 'COMMUNITY_ADMIN'],
  '/settings': ['USER', 'SECURITY_OFFICER', 'SUPER_ADMIN', 'COMMUNITY_ADMIN'],
  '/notifications': ['USER', 'SECURITY_OFFICER', 'SUPER_ADMIN', 'COMMUNITY_ADMIN'],
  '/panic': ['USER', 'SECURITY_OFFICER', 'SUPER_ADMIN', 'COMMUNITY_ADMIN'],
  '/community': ['USER', 'SECURITY_OFFICER', 'SUPER_ADMIN', 'COMMUNITY_ADMIN'],
  
  // Security routes - only for security officers and admins
  '/security': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/dashboard': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/reports': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/ai-match': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/heatmap': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/prioritization': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/collaboration': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/evidence': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/verify': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  '/security/setup-pin': ['SECURITY_OFFICER', 'SUPER_ADMIN'],
  
  // Admin routes - only for super admins
  '/admin': ['SUPER_ADMIN'],
  '/admin/dashboard': ['SUPER_ADMIN'],
  '/admin/users': ['SUPER_ADMIN'],
  '/admin/security-verifications': ['SUPER_ADMIN'],
  '/admin/analytics': ['SUPER_ADMIN'],
  '/admin/generate-code': ['SUPER_ADMIN'],
}

// Public routes that don't require authentication
const publicRoutes = ['/auth', '/login', '/register', '/verify-email', '/unauthorized', '/security/verify']

// Check security verification status
async function checkSecurityVerification(router: any, pathname: string) {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      // No token means user is not authenticated, redirect to auth page
      router.push('/auth')
      return
    }

    const response = await fetch('/api/security-verification/status', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      if (data) {
        if (data.status === 'pending' || data.status === 'rejected') {
          // Redirect to verification page if pending or rejected
          router.push('/security/verify')
          return
        } else if (data.status === 'approved') {
          // Approved - allow access to security dashboard
          if (pathname === '/') {
            router.push('/security/dashboard')
          }
          // For other security routes, allow access
          return
        }
      }
    } else if (response.status === 401) {
      // Unauthorized - user is not authenticated, redirect to auth
      router.push('/auth')
      return
    }
    
    // If no verification record exists or response not ok, redirect to verification
    // But only if we have a valid token
    if (token) {
      router.push('/security/verify')
    } else {
      router.push('/auth')
    }
  } catch (error) {
    console.error('Error checking verification status:', error)
    // On error, check if user is authenticated before redirecting
    const token = localStorage.getItem('auth_token')
    if (token) {
      router.push('/security/verify')
    } else {
      router.push('/auth')
    }
  }
}

export function RoleRouter({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuthAndRole = async () => {
      // Skip check for public routes
      if (publicRoutes.includes(pathname)) {
        setIsChecking(false)
        return
      }

      // Check authentication
      if (!isAuthenticated()) {
        router.push('/auth')
        // Keep loading state active during navigation
        setTimeout(() => setIsChecking(false), 100)
        return
      }

      // Check token version - if invalid, will redirect to auth
      const tokenValid = await checkAndHandleTokenInvalidation()
      if (!tokenValid) {
        setTimeout(() => setIsChecking(false), 100)
        return
      }

      // Try to get user data from cache first, then refresh in background
      let userData = getUserData()
      
      // Only refresh if we don't have cached data or if it's been a while
      if (!userData) {
        userData = await refreshUserData()
        if (!userData) {
          router.push('/auth')
          setTimeout(() => setIsChecking(false), 100)
          return
        }
      } else {
        // Refresh in background without blocking
        refreshUserData().catch(() => {
          // Silently fail background refresh
        })
      }
      
      if (!userData) {
        router.push('/auth')
        setTimeout(() => setIsChecking(false), 100)
        return
      }

      const userRole = userData.role as UserRole
      if (!userRole) {
        router.push('/auth')
        setTimeout(() => setIsChecking(false), 100)
        return
      }

      // Check if route requires specific role
      const allowedRoles = roleRoutes[pathname]
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        router.push('/auth')
        setTimeout(() => setIsChecking(false), 100)
        return
      }

      // SUPER_ADMIN can access all routes without verification
      if (userRole === 'SUPER_ADMIN') {
        // Redirect to admin dashboard if on root
        if (pathname === '/') {
          router.push('/admin/dashboard')
          setTimeout(() => setIsChecking(false), 300)
          return
        }
        // Allow access to all routes including security routes without verification
        setIsChecking(false)
        return
      }
      
      // Check verification status for security officers (but not admins)
      if (userRole === 'SECURITY_OFFICER') {
        // Allow access to verification and PIN setup pages
        if (pathname === '/security/verify' || pathname === '/security/setup-pin') {
          setIsChecking(false)
          return
        }
        
        // For security routes or root redirect, check verification first
        if (pathname.startsWith('/security') || pathname === '/') {
          await checkSecurityVerification(router, pathname)
          // Keep loading state active during navigation
          setTimeout(() => setIsChecking(false), 300)
          return
        }
      }

      // Redirect to appropriate dashboard based on role
      if (pathname === '/') {
        if (userRole === 'SECURITY_OFFICER') {
          // Verification check will handle redirect for security officers
          await checkSecurityVerification(router, pathname)
        } else {
          router.push('/home')
        }
        // Keep loading state active during navigation
        setTimeout(() => setIsChecking(false), 300)
        return
      }
      
      setIsChecking(false)
    }
    
    checkAuthAndRole()
  }, [pathname, router])

  // Show loading state while checking - with visible spinner
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}



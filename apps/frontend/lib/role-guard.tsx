'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUserData, refreshUserData } from './auth-storage'

type UserRole = 'USER' | 'SECURITY_OFFICER' | 'SUPER_ADMIN' | 'COMMUNITY_ADMIN'

/**
 * Role-based navigation guard hook
 * Refreshes user data from backend to ensure latest role
 */
export function useRoleGuard(allowedRoles: UserRole[], redirectTo: string = '/unauthorized') {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkRole = async () => {
      setIsChecking(true)
      
      // Refresh user data from backend to get latest role
      const userData = await refreshUserData()
      
      if (!userData) {
        router.push('/auth')
        return
      }

      const userRole = userData.role as UserRole
      if (!allowedRoles.includes(userRole)) {
        router.push(redirectTo)
        return
      }
      
      setIsChecking(false)
    }
    
    checkRole()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isChecking
}

/**
 * Check if user has required role
 */
export function hasRole(requiredRole: UserRole | UserRole[]): boolean {
  const userData = getUserData()
  if (!userData) return false

  const userRole = userData.role as UserRole
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole)
  }
  return userRole === requiredRole
}

/**
 * Check if user is security officer or admin
 */
export function isSecurityOrAdmin(): boolean {
  return hasRole(['SECURITY_OFFICER', 'SUPER_ADMIN'])
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  return hasRole('SUPER_ADMIN')
}

/**
 * Get user role (from cached data)
 * For fresh data, use refreshUserData() first
 */
export function getUserRole(): UserRole | null {
  const userData = getUserData()
  return userData?.role as UserRole || null
}

/**
 * Get user role from backend (fresh data)
 */
export async function getUserRoleFromBackend(): Promise<UserRole | null> {
  const userData = await refreshUserData()
  return userData?.role as UserRole || null
}


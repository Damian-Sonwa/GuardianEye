/**
 * Logout utility function
 * Clears all auth data and redirects to auth page
 */
import { clearAuthData } from './auth-storage'

export function logout(): void {
  clearAuthData()
  // Force a hard reload to clear any cached state
  window.location.href = '/auth'
}



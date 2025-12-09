/**
 * Token validation utility
 * Checks if the current token is still valid based on tokenVersion
 */
import { getAuthToken, getUserData, clearAuthData } from './auth-storage'

interface TokenPayload {
  sub: string
  email: string
  role: string
  tokenVersion?: number
  iat?: number
  exp?: number
}

/**
 * Decode JWT token (without verification - just for reading payload)
 */
function decodeToken(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Check if token version matches current user's tokenVersion from backend
 */
export async function validateTokenVersion(): Promise<boolean> {
  const token = getAuthToken()
  if (!token) {
    return false
  }

  const payload = decodeToken(token)
  if (!payload || !payload.tokenVersion) {
    // Old token without version - consider it valid but will be updated on next login
    return true
  }

  try {
    // Fetch current user data from backend to check tokenVersion
    const response = await fetch('/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (response.status === 401) {
      // Token is invalid - clear auth data
      clearAuthData()
      return false
    }

    if (response.ok) {
      const userData = await response.json()
      
      // Check if tokenVersion matches
      if (userData.tokenVersion && payload.tokenVersion !== userData.tokenVersion) {
        // Token version mismatch - role was changed, force logout
        clearAuthData()
        return false
      }
      
      return true
    }

    return false
  } catch (error) {
    console.error('Error validating token version:', error)
    return false
  }
}

/**
 * Check token version and handle logout if invalid
 */
export async function checkAndHandleTokenInvalidation(): Promise<boolean> {
  const isValid = await validateTokenVersion()
  
  if (!isValid) {
    // Token is invalid - redirect to auth page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth?message=role-updated'
    }
    return false
  }
  
  return true
}



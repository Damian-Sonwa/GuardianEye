/**
 * Secure Authentication Storage
 * Handles secure storage of tokens and credentials
 */

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'user_data'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Cache for refresh requests to prevent multiple simultaneous calls
let refreshPromise: Promise<any | null> | null = null
let lastRefreshTime = 0
const REFRESH_CACHE_MS = 5000 // Cache for 5 seconds

/**
 * Store authentication token securely
 */
export function storeAuthToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (error) {
    console.error('Error storing auth token:', error)
  }
}

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (error) {
    console.error('Error getting auth token:', error)
    return null
  }
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('Error removing auth token:', error)
  }
}

/**
 * Store refresh token
 */
export function storeRefreshToken(token: string): void {
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch (error) {
    console.error('Error storing refresh token:', error)
  }
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Error getting refresh token:', error)
    return null
  }
}

/**
 * Store user data
 */
export function storeUserData(user: any): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch (error) {
    console.error('Error storing user data:', error)
  }
}

/**
 * Get stored user data
 */
export function getUserData(): any | null {
  try {
    const data = localStorage.getItem(USER_KEY)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error getting user data:', error)
    return null
  }
}

/**
 * Refresh user data from backend
 * This ensures we have the latest role and user information including tokenVersion
 * Uses caching to prevent excessive API calls and includes timeout
 */
export async function refreshUserData(force = false): Promise<any | null> {
  try {
    const token = getAuthToken()
    if (!token) {
      return null
    }

    // Return cached data if refresh was called recently (unless forced)
    const now = Date.now()
    if (!force && refreshPromise && (now - lastRefreshTime) < REFRESH_CACHE_MS) {
      return refreshPromise
    }

    // If a refresh is already in progress, return that promise
    if (refreshPromise && !force) {
      return refreshPromise
    }

    // Create new refresh promise with timeout
    refreshPromise = Promise.race([
      fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).then(async (response) => {
        if (response.ok) {
          const userData = await response.json()
          
          // Check token version if available
          if (userData.tokenVersion !== undefined) {
            // Decode token to get tokenVersion from payload
            try {
              const base64Url = token.split('.')[1]
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              )
              const payload = JSON.parse(jsonPayload)
              
              // If tokenVersion doesn't match, token is invalid
              if (payload.tokenVersion !== undefined && payload.tokenVersion !== userData.tokenVersion) {
                // Token invalidated - clear auth and redirect
                clearAuthData()
                if (typeof window !== 'undefined') {
                  window.location.href = '/auth?message=role-updated'
                }
                return null
              }
            } catch (error) {
              // Error decoding token - continue with refresh
              console.warn('Could not decode token for version check:', error)
            }
          }
          
          storeUserData(userData)
          lastRefreshTime = Date.now()
          return userData
        } else if (response.status === 401) {
          // Token expired or invalid, clear auth data
          clearAuthData()
          if (typeof window !== 'undefined') {
            window.location.href = '/auth?message=role-updated'
          }
          return null
        }
        
        return getUserData() // Return cached data on error
      }),
      new Promise<any | null>((resolve) => {
        setTimeout(() => {
          console.warn('Refresh user data timeout, using cached data')
          resolve(getUserData())
        }, 8000) // 8 second timeout
      })
    ]).catch((error) => {
      console.error('Error refreshing user data:', error)
      return getUserData() // Return cached data on network error
    }).finally(() => {
      // Clear promise after a delay to allow concurrent calls to use it
      setTimeout(() => {
        refreshPromise = null
      }, REFRESH_CACHE_MS)
    })

    return refreshPromise
  } catch (error) {
    console.error('Error refreshing user data:', error)
    return getUserData() // Return cached data on error
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}

/**
 * Clear all authentication data
 */
export function clearAuthData(): void {
  const userData = getUserData()
  if (userData?.id) {
    // Clear WebAuthn credential ID if exists
    try {
      const { removeStoredCredentialId } = require('./webauthn')
      removeStoredCredentialId(userData.id)
    } catch (error) {
      // WebAuthn module might not be available
    }
  }
  removeAuthToken()
}

/**
 * WebAuthn Biometric Authentication Utility
 * Supports fingerprint, Face ID, and other platform authenticators
 */

export interface WebAuthnCredential {
  id: string
  publicKey: string
  counter: number
}

export interface WebAuthnOptions {
  username: string
  displayName: string
}

/**
 * Check if WebAuthn is supported in the browser
 */
export function isWebAuthnSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'PublicKeyCredential' in window &&
    typeof PublicKeyCredential !== 'undefined'
  )

}

/**
 * Check if platform authenticator (biometric) is available
 */
export async function isBiometricAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    return false
  }

  try {
    // Check if platform authenticator is available
    const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    return available
  } catch (error) {
    console.error('Error checking biometric availability:', error)
    return false
  }
}

/**
 * Get the biometric type name (Fingerprint, Face ID, etc.)
 */
export async function getBiometricType(): Promise<string> {
  if (!(await isBiometricAvailable())) {
    return 'Biometric'
  }

  // Try to detect the type (this is a best guess)
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
    return 'Face ID'
  } else if (userAgent.includes('android')) {
    return 'Fingerprint'
  } else if (userAgent.includes('mac')) {
    return 'Touch ID'
  } else if (userAgent.includes('windows')) {
    return 'Windows Hello'
  }
  
  return 'Biometric'
}

/**
 * Register a new WebAuthn credential for biometric authentication
 */
export async function registerBiometric(
  options: WebAuthnOptions
): Promise<PublicKeyCredential | null> {
  if (!(await isBiometricAvailable())) {
    throw new Error('Biometric authentication is not available on this device')
  }

  try {
    // Generate challenge
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    // Create credential creation options
    const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: 'Security App',
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(options.username),
        name: options.username,
        displayName: options.displayName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Use platform authenticator (biometric)
        userVerification: 'required',
      },
      timeout: 60000,
      attestation: 'direct',
    }

    // Create credential
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    }) as PublicKeyCredential

    return credential
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Biometric authentication was cancelled or not available')
    }
    console.error('Error registering biometric:', error)
    throw error
  }
}

/**
 * Authenticate using WebAuthn biometric
 */
export async function authenticateBiometric(
  credentialId?: string
): Promise<PublicKeyCredential | null> {
  if (!(await isBiometricAvailable())) {
    throw new Error('Biometric authentication is not available on this device')
  }

  try {
    // Get stored credential IDs from localStorage or API
    let allowCredentials: PublicKeyCredentialDescriptor[] = []
    
    if (credentialId) {
      allowCredentials = [
        {
          id: base64ToArrayBuffer(credentialId),
          type: 'public-key',
          transports: ['internal'], // Platform authenticator
        },
      ]
    }

    // Generate challenge
    const challenge = new Uint8Array(32)
    crypto.getRandomValues(challenge)

    // Create credential request options
    const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
      rpId: window.location.hostname,
      userVerification: 'required',
      timeout: 60000,
    }

    // Get credential
    const credential = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    }) as PublicKeyCredential

    return credential
  } catch (error: any) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Biometric authentication was cancelled')
    }
    if (error.name === 'InvalidStateError') {
      throw new Error('No biometric credential found. Please register first.')
    }
    console.error('Error authenticating with biometric:', error)
    throw error
  }
}

/**
 * Store credential ID securely in localStorage
 */
export function storeCredentialId(userId: string, credentialId: string): void {
  try {
    const key = `webauthn_credential_${userId}`
    localStorage.setItem(key, credentialId)
  } catch (error) {
    console.error('Error storing credential ID:', error)
  }
}

/**
 * Get stored credential ID for a user
 */
export function getStoredCredentialId(userId: string): string | null {
  try {
    const key = `webauthn_credential_${userId}`
    return localStorage.getItem(key)
  } catch (error) {
    console.error('Error getting stored credential ID:', error)
    return null
  }
}

/**
 * Remove stored credential ID
 */
export function removeStoredCredentialId(userId: string): void {
  try {
    const key = `webauthn_credential_${userId}`
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing credential ID:', error)
  }
}

/**
 * Convert base64 string to ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * Convert ArrayBuffer to base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}


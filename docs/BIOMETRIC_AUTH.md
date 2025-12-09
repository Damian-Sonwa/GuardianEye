# Biometric Authentication Documentation

## Overview

The Security App now supports biometric authentication (fingerprint, Face ID, Touch ID, Windows Hello) using the WebAuthn API. This provides a secure, convenient way for users to authenticate without entering passwords.

## Features

- ✅ **Platform Support**: Works on all modern browsers that support WebAuthn
- ✅ **Multiple Biometric Types**: Automatically detects and supports:
  - Face ID (iOS/iPadOS)
  - Touch ID (iOS/macOS)
  - Fingerprint (Android/Windows)
  - Windows Hello (Windows 10+)
- ✅ **Secure Storage**: Credentials stored securely using browser's credential manager
- ✅ **Fallback Support**: Gracefully falls back to Email/Google/PIN if biometric is unavailable
- ✅ **Auto-Prompt**: Automatically prompts for biometric on login if previously enabled

## Implementation Details

### WebAuthn Integration

The app uses the WebAuthn API to:
1. **Register** biometric credentials when user enables it
2. **Authenticate** using biometric when user signs in
3. **Store** credential IDs securely in localStorage
4. **Verify** credentials on the backend

### Files Structure

```
apps/frontend/
├── lib/
│   ├── webauthn.ts          # WebAuthn utility functions
│   └── auth-storage.ts      # Secure token storage
├── app/
│   ├── login/
│   │   └── page.tsx         # Login page with biometric support
│   ├── settings/
│   │   └── page.tsx         # Settings page to enable/disable biometric
│   └── api/
│       └── auth/
│           └── biometric/
│               └── route.ts # Backend API for biometric verification
```

## Usage

### For Users

1. **Enable Biometric Login**:
   - Sign in with email/password first
   - Go to Settings
   - Toggle "Biometric Login" to enable
   - Follow the prompt to register your fingerprint/Face ID

2. **Sign In with Biometric**:
   - On the login page, click the biometric button (Fingerprint/Face ID)
   - Confirm with your biometric
   - You'll be automatically signed in

3. **Disable Biometric**:
   - Go to Settings
   - Toggle "Biometric Login" to disable

### For Developers

#### Check Biometric Availability

```typescript
import { isBiometricAvailable, getBiometricType } from '@/lib/webauthn'

const available = await isBiometricAvailable()
const type = await getBiometricType() // "Face ID", "Fingerprint", etc.
```

#### Register Biometric

```typescript
import { registerBiometric } from '@/lib/webauthn'

const credential = await registerBiometric({
  username: 'user@example.com',
  displayName: 'John Doe',
})
```

#### Authenticate with Biometric

```typescript
import { authenticateBiometric, getStoredCredentialId } from '@/lib/webauthn'

const userId = 'user-id'
const credentialId = getStoredCredentialId(userId)
const credential = await authenticateBiometric(credentialId)
```

## Security Considerations

1. **Credential Storage**: Credential IDs are stored in localStorage (not sensitive data)
2. **Backend Verification**: All biometric authentications must be verified on the backend
3. **Token Management**: JWT tokens are stored securely and cleared on logout
4. **Fallback**: If biometric fails, users can always use Email/Google/PIN

## Browser Support

- ✅ Chrome/Edge 67+
- ✅ Firefox 60+
- ✅ Safari 13+ (macOS/iOS)
- ✅ Opera 54+

## API Endpoints

### POST `/api/auth/biometric`

Verifies biometric credentials and returns JWT token.

**Request Body**:
```json
{
  "credentialId": "base64-encoded-credential-id",
  "authenticatorData": "base64-encoded-authenticator-data",
  "clientDataJSON": "base64-encoded-client-data",
  "signature": "base64-encoded-signature",
  "userId": "user-id"
}
```

**Response**:
```json
{
  "success": true,
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Troubleshooting

### Biometric Not Available

- Check if device supports biometric authentication
- Ensure browser supports WebAuthn API
- Check if HTTPS is enabled (required for WebAuthn)

### Registration Fails

- User may have cancelled the prompt
- Device may not support platform authenticator
- Browser may not have permission to access biometric sensor

### Authentication Fails

- Credential may not be registered
- User may have cancelled the prompt
- Backend verification may have failed

## Future Enhancements

- [ ] Support for multiple credentials per user
- [ ] Cross-device biometric sync
- [ ] Biometric re-authentication for sensitive actions
- [ ] Biometric-based passwordless login

## References

- [WebAuthn API Specification](https://www.w3.org/TR/webauthn-2/)
- [MDN WebAuthn Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
- [WebAuthn.io](https://webauthn.io/) - Testing and examples


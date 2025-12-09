# Role Selection and Security Verification System

## Overview

The system now supports role-based registration with identity verification for security personnel and PIN setup after verification.

## Registration Flow

### 1. Role Selection During Registration

Users can now select their role during registration:
- **Regular User (USER)**: Default role, no verification needed
- **Security Personnel (SECURITY_OFFICER)**: Requires identity verification
- **Admin (SUPER_ADMIN)**: Cannot be selected during registration - must be assigned via database

### 2. Security Personnel Registration Flow

1. **Registration**
   - User selects "Security Personnel" role
   - Completes registration form
   - Automatically logged in after registration
   - Redirected to `/security/verify`

2. **Identity Verification** (`/security/verify`)
   - Upload required documents:
     - National ID Card (required)
     - Work ID Card (optional)
     - Police ID / Badge (optional)
   - Enter badge number and organization
   - Submit for admin review
   - Status: `pending` → `approved` or `rejected`

3. **PIN Setup** (`/security/setup-pin`) - After Verification
   - Only accessible after verification is approved
   - Create 4-digit PIN for quick login
   - Can skip and set up later

4. **Access Security Dashboard**
   - After verification and optional PIN setup
   - Full access to security features

## Database Schema

### New Models

**SecurityVerification**
- Stores verification documents and status
- Links to User via `userId`
- Status: `pending`, `approved`, `rejected`

## API Endpoints

### Registration
```
POST /auth/register
Body: {
  email: string
  password: string
  name?: string
  role?: 'USER' | 'SECURITY_OFFICER'  // ADMIN cannot be selected
}
```

### Security Verification
```
POST /security-verification/submit
Headers: Authorization: Bearer <token>
Body: {
  idCardUrl?: string
  workIdUrl?: string
  policeIdUrl?: string
  badgeNumber?: string
  organization?: string
}

GET /security-verification/status
Headers: Authorization: Bearer <token>
```

### PIN Setup
```
POST /auth/setup-pin
Headers: Authorization: Bearer <token>
Body: {
  pin: string  // 4 digits
}
```

### Admin Verification Management
```
GET /security-verification/pending
POST /security-verification/approve/:userId
POST /security-verification/reject/:userId
```

## Admin Role Assignment

Admin role can **only** be assigned through database:

```sql
UPDATE "User" 
SET role = 'SUPER_ADMIN' 
WHERE email = 'admin@example.com';
```

## File Upload

Verification documents are uploaded to `/uploads` directory:
- Files are stored with unique names
- Accessible via `/uploads/{filename}`
- In production, use cloud storage (S3, etc.)

## Login Flow Updates

1. **Regular Users**: Login → `/home`
2. **Security Personnel**:
   - If not verified → `/security/verify`
   - If verified but no PIN → `/security/setup-pin` (optional)
   - If verified → `/security/dashboard`
3. **Admins**: Login → `/security/dashboard`

## PIN Login

After PIN is set up, security personnel can login with:
- Email + Password (standard)
- PIN (quick login) - requires verification approval

## Migration Required

Run database migration to create new tables:

```bash
cd apps/api
npx prisma migrate dev --name add_security_verification
npx prisma generate
```

## Security Notes

1. **Role Selection**: Users can only select USER or SECURITY_OFFICER during registration
2. **Admin Role**: Must be assigned manually via database - cannot be selected
3. **Verification Required**: Security personnel cannot access dashboard until verified
4. **PIN Protection**: PIN can only be set after verification is approved
5. **Document Storage**: Upload files are stored locally (use cloud storage in production)

## Frontend Pages

- `/register` - Registration with role selection
- `/security/verify` - Identity verification form
- `/security/setup-pin` - PIN setup (after verification)
- `/security/dashboard` - Security dashboard (after verification)

## Testing

1. **Test Regular User Registration**:
   - Select "Regular User"
   - Complete registration
   - Should redirect to login

2. **Test Security Personnel Registration**:
   - Select "Security Personnel"
   - Complete registration
   - Should auto-login and redirect to verification
   - Upload documents
   - Wait for admin approval
   - Set up PIN
   - Access dashboard

3. **Test Admin Assignment**:
   - Register as regular user
   - Update role in database to SUPER_ADMIN
   - Login should redirect to security dashboard


# How to Generate Invitation Codes for Security Personnel

There are several ways to generate invitation codes for security personnel registration:

## Method 1: Using the Frontend Admin Page (Easiest)

1. **Login as Admin or Security Officer**
   - First, you need an account with `SUPER_ADMIN` or `SECURITY_OFFICER` role
   - If you don't have one, see Method 3 below

2. **Navigate to Generate Code Page**
   - Go to: `http://localhost:3000/admin/generate-code`
   - Or click "Generate Invitation Code" from the Security Dashboard (if you're an admin)

3. **Generate Code**
   - Enter the dev secret (default: `dev-secret-change-me`) or leave empty
   - Click "Generate Invitation Code"
   - Copy the generated code

4. **Share the Code**
   - Give the code to the person who should register as security personnel
   - They should use it during registration

## Method 2: Using API Endpoint (Development)

### Via cURL:

```bash
curl -X POST http://localhost:3001/invitation-codes/generate-dev \
  -H "Content-Type: application/json" \
  -d '{
    "role": "SECURITY_OFFICER",
    "expiresInDays": 30,
    "secret": "dev-secret-change-me"
  }'
```

### Via JavaScript/Fetch:

```javascript
const response = await fetch('http://localhost:3001/invitation-codes/generate-dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    role: 'SECURITY_OFFICER',
    expiresInDays: 30,
    secret: 'dev-secret-change-me'
  })
})

const data = await response.json()
console.log('Invitation Code:', data.code)
```

## Method 3: Using the Script

```bash
cd apps/api
npx ts-node scripts/generate-invitation-code.ts
```

With custom options:
```bash
npx ts-node scripts/generate-invitation-code.ts SECURITY_OFFICER 60
```

## Method 4: Direct Database (Quick Test)

For quick testing, you can insert directly:

```sql
INSERT INTO "InvitationCode" (id, code, role, "expiresAt", "createdAt")
VALUES (
  gen_random_uuid()::text,
  UPPER(encode(gen_random_bytes(16), 'hex')),
  'SECURITY_OFFICER',
  NOW() + INTERVAL '30 days',
  NOW()
)
RETURNING code;
```

## Method 5: Create Admin Account First

If you don't have an admin account yet:

1. **Register a regular user** (gets USER role by default)
2. **Update role in database**:

```sql
UPDATE "User" 
SET role = 'SUPER_ADMIN' 
WHERE email = 'your-email@example.com';
```

3. **Login and use Method 1** to generate codes

## Using the Invitation Code

1. Go to registration: `http://localhost:3000/register`
2. Fill in name, email, password
3. **Enter the invitation code** in the "Security Invitation Code" field
4. Complete registration
5. User will be assigned `SECURITY_OFFICER` role
6. They'll be redirected to `/security/dashboard` after login

## Security Notes

- ⚠️ The `/generate-dev` endpoint is **only available in development mode**
- In production, use the admin-protected `/generate` endpoint
- Set `DEV_INVITATION_SECRET` environment variable for additional protection
- Invitation codes expire after the specified number of days (default: 30)
- Each code can only be used once

## Environment Variables

Add to `.env`:

```env
# Development secret for invitation code generation
DEV_INVITATION_SECRET=your-secret-here

# API base URL (for frontend)
API_BASE_URL=http://localhost:3001
```



# Invitation Code Generation Scripts

## Generate Invitation Code via Script

Run the script to generate an invitation code:

```bash
cd apps/api
npx ts-node scripts/generate-invitation-code.ts
```

With custom role and expiry:

```bash
npx ts-node scripts/generate-invitation-code.ts SECURITY_OFFICER 60
```

Available roles:
- `USER` (default, no code needed)
- `SECURITY_OFFICER` (security personnel)
- `SUPER_ADMIN` (admin)
- `COMMUNITY_ADMIN` (community admin)

## Generate Invitation Code via API

### Option 1: Using Admin Account (Recommended)

1. First, you need to have a SUPER_ADMIN account. If you don't have one, you can manually update a user in the database:

```sql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'your-admin@email.com';
```

2. Login as admin and call the API:

```bash
# Login first to get token
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "your-password"}'

# Use the token to generate invitation code
curl -X POST http://localhost:3001/invitation-codes/generate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"role": "SECURITY_OFFICER", "expiresInDays": 30}'
```

### Option 2: Direct Database Insert (Quick Test)

For quick testing, you can insert directly into the database:

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

## Using the Invitation Code

1. Go to the registration page: `http://localhost:3000/register`
2. Fill in the registration form
3. Enter the invitation code in the "Security Invitation Code" field
4. Complete registration
5. The user will be assigned the SECURITY_OFFICER role


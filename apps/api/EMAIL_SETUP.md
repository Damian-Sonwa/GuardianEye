# Email Configuration Guide

## Overview

The application sends email verification emails when users register. You can configure email sending using one of three methods:

1. **SMTP** (Standard email servers - Gmail, Outlook, etc.)
2. **Gmail OAuth2** (More secure for Gmail)
3. **SendGrid** (Professional email service)

## Configuration

Add the following environment variables to your `.env` file:

### Option 1: SMTP (Recommended for Development)

```env
EMAIL_PROVIDER="smtp"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="Security App <your-email@gmail.com>"
```

**For Gmail:**
1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS`

**For Outlook/Office365:**
```env
SMTP_HOST="smtp.office365.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

### Option 2: Gmail OAuth2 (More Secure)

```env
EMAIL_PROVIDER="gmail-oauth2"
EMAIL_USER="your-email@gmail.com"
GMAIL_CLIENT_ID="your-client-id"
GMAIL_CLIENT_SECRET="your-client-secret"
GMAIL_REFRESH_TOKEN="your-refresh-token"
```

**Setup:**
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Get client ID, client secret, and refresh token

### Option 3: SendGrid (Production Recommended)

```env
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="Security App <noreply@yourdomain.com>"
```

**Setup:**
1. Sign up at https://sendgrid.com
2. Create an API key
3. Verify your sender email/domain

## Email Verification Settings

Control whether email verification is required:

```env
# Set to 'true' to require email verification before login
REQUIRE_EMAIL_VERIFICATION="false"
```

## Development Mode

In development mode (`NODE_ENV=development`), if email sending fails, the application will:
- Log the verification URL to the console
- Continue with registration (won't throw an error)
- Allow you to manually verify emails

## Testing Email Configuration

1. Start the API server
2. Register a new user
3. Check the console for the verification URL (in development)
4. Or check the email inbox (if configured)

## Email Templates

The application sends HTML emails with:
- Welcome message
- Verification button
- Verification link (as fallback)
- Expiry information (24 hours)

## Troubleshooting

### Emails Not Sending

1. **Check Environment Variables**
   - Ensure all required variables are set
   - Verify credentials are correct

2. **Check Console Logs**
   - Look for email sending errors
   - In development, verification URLs are logged

3. **Test SMTP Connection**
   ```bash
   # You can test using a simple Node.js script
   node -e "const nodemailer = require('nodemailer'); ..."
   ```

4. **Gmail Issues**
   - Use App Passwords, not your regular password
   - Enable "Less secure app access" (if not using OAuth2)
   - Check if 2FA is enabled

5. **Firewall/Network**
   - Ensure port 587 (SMTP) is not blocked
   - Check if your hosting provider allows outbound SMTP

## Production Recommendations

1. **Use SendGrid or similar service** for reliable email delivery
2. **Set up SPF, DKIM, and DMARC** records for your domain
3. **Monitor email delivery rates**
4. **Set up email bounce handling**
5. **Use a dedicated email address** for sending (not personal Gmail)

## Email Verification Flow

1. User registers → Verification token generated
2. Email sent with verification link
3. User clicks link → Token verified
4. Email marked as verified
5. User can now login (if `REQUIRE_EMAIL_VERIFICATION=true`)

## Resending Verification Emails

Users can request a new verification email via:
```
POST /auth/resend-verification
Body: { "email": "user@example.com" }
```


# Environment Variables Guide

This document lists all environment variables required for the Security App.

## 📁 Backend API (`apps/api/.env`)

### Database Configuration
```env
# PostgreSQL connection string for application runtime (Required)
# This uses the pooled connection for regular database queries
# Format: postgresql://user:password@host:port/database?schema=public
# For Supabase: Use port 6543 (pooler) with ?pgbouncer=true
DATABASE_URL="postgresql://user:password@localhost:5432/security_app?schema=public"

# Direct PostgreSQL connection for migrations (Required for Supabase/cloud databases)
# This uses a direct, non-pooled connection for Prisma migrations
# Format: postgresql://user:password@host:port/database?sslmode=require
# For Supabase: Use port 5432 (direct) with ?sslmode=require
# Note: Prisma automatically uses DIRECT_URL for migrate, db push, and db pull commands
DIRECT_URL="postgresql://user:password@localhost:5432/security_app?sslmode=require"
```

**Important Notes:**
- **DATABASE_URL**: Used by the application at runtime for all database queries (uses connection pooling)
- **DIRECT_URL**: Used by Prisma CLI for migrations only (direct connection, no pooling)
- For Supabase: DATABASE_URL uses port 6543 (pooler), DIRECT_URL uses port 5432 (direct)
- The Prisma schema is configured to automatically use DIRECT_URL for migrations

### Server Configuration
```env
# API server port (Optional, defaults to 3001)
PORT=3001

# Node environment (Optional, defaults to development)
NODE_ENV=development

# Frontend URL for CORS (Optional, defaults to http://localhost:3000)
FRONTEND_URL="http://localhost:3000"
```

### JWT Authentication
```env
# JWT secret key for token signing (Required for production)
# Generate a strong random string
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### Email Configuration

**Choose ONE email provider:**

#### Option 1: SMTP (Standard)
```env
EMAIL_PROVIDER="smtp"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="Security App <your-email@gmail.com>"
```

#### Option 2: Gmail OAuth2
```env
EMAIL_PROVIDER="gmail-oauth2"
EMAIL_USER="your-email@gmail.com"
GMAIL_CLIENT_ID="your-client-id"
GMAIL_CLIENT_SECRET="your-client-secret"
GMAIL_REFRESH_TOKEN="your-refresh-token"
```

#### Option 3: SendGrid
```env
EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="your-sendgrid-api-key"
EMAIL_FROM="Security App <noreply@yourdomain.com>"
```

### Email Verification Settings
```env
# Require email verification before login (Optional, defaults to false)
REQUIRE_EMAIL_VERIFICATION="false"
```

### Google OAuth (Optional)
```env
# Google OAuth credentials for Google Sign-In
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### AI Microservices (Optional)
```env
# Face recognition service URL (Optional, defaults to http://localhost:8000)
AI_FACE_SERVICE_URL="http://localhost:8000"

# Object detection service URL (Optional, defaults to http://localhost:8001)
AI_DETECT_SERVICE_URL="http://localhost:8001"
```

---

## 📁 Frontend (`apps/frontend/.env.local`)

### API Configuration
```env
# Backend API URL (Optional, defaults to http://localhost:3001)
API_BASE_URL="http://localhost:3001"
```

### Mapbox (Optional - for threat map feature)
```env
# Mapbox access token for map display
# Get one at: https://account.mapbox.com/access-tokens/
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"
```

### Node Environment
```env
# Node environment (Optional, defaults to development)
NODE_ENV=development
```

---

## 📋 Complete Example Files

### `apps/api/.env` (Backend)
```env
# Database
# Runtime connection (pooled)
DATABASE_URL="postgresql://postgres:password@localhost:5432/security_app?schema=public"
# Migration connection (direct) - Required for Supabase/cloud databases
DIRECT_URL="postgresql://postgres:password@localhost:5432/security_app?sslmode=require"

# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Email (SMTP Example)
EMAIL_PROVIDER="smtp"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="Security App <your-email@gmail.com>"

# Email Verification
REQUIRE_EMAIL_VERIFICATION="false"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# AI Services (Optional)
AI_FACE_SERVICE_URL="http://localhost:8000"
AI_DETECT_SERVICE_URL="http://localhost:8001"
```

### `apps/frontend/.env.local` (Frontend)
```env
# API
API_BASE_URL="http://localhost:3001"

# Mapbox (Optional)
NEXT_PUBLIC_MAPBOX_TOKEN="your-mapbox-token"

# Environment
NODE_ENV=development
```

---

## 🔑 Required vs Optional

### Backend - Required:
- ✅ `DATABASE_URL` - Database connection for runtime (pooled connection)
- ✅ `DIRECT_URL` - Direct database connection for migrations (required for Supabase/cloud databases)
- ✅ `JWT_SECRET` - For authentication (use strong secret in production)

### Backend - Optional:
- ⚪ `PORT` - Server port (defaults to 3001)
- ⚪ `NODE_ENV` - Environment (defaults to development)
- ⚪ `FRONTEND_URL` - CORS origin (defaults to http://localhost:3000)
- ⚪ Email configuration - Only needed if you want email verification
- ⚪ `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Only for Google Sign-In
- ⚪ `AI_FACE_SERVICE_URL` / `AI_DETECT_SERVICE_URL` - Only for AI features

### Frontend - Required:
- ✅ None (all have defaults)

### Frontend - Optional:
- ⚪ `API_BASE_URL` - Backend API URL (defaults to http://localhost:3001)
- ⚪ `NEXT_PUBLIC_MAPBOX_TOKEN` - Only needed for map feature
- ⚪ `NODE_ENV` - Environment (defaults to development)

---

## 🚀 Quick Start

1. **Backend Setup:**
   ```bash
   cd apps/api
   # Copy and edit .env file with your values
   # Minimum required: DATABASE_URL and JWT_SECRET
   ```

2. **Frontend Setup:**
   ```bash
   cd apps/frontend
   # Create .env.local if you need to override defaults
   # Most features work without any env variables
   ```

---

## 📝 Notes

- **`.env` files are gitignored** - Never commit them to version control
- **Use `.env.example`** files as templates (if they exist)
- **Production**: Use strong, unique values for all secrets
- **Development**: Defaults are provided for most variables
- **Next.js**: Frontend env variables starting with `NEXT_PUBLIC_` are exposed to the browser

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use strong, random secrets** for `JWT_SECRET` (minimum 32 characters)
3. **Use App Passwords** for Gmail SMTP (not your regular password)
4. **Rotate secrets regularly** in production
5. **Use different values** for development and production
6. **Restrict database access** with proper firewall rules
7. **Use environment-specific** `.env` files (`.env.development`, `.env.production`)


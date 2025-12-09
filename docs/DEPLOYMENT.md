# Deployment Guide

## Production Deployment Checklist

### 1. Environment Setup

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://phyqlwhjxbbqhxbdgzgf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

#### Backend API (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secure-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://app.yourdomain.com
AI_FACE_SERVICE_URL=https://ai-face.yourdomain.com
AI_DETECT_SERVICE_URL=https://ai-detect.yourdomain.com
SMS_API_KEY=your-sms-api-key
NODE_ENV=production
```

### 2. Database Migration

```bash
cd apps/api
npx prisma generate
npx prisma migrate deploy
```

### 3. Build Applications

```bash
# Frontend
cd apps/frontend
npm run build

# Dashboard
cd apps/dashboard
npm run build

# API
cd apps/api
npm run build
```

### 4. Deploy Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set root directory to `apps/frontend`
3. Add environment variables
4. Deploy

### 5. Deploy Dashboard (Vercel)

1. Create new Vercel project
2. Set root directory to `apps/dashboard`
3. Add environment variables
4. Deploy

### 6. Deploy API (Railway/Render)

#### Railway
1. Connect GitHub repository
2. Set root directory to `apps/api`
3. Add environment variables
4. Deploy

#### Render
1. Create new Web Service
2. Set build command: `cd apps/api && npm install && npm run build`
3. Set start command: `cd apps/api && npm run start:prod`
4. Add environment variables
5. Deploy

### 7. Deploy AI Services

#### Option A: Docker Containers

```dockerfile
# apps/ai-face/Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Deploy to:
- Google Cloud Run
- AWS ECS
- Azure Container Instances

#### Option B: Serverless Functions

Convert to serverless functions for:
- AWS Lambda
- Google Cloud Functions
- Vercel Serverless Functions

### 8. Media Storage (S3-compatible)

Set up:
- AWS S3
- DigitalOcean Spaces
- Cloudflare R2

Update API to use S3 SDK for media uploads.

### 9. SMS Integration

Configure:
- Termii API
- Africa's Talking API

Update panic service to send SMS alerts.

### 10. Monitoring & Logging

Set up:
- Error tracking (Sentry)
- Analytics (Plausible/Google Analytics)
- Uptime monitoring (UptimeRobot)
- Log aggregation (Logtail/LogRocket)

### 11. SSL/HTTPS

Ensure all services use HTTPS:
- Frontend: Automatic with Vercel
- API: Configure in hosting provider
- AI Services: Configure in hosting provider

### 12. Performance Optimization

- Enable CDN for static assets
- Optimize images (Next.js Image component)
- Enable compression
- Set up caching headers
- Use database connection pooling

### 13. Security Hardening

- Enable CORS restrictions
- Set secure cookie flags
- Implement rate limiting
- Enable DDoS protection
- Regular security audits

## Post-Deployment

1. Test all features
2. Monitor error rates
3. Check performance metrics
4. Verify offline functionality
5. Test panic button
6. Verify SMS fallback
7. Check AI service responses

## Rollback Plan

1. Keep previous deployment version
2. Database migration rollback scripts
3. Environment variable backups
4. Quick rollback procedure documented


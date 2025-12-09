# Deployment Guide

This guide covers deploying the Security App to Vercel (Frontend) and Render (Backend API).

## 📋 Prerequisites

- GitHub repository with your code
- Vercel account (for frontend)
- Render account (for backend API)
- PostgreSQL database (Supabase, Railway, Neon, or any PostgreSQL provider)

## 🚀 Deployment Steps

### 1. Deploy Backend API to Render

1. **Create a new Web Service on Render:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure the Service:**
   - **Name**: `security-app-api`
   - **Environment**: `Node`
   - **Build Command**: `cd apps/api && npm install && npm run build`
   - **Start Command**: `cd apps/api && npm run start:prod`
   - **Plan**: Starter (or higher)

3. **Set Environment Variables in Render:**
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=your-postgresql-connection-string
   DIRECT_URL=your-direct-postgresql-connection-string
   JWT_SECRET=your-strong-random-secret-key
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
   
   **Optional Environment Variables:**
   ```
   EMAIL_PROVIDER=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   EMAIL_FROM=Security App <your-email@gmail.com>
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   AI_FACE_SERVICE_URL=http://your-ai-service-url
   AI_DETECT_SERVICE_URL=http://your-ai-service-url
   ```

4. **Run Database Migrations:**
   After the first deployment, run migrations:
   ```bash
   cd apps/api
   npx prisma migrate deploy
   ```
   Or use Render's shell to run migrations.

5. **Health Check:**
   - Render will automatically check `/health` endpoint
   - Verify at: `https://your-api.onrender.com/health`

### 2. Deploy Frontend to Vercel

1. **Import Project to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project Settings:**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/frontend`
   - **Build Command**: `npm run build` (from root)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install`

3. **Set Environment Variables in Vercel:**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://your-api.onrender.com
   NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token (optional)
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically build and deploy

### 3. Update CORS Settings

After deploying the frontend, update the backend's `FRONTEND_URL` environment variable in Render to match your Vercel domain:

```
FRONTEND_URL=https://your-app.vercel.app
```

Then redeploy the backend API.

## 🔧 Configuration Files

### `vercel.json`
Already configured for the monorepo structure. Points to `apps/frontend` as the root directory.

### `render.yaml`
Contains the Render service configuration. You can use this file or configure manually in the Render dashboard.

## 📝 Post-Deployment Checklist

- [ ] Backend API is accessible at `/health` endpoint
- [ ] Frontend is accessible and loads correctly
- [ ] Database migrations have been run
- [ ] Environment variables are set correctly
- [ ] CORS is configured with the correct frontend URL
- [ ] API endpoints are accessible from the frontend
- [ ] Authentication flow works end-to-end

## 🔍 Troubleshooting

### Build Failures

1. **TypeScript Errors:**
   - All TypeScript errors have been fixed
   - Run `npm run build` locally to verify

2. **Missing Dependencies:**
   - Ensure `package.json` files are correct
   - Check that all workspace dependencies are listed

3. **Environment Variables:**
   - Verify all required environment variables are set
   - Check that values don't have extra quotes or spaces

### Runtime Issues

1. **Database Connection:**
   - Verify `DATABASE_URL` is correct
   - Check database firewall settings
   - Ensure `DIRECT_URL` is set for migrations

2. **CORS Errors:**
   - Verify `FRONTEND_URL` matches your Vercel domain exactly
   - Check that credentials are enabled in CORS config

3. **API Not Responding:**
   - Check Render service logs
   - Verify health endpoint: `/health`
   - Check that port is set correctly (3001)

## 🌐 Custom Domains

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Render
1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)


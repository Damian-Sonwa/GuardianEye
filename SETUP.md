# Quick Setup Guide - View the App

## Step 1: Install Dependencies

```bash
npm install
```

This will install all dependencies for the monorepo.

## Step 2: Set Up Environment Variables

### Frontend (.env.local)
Create `apps/frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://phyqlwhjxbbqhxbdgzgf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoeXFsd2hqeGJicWh4YmRnemdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzM0NDIsImV4cCI6MjA4MDAwOTQ0Mn0.yGMnkzV_1kwMB00SwPW8mYeVeDpg46-mpZRjorSl8Yw
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API (.env)
Create `apps/api/.env`:

```env
DATABASE_URL=postgresql://postgres.phyqlwhjxbbqhxbdgzgf:sopuluchukwu@aws-1-eu-central-2.pooler.supabase.com:5432/postgres
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
PORT=3001
```

## Step 3: Set Up Database

```bash
cd apps/api
npx prisma generate
npx prisma db push
```

## Step 4: Start the Apps

### Option A: Start Everything (Recommended)
From the root directory:

```bash
npm run dev
```

This will start:
- Frontend on http://localhost:3000
- API on http://localhost:3001
- Dashboard on http://localhost:3002

### Option B: Start Individually

**Terminal 1 - Frontend:**
```bash
cd apps/frontend
npm run dev
```
Visit: http://localhost:3000

**Terminal 2 - API:**
```bash
cd apps/api
npm run dev
```
API runs on: http://localhost:3001
API Docs: http://localhost:3001/api

**Terminal 3 - Dashboard (Optional):**
```bash
cd apps/dashboard
npm run dev
```
Visit: http://localhost:3002

## Step 5: View the App

1. **Frontend PWA**: Open http://localhost:3000 in your browser
2. **Agency Dashboard**: Open http://localhost:3002 in your browser
3. **API Documentation**: Open http://localhost:3001/api in your browser

## Troubleshooting

### Port Already in Use
If ports 3000, 3001, or 3002 are in use:
- Kill the process using the port, or
- Change the port in the package.json scripts

### Database Connection Error
- Verify your Supabase credentials are correct
- Check if the database is accessible
- Run `npx prisma db push` again

### Missing Dependencies
```bash
# Clean install
rm -rf node_modules
npm install
```

### Build Errors
```bash
# Clear Next.js cache
cd apps/frontend
rm -rf .next
npm run dev
```

## Quick Test

Once running, you should be able to:
1. See the splash screen → Login page
2. Click "Continue as Guest" to access the app
3. Navigate through all screens
4. Test the panic button
5. Create a test report

Enjoy! 🚀


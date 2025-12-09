# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` files:

**apps/frontend/.env.local**
```env
NEXT_PUBLIC_SUPABASE_URL=https://phyqlwhjxbbqhxbdgzgf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoeXFsd2hqeGJicWh4YmRnemdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzM0NDIsImV4cCI6MjA4MDAwOTQ0Mn0.yGMnkzV_1kwMB00SwPW8mYeVeDpg46-mpZRjorSl8Yw
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**apps/api/.env**
```env
DATABASE_URL=postgresql://postgres.phyqlwhjxbbqhxbdgzgf:sopuluchukwu@aws-1-eu-central-2.pooler.supabase.com:5432/postgres
JWT_SECRET=your-secret-key-change-in-production
FRONTEND_URL=http://localhost:3000
PORT=3001
```

### 3. Set Up Database

```bash
cd apps/api
npx prisma generate
npx prisma db push
```

### 4. Start Development Servers

**Option A: Run All (Recommended)**
```bash
npm run dev
```

**Option B: Run Individually**

Terminal 1 - Frontend:
```bash
cd apps/frontend
npm run dev
# Opens on http://localhost:3000
```

Terminal 2 - API:
```bash
cd apps/api
npm run dev
# Opens on http://localhost:3001
```

Terminal 3 - Dashboard:
```bash
cd apps/dashboard
npm run dev
# Opens on http://localhost:3002
```

### 5. (Optional) Start AI Services

Terminal 4 - Face Recognition:
```bash
cd apps/ai-face
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

Terminal 5 - Object Detection:
```bash
cd apps/ai-detect
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8001
```

## 📱 Access the Apps

- **Frontend PWA**: http://localhost:3000
- **Agency Dashboard**: http://localhost:3002
- **API Docs (Swagger)**: http://localhost:3001/api
- **Face Recognition API**: http://localhost:8000/docs
- **Object Detection API**: http://localhost:8001/docs

## 🧪 Test the App

1. **Open Frontend**: Navigate to http://localhost:3000
2. **Login**: Use "Continue as Guest" or create an account
3. **Test Panic Button**: Click the panic button (3-second countdown)
4. **Create Report**: Go to Report page and submit a test report
5. **View Map**: Check the threat map for incident markers
6. **AI Identification**: Upload a photo to test face matching

## 🔧 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check if Supabase is accessible
- Run `npx prisma db push` again

### Port Already in Use
- Change ports in package.json scripts
- Or kill the process using the port

### AI Services Not Starting
- Ensure Python 3.10+ is installed
- Install dependencies: `pip install -r requirements.txt`
- Check if ports 8000/8001 are available

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

## 📚 Next Steps

- Read [Full Documentation](./README.md)
- Check [API Documentation](./API.md)
- Review [Design System](./DESIGN_SYSTEM.md)
- See [Deployment Guide](./DEPLOYMENT.md)

## 🆘 Need Help?

- Check the main [README.md](./README.md)
- Review error messages in console
- Check API Swagger docs at `/api`
- Open an issue on GitHub


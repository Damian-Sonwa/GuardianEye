# Security App Documentation

## Overview

Security App is a full-stack Progressive Web App (PWA) designed for civilian safety and security agencies in rural African countries. It provides AI-powered bandit identification, community incident reporting, GPS threat mapping, panic button functionality, and an agency command dashboard.

## Architecture

### Monorepo Structure

```
security_app/
├── apps/
│   ├── frontend/          # Next.js PWA (Civilian App)
│   ├── dashboard/         # Next.js Agency Dashboard
│   ├── api/               # NestJS Backend API
│   ├── ai-face/           # Face Recognition Service (FastAPI)
│   └── ai-detect/         # Object Detection Service (FastAPI)
├── packages/
│   ├── ui/                # Shared UI Components
│   └── config/            # Shared Configuration
└── docs/                  # Documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL (or Supabase)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Copy `.env.example` files in each app directory and fill in the values:
   - `apps/frontend/.env.local`
   - `apps/api/.env`
   - `apps/dashboard/.env.local`

3. **Set up database**
   ```bash
   cd apps/api
   npx prisma generate
   npx prisma db push
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   
   # Or individually:
   cd apps/frontend && npm run dev      # Port 3000
   cd apps/dashboard && npm run dev     # Port 3002
   cd apps/api && npm run dev           # Port 3001
   ```

5. **Start AI services** (optional, in separate terminals)
   ```bash
   cd apps/ai-face
   pip install -r requirements.txt
   python main.py
   
   cd apps/ai-detect
   pip install -r requirements.txt
   python main.py
   ```

## Features

### Civilian App (PWA)

- **AI Face Identification**: Upload photos to match against suspect database
- **Incident Reporting**: Anonymous reporting with photo/video/audio support
- **GPS Threat Mapping**: Interactive map showing incident hotspots
- **Panic Button**: Emergency alert with SMS fallback
- **Offline Support**: Reports saved locally when offline, synced when online
- **Community Alerts**: Real-time alerts from nearby incidents

### Agency Dashboard

- **Map Visualization**: Heatmaps, clusters, and threat visualization
- **Case Management**: Create, assign, and track security cases
- **Suspect Database**: Manage suspect profiles with AI embeddings
- **Evidence Management**: View and organize evidence from reports
- **Activity Logs**: Audit trail of all actions
- **RBAC**: Role-based access control (User, Community Admin, Officer, Super Admin)

## API Documentation

Once the API server is running, visit:
- Swagger UI: `http://localhost:3001/api`

### Key Endpoints

#### Authentication
- `POST /auth/login` - Email/password login
- `POST /auth/register` - User registration
- `POST /auth/google` - Google OAuth
- `POST /auth/fingerprint` - Device fingerprint login
- `POST /auth/pin` - 4-digit PIN login

#### Reports
- `POST /reports` - Create incident report
- `GET /reports` - Get all reports (officers only)
- `GET /reports/:id` - Get report by ID

#### Panic
- `POST /panic` - Send panic alert

#### AI Services
- `POST /ai/face-match` - Match face against database
- `POST /ai/weapons` - Detect weapons in image
- `POST /ai/classify-threat` - Classify incident threat level

#### Cases
- `POST /cases` - Create case
- `GET /cases` - Get all cases
- `GET /cases/:id` - Get case by ID

#### Community
- `GET /community/alerts` - Get community alerts
- `GET /community/safe-routes` - Get safe route suggestions

## Database Schema

See `apps/api/prisma/schema.prisma` for the complete schema.

### Key Models

- **User**: Users with roles (USER, COMMUNITY_ADMIN, SECURITY_OFFICER, SUPER_ADMIN)
- **Report**: Incident reports with location, media, and risk level
- **PanicAlert**: Emergency panic alerts
- **Case**: Security cases assigned to officers
- **Suspect**: Suspect database with face embeddings
- **ActivityLog**: Audit logs

## PWA Features

### Service Worker
- Automatic caching of static assets
- Offline support for core functionality
- Background sync for reports

### IndexedDB
- Offline report storage
- Panic alert queue
- Automatic sync when online

### Install Prompt
- Add to home screen on mobile
- Standalone app experience
- Offline-first architecture

## AI Services

### Face Recognition (`apps/ai-face`)
- Uses `face_recognition` library
- Extracts facial embeddings
- Matches against suspect database
- Returns ranked results with confidence scores

### Object Detection (`apps/ai-detect`)
- Uses YOLOv8 for object detection
- Detects weapons (knives, guns)
- Returns bounding boxes and labels
- Can be fine-tuned for custom weapon detection

## Security

### Authentication
- JWT-based sessions
- Multiple auth methods (email, Google, fingerprint, PIN)
- Role-based access control (RBAC)

### Data Protection
- End-to-end encryption for sensitive uploads
- HTTPS only
- Secure storage of face embeddings
- Audit logs for officers

### Privacy
- Anonymous reporting option
- User data deletion/rectification
- Secure media storage

## Deployment

### Frontend (Vercel/Netlify)
```bash
cd apps/frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd apps/api
npm run build
npm run start:prod
```

### AI Services (Docker/Cloud Run)
```bash
# Build Docker images
docker build -t ai-face apps/ai-face
docker build -t ai-detect apps/ai-detect
```

## Environment Variables

### Frontend
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
API_BASE_URL=
```

### API
```
DATABASE_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FRONTEND_URL=
AI_FACE_SERVICE_URL=
AI_DETECT_SERVICE_URL=
SMS_API_KEY=
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please open an issue on GitHub.


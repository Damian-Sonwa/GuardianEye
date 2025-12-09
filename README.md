# Security App - Bandit Tracking & Safety PWA

A full-stack Progressive Web App for civilian safety and security agencies in rural African countries.

## Project Structure

```
security_app/
├── apps/
│   ├── frontend/          # Next.js PWA (Civilian App)
│   ├── dashboard/         # Next.js Agency Dashboard
│   ├── api/               # NestJS Backend API
│   ├── ai-face/           # Face Recognition Service (FastAPI)
│   └── ai-detect/         # Object Detection Service (FastAPI)
├── packages/
│   ├── ui/                # Shared UI Components (shadcn/ui)
│   └── config/            # Shared Configuration
└── docs/                  # Documentation

```

## Features

### Civilian App
- AI image identification for bandits
- Community incident reporting
- GPS threat mapping
- Panic button with SMS fallback
- Offline-first support
- Anonymous reporting

### Agency Dashboard
- Map visualization (hotspots, clusters, heatmaps)
- Case assignment & tracking
- Evidence management
- Suspect database with AI embeddings
- Incident timeline & activity logs
- Admin roles + RBAC

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: NestJS, PostgreSQL (Supabase), Prisma
- **AI Services**: Python, FastAPI, OpenCV, face_recognition
- **Maps**: Mapbox GL JS
- **PWA**: Service Worker, IndexedDB, Workbox

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (or Supabase)

### Installation

```bash
# Install dependencies
npm install

# Run all apps in development
npm run dev

# Or run specific app
cd apps/frontend && npm run dev
```

### Environment Variables

See `.env.example` files in each app directory.

## Documentation

See `/docs` for detailed documentation.


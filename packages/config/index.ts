export const config = {
  app: {
    name: "Security App",
    version: "1.0.0",
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://phyqlwhjxbbqhxbdgzgf.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoeXFsd2hqeGJicWh4YmRnemdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0MzM0NDIsImV4cCI6MjA4MDAwOTQ0Mn0.yGMnkzV_1kwMB00SwPW8mYeVeDpg46-mpZRjorSl8Yw",
    dbUrl: process.env.DATABASE_URL || "postgresql://postgres.phyqlwhjxbbqhxbdgzgf:sopuluchukwu@aws-1-eu-central-2.pooler.supabase.com:5432/postgres",
  },
  api: {
    baseUrl: process.env.API_BASE_URL || "http://localhost:3001",
  },
  ai: {
    faceServiceUrl: process.env.AI_FACE_SERVICE_URL || "http://localhost:8000",
    detectServiceUrl: process.env.AI_DETECT_SERVICE_URL || "http://localhost:8001",
  },
  sms: {
    provider: process.env.SMS_PROVIDER || "termii",
    apiKey: process.env.SMS_API_KEY || "",
  },
  mapbox: {
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  },
} as const;


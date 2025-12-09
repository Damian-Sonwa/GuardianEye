# Database Setup & Connection Guide

## Database Configuration

This application uses **PostgreSQL** as the database, which can be hosted on:
- **Supabase** (recommended for quick setup)
- **Railway**
- **Neon**
- **Local PostgreSQL**
- Any PostgreSQL-compatible database

## Database Connection String

The database connection is configured via the `DATABASE_URL` environment variable in the `.env` file.

### Format:
```
postgresql://username:password@host:port/database?schema=public
```

### Examples:

**Supabase:**
```
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"
```

**Local PostgreSQL:**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/security_app?schema=public"
```

**Railway:**
```
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"
```

## Verifying Database Connection

### 1. Health Check Endpoint

After starting the API server, visit:
```
http://localhost:3001/health
```

This will return:
- `status: "healthy"` if the database is connected
- `status: "unhealthy"` if there's a connection issue
- Database connection details

### 2. Check Environment Variables

Ensure your `.env` file contains:
```env
DATABASE_URL="your-database-connection-string"
```

### 3. Run Prisma Migrations

To set up the database schema:
```bash
cd apps/api
npx prisma migrate dev --name init
```

Or if you want to push the schema without migrations:
```bash
npx prisma db push
```

### 4. Verify Tables

You can use Prisma Studio to view your database:
```bash
npx prisma studio
```

This opens a GUI at `http://localhost:5555` where you can see all tables and data.

## Database Schema

The application uses the following main models:
- **User** - User accounts with email verification
- **Report** - Incident reports
- **PanicAlert** - Emergency panic alerts
- **Case** - Security cases
- **Suspect** - Suspect database for face recognition
- **ActivityLog** - System activity logs

## Troubleshooting

### Connection Refused
- Check if your database server is running
- Verify the host and port in your connection string
- Check firewall settings

### Authentication Failed
- Verify username and password
- Check if the database user has proper permissions

### Database Not Found
- Ensure the database exists
- Create the database if it doesn't exist:
  ```sql
  CREATE DATABASE security_app;
  ```

### SSL Connection Issues
If using Supabase or cloud providers, you may need to add SSL parameters:
```
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
```

## Current Database Status

To check the current database connection status, make a GET request to:
```
GET /health
```

Response example:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development",
  "databaseUrl": "host:port"
}
```


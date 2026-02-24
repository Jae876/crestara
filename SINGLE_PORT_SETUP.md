# Single Port (3000) Setup Guide

## How It Works Now

Your Crestara platform now runs **everything on port 3000**:

```
┌─────────────────────────────────┐
│   User Browser (Port 3000)      │
└────────────────────┬────────────┘
                     │
          ┌──────────▼──────────┐
          │  Next.js Frontend   │  (Port 3000)
          │   Middleware.ts     │
          └──────────┬──────────┘
                     │
         ┌──────────┬┴┬──────────┐
         │          │ │          │
    HTML/CSS    /api/* Pages
         │          │ │          │
         └──────────┴┼┴──────────┘
                     │
          ┌──────────▼──────────┐
          │    NestJS Backend   │  (Port 3001 - Internal)
          │    (Not exposed)    │
          └─────────────────────┘
```

## Components Modified

✅ **Next.js Middleware** (`frontend/middleware.ts`)
- Intercepts all `/api/*` requests
- Proxies them to backend (port 3001)
- Transparent to the browser

✅ **API Client** (`frontend/src/lib/api-client.ts`)
- Changed from `http://localhost:3001` to `/api`
- Routes through Next.js middleware automatically

✅ **Next.js Config** (`frontend/next.config.js`)
- Added rewrite rules for API proxying
- Routes `/api/*` → `http://localhost:3001/api/*`

✅ **Root Package.json** (`package.json`)
- Updated dev script to start backend first, then frontend
- Backend runs in background

## Running Everything

Once `npm install` finishes:

### Start Everything at Once
```bash
npm run dev
```

This will:
1. Start NestJS backend on port 3001 (internal only)
2. Start Next.js frontend on port 3000 (public)
3. All API requests from browser → /api/* → proxied to 3001

### Or Run Separately
```bash
npm run dev:backend  # Start backend (port 3001)
npm run dev:frontend # Start frontend (port 3000)
```

## URLs After Starting

- **User/Admin App**: http://localhost:3000
  - All pages served here
  - Admin dashboard at `/admin`
  
- **Backend API** (internal): http://localhost:3001
  - Not directly accessible from browser
  - Only through `/api/*` proxy

- **WebSocket**: ws://localhost:3000/socket.io
  - Proxied through Next.js to backend

## Database & Cache Setup

Before running, start PostgreSQL & Redis:

```bash
docker-compose up -d
```

Then setup database:

```bash
npm run db:migrate
npm run db:generate
```

## Environment Variables

The `.env.local` file is already created with:
- `NEXT_PUBLIC_API_URL=http://localhost:3001` (for server-side requests)
- `PORT=3001` (backend)
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crestara_db`
- `REDIS_URL=redis://localhost:6379`

## API Examples

All these now work from the browser:

```javascript
// Before (didn't work from browser)
fetch('http://localhost:3001/api/auth/login')

// Now (works through middleware)
fetch('/api/auth/login')
```

The React Query hooks automatically use the `/api` prefix, so nothing changes in your component code!

## Full Startup Sequence

1. **Start databases**:
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies** (if not done):
   ```bash
   npm install
   ```

3. **Setup database**:
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

4. **Start everything**:
   ```bash
   npm run dev
   ```

5. **Visit**: http://localhost:3000

## Troubleshooting

**"Cannot GET /api/..."**
- Backend might not be running on 3001
- Check: `npm run dev:backend` in separate terminal

**CORS errors**
- Should be resolved now since backend reads from `CORS_ORIGIN` env
- Make sure `.env.local` has `CORS_ORIGIN=http://localhost:3000`

**WebSocket connection fails**
- Backend might be down
- Check that backend is running: `npm run dev:backend`

**Port 3000 already in use**
- Kill existing process: `netstat -ano | findstr :3000` (Windows)
- Then: `taskkill /PID <PID> /F`

## Admin Dashboard

After everything starts:
1. Go to http://localhost:3000
2. Signup or login
3. Visit http://localhost:3000/admin
4. Uses same JWT token from authentication

Both user and admin panels on the same port! 🎉

---

**That's it! Everything on port 3000.** ✨

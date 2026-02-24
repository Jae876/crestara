# Quick Troubleshooting Guide

## Problem: 'next' is not recognized

**Cause**: npm dependencies are not installed yet.

**Solution**: Wait for `npm install` to complete, then run `npm run dev`.

---

## Installation Hanging/Failing?

If npm install is still failing after 10 minutes, try this approach:

### Option 1: Install Each Package Separately
```bash
# Install root dependencies
npm install

# Install shared package
cd shared && npm install && cd ..

# Install backend
cd backend && npm install && cd ..

# Install frontend
cd frontend && npm install && cd ..
```

### Option 2: Use Minimal Node Version
```bash
# Check your Node version
node --version

# If >= 18, you're good. Otherwise upgrade from nodejs.org
```

### Option 3: Clear Cache & Reinstall
```bash
# Already done, but if needed again:
npm cache clean --force
rm -r node_modules
npm install --no-audit --legacy-peer-deps
```

---

## Once Installation Completes

### 1. Start Docker Services (one terminal)
```bash
docker-compose up -d
```

Verify running:
```bash
docker-compose ps
```

### 2. Setup Database (separate terminal)
```bash
cd c:\Users\jae.jojo\Downloads\crestara
npm run db:migrate
npm run db:generate
```

### 3. Start Dev Server (separate terminal)
```bash
cd c:\Users\jae.jojo\Downloads\crestara
npm run dev
```

You should see:
```
- Local: http://localhost:3000
- Backend: http://localhost:3001
```

### 4. Visit http://localhost:3000

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Port 3000 already in use | `netstat -ano \| findstr :3000` then `taskkill /PID <PID> /F` |
| Database connection error | Check `docker-compose ps` - PostgreSQL running? |
| "Cannot find module @crestara/shared" | Run `npm install` in root again |
| WebSocket errors | Backend must be running on 3001 |
| 404 on /api/* routes | Next.js server not started yet |

---

## Architecture Reminder

```
Port 3000 (Next.js)
├─ /              → Frontend pages
├─ /admin         → Admin dashboard
├─ /auth/*        → Auth pages
└─ /api/*         → Proxied to backend (3001)

Port 3001 (NestJS - Backend)
├─ /api/auth/*    → Authentication
├─ /api/funding/* → Deposits/withdrawals
├─ /api/casino/*  → Games
├─ /api/mining/*  → Mining
├─ /api/referral/*→ Referrals
└─ /api/admin/*   → Admin operations
```

---

## Status Check Commands

```bash
# Check if npm install succeeded
npm list

# Check Node version
node -v

# Check if ports are free
netstat -ano | findstr ":3000 :3001 :5432 :6379"

# Check Docker
docker-compose ps

# Check database
npm run db:generate
```

---

**Once `npm install` finishes, everything should work!** ✨

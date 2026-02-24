# 🐳 Docker Setup + Multi-Deployment Guide

## Phase 1: Local Development with Docker (15 minutes)

### Prerequisites
- Docker Desktop installed: https://www.docker.com/products/docker-desktop
- Docker running on your machine

### Step 1: Start All Services

```bash
cd c:\Users\jae.jojo\Downloads\crestara
docker-compose up
```

Wait for output:
```
✅ postgres_1    | LOG: database system is ready to accept connections
✅ redis_1       | Ready to accept connections
```

**What's Running:**
- **PostgreSQL** on port 5432 (database)
- **Redis** on port 6379 (cache)
- **PgAdmin** on http://localhost:5050 (optional GUI)

### Step 2: Setup Database (New Terminal)

```bash
cd c:\Users\jae.jojo\Downloads\crestara\backend
npm run db:generate
npm run db:migrate
```

Expected output:
```
✓ Generated Prisma Client
✓ Your database has been created
```

### Step 3: Start Backend (New Terminal)

```bash
cd c:\Users\jae.jojo\Downloads\crestara\backend
npm run dev
```

Wait for:
```
✨ Crestara API listening on port 3001
```

### Step 4: Start Frontend (New Terminal)

```bash
cd c:\Users\jae.jojo\Downloads\crestara\frontend
npm run dev
```

Wait for:
```
▲ Next.js running on http://localhost:3000
```

### Step 5: Test Everything

- **App**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Database GUI**: http://localhost:5050
  - Email: admin@crestara.io
  - Password: admin

---

## Phase 2: Deploy to Neon (Cloud PostgreSQL)

### What is Neon?
- Free serverless PostgreSQL (perfect for production)
- Auto-scaling, backups, easy migrations
- Works with Vercel, Railway, anywhere

### Step 1: Create Neon Account

1. Go to: https://console.neon.tech
2. Sign up (free)
3. Create a new project named "crestara"
4. Copy the connection string

### Step 2: Set Connection String

Edit `backend/.env.neon`:

```env
DATABASE_URL="postgresql://user:password@ep-xyz.us-east-1.aws.neon.tech/crestara?sslmode=require"
```

### Step 3: Test Connection Locally

```bash
cd backend

# Copy Neon connection to temporary .env
cp .env .env.backup
cp .env.neon .env

# Test connection
npm run db:generate

# See if it connects (if error, check connection string)
```

### Step 4: Run Migrations on Neon

```bash
npm run db:migrate
```

This creates all tables in your Neon database.

### Step 5: Deploy Backend

Use **Railway.app** (recommended - works perfectly):

1. Go to: https://railway.app
2. Import GitHub repo (or upload this folder)
3. Add PostgreSQL plugin (uses Neon)
4. Set environment variables from `.env.neon`
5. Deploy

**Railway will:**
- Build your NestJS backend
- Connect to Neon database
- Host on public URL
- Auto-restart on crash

### Step 6: Deploy Frontend

Use **Vercel** (Next.js creators):

1. Go to: https://vercel.com
2. Import GitHub repo
3. Set `NEXT_PUBLIC_API_URL=https://your-railway-backend.com`
4. Deploy

**Frontend is now live!**

#### Full URL Structure:
- Frontend: `https://your-project.vercel.app`
- Backend: `https://your-project.railway.app`
- Database: Neon (managed automatically)

---

## Phase 3: Deploy to cPanel (Shared Hosting)

### What You Need (from cPanel):

1. **SSH Access** - ask your hosting provider
2. **PostgreSQL Database** - create via cPanel > Databases
3. **Node.js Selection** - enable Node.js via cPanel

### Step 1: Create PostgreSQL Database in cPanel

```
cPanel > Databases > PostgreSQL Databases
├─ Database Name: cpanelusername_crestara
├─ Database User: cpanelusername_crestara_user
├─ Password: [strong password]
└─ Note connection details
```

### Step 2: Update Environment File

Edit `backend/.env.cpanel`:

```env
DATABASE_URL="postgresql://cpanelusername_crestara_user:password@localhost:5432/cpanelusername_crestara"
```

### Step 3: Login via SSH

```bash
ssh cpanelusername@your-cpanel-ip
```

### Step 4: Clone and Setup

```bash
# Navigate to public_html  
cd public_html

# Clone repository
git clone https://github.com/yourusername/crestara.git
cd crestara

# Install dependencies
npm install --production

# Setup database
cp backend/.env.cpanel backend/.env
cd backend
npm run db:generate
npm run db:migrate
cd ..
```

### Step 5: Start Backend with PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
cd backend
pm2 start "npm run start" --name "crestara-api"
cd ..

# Save PM2 config
pm2 save
pm2 startup

# Check status
pm2 list
```

### Step 6: Setup Frontend Build

```bash
cd frontend
npm run build

# This creates a `.next` build - ready to deploy
```

### Step 7: Point Domain

In cPanel:
- **Domain**: yourdomain.com → `/public_html/crestara/frontend/.next`
- **Subdomain API**: api.yourdomain.com → Node.js app (backend running on port 3001)

### Step 8: Setup Reverse Proxy (Nginx)

Ask cPanel to enable Nginx reverse proxy:

```nginx
location /api {
  proxy_pass http://localhost:3001;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

---

## Environment Variables Summary

### Local (.env - Docker)
```
DATABASE_URL=postgresql://crestara:postgres@localhost:5432/crestara_dev
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Production (Neon + Railway)
```
DATABASE_URL=postgresql://user:pw@neon-host/db?sslmode=require
REDIS_URL=redis://upstash-host:port
NODE_ENV=production
```

### cPanel
```
DATABASE_URL=postgresql://user:pw@localhost:5432/db
REDIS_URL=memory://  (or redis service URL)
NODE_ENV=production
```

---

## Verification Checklist

### Local Docker ✅
- [ ] `docker-compose up` shows all services running
- [ ] `npm run db:migrate` creates tables
- [ ] Backend starts: `npm run dev` in backend folder
- [ ] Frontend starts: `npm run dev` in frontend folder
- [ ] http://localhost:3000 loads

### Neon Deployment ✅
- [ ] Neon account created
- [ ] Connection string tested
- [ ] Database tables migrated
- [ ] Railway/similar platform connecting
- [ ] API responding at public URL
- [ ] Frontend points to new API URL

### cPanel Deployment ✅
- [ ] SSH access working
- [ ] PostgreSQL database created
- [ ] Node.js app running with PM2
- [ ] Domain pointing correctly
- [ ] API accessible at subdomain
- [ ] Frontend and backend connected

---

## Quick Troubleshooting

### Docker Issues
```bash
# Docker not running?
docker-compose down  # Stop
docker-compose up    # Start fresh
```

### Database Migration Failed
```bash
# Rollback migration
npm run db:migrate:reset

# Or check what's wrong
npm run db:generate  # Regenerate Prisma client
```

### Port Already in Use
```bash
# Find process on port 3001
netstat -ano | findstr :3001

# Kill it
taskkill /PID 12345 /F
```

### Neon Connection Issues
- Check connection string has `?sslmode=require`
- Whitelist your IP in Neon dashboard
- Test with pgAdmin first

### cPanel Deployment
- Check PM2 logs: `pm2 logs`
- SSH into server: `pm2 monit`
- Check Node version: `node --version`

---

## Next Steps After Deployment

1. **Setup CI/CD** - Auto-deploy on git push
2. **Add Custom Domain** - Point your domain name
3. **Enable HTTPS** - SSL certificates (automatic with Vercel/Railway)
4. **Database Backups** - Neon does this automatically
5. **Monitoring** - Add error tracking (Sentry)
6. **Performance** - CDN for frontend (Cloudflare)

---

## Costs Estimation

| Service | Cost | Notes |
|---------|------|-------|
| **Neon DB** | Free tier (2GB) or $15/mo | Serverless PostgreSQL |
| **Railway** | Starter ($5/month) | Backend + Redis |
| **Vercel** | Free | Frontend (generous free tier) |
| **Total** | ~$20/month | Production ready |

---

**You now have a production-ready infrastructure! 🎉**

Docker locally → Neon DB + Railway backend → Vercel frontend = Production Setup

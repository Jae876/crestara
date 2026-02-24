# 🐳 Docker Installation & Setup (5 minutes)

## Step 1: Download Docker Desktop

### Windows
1. Go to: **https://www.docker.com/products/docker-desktop**
2. Click "Download for Windows"
3. Choose your Windows version:
   - **Windows 11/10 Pro/Enterprise**: Use WSL 2 backend (recommended)
   - **Windows 10 Home**: Use Hyper-V
4. Run the installer
5. Follow the installation wizard
6. **Restart your computer** when prompted
7. Launch Docker Desktop from Start Menu

### Verify Installation
After restart, open PowerShell and run:
```powershell
docker --version
docker ps
```

Should show:
```
Docker version 25.x.x
CONTAINER ID        IMAGE ...
```

---

## Step 2: Start Docker Services (2 minutes)

### Option A: Using Setup Script

```powershell
cd c:\Users\jae.jojo\Downloads\crestara
.\setup.bat
```

This will:
- Start PostgreSQL (port 5432)
- Start Redis (port 6379)
- Start PgAdmin (http://localhost:5050)

### Option B: Manual Docker Commands

```powershell
cd c:\Users\jae.jojo\Downloads\crestara
docker-compose up
```

Wait for both to show "ready":
```
postgres_1  | ready to accept connections
redis_1     | Ready to accept connections
```

---

## Step 3: Setup Database (1 minute)

**Open a NEW PowerShell window** (keep docker-compose running):

```powershell
cd c:\Users\jae.jojo\Downloads\crestara\backend

# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:migrate
```

Should see:
```
✓ Prisma Client generated
✓ Migration applied
```

---

## Step 4: Start Backend (1 minute)

**In the same backend terminal:**

```powershell
npm run dev
```

Wait for:
```
[Nest] 12345   - 02/21/2026, 10:30:45 AM     LOG [NestFactory]
Nest application successfully started
✨ Crestara API listening on port 3001
```

---

## Step 5: Start Frontend (1 minute)

**Open ANOTHER NEW PowerShell window:**

```powershell
cd c:\Users\jae.jojo\Downloads\crestara\frontend
npm run dev
```

Wait for:
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
```

---

## Step 6: Visit Your App! ✅

Open browser and go to: **http://localhost:3000**

You should see:
- Crestara landing page
- Animated logo
- Sign up / Login buttons
- Working navigation

---

## 🎯 What You Now Have Running

### Terminals Running:
| Terminal | Command | Port | What It Does |
|----------|---------|------|--------------|
| 1 | `docker-compose up` | 5432, 6379 | PostgreSQL, Redis |
| 2 | `npm run dev` (backend) | 3001 | API server |
| 3 | `npm run dev` (frontend) | 3000 | Web app |

### Services:
```
Frontend (http://localhost:3000)
    ↓ API calls to /api/*
Backend (http://localhost:3001)
    ↓ connects to
PostgreSQL (Database on 5432)
Redis (Cache on 6379)
```

---

## 🧪 Test Everything Works

### 1. Check Database is Running
```powershell
docker ps
```

Should show:
```
postgres:15
redis:7
```

### 2. Check Backend API
Open browser: **http://localhost:3001/api**

Should show 404 (that's OK, means backend is running)

### 3. Check Frontend
Open browser: **http://localhost:3000**

Should show Crestara landing page with animated logo

### 4. Test Signup
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter email and password
4. Click submit

Should see success message or redirect to dashboard

### 5. Check Database GUI
Open browser: **http://localhost:5050**

Login:
- Email: admin@crestara.io
- Password: admin

Browse the database tables!

---

## 📊 Project Status

```
✅ Docker installed
✅ PostgreSQL running
✅ Redis running
✅ Backend running on 3001
✅ Frontend running on 3000
✅ Database synced with Prisma
✅ API and Web App connected
```

---

## 🛠️ Common Issues

### Docker Won't Start
```powershell
# Check if Docker Desktop is running
# If not, launch it from Start Menu

# Or try restarting Docker:
docker restart
```

### Port Already in Use
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID 12345 /F
```

### Database Connection Error
```powershell
# Check if postgres is running
docker ps | findstr postgres

# If not, restart services
docker-compose restart postgres
docker-compose restart redis
```

### Backend can't connect to database
```powershell
# Check backend .env has correct DATABASE_URL
cat backend\.env

# Should be:
# DATABASE_URL="postgresql://crestara:postgres@localhost:5432/crestara_dev"

# If wrong, fix it
```

### "Cannot find module" errors
```powershell
# Reinstall dependencies
cd backend
npm install
cd ..\frontend
npm install
```

---

## 📋 Checklist

- [ ] Docker Desktop installed
- [ ] Docker daemon running
- [ ] `docker-compose up` shows services running
- [ ] `npm run db:migrate` completed successfully
- [ ] Backend started with `npm run dev`
- [ ] Frontend started with `npm run dev`
- [ ] http://localhost:3000 loads
- [ ] Can sign up at http://localhost:3000
- [ ] Database visible at http://localhost:5050

---

## 🚀 Next Steps

Once everything is working:

1. **Explore the App**
   - Sign up with test account
   - Check dashboard
   - Try admin panel

2. **Review Code**
   - `frontend/src/app` - Pages
   - `backend/src/modules` - API logic
   - `backend/prisma/schema.prisma` - Database

3. **Make Changes**
   - Edit code
   - Backend auto-reloads (watch mode)
   - Frontend auto-reloads (hot reload)

4. **Deploy to Production**
   - Follow `DOCKER_DEPLOYMENT_GUIDE.md`
   - Use Neon for database
   - Use Railway for backend
   - Use Vercel for frontend

---

## 💡 Key Commands Reference

```powershell
# Start everything
docker-compose up                    # Docker services
cd backend && npm run dev            # Backend (3001)
cd frontend && npm run dev           # Frontend (3000)

# Stop everything
docker-compose down                  # Stop Docker services
Ctrl+C                              # Stop backend/frontend

# Database commands
npm run db:generate                  # Generate Prisma client
npm run db:migrate                   # Apply migrations
npm run db:seed                      # Seed with test data (if exists)

# Monitoring
docker ps                            # List running containers
docker logs postgres                 # PostgreSQL logs
docker logs redis                    # Redis logs
pm2 logs                            # Node.js logs (if using PM2)
```

---

**You're now ready to run Crestara locally!** 🎉

If you hit any issues, check the troubleshooting section above or let me know!

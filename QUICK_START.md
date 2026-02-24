# ⚡ QUICK START (Copy-Paste Instructions)

## Step 1: Install Docker (One-Time)

### ⬇️ Download Docker Desktop
- Go to: **https://www.docker.com/products/docker-desktop**
- Select your Windows version
- Run installer (takes 3-5 minutes)
- **Restart your computer**
- Launch Docker Desktop from Start Menu

### ✓ Verify Docker is Ready
Open PowerShell and run:
```powershell
docker --version
```

Should show: `Docker version 25.x.x`

---

## Step 2: Start Everything (Copy-Paste These Commands)

### Terminal 1 - Startup Services
```powershell
cd c:\Users\jae.jojo\Downloads\crestara
docker-compose up
```

**Wait for:**
```
postgres-1  | ready to accept connections
redis-1     | Ready to accept connections
```

### Terminal 2 - Setup Database
```powershell
cd c:\Users\jae.jojo\Downloads\crestara\backend
npm run db:generate
npm run db:migrate
```

**Should complete with:** ✓ Migration applied

### Terminal 3 - Start Backend
```powershell
cd c:\Users\jae.jojo\Downloads\crestara\backend
npm run dev
```

**Wait for:**
```
✨ Crestara API listening on port 3001
```

### Terminal 4 - Start Frontend
```powershell
cd c:\Users\jae.jojo\Downloads\crestara\frontend
npm run dev
```

**Wait for:**
```
▲ Next.js running on http://localhost:3000
```

---

## Step 3: Open Your App ✅

**Visit:** http://localhost:3000

---

## 📊 Status Check

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | http://localhost:3000 | ✅ Web App |
| **Backend API** | http://localhost:3001/api | ✅ API Server |
| **Database** | http://localhost:5050 | ✅ PgAdmin (optional) |
| **PostgreSQL** | localhost:5432 | ✅ Database |
| **Redis** | localhost:6379 | ✅ Cache |

---

## 🎯 Test Features

1. **Signup**: Click "Sign Up" button
2. **Login**: Use credentials you just created
3. **Dashboard**: Check user balance
4. **Casino**: Try placing a bet
5. **Admin**: Visit http://localhost:3000/admin

---

## 🆘 If Something Breaks

### Docker won't start
```powershell
# Check Docker Desktop is running in taskbar
# If not, click Start Menu > Docker Desktop
```

### Port already in use (3000/3001)
```powershell
netstat -ano | findstr :3000
taskkill /PID 12345 /F
```

### Database connection error
```powershell
# Check if PostgreSQL is running
docker ps

# If not running, restart
docker-compose restart postgres
```

### "npm not found"
```powershell
# Check Node.js is installed
node --version

# If not, download from nodejs.org
```

---

## 📁 Project Structure

```
crestara/
├── frontend/          ← Web app (port 3000)
├── backend/           ← API server (port 3001)
├── shared/            ← Shared types
├── docker-compose.yml ← PostgreSQL + Redis config
└── INSTALL_DOCKER.md  ← Full guide
```

---

## 🔑 Database Credentials

```
Host:     localhost
Port:     5432
User:     crestara
Password: postgres
Database: crestara_dev
```

---

## ✨ What You'll See

### Landing Page
- Crestara logo (animated, rotating)
- "Join Crestara" button
- 3 feature cards (Casino, Mining, Referrals)

### After Signup
- Dashboard with balance
- Casino games
- Mining packages
- Referral program

### Admin Panel
- User management
- Transaction logs
- Game settings

---

## 📞 Need Help?

If stuck, check these files:
- `INSTALL_DOCKER.md` - Full installation guide
- `DOCKER_DEPLOYMENT_GUIDE.md` - Deployment details
- `README.md` - Project overview

Still stuck? Common solutions:
1. Restart Docker Desktop
2. Run `docker-compose down` then `docker-compose up`
3. Clear npm cache: `npm cache clean --force`
4. Restart your computer

---

**That's it! Enjoy exploring Crestara! 🚀**

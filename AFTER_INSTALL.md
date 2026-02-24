# ✅ Installation Complete - Next Steps

Once the npm install finishes (watch the terminal for "added XX packages"), do this:

## Step 1: Verify Installation

```bash
cd c:\Users\jae.jojo\Downloads\crestara
npm list next
npm list @nestjs/core
```

Both should show version numbers (not errors).

---

## Step 2: Quick Database Setup (SKIP DATABASE FOR NOW - Using SQLite)

### Option A: Use SQLite (No Docker/PostgreSQL needed)

Edit `C:\Users\jae.jojo\Downloads\crestara\backend\.env`:

```env
DATABASE_URL="file:./dev.db"
REDIS_URL="memory"
```

Then:
```bash
cd backend
npm run db:migrate
npm run db:generate
```

### Option B: Use PostgreSQL (Requires Docker or local install)

If you have Docker:
```bash
docker-compose up -d
npm run db:migrate
npm run db:generate
```

---

## Step 3: Start Backend (Terminal 1)

```bash
cd c:\Users\jae.jojo\Downloads\crestara\backend
npm run dev
```

Wait for output:
```
✨ Crestara API listening on port 3001
```

---

## Step 4: Start Frontend (Terminal 2)

```bash
cd c:\Users\jae.jojo\Downloads\crestara\frontend
npm run dev
```

Wait for output:
```
▲ Next.js running on http://localhost:3000
```

---

## Step 5: Open App

Visit: **http://localhost:3000**

You should see the Crestara landing page with the animated logo! 🎉

---

## Common Errors & Fixes

### "Port 3000 already in use"
```bash
netstat -ano | findstr ":3000"
taskkill /PID <NUMBER> /F
```

### "Cannot find module @crestara/shared"
```bash
cd c:\Users\jae.jojo\Downloads\crestara\shared
npm install
cd ..\
npm install
```

### "Error: ENOENT: no such file or directory, open './dist'"
This is normal on first run. Just run again (build happens automatically on second try).

### "Prisma schema not found"
```bash
cd backend
npm run db:generate
```

### WebSocket connection errors
These are OK if backend isn't running yet. Just start backend in Terminal 1.

---

## Testing the API

### Signup (from browser console)
```javascript
fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test@1234'
  })
})
.then(r => r.json())
.then(console.log)
```

### Check Backend Health
```
http://localhost:3001/health
```

---

## Next: Admin Panel

After signing up, visit:
```
http://localhost:3000/admin
```

Login with same credentials.

---

## Performance Note

First `npm run dev` startup takes ~30-60 seconds while Next.js and NestJS compile. Subsequent changes are hot-reloaded (instant).

---

## You're Ready!

The Crestara platform is now running on your machine. 🚀

Next steps:
1. Customize branding
2. Integrate payment processor
3. Deploy to production

See `README.md` for full documentation.

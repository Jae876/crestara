# 🚀 Start Application (No Docker)

## While npm installs...

Both frontend and backend are installing dependencies now. This takes 5-10 minutes.

## Once Installation Completes

Open **2 separate terminals** (keep both open).

### Terminal 1: Backend
```bash
cd c:\Users\jae.jojo\Downloads\crestara\backend
npm run dev
```

Wait for:
```
[Nest] 12345   - 02/21/2026, 10:30:45 AM     LOG [NestFactory] Nest application successfully started +123ms
✨ Crestara API listening on port 3001
```

### Terminal 2: Frontend  
```bash
cd c:\Users\jae.jojo\Downloads\crestara\frontend
npm run dev
```

Wait for:
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
```

### Visit the App
Open browser: **http://localhost:3000**

You should see the Crestara landing page with the animated logo! 🎉

---

## Database Setup (One-Time)

After both are running, in a **3rd terminal**:

```bash
cd c:\Users\jao\Downloads\crestara\backend
npm run db:generate
npm run db:migrate
```

This creates a SQLite database (dev.db) automatically.

---

## Verify it's Working

### Check Backend
Open: http://localhost:3001/api

Should show an error (API routes need paths), but the server is running.

### Check Frontend
Open: http://localhost:3000

Should show Crestara landing page with animated logo.

### Test API Call
From browser console (on http://localhost:3000):
```javascript
fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test@12345'
  })
})
.then(r => r.json())
.then(d => console.log(d))
```

Should return user data with JWT token!

---

## Common Issues

| Issue | Fix |
|-------|-----|
| Port 3000 in use | `netstat -ano \| findstr :3000` then `taskkill /PID <num> /F` |
| "Cannot find module @crestara/shared" | Delete `node_modules` in `backend` and `frontend`, run `npm install` again |
| Database errors | Run `npm run db:generate` then `npm run db:migrate` |
| API returns 404 | Make sure backend is running on port 3001 |
| CORS errors | Should be fixed, but check `.env` has `CORS_ORIGIN=http://localhost:3000` |

---

## Admin Panel

After signup, visit:
```
http://localhost:3000/admin
```

Login with same email/password you used to sign up.

---

**You're all set!** The Crestara platform is now running. 🎉

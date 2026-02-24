# 🚀 Quick Setup - Skip Docker

## You Don't Need Docker Right Now

Let's get it running with just Node.js first.

---

## Step 1: Install Global Packages

```bash
npm install -g next nestjs @nestjs/cli
```

---

## Step 2: From Project Root

```bash
cd c:\Users\jae.jojo\Downloads\crestara
npm install --workspaces --no-optional
```

If that fails, try:

```bash
cd c:\Users\jae.jojo\Downloads\crestara\frontend
npm install

cd ..\backend  
npm install

cd ..\shared
npm install
```

---

## Step 3: Setup Frontend (.env.local in project root)

Create file: `c:\Users\jae.jojo\Downloads\crestara\.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Step 4: Setup Backend Database (Skip for Now)

We'll use SQLite instead of PostgreSQL to avoid Docker dependency:

Edit `backend/.env`:
```
DATABASE_URL="file:./dev.db"
```

---

## Step 5: Start Services

### Terminal 1 - Start Backend
```bash
cd c:\Users\jae.jojo\Downloads\crestara\backend
npm run dev
```

Wait for: `✨ Crestara API listening on port 3001`

### Terminal 2 - Start Frontend  
```bash
cd c:\Users\jae.jojo\Downloads\crestara\frontend
npm run dev
```

Wait for: `▲ Next.js running on http://localhost:3000`

---

## Step 6: Visit App

- **App**: http://localhost:3000
- **Admin**: http://localhost:3000/admin

---

## Troubleshooting

### "Module not found: @crestara/shared"
```bash
cd c:\Users\jae.jojo\Downloads\crestara\shared
npm install
```

### "Port 3000 already in use"
```bash
netstat -ano | findstr :3000
taskkill /PID 12345 /F
```

### TypeError: Cannot read property 'constructor'
This is OK during first run, it's Prisma generating. Just wait a moment.

---

## That's It!

No Docker. No complex setup. Just Node.js.

Once this works, you can add:
- PostgreSQL + Redis (Docker or local)
- Database migrations
- Production deployment

But for now: **Get it running!** 🚀

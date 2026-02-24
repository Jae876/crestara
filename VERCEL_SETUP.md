# VERCEL DEPLOYMENT WITH NEON DATABASE - SETUP GUIDE

## 🚀 QUICK START (5 minutes)

### Step 1: Create Neon PostgreSQL Database

1. Go to: https://console.neon.tech
2. Sign up or login
3. Create a new project:
   - **Project Name**: `crestara`
   - **Region**: Pick closest to your users
   - **Database Name**: `neondb` (default)
4. Click "Create" and wait for provisioning

### Step 2: Get Your Connection String

1. In Neon dashboard, go to **Connection** section
2. Select connection type: **Connection string**
3. Copy the full string that looks like:
   ```
   postgresql://neondb_owner:AbCdEf123456@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **KEEP THIS SAFE** - it has your password

### Step 3: Generate JWT Secrets

Open terminal and run:

```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate JWT_REFRESH_SECRET
openssl rand -hex 32
```

Copy both outputs (64 hex characters each)

### Step 4: Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

1. Go to: https://vercel.com/new
2. Click **"Continue with GitHub"**
3. Select `Jae876/crestara` repository
4. Click **"Import"**
5. In **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string (from Step 2) |
| `JWT_SECRET` | Your generated JWT_SECRET (from Step 3) |
| `JWT_REFRESH_SECRET` | Your generated JWT_REFRESH_SECRET (from Step 3) |
| `NODE_ENV` | `production` |

6. Click **"Deploy"**
7. Wait 5-10 minutes for build to complete

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Add environment variables when prompted:
# - DATABASE_URL: Your Neon connection string
# - JWT_SECRET: Your generated secret
# - JWT_REFRESH_SECRET: Your generated secret
# - NODE_ENV: production
```

### Step 5: Verify Deployment

1. Go to your Vercel project dashboard
2. Wait for **Build** to complete (shows checkmark)
3. Wait for **Deployment** to complete
4. Visit your app URL in browser
5. Go to `/api/health` to verify database connection

Expected response:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "latency_ms": 45
  },
  "environment": "production"
}
```

**If database is unhealthy**, see **Troubleshooting** below.

---

## 📋 WHAT HAPPENS ON DEPLOYMENT

Vercel automatically:

1. **Installs dependencies** → `npm ci`
2. **Builds Next.js** → `npm run build`
3. **Migrates database** → `prisma migrate deploy` (automatic)
4. **Starts production server** → Next.js runs your API routes

**No manual database setup needed!** Prisma handles migrations automatically.

---

## ✅ POST-DEPLOYMENT CHECKLIST

After deployment succeeds:

- [ ] Visit `/api/health` - shows `"connected": true`
- [ ] Visit `/api/auth/signup` - create test account
- [ ] Visit `/api/auth/login` - verify login works
- [ ] Visit `/api/auth/me` with Bearer token - verify auth works
- [ ] Admin tests: POST `/api/admin` with admin token

---

## 🔧 ENVIRONMENT VARIABLES REFERENCE

### Required for Production

```env
DATABASE_URL=postgresql://...  # Neon connection string
JWT_SECRET=<64-char-hex>       # openssl rand -hex 32
JWT_REFRESH_SECRET=<64-char>   # openssl rand -hex 32
NODE_ENV=production
```

### Optional

```env
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app  # For CORS
SENTRY_DSN=                                          # Error tracking
LOG_LEVEL=info                                       # Logging level
```

---

## 🆘 TROUBLESHOOTING

### Issue: Build fails with "prisma: command not found"

**Solution**: Already fixed in package.json - uses `npx prisma`

### Issue: `/api/health` returns unhealthy

**Check 1**: Verify `DATABASE_URL` in Vercel environment variables
```bash
# In Vercel dashboard:
# Settings > Environment Variables > DATABASE_URL
# Make sure it exists and has no typos
```

**Check 2**: Check connection string format
```
✅ Correct: postgresql://user:pass@host/db?sslmode=require
❌ Wrong: database=...  (missing user:pass)
```

**Check 3**: Verify Neon is running
```
# Go to Neon console:
# https://console.neon.tech
# Check if your project shows "Available"
```

### Issue: Prisma migrations fail

**Solution**: Ensure `DATABASE_URL` is set BEFORE deployment
- Add it to Vercel Environment Variables (not in code)
- Never commit `.env` files
- Migrations run automatically in build

### Issue: "JWT_SECRET and JWT_REFRESH_SECRET must be set"

**Solution**: Add to Vercel Environment Variables
```
Settings > Environment Variables
Add JWT_SECRET and JWT_REFRESH_SECRET
```

### Issue: Database connection times out

**Likely cause**: Neon is in different region or firewall issue

**Solutions**:
1. Check Neon project status (should show "Available")
2. Verify connection string in `DATABASE_URL`
3. Try connection from local machine:
   ```bash
   psql "postgresql://user:pass@host/db?sslmode=require"
   ```

---

## 🔐 SECURITY BEST PRACTICES

### Never Store Secrets in Code

```typescript
// ❌ NEVER DO THIS
const JWT_SECRET = "your-secret-key";

// ✅ DO THIS INSTEAD
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET not set');
```

### Rotate Secrets Regularly

```bash
# Generate new JWT secrets (monthly)
openssl rand -hex 32

# Update in Vercel dashboard
# Secrets are used for NEW tokens only
```

### Restrict Database Access

In Neon dashboard:
- IP Whitelist: Add Vercel's IP ranges (automatic)
- Use read-only roles for application
- Create separate connection string for migrations

---

## 📊 MONITORING AFTER DEPLOYMENT

### Check Application Logs

```bash
# Vercel Dashboard > Deployments > View Runtime Logs
# Look for:
# - Prisma migration logs
# - Database connection messages
# - Any errors during startup
```

### Monitor Database Usage

```
Neon Console > Metrics
- Connection count
- Query latency
- Storage usage
```

### Test API Endpoints

```bash
# Get deployment URL from Vercel dashboard
# Example: https://crestara.vercel.app

# Test health
curl https://crestara.vercel.app/api/health

# Test signup
curl -X POST https://crestara.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

---

## 🚀 PRODUCTION READINESS CHECKLIST

### Before Going Live

- [ ] `DATABASE_URL` set in Vercel
- [ ] `JWT_SECRET` and `JWT_REFRESH_SECRET` generated and set
- [ ] Build completes without errors
- [ ] `/api/health` shows `connected: true`
- [ ] Test user signup/login works
- [ ] Admin API requires authentication
- [ ] Audit logs being created
- [ ] Error handling is comprehensive
- [ ] Rate limiting configured (optional but recommended)
- [ ] CORS properly configured

### Ongoing Maintenance

- [ ] Monitor deployment logs daily
- [ ] Check database metrics weekly
- [ ] Rotate secrets monthly
- [ ] Test database backups monthly
- [ ] Review audit logs for suspicious activity

---

## 📞 SUPPORT

### Common Issues

| Error | Solution |
|-------|----------|
| `connect ECONNREFUSED` | DATABASE_URL is invalid or Neon is down |
| `permission denied for schema public` | DATABASE_URL user lacks permissions |
| `certificate verify failed` | Add `?sslmode=require` to connection string |
| `too many connections` | Prisma pool exhausted - check for leaks |

### Get Help

1. Neon Support: https://support.neon.tech
2. Vercel Support: https://vercel.com/support
3. Prisma Docs: https://www.prisma.io/docs

---

## 🎉 YOU'RE DEPLOYED!

Your production Crestara platform is now live at: `https://your-app.vercel.app`

**Key Endpoints:**
- `GET /` - Landing page
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Authenticated user profile
- `GET /api/health` - Health check
- `POST /api/admin` - Admin dashboard (requires admin token)

---

**Last Updated**: February 24, 2026  
**Version**: 1.0.0 - Production Ready

# NEON POSTGRES SETUP - ADVANCED GUIDE

## 🎯 WHAT IS NEON?

Neon is a **serverless PostgreSQL database** hosted on AWS that automatically scales.

**Benefits:**
- ✅ No database server to manage
- ✅ Automatic backups
- ✅ Auto-scaling connections
- ✅ Branch support (dev/staging/production)
- ✅ Connection pooling included
- ✅ Free tier: 3 projects, 3GB storage, 10 connections

---

## 1️⃣ CREATE NEON PROJECT

### Step 1: Sign Up

1. Go to: https://console.neon.tech
2. Sign up with GitHub or email
3. Confirm your email

### Step 2: Create Project

Click **"Create a new project"**

**Settings:**
- **Project name**: `crestara`
- **Region**: Pick closest to your users:
  - 🇺🇸 `us-east-1` (N. Virginia) - Default
  - 🇪🇺 `eu-west-1` (Ireland)
  - 🇯🇵 `ap-southeast-1` (Tokyo)
- **Database**: `neondb` (default)
- **User**: `neondb_owner` (default)

Click **"Create project"**

Wait 2-3 minutes while Neon provisions your database...

### Step 3: Get Your Connection Credentials

After creation, you'll see the Connection String:

```
postgresql://neondb_owner:AbCdEf123456@ep-xxxxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**This string contains:**
- `neondb_owner` - Username
- `AbCdEf123456` - Password (auto-generated)
- `ep-xxxxx.us-east-1.aws.neon.tech` - Host
- `neondb` - Database name
- `?sslmode=require` - SSL encryption (required)

---

## 2️⃣ GET SHADOW DATABASE (FOR MIGRATIONS)

### What is Shadow Database?

Prisma uses a "shadow database" to safely plan schema migrations without affecting production data.

### Create Shadow Database in Neon

1. Go to Neon console: https://console.neon.tech
2. Click your project name
3. Go to **"Databases"** tab
4. Click **"New Database"**
5. **Name**: `neondb_shadow`
6. Click **"Create"**

### Get Shadow Connection String

1. In Neon console, click **"Connection"**
2. Copy the connection string
3. **Replace the database name**: Change `neondb` → `neondb_shadow`

**Example:**
```
# Original (main database)
postgresql://neondb_owner:AbCdEf@ep-xxxxx.../neondb?sslmode=require

# Shadow (for migrations)
postgresql://neondb_owner:AbCdEf@ep-xxxxx.../neondb_shadow?sslmode=require
```

---

## 3️⃣ SET VERCEL ENVIRONMENT VARIABLES

### In Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Select your **`crestara`** project
3. Click **"Settings"**
4. Go to **"Environment Variables"**
5. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | Main connection string | `production` |
| `SHADOW_DATABASE_URL` | Shadow connection string | `production` |
| `JWT_SECRET` | `openssl rand -hex 32` | `production` |
| `JWT_REFRESH_SECRET` | `openssl rand -hex 32` | `production` |
| `NODE_ENV` | `production` | `production` |

**Click "Save"** after each addition

### Generate JWT Secrets

Open your terminal:
```bash
# Generate JWT_SECRET
openssl rand -hex 32

# Generate JWT_REFRESH_SECRET  
openssl rand -hex 32
```

Copy each output (64 hex characters) into Vercel

---

## 4️⃣ DEPLOY TO VERCEL

1. Go to: https://vercel.com/new
2. Click **"Continue with GitHub"**
3. Select `Jae876/crestara`
4. Click **"Import"**
5. Environment variables are already set (from Step 3)
6. Click **"Deploy"**

**Waiting for deployment:**
- Build phase: 3-5 minutes (compiles Next.js)
- Migration phase: 1-2 minutes (Prisma deploys schema)
- Deployment: 1-2 minutes (Vercel finalizes)
- **Total: ~10 minutes**

---

## 5️⃣ VERIFY DEPLOYMENT

### Test Health Endpoint

```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "latency_ms": 42
  }
}
```

### Test Auth Flow

```bash
# Sign up
VERCEL_URL="https://your-app.vercel.app"

curl -X POST $VERCEL_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123456","confirmPassword":"Test@123456"}'

# Response should have accessToken and refreshToken
```

---

## 🔗 NEON CONNECTION POOLING

Neon includes built-in connection pooling. You can use it for even better performance:

### Get Pooled Connection String

In Neon connection dialog, select:
- **Connection type**: "Pooled connection"
- Copy the string

Use in Vercel as `DATABASE_URL_POOLED` for API routes (faster)

---

## 📊 MONITOR YOUR DATABASE

### Neon Console Metrics

1. Go to: https://console.neon.tech
2. Click your project
3. Go to **"Metrics"** tab

Monitor:
- **Connections**: Current active connections (should be < 10)
- **Queries/sec**: Database activity
- **Storage used**: Data size (free tier: 3GB)

### Logs

1. Go to **"Logs"** tab
2. View recent queries and errors
3. Helpful for debugging

---

## 🆘 TROUBLESHOOTING

### Issue: "relation \"User\" does not exist"

**Cause**: Migrations didn't run

**Solution**:
1. Check Vercel deployment logs:
   - Dashboard > Deployments > View Logs
   - Look for "prisma migrate deploy"
2. If failed, retry:
   ```bash
   vercel env pull  # Get env vars locally
   npm run db:migrate:prod  # Run migrations manually
   ```

### Issue: "too many connections"

**Cause**: Connection pool exhausted

**Solution**:
1. Use Neon's pooled connection (faster)
2. Set connection limit in Vercel:
   - Add `PRISMA_CLIENT_ENGINE_TYPE=dataproxy`

### Issue: "SSL certificate problem"

**Cause**: `?sslmode=require` missing

**Solution**:
1. Verify connection string includes `?sslmode=require` at the end
2. Update in Vercel environment variables

### Issue: Shadow database connection fails

**Cause**: Shadow database doesn't exist

**Solution**:
1. Create shadow database in Neon:
   - Neon Console > Databases > New Database > `neondb_shadow`
2. Get connection string and update `SHADOW_DATABASE_URL`

---

## 🔒 SECURITY BEST PRACTICES

### Change Default Password

Neon auto-generates a password. To change it:

1. Neon Console > Click project
2. Go to **"Settings"** tab
3. Click **"Change password"**
4. Update connection string in Vercel

### Rotate Credentials Regularly

Every month:
1. Generate new password in Neon
2. Update `DATABASE_URL` in Vercel
3. Old connections gracefully timeout

### Create Read-Only User (Optional)

For analytics/reporting role:
```sql
CREATE ROLE analytics WITH LOGIN PASSWORD 'password';
GRANT CONNECT ON DATABASE neondb TO analytics;
GRANT USAGE ON SCHEMA public TO analytics;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics;
```

---

## 📈 SCALE UP

### Add More Resources

When you outgrow the free tier:

1. Neon Console > Settings
2. Upgrade plan (pay-as-you-go or fixed)
3. Choose compute size (bigger = faster queries)
4. Add storage (scales automatically)

### Backup Strategy

Neon automatically backs up your data:
- **Daily backups**: 7 days retention
- **Point-in-time recovery**: Available

To export data:
```bash
# Export to SQL file
pg_dump "your-connection-string" > backup.sql

# Restore from file
psql "your-connection-string" < backup.sql
```

---

## 📚 USEFUL LINKS

- **Neon Docs**: https://neon.tech/docs
- **Neon Console**: https://console.neon.tech
- **Prisma + Neon Guide**: https://www.prisma.io/docs/guides/database/neon
- **Connection String Reference**: https://neon.tech/docs/connect/connection-details

---

## ✅ DEPLOYMENT CHECKLIST

- [ ] Neon project created
- [ ] Main database connection string copied
- [ ] Shadow database created
- [ ] Shadow connection string copied
- [ ] Vercel environment variables set
- [ ] Deployment triggered
- [ ] `/api/health` returns healthy
- [ ] Test user signup works
- [ ] Database visible in Neon console
- [ ] Metrics show active connections

---

**You're now using production-grade serverless PostgreSQL! 🎉**

Questions? Check Neon support: https://support.neon.tech

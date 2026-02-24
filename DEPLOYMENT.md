# 🚀 CRESTARA - PRODUCTION DEPLOYMENT GUIDE

**Status**: ✅ **PRODUCTION READY**

Complete guide to deploy Crestara to production in ~15 minutes.

---

## 📋 WHAT YOU'LL NEED

1. **GitHub account** (you already have one)
2. **Neon account** (free tier, sign up: https://console.neon.tech)
3. **Vercel account** (connects to GitHub, sign up: https://vercel.com)
4. **Time**: 5-15 minutes

---

## 🎯 DEPLOYMENT ARCHITECTURE

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Your Code     │         │   Vercel Dev     │         │  Neon           │
│   (GitHub)      │────────▶│   Server         │────────▶│  PostgreSQL     │
│  Crestara Repo  │         │   (Next.js)      │         │  (Auto-scale)   │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        Push                 Auto-deploys                 Auto-migrates
```

**What happens automatically:**
1. You push code to GitHub
2. Vercel detects change → Starts build
3. Vercel runs: `npm run build` + `npm run db:migrate:prod`
4. Database migrations execute automatically
5. Health check endpoint verifies database connectivity
6. Vercel deploys live URL

**How long it takes:**
- Build: 3-5 minutes
- Migrations: 1-2 minutes
- Deployment: 1-2 minutes
- **Total: ~10 minutes**

---

## ⚡ QUICK START (5 STEPS ONLY)

### Step 1: Create Neon Database (3 min)

1. Go to: https://console.neon.tech
2. Sign up (GitHub or email)
3. Click "Create project"
4. Name: `crestara`
5. Copy the connection string (looks like `postgresql://...?sslmode=require`)
6. Create second database: Databases tab → New → `neondb_shadow`
7. Copy that connection string too

**You now have:**
- `DATABASE_URL` = Main database connection
- `SHADOW_DATABASE_URL` = Migration testing database

### Step 2: Generate JWT Secrets (1 min)

Open PowerShell and run twice:

```powershell
# Windows PowerShell
openssl rand -hex 32
```

Or use Python:
```python
import secrets; print(secrets.token_hex(32))
```

Get 2 values:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

### Step 3: Configure Vercel (1 min)

1. Go to: https://vercel.com/new
2. Click **"GitHub"**
3. Select **`Jae876/crestara`**
4. Click **"Import"**

Add Environment Variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Neon main connection string |
| `SHADOW_DATABASE_URL` | Your Neon shadow connection string |
| `JWT_SECRET` | First 64-char hex value |
| `JWT_REFRESH_SECRET` | Second 64-char hex value |
| `NODE_ENV` | `production` |

Click **"Deploy"**

### Step 4: Wait for Deployment (10 min)

Vercel will automatically:
1. Build Next.js app
2. Run database migrations
3. Verify database connectivity
4. Deploy live

When it says **"Domain ready"**, you're live! ✅

### Step 5: Test It (2 min)

```bash
# Get your Vercel URL (from dashboard)
$SITE = "https://your-app.vercel.app"

# Test 1: Health check
curl "$SITE/api/health"
# Expected: {"status":"healthy","database":{"connected":true}}

# Test 2: Sign up
curl -X POST "$SITE/api/auth/signup" `
  -H "Content-Type: application/json" `
  -d @- << 'EOF'
{
  "email":"test@example.com",
  "password":"Test@123456",
  "confirmPassword":"Test@123456"
}
EOF
# Expected: {"accessToken":"eyJ...", "user":{"id":"...","email":"test@example.com"}}
```

✅ **If tests pass, you're LIVE!**

---

## 📖 DETAILED SETUP GUIDES

For step-by-step walkthroughs, see:
- [NEON_SETUP.md](./NEON_SETUP.md) - Complete Neon PostgreSQL setup
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Complete Vercel deployment guide
---

## 🏗️ WHAT'S INCLUDED

### Database (PostgreSQL via Neon)

8 Tables managed by Prisma:

| Table | Purpose |
|-------|---------|
| `User` | Player accounts (emails, passwords, balances) |
| `Transaction` | Deposits, withdrawals, payouts |
| `Bet` | Gaming bets with outcomes |
| `MiningBot` | Cloud mining subscriptions |
| `Bonus` | Promotional bonuses |
| `Referral` | Referral tracking |
| `GameConfig` | Per-game rules and house edge |
| `AuditLog` | Admin action history (compliance) |

### Backend API (11 Endpoints)

All routes in `/src/app/api/`:

**Authentication** (5 endpoints)
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify` - Check token validity

**Gaming** (1 endpoint)
- `POST /api/casino` - Place bet

**Mining** (2 endpoints)
- `GET /api/mining` - List mining subscriptions
- `POST /api/mining` - Buy mining package

**Funding & Referrals** (3 endpoints)
- `GET /api/funding` - View transactions
- `POST /api/funding` - Initiate deposit
- `POST /api/referral` - Apply referral code

**Admin** (🔒 Protected endpoints)
- `GET /api/admin` - Dashboard metrics
- `POST /api/admin?action=...` - User management, game stats, banning, etc.

**Health Check** (1 endpoint)
- `GET /api/health` - Database connectivity verification

### Frontend (Next.js + React)

Pages in `/src/app/`:
- `/` - Home page with game previews
- `/auth/(signin|signup)` - Authentication flows
- `/dashboard` - Player dashboard
- `/casino` - Gaming platform
- `/mining` - Cloud mining
- `/admin` - Admin dashboard (RBAC protected)

---

## 🔒 SECURITY

### Built-In Protections

✅ **Password Security**
- Argon2 hashing (memory-hard, resistant to GPU attacks)
- Configurable cost factor (2^16 memory, 3 iterations)

✅ **Authentication**
- JWT tokens (1 hour expiry)
- Refresh tokens (7 day expiry)
- Secure token storage (HTTP-only cookies)

✅ **Database**
- Connection pooling (prevents exhaustion)
- Singleton client (prevents memory leaks)
- Shadow database for safe migrations

✅ **Authorization**
- Role-based access control (RBAC)
- Admin endpoints require ADMIN role
- Proper error messages (no user enumeration)

✅ **Audit Trail**
- All admin actions logged
- KYC status tracked
- Compliance reporting ready

### Environment Variables

**Never commit secrets to GitHub!**

Vercel stores these securely:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - Access token signing key
- `JWT_REFRESH_SECRET` - Refresh token signing key
- `NODE_ENV` - Set to `production`

---

## 📊 MONITORING

### Check Health Anytime

```bash
curl https://your-app.vercel.app/api/health
```

Response shows:
- Database connection status
- Latency (should be < 100ms)
- Environment (production/development)

### View Logs

**Vercel Logs:**
- Dashboard → Deployments → View Logs
- See build errors, migration status, API calls

**Database Logs:**
- Neon Console → Logs tab
- View SQL queries, connection events

**Metrics:**
- Vercel: Response time, error rate
- Neon: Connections, queries/sec, storage used

---

## 🚨 TROUBLESHOOTING

### "relation 'User' does not exist"

**Problem**: Database schema not created

**Solution**:
```bash
# Check Vercel build logs for migration errors
# If failed, manually migrate:
vercel env pull  # Get environment variables
npm run db:migrate:prod
```

### "too many connections"

**Problem**: Connection pool exhausted

**Solution**:
1. Use Neon pooled connection (faster)
2. Limit connections in `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

### "SSL certificate problem"

**Problem**: Connection string missing SSL config

**Solution**:
- Verify `DATABASE_URL` ends with `?sslmode=require`
- Update in Vercel environment variables

### App starts but no database data

**Problem**: Migrations didn't run

**Solution**:
1. Vercel Dashboard → [Project Name] → Deployments
2. Click latest deployment
3. Scroll to "Deploy logs"
4. Search for "prisma migrate"
5. Look for errors or "migrations applied"

If no migration output, migrations didn't run:
```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger deployment"
git push origin main
```

---

## 🔄 CONTINUOUS DEPLOYMENT

### How Updates Work

1. You make code changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```
3. Vercel automatically detects the push
4. Build starts (watches on Vercel dashboard)
5. If successful, updates go live immediately
6. Old version still available (you can rollback)

### Database Migrations are Automatic

When you update `prisma/schema.prisma`:
1. Run locally first:
   ```bash
   npx prisma migrate dev --name "description"
   ```
2. Commit and push
3. Vercel automatically runs `prisma migrate deploy` during build
4. No need for manual database steps!

---

## 📈 SCALING

### When You Need More Resources

1. **Traffic grows**: Vercel auto-scales (no config needed)
2. **Database grows**: Upgrade Neon plan (pay-as-you-go)
3. **More connections**: Use Neon's built-in pooling
4. **More regions**: Vercel has 32+ data centers

Neon free tier includes:
- 3GB storage
- Up to 10 connections
- Daily backups
- Auto-scaling compute

---

## ✅ DEPLOYMENT CHECKLIST

Before going live, verify:

- [ ] Neon project created (got DATABASE_URL + SHADOW_DATABASE_URL)
- [ ] JWT secrets generated (2 hex values)
- [ ] Vercel project connected to GitHub
- [ ] Environment variables set in Vercel
- [ ] Deployment completed (shows "Domain ready")
- [ ] `/api/health` returns healthy status
- [ ] Can sign up and login
- [ ] Admin dashboard loads (if you're admin)
- [ ] Database visible in Neon console

---

## 🎉 YOU'RE LIVE!

Your production app is now:
- ✅ Deployed globally on Vercel CDN
- ✅ Connected to PostgreSQL database
- ✅ Auto-scaling (no limits)
- ✅ HTTPS secured
- ✅ Monitored 24/7

**Share your app URL:**
```
https://your-app.vercel.app
```

---

## 📚 NEXT STEPS

1. **Test thoroughly** - Try all features in production
2. **Monitor metrics** - Check Vercel/Neon dashboards daily
3. **Set up alerts** - Neon can email you on issues
4. **Plan marketing** - Your app is live!
5. **Scale gradually** - Monitor costs as you grow

---

## 🆘 GETTING HELP

**Documentation:**
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

**Support:**
- Vercel Support: https://vercel.com/support
- Neon Support: https://support.neon.tech
- GitHub Issues: https://github.com/Jae876/crestara/issues

---

**Status: 🟢 READY FOR PRODUCTION DEPLOYMENT**
- **Retention**: 30 days minimum
- **Cross-region**: Store backups in separate region

```bash
pg_dump DATABASE_URL > backup.sql
```

### Restore Procedure
```bash
psql DATABASE_URL < backup.sql
```

---

## Scaling Strategy

### Phase 1: MVP (Current)
- Single API instance
- Shared PostgreSQL
- Single Redis instance

### Phase 2: Growth
- Load balancer (Railway/Fly.io managed)
- Database read replicas
- Redis cluster
- CDN for static assets

### Phase 3: Scale
- Kubernetes (EKS/GKE)
- Managed PostgreSQL (RDS)
- ElastiCache Redis
- CloudFront/Fastly CDN

---

## Maintenance Schedule

| Task | Frequency | Owner |
|------|-----------|-------|
| Security updates | Monthly | DevOps |
| Database backups | Daily | Automated |
| Log rotation | Weekly | Automated |
| Certificate renewal | 90 days | Automated |
| Performance review | Monthly | DevOps |
| Dependency updates | Monthly | Developer |

---

## Troubleshooting

### API Connection Failed
- Check backend is running: `curl https://api.crestara.io/health`
- Verify environment variable: `NEXT_PUBLIC_API_BASE_URL`
- Check CORS headers

### Database Connection Timeout
- Verify connection string
- Check database is reachable
- Ensure IP whitelist includes app

### Out of Memory
- Check process logs
- Optimize queries
- Increase RAM allocation

---

## Cost Estimation (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | $20-80 | Frontend hosting |
| Railway | $7-30 | NestJS + PostgreSQL + Redis |
| Upstash Redis | $10-50 | Cache & sessions |
| CoinGecko API | Free | Crypto prices |
| Tatum.io | $99-499 | Blockchain data |
| Domain | $12 | .io domain |
| **Total** | **$158-671** | Estimated MVP costs |

---

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Fly.io Docs](https://fly.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

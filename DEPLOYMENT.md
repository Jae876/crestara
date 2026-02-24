# 🚀 Deployment Guide

Complete production deployment strategy for Crestara platform.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Vercel)                       │
│                   Next.js 14+ React App                      │
│          Deployed globally with CDN + serverless             │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/WSS
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Railway/Fly.io)                    │
│                      NestJS REST API                         │
│                  Socket.io Real-time Hub                     │
│                  JWT Auth + Rate Limiting                    │
└─┬────────────────────────────────┬──────────────────────────┘
  │                                │
  ↓                                ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data & Cache Layer                         │
│  PostgreSQL (db) │ Redis (cache/sessions/queues)            │
│                  │ Prisma ORM                               │
└─────────────────────────────────────────────────────────────┘
  │
  ├─→ CoinGecko API (prices)
  ├─→ Tatum.io (blockchain deposits)
  ├─→ Pragmatic Play / BGaming (game iframes)
  └─→ Email Service (SMS/Sendgrid)
```

## Frontend Deployment (Vercel)

### Setup

1. **Create Git Repository**
   ```bash
   git init
   git remote add origin https://github.com/yourusername/crestara.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import GitHub repository
   - Select `frontend/` as root directory

3. **Environment Variables**
   In Vercel dashboard, add:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.crestara.io
   NEXT_PUBLIC_BRAND=Crestara
   ```

4. **Deploy**
   - Automatic on Git push to main
   - Previews for pull requests
   - Custom domain: crestara.io

### Production Checklist

- [ ] `.env.local` excluded from git (.gitignore)
- [ ] Minification & code splitting enabled
- [ ] Image optimization (Next.js Image)
- [ ] Security headers set (Vercel config)
- [ ] CORS configured for API domain
- [ ] Analytics enabled (optional)

---

## Backend Deployment (Railway or Fly.io)

### Option 1: Railway

#### Setup

1. **Create Project**
   ```bash
   npm install -g @railway/cli
   railway init
   railway login
   ```

2. **Create Services**
   - PostgreSQL database
   - Redis cache
   - NestJS app

   ```bash
   railway service add
   ```

3. **Environment Variables**
   ```
   DATABASE_URL=postgresql://user:pass@localhost:5432/crestara
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-secret-key-min-32-chars
   NODE_ENV=production
   PORT=3001
   ```

4. **Deploy**
   ```bash
   railway up
   ```

### Option 2: Fly.io

#### Setup

1. **Create App**
   ```bash
   flyctl apps create crestara-api
   cd backend
   flyctl launch
   ```

2. **Attach PostgreSQL**
   ```bash
   flyctl postgres create crestara-db
   flyctl postgres attach crestara-db
   ```

3. **Attach Redis**
   ```bash
   flyctl upscale add redis-cache 1
   ```

4. **Environment Variables** (fly.toml)
   ```toml
   [env]
   DATABASE_URL = "postgresql://..."
   REDIS_URL = "redis://..."
   JWT_SECRET = "your-secret"
   NODE_ENV = "production"
   ```

5. **Deploy**
   ```bash
   flyctl deploy
   ```

### Database Setup

#### PostgreSQL

**Local Development**:
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=crestara_dev \
  -p 5432:5432 \
  postgres:15
```

**Apply Migrations**:
```bash
npm run db:migrate:prod
npm run db:generate
```

**Seed Data**:
```bash
npm run db:seed
```

---

## Redis Setup

### Local Development
```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7 redis-server
```

### Production
- **Upstash**: Fully managed Redis (recommended for startups)
- **Redis Cloud**: AWS/GCP/Azure hosted
- **Fly.io PostgreSQL**: Built-in PostgreSQL backup

---

## SSL/TLS Certificates

### Automatic (Recommended)
- **Vercel**: Auto HTTPS with Let's Encrypt
- **Railway/Fly.io**: Auto HTTPS on deploy
- **Custom Domain**: Add CNAME record to Vercel/Railway

### Manual
```bash
# Let's Encrypt with Certbot
certbot certonly --standalone -d crestara.io
```

---

## Domain Configuration

### DNS Records

```
# CNAME for frontend (Vercel)
crestara.io       CNAME  cname.vercel-dns.com

# CNAME for API (Railway/Fly.io)
api.crestara.io   CNAME  api.railway.io
                  OR
                  CNAME  api.fly.io

# Optional: Email
mail              MX     10 mail.example.com
```

---

## Security Hardening

### Backend

1. **Enable HTTPS Only**
   ```typescript
   app.use(helmet());
   app.use(redirect to HTTPS);
   ```

2. **Rate Limiting**
   ```bash
   npm install @nestjs/throttler
   ```

3. **API Key Rotation**
   - CoinGecko: Optional API key
   - Tatum.io: Rotate API keys quarterly

4. **Database**
   - Restrict IP whitelist
   - Enable SSL for connections
   - Regular backups to separate region

5. **Secrets Management**
   - Use deployment platform's secret store
   - Never commit .env files
   - Rotate JWT secrets quarterly

### Frontend

1. **Headers** (next.config.js)
   ```javascript
   headers: {
     'Strict-Transport-Security': 'max-age=31536000',
     'X-Content-Type-Options': 'nosniff',
     'X-Frame-Options': 'DENY',
   }
   ```

2. **Content Security Policy**
   ```
   default-src 'self';
   script-src 'self' cdn.jsdelivr.net;
   style-src 'self' 'unsafe-inline';
   ```

---

## Monitoring & Logging

### Backend Logs
- **Pino**: Structured JSON logging
- **Sentry**: Error tracking & alerting

```bash
npm install @sentry/nestjs
```

### Frontend Monitoring
- **Vercel Analytics**: Built-in
- **Sentry**: Client-side error tracking

### Database Monitoring
- **Railway/Fly.io**: Built-in dashboards
- **pgAdmin**: PostgreSQL GUI (optional)

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      # Frontend
      - name: Deploy Frontend to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      
      # Backend
      - name: Deploy Backend to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      
      # Database
      - name: Run Migrations
        run: |
          npm install
          npm run db:migrate:prod
```

---

## Performance Optimization

### Frontend
- Image optimization (Next.js Image)
- Code splitting & lazy loading
- CDN via Vercel
- Compression (automatically enabled)

### Backend
- Connection pooling (Prisma)
- Redis caching layer
- Database indexing
- Rate limiting on endpoints

### Database
- Add indexes on frequently queried fields
- Archive old transactions/bets
- Regular VACUUM & ANALYZE

---

## Backup & Disaster Recovery

### Database Backups
- **Automated**: Railway/Fly.io daily backups
- **Manual**: `pg_dump` for PostgreSQL
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

# Prisma Migrations

This folder contains all database migrations for Crestara.

## Setup

```bash
# Generate client from schema
npm run db:generate

# Run migrations (development)
npm run db:migrate

# Apply migrations (production)
npm run db:migrate:prod

# Reset database (dev only)
npm run db:reset
```

## Initial Migration

The `001_init` migration creates all core tables:
- User (with roles and KYC)
- Transaction
- Bet (casino)
- Bonus
- MiningBot
- Referral
- GameConfig
- SystemConfig
- AuditLog

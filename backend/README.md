# ⚙️ Crestara Backend

**NestJS production-grade API** for the Crestara crypto casino and mining platform.

## 📁 Structure

```
backend/
├── src/
│   ├── main.ts                      # Application entry point
│   ├── app.module.ts                # Root module
│   ├── modules/
│   │   ├── auth/                    # Authentication (JWT, signup, login)
│   │   ├── funding/                 # Deposits, withdrawals, coins
│   │   ├── casino/                  # Games, betting, provably fair
│   │   ├── mining/                  # Mining bots, packages, payouts
│   │   ├── referral/                # Affiliate program & tracking
│   │   └── admin/                   # Admin dashboard & controls
│   ├── common/
│   │   ├── prisma/                  # Database module
│   │   ├── strategies/              # JWT strategy
│   │   ├── guards/                  # Auth & role guards
│   │   ├── decorators/              # Custom decorators
│   │   └── websocket/               # Socket.io gateway
│   └── config/                      # Configuration files
├── prisma/
│   ├── schema.prisma                # Data model
│   ├── migrations/                  # Database migrations
│   └── seed.ts                      # Seed script
├── test/                            # Tests
└── package.json
```

## 🚀 Getting Started

### Install Dependencies
```bash
cd backend
npm install
```

### Environment Setup
Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/crestara_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRY="7d"
NODE_ENV="development"
PORT=3001
```

### Database Setup
```bash
npm run db:migrate      # Apply migrations
npm run db:generate     # Generate Prisma client
npm run db:seed         # Seed initial data (optional)
```

### Run Development Server
```bash
npm run dev
```
Server runs on [http://localhost:3001](http://localhost:3001)

## 🏗️ Architecture

### Modules

#### Auth Module
- Email/password sign-up with email verification
- JWT authentication + refresh tokens
- Argon2 password hashing
- OTP support (extensible)

**Routes**:
- `POST /auth/signup`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me` (protected)

#### Funding Module
- 130+ cryptocurrency support (CoinGecko API)
- Deposit address generation (Tatum.io placeholder)
- Withdrawal handling
- Transaction tracking with webhooks

**Routes**:
- `GET /funding/coins` - Available coins
- `POST /funding/deposit/initiate`
- `POST /funding/deposit/confirm`
- `POST /funding/withdraw/initiate`
- `GET /funding/transactions`

#### Casino Module
- Provably fair games (Crash, Plinko, Dice, Mines, Coinflip, Keno)
- House edge configuration
- Bet history & verification
- Real-time win notifications via WebSocket

**Routes**:
- `GET /casino/games`
- `POST /casino/bet/place`
- `GET /casino/bets`
- `GET /casino/verify/:betId`

#### Mining Module
- 3 packages (Basic $5, Pro $10, Elite $20)
- 6 coins (BTC, ETH, XMR, LTC, DOGE, RVN)
- Daily payout cron job
- Bot expiry tracking

**Routes**:
- `GET /mining/packages`
- `POST /mining/bot/purchase`
- `GET /mining/bots`

#### Referral Module
- Unique referral links (?ref=CODE)
- Conversion tracking
- $2 credit per qualified referral
- Referral earnings dashboard

**Routes**:
- `GET /referral/stats`
- `POST /referral/track`
- `POST /referral/credit`

#### Admin Module
- User management (list, balance edit, ban)
- Transaction approval/rejection
- Game configuration (house edge)
- Analytics & monitoring

**Routes**:
- `GET /admin/overview`
- `GET /admin/users`
- `GET /admin/users/:userId`
- `PUT /admin/users/:userId/balance`
- `POST /admin/users/:userId/ban`
- `GET /admin/transactions`
- `POST /admin/transactions/:txId/approve`
- `POST /admin/transactions/:txId/reject`
- `PUT /admin/games/:gameType`

### Security

- **Helmet**: HTTP security headers
- **Rate Limiting**: Built-in via Guard
- **CORS**: Configurable origins
- **JWT Validation**: Protected routes
- **Argon2**: Password hashing
- **Zod**: Input validation
- **SQL Injection Prevention**: Prisma ORM

### Database Schema

**Core Tables**:
- `User` - User accounts, balance, KYC status
- `Transaction` - Deposits, withdrawals, game payouts
- `Bet` - Casino game history with provably fair data
- `MiningBot` - Active mining subscriptions
- `Bonus` - Welcome bonuses, free spins
- `Referral` - Affiliate tracking
- `GameConfig` - Game settings & house edge
- `AuditLog` - Action logging

See [prisma/schema.prisma](./prisma/schema.prisma) for full schema.

## 🔄 Key Services

### AuthService
- User registration with unique referral codes
- Password hashing & verification
- JWT token generation & refresh
- OTP support (extensible)

### FundingService
- CoinGecko price integration
- Deposit address generation
- Balance crediting on confirmation
- Withdrawal validation & processing

### CasinoService
- Provably fair game logic (SHA-256 hash)
- Bet placement & outcome calculation
- House edge enforcement
- Transaction logging

### MiningService
- Bot purchase & subscription management
- Daily payout scheduling (cron)
- Earnings calculation
- Bot expiry handling

### ReferralService
- Referral link tracking
- Conversion status management
- Bonus crediting
- Earnings calculation

### AdminService
- User balance manipulation
- Transaction approval workflows
- Game configuration updates
- Audit logging

## 📡 Real-Time (WebSocket)

Socket.io gateway broadcasts:
- `notification` - User alerts
- `bet:won` - Game win events
- `mining:payout` - Mining earnings
- `price:update` - Crypto price changes

## 🧪 Testing

```bash
npm run test            # Run tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
```

## 🛠️ Building & Running

### Development
```bash
npm run dev             # Watch mode with hot reload
```

### Production
```bash
npm run build           # Compile TypeScript
npm start               # Run compiled app
```

### Cron Jobs (Examples)
```typescript
// Daily mining payout
@Cron('0 0 * * *')
async miningPayoutCron() {
  await this.miningService.processDailyPayouts();
}

// Check bot expiry
@Cron('0 */6 * * *')
async botExpiryCron() {
  await this.miningService.checkBotExpiry();
}
```

## 🚀 Deployment

### Railway
```bash
railway link
railway up
```

### Fly.io
```bash
flyctl apps create crestara-api
flyctl deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Database Deployment

### PostgreSQL
- **Local**: Docker container
- **Production**: RDS, Railway, or Render
- **Connection Pool**: pgBouncer for scaling

### Redis
- **Local**: Docker container
- **Production**: Upstash, Redis Cloud, or Managed
- **Use**: Session storage, caching, Bullish queues

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | `postgresql://...` |
| `REDIS_URL` | Redis connection | `redis://...` |
| `JWT_SECRET` | Token signing key | `your-secret` |
| `JWT_EXPIRY` | Token lifetime | `7d` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3001` |
| `CORS_ORIGIN` | CORS whitelist | `https://crestara.io` |

## 📦 Dependencies

- **@nestjs/core**: Framework
- **@nestjs/jwt**: JWT auth
- **prisma**: ORM
- **@prisma/client**: Database client
- **argon2**: Password hashing
- **socket.io**: Real-time updates
- **axios**: HTTP client
- **zod**: Schema validation
- **helmet**: Security headers
- **pino**: Logging

## 📖 More Info

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Socket.io Docs](https://socket.io/docs/)
- [JWT Guide](https://jwt.io/)

# 🚀 Crestara: Premium Crypto Casino + Cloud Mining Platform

**Crestara** is a production-grade hybrid crypto casino and AI-powered cloud mining platform with a sophisticated futuristic aesthetic. Built with modern fintech/iGaming best practices.

## 📋 Project Structure

```
crestara/
├── frontend/              # Next.js 14+ web app
│   ├── app/              # App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Types, utilities, API clients
│   └── public/           # Static assets
├── backend/               # NestJS API server
│   ├── src/              # Source code (controllers, services, entities)
│   ├── prisma/           # ORM schema & migrations
│   └── test/             # Tests
├── shared/                # Shared types & utilities
└── package.json           # Root workspace config
```

## 🛠 Tech Stack

### Frontend
- **Next.js 14+** (App Router, SSR, API Routes)
- **TypeScript** for type safety
- **Tailwind CSS** with custom dark/neon theme
- **Framer Motion** for animations
- **TanStack Query (React Query)** for data fetching
- **Zustand** for state management
- **Socket.io Client** for real-time updates

### Backend
- **NestJS** with modular architecture
- **Prisma ORM** for database abstraction
- **PostgreSQL** as primary datastore
- **Redis** for caching, sessions, and queues
- **Socket.io** for real-time notifications
- **Helmet** & **Rate Limiting** for security

### Infrastructure
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Railway / Fly.io / Docker
- **Database**: PostgreSQL (managed or Docker)
- **Cache**: Redis (managed or Docker)

## 📦 Installation & Setup

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0
- PostgreSQL 14+ (local or managed)
- Redis (optional for dev, required for prod)

### Steps

1. **Clone & Install**
   ```bash
   cd crestara
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your DB, Redis, API keys
   ```

3. **Database Setup (Backend)**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run Development**
   ```bash
   # Run both frontend & backend in parallel
   npm run dev

   # Or separately
   npm run dev:frontend  # http://localhost:3000
   npm run dev:backend   # http://localhost:3001
   ```

## 🎮 Core Features

### User Authentication
- Email/password sign-up with OTP verification
- JWT + refresh tokens (Argon2 hashing)
- Role-based access (USER, ADMIN)
- KYC tracking

### 💰 Funding & Transactions
- 130+ cryptocurrency support (BTC, ETH, SOL, USDT, etc.)
- CoinGecko live pricing & logos
- Unique deposit addresses per coin/network
- Transaction tracking with webhooks
- Real-time balance updates

### 🎰 Casino Games
- **Provably Fair Originals**: Crash, Plinko, Dice, Mines, Coinflip, Keno
- **Slots/Live/Table**: Integration points for Pragmatic Play, BGaming, Evolution
- House edge logic, bet tracking, payout calculations

### ⛏️ AI Cloud Mining Bots
- Multiple packages: Basic ($5), Pro ($10), etc.
- Coin-specific mining (BTC SHA-256, XMR RandomX, LTC Scrypt, etc.)
- Daily earnings with cron-based payouts
- User dashboard with bot activation/tracking

### 🎁 Bonuses & Referrals
- 300% welcome bonus (40x wagering) on first deposit
- 2 free spins on sign-up
- Affiliate program with $2 credit per referred deposit
- Referral link tracking (?ref=CODE)

### 👨‍💼 Admin Dashboard
- User management (list, search, balance edit, ban)
- Transaction monitoring & approval workflow
- Bonus/referral configurations
- Game settings & house edge tweaks
- Analytics with Recharts & CSV exports
- Real-time monitoring via Socket.io

## 🔐 Security Features

- **Rate Limiting**: Prevent brute force & abuse
- **CSRF Protection**: Token-based
- **Helmet**: HTTP security headers
- **JWT Validation**: Token verification on all protected routes
- **Argon2 Hashing**: Industry-standard password hashing
- **Zod Validation**: Input validation on DTO level
- **Logging**: Pino for structured logging
- **HTTPS**: Enforced in production

## 🎨 Branding

**Crestara** logo is prominently integrated throughout the UI:
- Large stylized **C** with vertical blade/pillar structures
- Encircled by high-tech circuit ring
- Orbiting crypto coin elements (dynamic animation)
- Neon blue/gold glow accents
- Dark cosmic theme (#0A0E12 to #001F3F)
- Metallic silver/chrome accents (#D9D5C8)

**Logo appear in**:
- Header (with pulse glow animation)
- Footer
- Login/signup pages
- Dashboard hero section
- Loading screens
- Favicon

## 📡 API Integration Points

- **CoinGecko**: Live crypto prices, market caps, logos
- **Tatum.io**: Blockchain deposit address generation, webhook listeners
- **Pragmatic Play / BGaming / Evolution**: Casino game iframes/SDKs
- **Socket.io**: Real-time wins feed, mining notifications, admin broadcasts

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### Backend (Railway / Fly.io)
```bash
# Railway
railway up

# Fly.io
flyctl deploy
```

### Environment Secrets
Set all variables from `.env.example` in your deployment platform's secret management.

## 💾 Database Schema

Key entities:
- **User**: Authentication, balance, referrals, KYC
- **Transaction**: Deposits, withdrawals, game payouts
- **Bet**: Casino bet history, outcomes, multipliers
- **MiningBot**: Package, coin, activation dates, earnings
- **Bonus**: Welcome, free spins, referral attribution
- **Referral**: Affiliate tracking, conversion status

See [backend/prisma/schema.prisma](backend/prisma/schema.prisma) for full schema.

## 📝 Testing

```bash
# Run all tests
npm run test

# With coverage
npm run test:coverage
```

## 📚 Documentation

- [Frontend Setup](frontend/README.md)
- [Backend Setup](backend/README.md)
- [API Documentation](backend/API.md) 
- [Database Schema](backend/prisma/README.md)

## 🤝 Support & Development

For issues, feature requests, or contributions:
- Check GitHub Issues
- Review CONTRIBUTING.md
- Contact: dev@crestara.io

## 📄 License

Proprietary. Crestara Platform © 2026.

---

**Built with ❤️ for the future of fintech.**

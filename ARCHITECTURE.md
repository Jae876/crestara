# Architecture & Implementation Guide

## 🏗️ System Architecture

Crestara is built as a **monorepo** with three main packages:

### 1. Shared Package (`/shared`)
Contains all type definitions and validation schemas used across frontend and backend.

**Key Files**:
- `types.ts` - All TypeScript interfaces (UserDTO, BetDTO, MiningBotDTO, etc.)
- `validation.ts` - Zod schemas for input validation

**Usage**:
```typescript
import { UserDTO, GameType, BetDTO } from '@crestara/shared';
```

---

### 2. Backend Package (`/backend`)
NestJS REST API with modular architecture.

**Module Structure**:
```
auth/        → JWT authentication, signup/login
funding/     → Deposits, withdrawals, coin support
casino/      → Games, betting, provably fair
mining/      → Mining bots, daily payouts
referral/    → Affiliate program
admin/       → Admin dashboard & controls
common/      → Shared services (Prisma, Guards, Decorators)
```

**Request Flow**:
```
HTTP Request
    ↓
Controller (route handler)
    ↓
DTO Validation (Zod)
    ↓
Service (business logic)
    ↓
Prisma (database)
    ↓
Response
```

---

### 3. Frontend Package (`/frontend`)
Next.js 14+ React app with dark futuristic theme.

**Page Structure**:
```
/              → Landing page with logo & hero
/auth/login    → Login form
/auth/signup   → Registration with welcome bonus
/dashboard     → User dashboard & balance
/casino        → Games list & play interface
/mining        → Mining packages & bot management
/admin         → Admin panel (role-gated)
```

**Data Flow**:
```
Component
    ↓
useApi Hook (React Query)
    ↓
API Client (Axios)
    ↓
Backend (NestJS)
    ↓
Store (Zustand) ← Display data
```

---

## 🔐 Authentication Flow

### Sign Up
```
1. User fills form: email, password, confirmPassword
2. Frontend validates with Zod
3. POST /auth/signup → Backend
4. Backend:
   - Validates input
   - Hash password with Argon2
   - Create User + generate referralCode
   - Grant welcome bonus (2 free spins)
   - Return AuthResponse with JWT tokens
5. Frontend stores tokens in localStorage
6. Redirect to /dashboard
```

### Login
```
1. User submits: email, password
2. POST /auth/login → Backend
3. Backend:
   - Find user by email
   - Verify password with Argon2
   - Generate JWT tokens
   - Return AuthResponse
4. Frontend stores tokens
5. Set user in Zustand store
6. All future requests include JWT in header
```

### Token Refresh
```
1. Access token expires (7 days)
2. API returns 401 Unauthorized
3. Axios interceptor catches 401
4. Send refresh token to POST /auth/refresh
5. Get new access token
6. Retry original request
7. If refresh fails → logout and redirect to /login
```

---

## 💰 Funding Flow

### Deposit
```
1. User clicks "Add Funds"
2. Select coin (BTC, ETH, USDT, etc.) + amount
3. Frontend: POST /funding/deposit/initiate
4. Backend:
   - Get coin price from CoinGecko API
   - Generate unique deposit address
   - Create pending Transaction record
   - Return depositAddress + QRCode
5. User sends crypto to address
6. Blockchain listener detects transaction
7. Backend: POST /funding/deposit/confirm with txHash
8. Backend:
   - Update Transaction status → CONFIRMED
   - Credit user.balanceUSD with amountUSD
   - Broadcast via WebSocket
9. Frontend shows balance update
```

### Withdrawal
```
1. User fills: coin, amount, destinationAddress
2. Frontend: POST /funding/withdraw/initiate
3. Backend:
   - Validate user balance ≥ amount
   - Deduct from balanceUSD (move to pending)
   - Create Transaction with WITHDRAWAL type
   - Admin reviews
4. Admin approves (or manually processes)
5. Crypto sent to destinationAddress
6. Backend confirms with txHash
7. Transaction marked CONFIRMED
```

---

## 🎰 Casino Flow

### Place Bet
```
1. User selects game + bet amount
2. Frontend: POST /casino/bet/place
3. Backend:
   - Validate bet amount vs minBet/maxBet
   - Check user balance (deduct bonus first, then balance)
   - Lock balance in transaction
   - Generate clientSeed
4. Backend generates serverSeed
5. Hash = sha256(clientSeed + serverSeed)
6. Use hash to determine outcome
7. Calculate payout (if win):
   - Use multiplier based on game type
   - payout = betAmount * multiplier
8. Create Bet record with outcome
9. Credit user balance with payout
10. Return result with balanceAfter
11. Frontend broadcasts via WebSocket (bet:won event)
12. Show confetti animation if win
```

### Verify Provably Fair
```
1. User clicks "Verify" on bet history
2. Frontend: GET /casino/verify/{betId}
3. Backend:
   - Retrieve bet
   - Recalculate hash from clientSeed + serverSeed
   - Return original hash + recalculated hash
   - If match → bet is verified fair
4. Frontend displays verification badge
```

---

## ⛏️ Mining Bot Flow

### Purchase Bot
```
1. User selects package (BASIC $5, PRO $10, ELITE $20)
2. Select mining coin (BTC, ETH, XMR, etc.)
3. Frontend: POST /mining/bot/purchase
4. Backend:
   - Validate user balance ≥ cost
   - Deduct balance
   - Calculate endDate (90/120/180 days from now)
   - Create MiningBot record with status=ACTIVE
   - dailyRate set per package
5. Frontend shows active bot
```

### Daily Payout (Cron Job)
```
Every day at 00:00 UTC:
1. Find all ACTIVE bots where endDate > now
2. For each bot:
   - Credit user: balanceUSD += dailyRate
   - Update bot: totalMined += dailyRate
   - Create MINING_PAYOUT transaction
   - Notify user via WebSocket
3. Check for expired bots:
   - Find bots where endDate ≤ now
   - Update status to COMPLETED
```

---

## 🔗 Referral Program Flow

### Generate Referral Link
```
1. Every user has unique referralCode (CUID)
2. Share link: crestara.io/?ref={referralCode}
3. Referred user clicks link
```

### Track Referral
```
1. New user signs up with ?ref=CODE in URL
2. Frontend: POST /referral/track with code
3. Backend:
   - Find referrer by referralCode
   - Create Referral record (status=PENDING)
   - Store referredUserId on new user
```

### Convert & Credit
```
1. Referred user deposits ≥ $10
2. POST /referral/convert (referredUserId)
3. Backend:
   - Update Referral status → CONVERTED
4. Referred user places bet or activates bot
5. POST /referral/credit
6. Backend:
   - Update status → CREDITED
   - Credit referrer balance: +$2 USDT
   - Create REFERRAL_BONUS transaction
```

---

## 🛡️ Admin Controls

### User Management
```
Admin can:
- View all users with email, balance, KYC status
- Edit user balance (for disputes)
- Ban user (prevent login)
- View user history: transactions, bets, bots, referrals
```

### Transaction Review
```
Admin can:
- List pending transactions
- Approve (status → CONFIRMED, credit balance)
- Reject (status → FAILED, refund balance)
```

### Game Configuration
```
Admin can:
- Enable/disable games
- Adjust house edge (0-100%)
- Set min/max bet limits
- Changes apply immediately to all users
```

---

## 🔄 Real-Time Updates (WebSocket)

### Socket Events

**On Connect**:
```typescript
socket.on('connect', () => {
  // Join user room
  socket.emit('join', userId);
});
```

**Broadcast Events**:
```typescript
// When user wins
server.emit('bet:won', {
  betId,
  userId,
  gameType,
  payout,
  timestamp
});

// When mining payout processed
server.emit('mining:payout', {
  botId,
  userId,
  coin,
  amount,
  timestamp
});

// Price updates
server.emit('price:update', {
  coin,
  priceUSD,
  change24h
});
```

**Frontend Listener**:
```typescript
useEffect(() => {
  socket.on('bet:won', (data) => {
    // Update balance
    // Show confetti animation
    // Toast notification
  });
}, []);
```

---

## 🗄️ Database Schema Structure

### Core Tables Relationship

```
User
├── Transactions (1→N)
├── Bets (1→N)
├── MiningBots (1→N)
├── Bonuses (1→N)
├── ReferralLinks (1→N) as referrer
├── ReferralLinks (1→N) as referred
└── referredBy → User (self-reference)

Transaction
└── user_id → User

Bet
└── user_id → User

MiningBot
└── user_id → User

Bonus
└── user_id → User

Referral
├── referrer_id → User
└── referred_user_id → User
```

---

## 🚀 Deployment Strategy

### Development
- `npm run dev` - Both frontend & backend
- Docker Compose for PostgreSQL + Redis
- Hot reload enabled

### Staging
- Deploy frontend to Vercel staging
- Deploy backend to Railway/Fly.io staging
- Use staging database credentials
- Real-time testing with live services

### Production
- Deploy frontend to Vercel (crestara.io)
- Deploy backend to Railway/Fly.io (api.crestara.io)
- PostgreSQL managed (RDS/Railway)
- Redis managed (Upstash/Redis Cloud)
- SSL/TLS auto-enabled
- CDN for static assets
- Rate limiting on all endpoints

---

## 🎨 Front-End Architecture

### Component Hierarchy

```
RootLayout
├── Providers (QueryClient, Zustand)
├── Header
│   ├── Logo
│   ├── Nav
│   └── Mobile Menu
├── Page Content
│   ├── Auth Pages
│   ├── Dashboard
│   ├── Casino
│   ├── Mining
│   └── Admin
└── Footer
    └── Logo
```

### State Management

**Zustand Stores**:
- `authStore` - User, tokens, auth state
- `balanceStore` - Real-time balance updates

**React Query**:
- `coins` - Supported cryptocurrency list
- `games` - Available casino games
- `mining-packages` - Mining package options
- `user-bots` - Active mining bots
- `user-bets` - Betting history
- `transactions` - Transaction history
- `referral-stats` - Affiliate earnings

**WebSocket**:
- Real-time notifications
- Bet outcomes
- Mining payouts
- Price updates

---

## 🔐 Security Layers

### Authentication
- ✅ JWT tokens (HS256)
- ✅ Refresh token rotation
- ✅ Argon2 password hashing
- ✅ Email verification option

### Authorization
- ✅ Role-based access control
- ✅ JWT guard on protected routes
- ✅ Admin-only endpoints

### API Security
- ✅ Rate limiting (TODO: implement)
- ✅ CORS configured
- ✅ Helmet headers
- ✅ HTTPS enforced

### Data Validation
- ✅ Zod schemas on inputs
- ✅ Type-safe responses
- ✅ SQL injection prevention (Prisma ORM)

---

## 📊 Monitoring & Analytics

### Metrics to Track
- User signup rate
- Deposit volume
- Casino win/loss ratio
- Mining bot profitability
- Referral conversion rate
- API response times
- Error rates

### Tools
- Sentry (error tracking)
- Vercel Analytics (frontend)
- Built-in logging (Pino)
- Database query logs

---

## 🚦 Next Steps for Development

1. **Authentication Testing**
   - Test signup/login flows
   - Verify token refresh
   - Test password reset (TODO)

2. **Funding Integration**
   - Integrate CoinGecko API
   - Connect Tatum.io for deposits
   - Implement deposit listener webhook

3. **Casino Development**
   - Implement game logic (Crash, Plinko, etc.)
   - Test provably fair verification
   - Integrate Pragmatic Play SDK

4. **Mining Implementation**
   - Setup cron job for daily payouts
   - Implement bot expiry checking
   - Add earnings calculation

5. **Admin Dashboard**
   - User management interface
   - Transaction approval UI
   - Game configuration panel

6. **Testing & QA**
   - Unit tests for services
   - Integration tests for flows
   - Load testing
   - Security audit

---

## 📝 Example: Complete User Journey

```
1. User lands on crestara.io
   ↓
2. Clicks "Sign Up"
   ↓
3. Enters email, password
   ↓
4. Account created + 2 free spins bonus
   ↓
5. Sees dashboard with $0 balance
   ↓
6. Clicks "Add Funds" → selects USDT
   ↓
7. Receives deposit address + QR code
   ↓
8. Sends $20 USDT from wallet
   ↓
9. Backend confirms deposit + credits balance
   ↓
10. Balance shows $20 + $60 bonus (300% match on first deposit)
    ↓
11. Clicks "Play Casino" → plays Crash game
    ↓
12. Wins 2x multiplier → balance updates to $100
    ↓
13. Clicks "Mining" → purchases PRO bot ($10)
    ↓
14. Bot starts earning $1/day
    ↓
15. Shares referral link with friend
    ↓
16. Friend signs up + deposits → referrer gets $2 credit
    ↓
17. After 120 days → mining bot completes
    ↓
18. Total earned: $120 (mining) + $X (casino)
    ↓
19. Withdraws balance
    ↓
20. Crypto sent to wallet ✅
```

This is the complete Crestara ecosystem in action!

---

**Ready to build?** Start with: `bash setup.sh && npm run dev`

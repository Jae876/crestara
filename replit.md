# Crestara Platform

Premium crypto casino and AI-powered cloud mining platform built with Next.js 14, TypeScript, Prisma, and TailwindCSS.

## Architecture

- **Framework**: Next.js 14.2.29 (App Router), TypeScript
- **Styling**: TailwindCSS + custom CSS design system (globals.css)
- **Database**: PostgreSQL via Prisma ORM
- **State**: Zustand (auth), TanStack Query (server data)
- **Animations**: Framer Motion
- **Auth**: JWT (access + refresh tokens), bcrypt
- **GitHub Remote**: https://github.com/Jae876/crestara (requires PAT to push)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  — Home / landing page
│   ├── layout.tsx                — Root layout (Header + Footer)
│   ├── globals.css               — Full design system (cards, buttons, inputs, animations)
│   ├── providers.tsx             — QueryClient + auth hydration
│   ├── auth/
│   │   ├── login/page.tsx        — Login (split-panel)
│   │   └── signup/page.tsx       — Sign-up (split-panel)
│   ├── dashboard/page.tsx        — User dashboard
│   ├── casino/page.tsx           — Casino (tabbed game grid, live ticker, sidebar)
│   ├── mining/page.tsx           — Cloud mining (coin selector, package cards, active bots)
│   ├── referrals/page.tsx        — Referral program (link, stats, table)
│   └── api/
│       ├── auth/                 — /api/auth/login, /api/auth/signup, /api/auth/refresh
│       ├── mining/route.ts       — /api/mining (GET packages+bots, POST purchase)
│       ├── casino/               — /api/casino/games, /api/casino/bet
│       ├── funding/              — /api/funding/deposit, /api/funding/transactions
│       └── referral/             — /api/referral/stats, /api/referral/list
├── components/
│   ├── CrestanaLogo.tsx          — Full SVG logo (metallic C, blade pillars, circuit ring, orbiting coins)
│   ├── Header.tsx                — Sticky header with scroll effect, mobile hamburger
│   └── Footer.tsx                — 5-column footer with disclaimer
├── hooks/useApi.ts               — All TanStack Query hooks (login, signup, mining, casino, referrals)
├── store/authStore.ts            — Zustand auth store (setAuth, logout, setError)
└── lib/
    ├── db.ts                     — Prisma client singleton
    ├── auth-middleware.ts        — JWT extract + verify middleware
    └── api-client.ts             — Axios instance with token interceptors
```

## Design System

**Palette**: #060d17 (bg), #0d2040 (cards), #00c4b4 (teal), #1e90ff (blue), #c9a96e (gold), #d9d5c8 (silver)
**Fonts**: Orbitron (headings), Inter (body), JetBrains Mono (code)
**CSS Classes**: .card, .card-gold, .btn-primary, .btn-outline, .btn-gold, .input-field, .badge-*, .data-table, .neon-text, .gold-text, .silver-text, .glow-orb, .progress-bar, .progress-fill, .progress-fill-gold

## Mining Packages

| Package | Price  | Daily Earnings | Duration | Est. Total |
|---------|--------|----------------|----------|------------|
| BASIC   | $5.00  | $0.50/day      | 90 days  | $45        |
| PRO     | $10.00 | $1.00/day      | 120 days | $120       |

## Key Features

- Provably fair casino (Crash, Plinko, Dice, Mines, Keno, Coinflip, Slots)
- Virtual Sports betting (Football, Basketball, Horse Racing, Dog Racing, Tennis, Motor Racing)
  - Events auto-generated every 2-5 minutes per sport
  - Seeded RNG for fair outcomes, countdown timers, market odds
  - Bet slip, balance deduction, auto-payout on win
  - Admin panel at /admin/virtual to enable/disable sports, set limits, view all bets
- AI cloud mining bots with daily balance credits
- Referral program: $2 per qualifying referral
- 300% first-deposit bonus + 2 free spins
- 130+ crypto deposit support
- JWT-secured authentication with refresh tokens

## Environment Variables

| Variable              | Required | Notes                       |
|-----------------------|----------|-----------------------------|
| DATABASE_URL          | Yes      | PostgreSQL connection string |
| JWT_SECRET            | Yes      | Access token signing key     |
| JWT_REFRESH_SECRET    | Yes      | Refresh token signing key    |
| NEXT_PUBLIC_APP_URL   | No       | Public URL (for referral links) |

## Development

```bash
npm run dev    # Start on port 5000
```

## Port Configuration

App runs on **port 5000** (configured in .replit and package.json dev script).

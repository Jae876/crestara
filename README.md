# 🎨 Crestara Frontend

**Next.js 14+ React web application** for the Crestara crypto casino and mining platform.

## 📁 Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js App Router pages
│   │   ├── auth/       # Authentication pages
│   │   ├── casino/     # Casino game pages
│   │   ├── mining/     # Mining bot pages
│   │   ├── dashboard/  # User dashboard
│   │   ├── admin/      # Admin panel
│   │   └── layout.tsx  # Root layout with Crestara logo
│   ├── components/     # Reusable React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── CrestanaLogo.tsx  # SVG logo component
│   ├── hooks/          # Custom React hooks
│   │   ├── useApi.ts   # React Query hooks for API
│   │   └── useSocket.ts # WebSocket integration
│   ├── lib/            # Utilities & config
│   │   └── api-client.ts  # Axios instance with auth
│   ├── store/          # Zustand state management
│   │   ├── authStore.ts
│   │   └── balanceStore.ts
│   └── styles/         # Global styles
└── package.json
```

## 🚀 Getting Started

### Install Dependencies
```bash
cd frontend
npm install
```

### Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_BRAND=Crestara
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Colors
- **Background**: Dark cosmic theme (#0A0E12, #001F3F)
- **Primary Accent**: Neon Teal (#00C4B4) & Cyan (#1E90FF)
- **Secondary Accent**: Metallic Gold (#C9A96E) & Silver (#D9D5C8)
- **Borders**: #1A2940

### Typography
- **Headings**: Orbitron (futuristic)
- **Body**: System sans-serif

### Animations
- Framer Motion for smooth transitions
- Glow effects on interactive elements
- Pulsing animations on logo

## 📦 Key Dependencies

- **Next.js 14**: Framework
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling with custom theme
- **Framer Motion**: Animations
- **TanStack Query**: Data fetching & caching
- **Zustand**: State management
- **Socket.io Client**: Real-time updates
- **React Hook Form**: Form handling
- **Zod**: Schema validation

## 🔗 API Integration

All API calls use the `useApi` hooks from `src/hooks/useApi.ts`:

```typescript
import { useLogin, useCoins, usePlaceBet } from '@/hooks/useApi';

// In component
const { mutate: login } = useLogin();
const { data: coins } = useCoins();
```

## 🔐 Authentication

- **JWT Tokens**: Access + Refresh tokens stored in localStorage
- **Auto Refresh**: Axios interceptor handles token refresh
- **Protected Routes**: Check `useAuthStore` for user state

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero |
| `/auth/login` | Login form |
| `/auth/signup` | Registration with welcome bonus |
| `/dashboard` | User dashboard & balance |
| `/casino` | Game selection & play |
| `/mining` | Mining packages & bot management |
| `/referrals` | Referral program & stats |
| `/admin` | Admin dashboard (role-gated) |

## 🎮 Components

### CrestanaLogo
SVG logo with rotating animation, circuit patterns, and crypto coin elements.

```typescript
<CrestanaLogo size="large" animated={true} />
```

### Header
Navigation with auth state, mobile menu, logo integration.

### Dashboard
Balance cards, quick links, feature previews.

## 🔌 WebSocket Integration

Real-time updates via Socket.io:

```typescript
import { useSocket } from '@/hooks/useSocket';

useSocket();  // Connects to backend socket
// Listens to: notification, bet:won, mining:payout, price:update
```

## 🛠️ Building

```bash
npm run build    # Production build
npm run lint     # ESLint check
npm run format   # Prettier formatting
npm start        # Start production server
```

## 📚 API Hooks

### Authentication
- `useLogin()` - Sign in
- `useSignUp()` - Register

### Funding
- `useCoins()` - Get supported coins
- `useInitiateDeposit()` - Start deposit
- `useTransactions()` - Get user transactions

### Mining
- `useMiningPackages()` - Get available packages
- `usePurchaseBot()` - Buy mining bot
- `useUserBots()` - Get active bots

### Casino
- `useGames()` - Get game list
- `usePlaceBet()` - Place a bet
- `useUserBets()` - Get bet history

### Referrals
- `useReferralStats()` - Get referral earnings

## 🌐 Deployment

### Vercel (Recommended)
```bash
cd frontend
vercel deploy
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_BASE_URL`: Production API URL

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📖 More Info

- [Next.js Docs](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [TanStack Query](https://tanstack.com/query/)

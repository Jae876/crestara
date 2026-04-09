'use client';

import { useState } from 'react';
import { useMiningPackages, useUserBots, usePurchaseBot } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import Link from 'next/link';

const COIN_CONFIGS = [
  { symbol: 'BTC', name: 'Bitcoin',   algo: 'SHA-256 ASIC',  icon: '₿', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum',  algo: 'Ethash GPU',    icon: 'Ξ', color: '#627EEA' },
  { symbol: 'XMR', name: 'Monero',    algo: 'RandomX CPU',   icon: 'ɱ', color: '#FF6600' },
  { symbol: 'LTC', name: 'Litecoin',  algo: 'Scrypt ASIC',   icon: 'Ł', color: '#B0B0B0' },
  { symbol: 'DOGE', name: 'Dogecoin', algo: 'Scrypt ASIC',   icon: 'Ð', color: '#C2A633' },
  { symbol: 'RVN', name: 'Ravencoin', algo: 'KAWPOW GPU',    icon: 'R', color: '#384182' },
];

const PACKAGES = [
  {
    id: 'STARTER',
    label: 'Starter',
    price: 10,
    daily: 0.50,
    days: 90,
    total: 45,
    hashrate: '5 TH/s',
    coins: ['BTC', 'LTC', 'DOGE'],
    features: ['BTC, LTC & DOGE mining', 'Daily auto-credit', 'Email reports', 'Community support'],
    color: '#00c4b4',
    gradient: 'linear-gradient(135deg, #00c4b4, #1e90ff)',
    popular: false,
    badge: null,
  },
  {
    id: 'BASIC',
    label: 'Basic',
    price: 50,
    daily: 2.50,
    days: 90,
    total: 225,
    hashrate: '25 TH/s',
    coins: ['BTC', 'LTC', 'DOGE', 'ETH'],
    features: ['4 coins supported', 'Daily auto-credit', 'Priority payouts', 'Email & chat support', 'Weekly earnings report'],
    color: '#1e90ff',
    gradient: 'linear-gradient(135deg, #1e90ff, #00c4b4)',
    popular: false,
    badge: null,
  },
  {
    id: 'STANDARD',
    label: 'Standard',
    price: 100,
    daily: 5.00,
    days: 120,
    total: 600,
    hashrate: '60 TH/s',
    coins: ['BTC', 'LTC', 'DOGE', 'ETH', 'XMR'],
    features: ['5 coins supported', 'Daily auto-credit', 'Instant payouts', 'Dedicated account manager', 'Coin-switching AI', 'Monthly performance report'],
    color: '#c9a96e',
    gradient: 'linear-gradient(135deg, #c9a96e, #ffd700)',
    popular: true,
    badge: 'MOST POPULAR',
  },
  {
    id: 'ADVANCED',
    label: 'Advanced',
    price: 250,
    daily: 12.50,
    days: 150,
    total: 1875,
    hashrate: '150 TH/s',
    coins: ['BTC', 'LTC', 'DOGE', 'ETH', 'XMR', 'RVN'],
    features: ['All 6 coins supported', 'Daily auto-credit', 'Instant payouts', 'VIP account manager', 'AI coin-switching', 'Compounding reinvestment', 'Tax report export'],
    color: '#f56565',
    gradient: 'linear-gradient(135deg, #f56565, #c9a96e)',
    popular: false,
    badge: 'HIGH YIELD',
  },
  {
    id: 'ELITE',
    label: 'Elite',
    price: 500,
    daily: 25.00,
    days: 180,
    total: 4500,
    hashrate: '300 TH/s',
    coins: ['BTC', 'LTC', 'DOGE', 'ETH', 'XMR', 'RVN'],
    features: ['All 6 coins supported', 'Daily auto-credit', 'Instant withdrawals', 'Dedicated VIP manager', 'Full AI suite', 'Compounding + reinvest', 'Tax + compliance export', 'Private Telegram group'],
    color: '#ffd700',
    gradient: 'linear-gradient(135deg, #ffd700, #c9a96e)',
    popular: false,
    badge: 'BEST VALUE',
  },
  {
    id: 'DIAMOND',
    label: 'Diamond',
    price: 1000,
    daily: 55.00,
    days: 365,
    total: 20075,
    hashrate: '1 PH/s',
    coins: ['BTC', 'LTC', 'DOGE', 'ETH', 'XMR', 'RVN'],
    features: [
      'Institutional 1 PH/s hashrate',
      'All 6 coins + auto-switching AI',
      'Daily $55 auto-credit',
      '365-day duration',
      'Private VIP group access',
      'Dedicated senior account manager',
      'API access for integration',
      'Priority withdrawal processing',
      'Monthly compliance report',
      'Exclusive market intelligence feed',
    ],
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)',
    popular: false,
    badge: '💎 DIAMOND',
  },
];

const STATS = [
  { value: '18,400+', label: 'Active Miners', icon: '👥' },
  { value: '$4.2M+',  label: 'Total Paid Out', icon: '💰' },
  { value: '99.97%',  label: 'Uptime SLA',     icon: '⚡' },
  { value: '< 5 min', label: 'Avg Withdrawal',  icon: '🚀' },
];

const TESTIMONIALS = [
  {
    name: 'Marcus H.',
    location: 'United Kingdom',
    pkg: 'Standard — $100',
    text: 'Started with the Standard plan 3 months ago. Daily credits hit like clockwork. Withdrawn $580 so far — no issues, no delays.',
    rating: 5,
  },
  {
    name: 'Priya S.',
    location: 'Singapore',
    pkg: 'Advanced — $250',
    text: 'The AI coin-switching is real — I watched it move from ETH to BTC during a dip and my daily returns actually went up. Impressive.',
    rating: 5,
  },
  {
    name: 'Daniel O.',
    location: 'Canada',
    pkg: 'Elite — $500',
    text: "My VIP manager reached out within an hour of activating. Payouts are instant. Running two Elite bots now — best passive income I've found.",
    rating: 5,
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Choose a Plan', desc: 'Select the mining bot that fits your budget. One-time payment, no recurring fees.' },
  { step: '02', title: 'Bot Activates', desc: 'Your AI mining bot connects to our distributed hash network instantly upon activation.' },
  { step: '03', title: 'Earn Daily', desc: 'Daily earnings are credited automatically to your Crestara wallet. Withdraw anytime.' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function MiningPage() {
  const { user } = useAuthStore();
  const { data: userBotsData } = useUserBots();
  const { mutate: purchaseBot, isPending } = usePurchaseBot();

  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [purchasingPkg, setPurchasingPkg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeBots = userBotsData?.activeBots || userBotsData || [];

  const handlePurchase = (pkgId: string) => {
    if (!user) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setPurchasingPkg(pkgId);
    purchaseBot({ packageType: pkgId, coin: selectedCoin }, {
      onSuccess: () => {
        setPurchasingPkg(null);
        setSuccessMsg(`${pkgId} bot activated! Mining ${selectedCoin} — first payout within 24 hours.`);
      },
      onError: (err: any) => {
        setPurchasingPkg(null);
        setErrorMsg(err?.response?.data?.error || 'Purchase failed. Check your balance.');
      },
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ background: 'linear-gradient(160deg, #060d17 0%, #0a1520 50%, #0d1f3a 100%)' }}>

      {/* ── Hero header ── */}
      <div className="px-4 py-12 relative overflow-hidden" style={{ background: 'rgba(13,32,64,0.45)', borderBottom: '1px solid #1a3050' }}>
        <div className="glow-orb" style={{ width: 600, height: 600, top: '-200px', right: '0%', background: 'rgba(201,169,110,0.04)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full" style={{ background: '#48bb78', boxShadow: '0 0 6px #48bb78' }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: '#48bb78', fontFamily: 'Orbitron, system-ui' }}>Live Network Active</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 gold-text" style={{ fontFamily: 'Orbitron, system-ui' }}>AI Cloud Mining</h1>
            <p className="text-base mb-6 max-w-xl" style={{ color: '#6b7e96' }}>
              Institutional-grade mining infrastructure. AI-powered coin switching. Daily payouts — no hardware required.
            </p>
            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: '🔒', text: '256-bit SSL' },
                { icon: '🌐', text: 'Curaçao Licensed' },
                { icon: '⚡', text: 'Instant Payouts' },
                { icon: '🤖', text: 'AI-Powered' },
              ].map((b) => (
                <span key={b.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(0,196,180,0.08)', border: '1px solid rgba(0,196,180,0.2)', color: '#a0b4c8' }}>
                  {b.icon} {b.text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Platform stats ── */}
      <div style={{ background: 'rgba(13,32,64,0.3)', borderBottom: '1px solid #1a3050' }}>
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label} className="text-center"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-2xl font-black" style={{ fontFamily: 'Orbitron, system-ui', color: '#c9a96e' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#4a5a6a' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* ── Alerts ── */}
        {successMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-5 py-4 rounded-lg text-sm"
            style={{ background: 'rgba(72,187,120,0.12)', border: '1px solid rgba(72,187,120,0.3)', color: '#48bb78' }}>
            ✓ {successMsg}
          </motion.div>
        )}
        {errorMsg && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-5 py-4 rounded-lg text-sm"
            style={{ background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.3)', color: '#f56565' }}>
            {errorMsg}
          </motion.div>
        )}

        {/* ── How it works ── */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div key={step.step} className="card p-7 text-center relative"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="text-4xl font-black mb-4" style={{ fontFamily: 'Orbitron, system-ui', color: 'rgba(0,196,180,0.15)', lineHeight: 1 }}>
                  {step.step}
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', color: '#00c4b4', fontSize: '0.9rem' }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7e96' }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Coin selector ── */}
        <div className="mb-10">
          <h2 className="font-bold mb-4" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.8rem', color: '#6b7e96', letterSpacing: '0.12em' }}>
            SELECT MINING COIN
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {COIN_CONFIGS.map((coin) => (
              <button key={coin.symbol} onClick={() => setSelectedCoin(coin.symbol)}
                className="p-4 rounded-xl text-center transition-all"
                style={{
                  background: selectedCoin === coin.symbol ? `${coin.color}18` : 'rgba(13,32,64,0.6)',
                  border: `1.5px solid ${selectedCoin === coin.symbol ? coin.color : '#1a3050'}`,
                  boxShadow: selectedCoin === coin.symbol ? `0 0 18px ${coin.color}28` : 'none',
                }}>
                <div className="text-2xl mb-1" style={{ color: coin.color }}>{coin.icon}</div>
                <div className="font-bold text-xs" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>{coin.symbol}</div>
                <div className="text-xs mt-0.5" style={{ color: '#4a5a6a', fontSize: '0.6rem' }}>{coin.algo}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Pricing packages ── */}
        <div className="mb-16">
          <h2 className="font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.8rem', color: '#6b7e96', letterSpacing: '0.12em' }}>
            MINING BOT PLANS
          </h2>
          <p className="text-sm mb-8" style={{ color: '#4a5a6a' }}>One-time activation fee. No subscription. No hidden charges.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <motion.div key={pkg.id}
                className={`relative rounded-2xl p-7 ${pkg.popular ? 'card-gold card' : 'card'}`}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                style={{ borderColor: pkg.popular ? 'rgba(201,169,110,0.4)' : `${pkg.color}20` }}>

                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
                    <span className="px-4 py-1 rounded-full text-xs font-black"
                      style={{ background: pkg.gradient, color: '#060d17', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.08em' }}>
                      {pkg.badge}
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-black mb-0.5" style={{ fontFamily: 'Orbitron, system-ui', color: pkg.color }}>{pkg.label}</h3>
                    <p className="text-xs" style={{ color: '#4a5a6a' }}>{pkg.hashrate} · Mining {selectedCoin}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>${pkg.price}</div>
                    <div className="text-xs" style={{ color: '#4a5a6a' }}>one-time</div>
                  </div>
                </div>

                <div className="divider mb-5" />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[
                    { label: 'Daily', value: `$${pkg.daily.toFixed(2)}`, color: pkg.color },
                    { label: 'Duration', value: `${pkg.days}d`, color: '#fff' },
                    { label: 'Est. Total', value: `$${pkg.total.toLocaleString()}`, color: '#c9a96e' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center py-2.5 rounded-xl"
                      style={{ background: 'rgba(6,13,23,0.6)' }}>
                      <div className="font-bold text-sm" style={{ fontFamily: 'Orbitron, system-ui', color: stat.color }}>{stat.value}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#4a5a6a', fontSize: '0.6rem' }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: '#d9d5c8' }}>
                      <span style={{ color: pkg.color, fontSize: '0.75rem' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                {user ? (
                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={isPending && purchasingPkg === pkg.id}
                    className={`w-full font-bold text-sm py-3 rounded-xl transition-all ${pkg.popular ? 'btn-gold' : 'btn-primary'}`}
                    style={{ fontFamily: 'Orbitron, system-ui', letterSpacing: '0.06em' }}
                  >
                    {isPending && purchasingPkg === pkg.id ? 'Activating...' : `Activate — $${pkg.price}`}
                  </button>
                ) : (
                  <Link href="/auth/signup">
                    <button className={`w-full font-bold text-sm py-3 rounded-xl transition-all ${pkg.popular ? 'btn-gold' : 'btn-primary'}`}
                      style={{ fontFamily: 'Orbitron, system-ui', letterSpacing: '0.06em' }}>
                      Get Started Free
                    </button>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div className="card p-6 mb-16" style={{ borderColor: 'rgba(0,196,180,0.15)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🔐', title: 'Non-Custodial Wallet', sub: 'You own your keys and funds' },
              { icon: '📊', title: 'Live Dashboard', sub: 'Track earnings in real-time' },
              { icon: '💳', title: 'Instant Withdrawals', sub: 'BTC, ETH, USDT supported' },
              { icon: '📞', title: '24/7 Support', sub: 'Live chat + dedicated managers' },
            ].map((item) => (
              <div key={item.title}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-xs font-bold mb-1" style={{ color: '#d9d5c8', fontFamily: 'Orbitron, system-ui', fontSize: '0.72rem' }}>{item.title}</div>
                <div className="text-xs" style={{ color: '#4a5a6a' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>
            What Our Miners Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} className="card p-6"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} style={{ color: '#ffd700', fontSize: '0.8rem' }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#a0b4c8' }}>"{t.text}"</p>
                <div className="border-t pt-4" style={{ borderColor: '#1a3050' }}>
                  <div className="font-bold text-sm" style={{ color: '#fff' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: '#4a5a6a' }}>{t.location} · {t.pkg}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Active bots ── */}
        {activeBots.length > 0 && (
          <div>
            <h2 className="font-bold mb-6" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.8rem', color: '#6b7e96', letterSpacing: '0.12em' }}>
              YOUR ACTIVE BOTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeBots.map((bot: any) => {
                const coin = COIN_CONFIGS.find((c) => c.symbol === bot.coin);
                const elapsed = Math.max(0, (Date.now() - new Date(bot.activatedAt || bot.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                const duration = bot.packageType === 'BASIC' ? 90 : bot.packageType === 'STANDARD' ? 120 : bot.packageType === 'ADVANCED' ? 150 : bot.packageType === 'ELITE' ? 180 : 90;
                const progress = Math.min(100, (elapsed / duration) * 100);
                const remaining = Math.max(0, duration - Math.floor(elapsed));
                return (
                  <motion.div key={bot.id} className="card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ y: -3 }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold"
                          style={{ background: `${coin?.color || '#00c4b4'}18`, color: coin?.color || '#00c4b4', fontSize: '1.1rem' }}>
                          {coin?.icon || bot.coin[0]}
                        </div>
                        <div>
                          <div className="font-bold text-sm" style={{ fontFamily: 'Orbitron, system-ui' }}>{bot.coin}</div>
                          <div className="text-xs" style={{ color: '#4a5a6a' }}>{bot.packageType}</div>
                        </div>
                      </div>
                      <span className="badge badge-success">ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                      <div><div style={{ color: '#4a5a6a' }}>Daily Rate</div>
                        <div className="font-bold" style={{ color: '#00c4b4', fontFamily: 'Orbitron, system-ui' }}>${bot.dailyRate?.toFixed(2)}</div></div>
                      <div><div style={{ color: '#4a5a6a' }}>Total Mined</div>
                        <div className="font-bold" style={{ color: '#c9a96e', fontFamily: 'Orbitron, system-ui' }}>${(bot.totalMined || 0).toFixed(2)}</div></div>
                      <div><div style={{ color: '#4a5a6a' }}>Days Left</div>
                        <div className="font-bold" style={{ color: '#fff', fontFamily: 'Orbitron, system-ui' }}>{remaining}d</div></div>
                      <div><div style={{ color: '#4a5a6a' }}>End Date</div>
                        <div className="font-bold" style={{ color: '#fff', fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem' }}>{new Date(bot.endDate).toLocaleDateString()}</div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1.5" style={{ color: '#4a5a6a' }}>
                        <span>Progress</span><span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill-gold" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        {!user && (
          <motion.div className="card-gold card text-center py-12 px-8 mt-8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="text-3xl mb-3">🚀</div>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Orbitron, system-ui', color: '#c9a96e' }}>
              Start Earning Today
            </h3>
            <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: '#6b7e96' }}>
              Join 18,400+ miners already earning daily. Sign up free, deposit, and activate your bot in under 2 minutes.
            </p>
            <Link href="/auth/signup">
              <button className="btn-gold px-10 py-3">Create Free Account</button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

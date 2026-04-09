'use client';

import { motion } from 'framer-motion';
import { CrestanaLogo } from '@/components/CrestanaLogo';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const STATS = [
  { label: 'Active Users', value: '48,291', suffix: '+' },
  { label: 'Total Volume', value: '$142M', suffix: '+' },
  { label: 'Games Available', value: '80', suffix: '+' },
  { label: 'Avg Daily Payout', value: '$24K', suffix: '+' },
];

const GAMES = [
  { name: 'Crash', icon: '📈', desc: 'Multiplier rocket — cash out before it crashes', edge: '1.5%', tag: 'HOT' },
  { name: 'Plinko', icon: '⚙️', desc: 'Drop the ball, watch multipliers rain', edge: '2%', tag: null },
  { name: 'Dice', icon: '🎲', desc: 'Classic over/under with instant results', edge: '1%', tag: null },
  { name: 'Mines', icon: '💣', desc: 'Navigate the minefield, multiply wins', edge: '2.5%', tag: 'NEW' },
  { name: 'Keno', icon: '🎱', desc: 'Pick your numbers, win big multipliers', edge: '2%', tag: null },
  { name: 'Coinflip', icon: '🪙', desc: 'Heads or tails — 50/50 pure chance', edge: '1%', tag: null },
];

const MINING_PKG = [
  {
    name: 'BASIC',
    price: 5,
    daily: 0.50,
    days: 90,
    total: 45,
    coins: ['BTC', 'LTC', 'DOGE'],
    color: '#00c4b4',
    popular: false,
  },
  {
    name: 'PRO',
    price: 10,
    daily: 1.00,
    days: 120,
    total: 120,
    coins: ['BTC', 'ETH', 'XMR', 'LTC', 'DOGE', 'RVN'],
    color: '#c9a96e',
    popular: true,
  },
];

const LIVE_WINS = [
  { user: 'u***r4', game: 'Crash', amount: 2410, mult: '12.5x' },
  { user: 'k***9', game: 'Plinko', amount: 880, mult: '8.8x' },
  { user: 'm***z1', game: 'Dice', amount: 320, mult: '3.2x' },
  { user: 'x***7', game: 'Mines', amount: 1550, mult: '15.5x' },
  { user: 'j***n2', game: 'Coinflip', amount: 200, mult: '2x' },
  { user: 'p***q8', game: 'Crash', amount: 6100, mult: '61x' },
  { user: 'a***s5', game: 'Keno', amount: 740, mult: '7.4x' },
];

function TickerBar() {
  const items = [...LIVE_WINS, ...LIVE_WINS];
  return (
    <div className="relative overflow-hidden py-2.5" style={{ background: 'rgba(0,196,180,0.06)', borderTop: '1px solid rgba(0,196,180,0.15)', borderBottom: '1px solid rgba(0,196,180,0.15)' }}>
      <div className="flex" style={{ animation: 'ticker 28s linear infinite', width: 'max-content' }}>
        {items.map((w, i) => (
          <div key={i} className="flex items-center gap-2 px-8 whitespace-nowrap text-sm">
            <span className="text-gray-500">🏆</span>
            <span className="font-mono" style={{ color: '#6b7e96', fontSize: '0.8rem' }}>{w.user}</span>
            <span className="text-white text-xs">{w.game}</span>
            <span className="font-bold text-xs" style={{ color: '#00c4b4' }}>+${w.amount.toLocaleString()}</span>
            <span className="text-xs" style={{ color: '#c9a96e' }}>{w.mult}</span>
            <span className="text-gray-700 mx-4">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative" style={{ background: 'linear-gradient(135deg, #060d17 0%, #0a1520 50%, #0d2040 100%)', minHeight: '100vh' }}>
      {/* Ambient glow orbs */}
      <div className="glow-orb" style={{ width: 600, height: 600, top: '-100px', left: '-200px', background: 'rgba(0,196,180,0.04)' }} />
      <div className="glow-orb" style={{ width: 500, height: 500, top: '30%', right: '-150px', background: 'rgba(30,144,255,0.05)' }} />
      <div className="glow-orb" style={{ width: 400, height: 400, bottom: '20%', left: '20%', background: 'rgba(201,169,110,0.03)' }} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial="hidden" animate="show" variants={fadeUp}
        >
          {/* Animated logo */}
          <motion.div
            className="flex justify-center mb-10"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {mounted && <CrestanaLogo size="xlarge" animated />}
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <h1
              className="text-5xl md:text-7xl font-bold mb-4 tracking-wider"
              style={{ fontFamily: 'Orbitron, system-ui, sans-serif' }}
            >
              <span className="neon-text">CRESTARA</span>
            </h1>
            <p className="text-lg md:text-xl mb-3" style={{ color: '#d9d5c8', letterSpacing: '0.12em' }}>
              PREMIUM CRYPTO CASINO &amp; CLOUD MINING PLATFORM
            </p>
            <p className="text-sm mb-10" style={{ color: '#6b7e96', letterSpacing: '0.2em' }}>
              TRADE &nbsp;•&nbsp; MINE &nbsp;•&nbsp; GAMBLE &nbsp;•&nbsp; EARN
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link href="/auth/signup">
              <button className="btn-primary text-base px-10 py-4">
                Get Started Free
              </button>
            </Link>
            <Link href="/casino">
              <button className="btn-outline text-base px-10 py-4">
                Explore Casino
              </button>
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} custom={3} className="text-xs" style={{ color: '#4a5a6a' }}>
            🎁 Sign up bonus: 2 Free Spins + 300% deposit match on first deposit ≥ $10
          </motion.p>
        </motion.div>
      </section>

      {/* ── LIVE WINS TICKER ── */}
      <TickerBar />

      {/* ── STATS ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="card text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="stat-value text-2xl md:text-3xl mb-1" style={{ color: '#00c4b4' }}>
                {s.value}<span style={{ color: '#c9a96e' }}>{s.suffix}</span>
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GAMES ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 neon-text">Premium Casino Games</h2>
            <p style={{ color: '#6b7e96' }}>New members enjoy an 80% boosted win rate — the best time to start is now.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAMES.map((g, i) => (
              <motion.div
                key={g.name}
                className="card p-6 cursor-pointer relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                {g.tag && (
                  <span
                    className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      background: g.tag === 'HOT' ? 'rgba(245,101,101,0.2)' : 'rgba(0,196,180,0.2)',
                      color: g.tag === 'HOT' ? '#f56565' : '#00c4b4',
                      border: `1px solid ${g.tag === 'HOT' ? 'rgba(245,101,101,0.3)' : 'rgba(0,196,180,0.3)'}`,
                      fontFamily: 'Orbitron, system-ui',
                      fontSize: '0.65rem',
                    }}
                  >
                    {g.tag}
                  </span>
                )}
                <div className="text-4xl mb-4">{g.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui' }}>{g.name}</h3>
                <p className="text-sm mb-4" style={{ color: '#6b7e96' }}>{g.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#4a5a6a' }}>House edge: <span style={{ color: '#00c4b4' }}>{g.edge}</span></span>
                  <Link href="/casino">
                    <button className="text-xs font-bold px-3 py-1.5 rounded transition-all group-hover:shadow-glow"
                      style={{ background: 'linear-gradient(135deg, #00c4b4, #1e90ff)', color: '#fff', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.05em' }}>
                      Play
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/casino">
              <button className="btn-outline px-10">View All Games</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MINING ── */}
      <section className="py-16 px-4" style={{ background: 'rgba(13,32,64,0.3)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 gold-text">AI Cloud Mining Bots</h2>
            <p style={{ color: '#6b7e96' }}>Automated mining with daily earnings credited directly to your balance.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {MINING_PKG.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                className={pkg.popular ? 'card-gold card p-8 relative' : 'card p-8 relative'}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="btn-gold px-4 py-1 text-xs rounded-full" style={{ fontFamily: 'Orbitron, system-ui' }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Orbitron, system-ui', color: pkg.color }}>
                  {pkg.name}
                </h3>
                <div className="text-4xl font-bold my-4" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>
                  ${pkg.price}
                  <span className="text-base font-normal ml-1" style={{ color: '#6b7e96' }}>one-time</span>
                </div>
                <ul className="space-y-2.5 mb-6 text-sm" style={{ color: '#d9d5c8' }}>
                  <li className="flex items-center gap-2">
                    <span style={{ color: pkg.color }}>✓</span>
                    <span><b style={{ color: '#fff' }}>${pkg.daily}</b>/day earnings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: pkg.color }}>✓</span>
                    <span><b style={{ color: '#fff' }}>{pkg.days} days</b> contract duration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span style={{ color: pkg.color }}>✓</span>
                    <span>Est. total: <b style={{ color: '#c9a96e' }}>${pkg.total}</b></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: pkg.color }}>✓</span>
                    <span>Supports: {pkg.coins.join(', ')}</span>
                  </li>
                </ul>
                <Link href="/auth/signup">
                  <button className={pkg.popular ? 'btn-gold w-full' : 'btn-primary w-full'}>
                    Start Mining
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFERRAL BANNER ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="card p-10 text-center relative overflow-hidden"
            style={{ borderColor: 'rgba(0,196,180,0.3)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glow-orb" style={{ width: 300, height: 300, top: '-100px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,196,180,0.04)', filter: 'blur(60px)' }} />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🔗</div>
              <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Orbitron, system-ui' }}>
                <span className="neon-text">Earn $2</span> per referral
              </h2>
              <p className="mb-6" style={{ color: '#6b7e96' }}>
                Share your unique link. When a friend deposits ≥ $10 and starts playing or mining — you earn $2 instantly.
              </p>
              <Link href="/auth/signup">
                <button className="btn-primary px-10">Get Your Referral Link</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WELCOME BONUS ── */}
      <section className="py-16 px-4" style={{ background: 'rgba(13,32,64,0.3)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎰', title: '2 Free Spins', desc: 'Receive $1 free spins just for signing up — wins go straight to your bonus balance.' },
              { icon: '🚀', title: '300% Deposit Match', desc: 'First deposit ≥ $10? We triple it. 40x wagering requirement. Up to $3,000 bonus.' },
              { icon: '💎', title: 'VIP Rewards', desc: 'Earn loyalty points on every game and mining purchase. Redeem for cashback and perks.' },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="card p-7"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', color: '#00c4b4' }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7e96' }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text" style={{ fontFamily: 'Orbitron, system-ui' }}>
            Ready to Begin?
          </h2>
          <p className="mb-8 text-lg" style={{ color: '#6b7e96' }}>Join 48,000+ members earning daily on Crestara.</p>
          <Link href="/auth/signup">
            <button className="btn-primary text-lg px-14 py-5">
              Create Free Account
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

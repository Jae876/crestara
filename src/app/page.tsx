'use client';

import { motion } from 'framer-motion';
import { CrestanaLogo } from '@/components/CrestanaLogo';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const PLATFORM_STATS = [
  { label: 'Active Users',    value: '48,291+',  icon: '👥', color: '#00c4b4' },
  { label: 'Total Paid Out',  value: '$4.2M+',   icon: '💰', color: '#c9a96e' },
  { label: 'Games Available', value: '80+',       icon: '🎮', color: '#1e90ff' },
  { label: 'Avg Withdrawal',  value: '< 5 min',  icon: '⚡', color: '#48bb78' },
];

const TRUST_BADGES = [
  { icon: '🔒', text: '256-bit SSL Encrypted' },
  { icon: '🌐', text: 'Curaçao eGaming Licensed' },
  { icon: '⚡', text: 'Instant Crypto Payouts' },
  { icon: '🤖', text: 'AI-Powered Platform' },
  { icon: '🛡️', text: 'Funds Protected' },
];

const GAMES = [
  { name: 'Crash',    icon: '📈', desc: 'Multiplier rocket — cash out before it crashes', tag: 'HOT' },
  { name: 'Plinko',   icon: '⚙️', desc: 'Drop the ball, watch multipliers rain',          tag: null },
  { name: 'Dice',     icon: '🎲', desc: 'Classic over/under with instant results',         tag: null },
  { name: 'Mines',    icon: '💣', desc: 'Navigate the minefield, multiply your stake',     tag: 'NEW' },
  { name: 'Keno',     icon: '🎱', desc: 'Pick your numbers, win big multipliers',          tag: null },
  { name: 'Coinflip', icon: '🪙', desc: 'Heads or tails — pure 50/50 excitement',          tag: null },
];

const MINING_PLANS = [
  { id: 'STARTER',  label: 'Starter',  price: 10,  daily: 0.50,  days: 90,  total: 45,    color: '#00c4b4', popular: false },
  { id: 'BASIC',    label: 'Basic',    price: 50,  daily: 2.50,  days: 90,  total: 225,   color: '#1e90ff', popular: false },
  { id: 'STANDARD', label: 'Standard', price: 100, daily: 5.00,  days: 120, total: 600,   color: '#c9a96e', popular: true  },
  { id: 'ADVANCED', label: 'Advanced', price: 250, daily: 12.50, days: 150, total: 1875,  color: '#f56565', popular: false },
  { id: 'ELITE',    label: 'Elite',    price: 500, daily: 25.00, days: 180, total: 4500,  color: '#ffd700', popular: false },
];

const TESTIMONIALS = [
  {
    name: 'Marcus H.',
    location: 'United Kingdom',
    plan: 'Standard Bot · $100',
    text: 'Started 3 months ago. Daily credits hit like clockwork. Withdrawn $580 so far — zero delays.',
    stars: 5,
  },
  {
    name: 'Priya S.',
    location: 'Singapore',
    plan: 'Casino + Advanced Bot',
    text: 'The AI coin-switching is real. Watched it move from ETH to BTC during a dip and my daily returns actually went up.',
    stars: 5,
  },
  {
    name: 'Daniel O.',
    location: 'Canada',
    plan: 'Elite Bot · $500',
    text: 'VIP manager reached out within an hour of activating. Payouts are instant. Running two Elite bots now.',
    stars: 5,
  },
];

const LIVE_WINS = [
  { user: 'u***r4', game: 'Crash',    amount: 2410, mult: '12.5x' },
  { user: 'k***9',  game: 'Plinko',   amount: 880,  mult: '8.8x'  },
  { user: 'm***z1', game: 'Dice',     amount: 320,  mult: '3.2x'  },
  { user: 'x***7',  game: 'Mines',    amount: 1550, mult: '15.5x' },
  { user: 'j***n2', game: 'Coinflip', amount: 200,  mult: '2x'    },
  { user: 'p***q8', game: 'Crash',    amount: 6100, mult: '61x'   },
  { user: 'a***s5', game: 'Keno',     amount: 740,  mult: '7.4x'  },
];

function TickerBar() {
  const items = [...LIVE_WINS, ...LIVE_WINS];
  return (
    <div className="relative overflow-hidden py-2.5" style={{ background: 'rgba(0,196,180,0.06)', borderTop: '1px solid rgba(0,196,180,0.12)', borderBottom: '1px solid rgba(0,196,180,0.12)' }}>
      <div className="flex" style={{ animation: 'ticker 28s linear infinite', width: 'max-content' }}>
        {items.map((w, i) => (
          <div key={i} className="flex items-center gap-2 px-8 whitespace-nowrap text-sm">
            <span style={{ color: '#4a5a6a' }}>🏆</span>
            <span className="font-mono text-xs" style={{ color: '#6b7e96' }}>{w.user}</span>
            <span className="text-xs text-white">{w.game}</span>
            <span className="font-bold text-xs" style={{ color: '#00c4b4' }}>+${w.amount.toLocaleString()}</span>
            <span className="text-xs" style={{ color: '#c9a96e' }}>{w.mult}</span>
            <span className="mx-4" style={{ color: '#1a3050' }}>|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.1 } }),
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative" style={{ background: 'linear-gradient(160deg, #060d17 0%, #0a1520 55%, #0d2040 100%)', minHeight: '100vh' }}>
      <div className="glow-orb" style={{ width: 700, height: 700, top: '-150px', left: '-250px', background: 'rgba(0,196,180,0.04)' }} />
      <div className="glow-orb" style={{ width: 500, height: 500, top: '30%', right: '-200px', background: 'rgba(30,144,255,0.04)' }} />
      <div className="glow-orb" style={{ width: 400, height: 400, bottom: '25%', left: '15%', background: 'rgba(201,169,110,0.03)' }} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-12">
        <motion.div className="text-center max-w-4xl mx-auto" initial="hidden" animate="show" variants={fadeUp}>

          <motion.div className="flex justify-center mb-10"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
            {mounted && <CrestanaLogo size="xlarge" animated />}
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wider neon-text"
              style={{ fontFamily: 'Orbitron, system-ui' }}>
              CRESTARA
            </h1>
            <p className="text-lg md:text-xl mb-3" style={{ color: '#d9d5c8', letterSpacing: '0.12em' }}>
              PREMIUM CRYPTO CASINO &amp; AI CLOUD MINING
            </p>
            <p className="text-sm mb-8" style={{ color: '#6b7e96', letterSpacing: '0.2em' }}>
              TRADE &nbsp;•&nbsp; MINE &nbsp;•&nbsp; GAMBLE &nbsp;•&nbsp; EARN
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/auth/signup">
              <button className="btn-primary text-base px-10 py-4">Get Started Free</button>
            </Link>
            <Link href="/casino">
              <button className="btn-outline text-base px-10 py-4">Explore Casino</button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-2 mb-6">
            {TRUST_BADGES.map((b) => (
              <span key={b.text}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                style={{ background: 'rgba(0,196,180,0.07)', border: '1px solid rgba(0,196,180,0.18)', color: '#8aabb8' }}>
                {b.icon} {b.text}
              </span>
            ))}
          </motion.div>

          <motion.p variants={fadeUp} custom={4} className="text-xs" style={{ color: '#3a4a5a' }}>
            🎁 300% first deposit match + 2 Free Spins on sign up · $2 per referral
          </motion.p>
        </motion.div>
      </section>

      {/* ── LIVE TICKER ── */}
      <TickerBar />

      {/* ── PLATFORM STATS ── */}
      <section className="py-14 px-4" style={{ background: 'rgba(13,32,64,0.35)', borderBottom: '1px solid #1a3050' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {PLATFORM_STATS.map((s, i) => (
            <motion.div key={s.label} className="card text-center p-6"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl md:text-3xl font-black mb-1" style={{ fontFamily: 'Orbitron, system-ui', color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="card p-8" style={{ borderColor: 'rgba(0,196,180,0.15)' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🔐', title: 'Non-Custodial',      sub: 'You own your keys & funds'   },
                { icon: '📊', title: 'Live Dashboard',     sub: 'Real-time earnings tracking'  },
                { icon: '💳', title: 'Multi-Crypto',       sub: 'BTC, ETH, USDT & more'        },
                { icon: '📞', title: '24/7 Support',       sub: 'Live chat + VIP managers'      },
              ].map((item) => (
                <div key={item.title}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xs font-bold mb-1" style={{ color: '#d9d5c8', fontFamily: 'Orbitron, system-ui', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                    {item.title}
                  </div>
                  <div className="text-xs" style={{ color: '#4a5a6a' }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CASINO GAMES ── */}
      <section className="py-16 px-4" style={{ background: 'rgba(13,32,64,0.25)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 neon-text" style={{ fontFamily: 'Orbitron, system-ui' }}>
              Premium Casino Games
            </h2>
            <p style={{ color: '#6b7e96' }}>Instant results. 300% welcome bonus. Crypto payouts in minutes.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAMES.map((g, i) => (
              <motion.div key={g.name} className="card p-6 cursor-pointer relative overflow-hidden group"
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}>
                {g.tag && (
                  <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      background: g.tag === 'HOT' ? 'rgba(245,101,101,0.18)' : 'rgba(0,196,180,0.18)',
                      color: g.tag === 'HOT' ? '#f56565' : '#00c4b4',
                      border: `1px solid ${g.tag === 'HOT' ? 'rgba(245,101,101,0.3)' : 'rgba(0,196,180,0.3)'}`,
                      fontFamily: 'Orbitron, system-ui', fontSize: '0.6rem',
                    }}>
                    {g.tag}
                  </span>
                )}
                <div className="text-4xl mb-4">{g.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui' }}>{g.name}</h3>
                <p className="text-sm mb-5" style={{ color: '#6b7e96' }}>{g.desc}</p>
                <Link href="/casino">
                  <button className="text-xs font-bold px-4 py-2 rounded-lg w-full transition-all"
                    style={{ background: 'linear-gradient(135deg, #00c4b4, #1e90ff)', color: '#fff', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.06em' }}>
                    Play Now
                  </button>
                </Link>
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

      {/* ── AI MINING PLANS ── */}
      <section className="py-20 px-4" style={{ background: 'rgba(6,13,23,0.6)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 gold-text" style={{ fontFamily: 'Orbitron, system-ui' }}>
              AI Cloud Mining Bots
            </h2>
            <p className="mb-2" style={{ color: '#6b7e96' }}>
              Institutional-grade mining infrastructure. AI coin-switching. Daily payouts — no hardware needed.
            </p>
            <p className="text-xs" style={{ color: '#3a4a5a' }}>One-time activation · No recurring fees · Withdraw anytime</p>
          </motion.div>

          {/* How it works — 3 steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-14 mt-10">
            {[
              { step: '01', title: 'Choose a Plan', desc: 'Select your bot tier. One payment, no surprises.' },
              { step: '02', title: 'Bot Activates', desc: 'AI connects to our global hash network instantly.' },
              { step: '03', title: 'Earn Daily',    desc: 'Funds credited automatically. Withdraw any time.' },
            ].map((s, i) => (
              <motion.div key={s.step} className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-3xl font-black mb-3" style={{ fontFamily: 'Orbitron, system-ui', color: 'rgba(0,196,180,0.18)' }}>
                  {s.step}
                </div>
                <div className="font-bold mb-1 text-sm" style={{ fontFamily: 'Orbitron, system-ui', color: '#00c4b4' }}>{s.title}</div>
                <p className="text-xs" style={{ color: '#6b7e96' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Pricing grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {MINING_PLANS.map((pkg, i) => (
              <motion.div key={pkg.id}
                className={`relative rounded-2xl p-6 ${pkg.popular ? 'card-gold card' : 'card'}`}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                style={{ borderColor: pkg.popular ? 'rgba(201,169,110,0.45)' : `${pkg.color}25` }}>

                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-black"
                      style={{ background: 'linear-gradient(135deg, #c9a96e, #ffd700)', color: '#060d17', fontFamily: 'Orbitron, system-ui', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <h3 className="font-black mb-1 text-base" style={{ fontFamily: 'Orbitron, system-ui', color: pkg.color }}>{pkg.label}</h3>
                <div className="text-3xl font-black mb-1" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>${pkg.price}</div>
                <div className="text-xs mb-4" style={{ color: '#4a5a6a' }}>one-time</div>

                <div className="space-y-2 mb-5 text-xs">
                  <div className="flex justify-between">
                    <span style={{ color: '#6b7e96' }}>Daily</span>
                    <span className="font-bold" style={{ color: pkg.color }}>${pkg.daily.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#6b7e96' }}>Duration</span>
                    <span className="font-bold" style={{ color: '#fff' }}>{pkg.days} days</span>
                  </div>
                  <div style={{ height: 1, background: '#1a3050', margin: '8px 0' }} />
                  <div className="flex justify-between">
                    <span style={{ color: '#6b7e96' }}>Est. Total</span>
                    <span className="font-bold" style={{ color: '#c9a96e' }}>${pkg.total.toLocaleString()}</span>
                  </div>
                </div>

                <Link href="/auth/signup">
                  <button className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${pkg.popular ? 'btn-gold' : 'btn-primary'}`}
                    style={{ fontFamily: 'Orbitron, system-ui', letterSpacing: '0.05em' }}>
                    Activate Bot
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/mining">
              <button className="btn-outline px-10">View Full Plans</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 px-4" style={{ background: 'rgba(13,32,64,0.3)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>
              Trusted by 18,400+ Members
            </h2>
            <p style={{ color: '#6b7e96', fontSize: '0.9rem' }}>Real users. Real earnings. Real withdrawals.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} className="card p-6"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <span key={j} style={{ color: '#ffd700', fontSize: '0.85rem' }}>★</span>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: '#a0b4c8' }}>"{t.text}"</p>
                <div style={{ borderTop: '1px solid #1a3050', paddingTop: 14 }}>
                  <div className="font-bold text-sm" style={{ color: '#fff' }}>{t.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#4a5a6a' }}>{t.location} · {t.plan}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BONUSES ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>
              Welcome Bonuses
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎰', title: '2 Free Spins',        desc: 'Credited on signup — wins go straight to your balance.',        color: '#00c4b4' },
              { icon: '🚀', title: '300% Deposit Match',   desc: 'First deposit ≥ $10? We triple it. Up to $3,000 bonus.',        color: '#c9a96e' },
              { icon: '🔗', title: '$2 Per Referral',      desc: 'Invite a friend who deposits — earn $2 instantly, no cap.',     color: '#1e90ff' },
            ].map((b, i) => (
              <motion.div key={i} className="card p-7"
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}>
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="text-base font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', color: b.color }}>{b.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7e96' }}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 text-center" style={{ background: 'rgba(13,32,64,0.4)', borderTop: '1px solid #1a3050' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 neon-text" style={{ fontFamily: 'Orbitron, system-ui' }}>
            Ready to Begin?
          </h2>
          <p className="mb-2 text-lg" style={{ color: '#6b7e96' }}>Join 48,000+ members earning daily on Crestara.</p>
          <p className="text-sm mb-10" style={{ color: '#3a4a5a' }}>Sign up free · No deposit required to explore</p>
          <Link href="/auth/signup">
            <button className="btn-primary text-lg px-14 py-5">Create Free Account</button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

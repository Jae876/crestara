'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useTransactions, useMiningPackages, useUserBots, useWheelSpins } from '@/hooks/useApi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { WheelOfFortune } from '@/components/WheelOfFortune';

function StatCard({ label, value, sub, color = '#00c4b4', icon }: { label: string; value: string; sub?: string; color?: string; icon: string }) {
  return (
    <motion.div
      className="card p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        <div className="px-2 py-0.5 rounded text-xs" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
          LIVE
        </div>
      </div>
      <div className="stat-value text-3xl mb-1" style={{ color }}>{value}</div>
      <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>{label}</div>
      {sub && <div className="text-xs" style={{ color: '#4a5a6a' }}>{sub}</div>}
    </motion.div>
  );
}

const TX_TYPE_COLOR: Record<string, string> = {
  DEPOSIT: '#48bb78',
  WITHDRAWAL: '#f56565',
  GAME_PAYOUT: '#00c4b4',
  MINING_PAYOUT: '#c9a96e',
  BONUS_CREDIT: '#1e90ff',
  REFERRAL_BONUS: '#c9a96e',
};

const TX_TYPE_LABEL: Record<string, string> = {
  DEPOSIT: 'Deposit',
  WITHDRAWAL: 'Withdraw',
  GAME_PAYOUT: 'Casino Win',
  MINING_PAYOUT: 'Mining',
  BONUS_CREDIT: 'Bonus',
  REFERRAL_BONUS: 'Referral',
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { data: txData } = useTransactions();
  const { data: packages } = useMiningPackages();
  const { data: userBots } = useUserBots();
  const { data: wheelData, refetch: refetchWheelSpins } = useWheelSpins(!!user);

  const [showAddFunds, setShowAddFunds] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [activeWheelSpin, setActiveWheelSpin] = useState<any | null>(null);
  const searchParams = useSearchParams();
  const welcomeAutoOpenDone = useRef(false);

  useEffect(() => {
    if (!user) router.push('/auth/login');
  }, [user, router]);

  useEffect(() => {
    if (welcomeAutoOpenDone.current) return;
    const isWelcome = searchParams.get('welcome') === '1';
    if (isWelcome && wheelData?.wheelSpins) {
      const spin = wheelData.wheelSpins.find((ws: any) => ws.spinsUsed < ws.spinsAllocated);
      if (spin) {
        welcomeAutoOpenDone.current = true;
        setActiveWheelSpin(spin);
      }
    }
  }, [searchParams, wheelData]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#060d17' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-4 animate-spin" style={{ borderColor: '#00c4b4', borderTopColor: 'transparent' }} />
          <p style={{ color: '#6b7e96' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const transactions = txData?.transactions || txData || [];
  const activeBots = userBots?.activeBots || userBots || [];
  const wheelSpins: any[] = wheelData?.wheelSpins || [];
  const totalAvailableSpins: number = wheelData?.totalAvailable ?? 0;
  const firstAvailableSpin = wheelSpins.find((ws) => ws.spinsUsed < ws.spinsAllocated) || null;

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/signup?ref=${user.referralCode || ''}`
    : `https://crestara.io/auth/signup?ref=${user.referralCode || ''}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4" style={{ background: 'linear-gradient(135deg, #060d17 0%, #0a1520 50%, #0d2040 100%)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold neon-text" style={{ fontFamily: 'Orbitron, system-ui' }}>Dashboard</h1>
            <p className="mt-1 text-sm" style={{ color: '#6b7e96' }}>
              Welcome back, <span style={{ color: '#d9d5c8' }}>{user.email}</span>
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {totalAvailableSpins > 0 && firstAvailableSpin && (
              <motion.button
                onClick={() => setActiveWheelSpin(firstAvailableSpin)}
                className="font-bold text-sm px-4 py-2 rounded-lg"
                animate={{ boxShadow: ['0 0 10px rgba(201,169,110,0.3)', '0 0 25px rgba(201,169,110,0.7)', '0 0 10px rgba(201,169,110,0.3)'] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{
                  background: 'linear-gradient(135deg, #c9a96e, #e8c46a)',
                  color: '#000',
                  fontFamily: 'Orbitron, system-ui',
                  fontSize: '0.75rem',
                  letterSpacing: '0.08em',
                }}
              >
                🎡 Spin! ({totalAvailableSpins})
              </motion.button>
            )}
            <button onClick={() => setShowAddFunds(true)} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.8rem' }}>
              + Add Funds
            </button>
            <button onClick={logout} className="btn-outline" style={{ padding: '10px 20px', fontSize: '0.8rem', borderColor: '#1a3050', color: '#6b7e96' }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon="💵" label="Available Balance" value={`$${(user.balanceUSD || 0).toFixed(2)}`} color="#00c4b4" />
          <StatCard icon="🎁" label="Bonus Balance" value={`$${(user.bonusBalance || 0).toFixed(2)}`} sub="40x wagering req." color="#c9a96e" />
          <StatCard icon="⛏️" label="Active Bots" value={`${activeBots.length}`} color="#1e90ff" />
          <StatCard icon="📊" label="Total Earned" value="$0.00" sub="All time" color="#48bb78" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            { href: '/casino', icon: '🎰', title: 'Casino', desc: 'Crash, Plinko, Dice, Mines & more', color: '#00c4b4' },
            { href: '/mining', icon: '⛏️', title: 'AI Cloud Mining', desc: 'AI bots, daily earnings', color: '#c9a96e' },
            { href: '/referrals', icon: '🔗', title: 'Referral Program', desc: 'Earn $2 per successful referral', color: '#1e90ff' },
          ].map(({ href, icon, title, desc, color }) => (
            <Link href={href} key={href}>
              <motion.div
                className="card p-6 cursor-pointer h-full"
                whileHover={{ y: -3 }}
                style={{ borderColor: 'rgba(26,48,80,0.8)' }}
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold mb-1" style={{ fontFamily: 'Orbitron, system-ui', color, fontSize: '0.9rem' }}>{title}</h3>
                <p className="text-xs" style={{ color: '#6b7e96' }}>{desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Transactions */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.9rem' }}>Recent Transactions</h2>
                <button onClick={() => setShowAddFunds(true)} className="text-xs hover:underline" style={{ color: '#00c4b4' }}>
                  + Deposit
                </button>
              </div>
              {transactions.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 8).map((tx: any) => (
                      <tr key={tx.id}>
                        <td>
                          <span className="text-xs font-semibold" style={{ color: TX_TYPE_COLOR[tx.type] || '#d9d5c8', fontFamily: 'Orbitron, system-ui' }}>
                            {TX_TYPE_LABEL[tx.type] || tx.type}
                          </span>
                        </td>
                        <td>
                          <span className="font-mono text-sm" style={{ color: (tx.type === 'WITHDRAWAL') ? '#f56565' : '#48bb78' }}>
                            {tx.type === 'WITHDRAWAL' ? '-' : '+'}${(tx.amountUSD || tx.amount || 0).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${tx.status === 'CONFIRMED' ? 'badge-success' : tx.status === 'PENDING' ? 'badge-warning' : 'badge-danger'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="text-xs" style={{ color: '#4a5a6a' }}>
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-sm mb-4" style={{ color: '#6b7e96' }}>No transactions yet</p>
                  <button onClick={() => setShowAddFunds(true)} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.8rem' }}>
                    Make First Deposit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Referral card */}
            <div className="card p-6" style={{ borderColor: 'rgba(0,196,180,0.15)' }}>
              <h2 className="font-bold mb-1" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', color: '#00c4b4' }}>🔗 Referral Link</h2>
              <p className="text-xs mb-4" style={{ color: '#6b7e96' }}>Earn $2 for every friend who deposits ≥ $10</p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={referralLink}
                  className="input-field text-xs"
                  style={{ padding: '10px 12px' }}
                />
                <button
                  onClick={copyReferralLink}
                  className="btn-primary flex-shrink-0"
                  style={{ padding: '10px 14px', fontSize: '0.75rem' }}
                >
                  {copiedRef ? '✓' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Active mining bots */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', color: '#c9a96e' }}>⛏️ AI Mining Bots</h2>
                <Link href="/mining" className="text-xs hover:underline" style={{ color: '#00c4b4' }}>View all</Link>
              </div>
              {activeBots.length > 0 ? (
                <div className="space-y-4">
                  {activeBots.slice(0, 3).map((bot: any) => {
                    const total = bot.dailyRate * 90;
                    const elapsed = Math.max(0, (Date.now() - new Date(bot.activatedAt || bot.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                    const progress = Math.min(100, (elapsed / 90) * 100);
                    return (
                      <div key={bot.id} className="p-3 rounded-lg" style={{ background: 'rgba(6,13,23,0.5)', border: '1px solid #1a3050' }}>
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <span className="text-xs font-bold" style={{ color: '#fff', fontFamily: 'Orbitron, system-ui' }}>{bot.coin}</span>
                            <span className="text-xs ml-2" style={{ color: '#6b7e96' }}>{bot.packageType}</span>
                          </div>
                          <span className="badge badge-success text-xs">{bot.status || 'ACTIVE'}</span>
                        </div>
                        <div className="flex justify-between text-xs mb-2" style={{ color: '#6b7e96' }}>
                          <span>Daily: <b style={{ color: '#c9a96e' }}>${bot.dailyRate}</b></span>
                          <span>Mined: <b style={{ color: '#00c4b4' }}>${(bot.totalMined || 0).toFixed(2)}</b></span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill-gold" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🤖</div>
                  <p className="text-xs mb-3" style={{ color: '#6b7e96' }}>No active bots</p>
                  <Link href="/mining">
                    <button className="btn-gold" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
                      Start Mining
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <motion.div
            className="card w-full max-w-md p-8" style={{ borderColor: 'rgba(0,196,180,0.2)' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl" style={{ fontFamily: 'Orbitron, system-ui' }}>Add Funds</h3>
              <button onClick={() => setShowAddFunds(false)} className="text-2xl leading-none" style={{ color: '#4a5a6a' }}>×</button>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6b7e96' }}>
              Deposit using any of 130+ supported cryptocurrencies. Funds are credited within 2–6 network confirmations.
            </p>
            <div className="space-y-3 mb-6">
              {['BTC — Bitcoin', 'ETH — Ethereum', 'USDT — Tether (TRC-20)', 'SOL — Solana', 'BNB — Binance Coin'].map((c) => (
                <button
                  key={c}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm transition-colors"
                  style={{ background: 'rgba(6,13,23,0.7)', border: '1px solid #1a3050', color: '#d9d5c8' }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = '#00c4b4'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = '#1a3050'; }}
                >
                  {c}
                </button>
              ))}
            </div>
            <p className="text-center text-xs" style={{ color: '#4a5a6a' }}>
              Full 130+ coin list available after selecting a network above
            </p>
          </motion.div>
        </div>
      )}

      {/* Wheel of Fortune Modal */}
      <AnimatePresence>
        {activeWheelSpin && (
          <WheelOfFortune
            wheelSpinId={activeWheelSpin.id}
            spinsRemaining={activeWheelSpin.spinsAllocated - activeWheelSpin.spinsUsed}
            depositAmount={activeWheelSpin.depositAmount}
            onClose={() => {
              setActiveWheelSpin(null);
              refetchWheelSpins();
            }}
            onSpinComplete={() => {
              refetchWheelSpins();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

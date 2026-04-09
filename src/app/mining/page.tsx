'use client';

import { useState } from 'react';
import { useMiningPackages, useUserBots, usePurchaseBot } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import Link from 'next/link';

const COIN_CONFIGS = [
  { symbol: 'BTC', name: 'Bitcoin', algo: 'SHA-256 ASIC', icon: '₿', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', algo: 'Ethash GPU', icon: 'Ξ', color: '#627EEA' },
  { symbol: 'XMR', name: 'Monero', algo: 'RandomX CPU', icon: 'ɱ', color: '#FF6600' },
  { symbol: 'LTC', name: 'Litecoin', algo: 'Scrypt ASIC', icon: 'Ł', color: '#B0B0B0' },
  { symbol: 'DOGE', name: 'Dogecoin', algo: 'Scrypt ASIC', icon: 'Ð', color: '#C2A633' },
  { symbol: 'RVN', name: 'Ravencoin', algo: 'KAWPOW GPU', icon: 'R', color: '#384182' },
];

const PACKAGES = [
  {
    type: 'BASIC',
    price: 5,
    daily: 0.50,
    days: 90,
    total: 45,
    roi: '800%',
    features: ['BTC, LTC, DOGE mining', 'Daily auto-credit', 'Email reports', 'Basic support'],
    color: '#00c4b4',
    gradient: 'linear-gradient(135deg, #00c4b4, #1e90ff)',
    popular: false,
  },
  {
    type: 'PRO',
    price: 10,
    daily: 1.00,
    days: 120,
    total: 120,
    roi: '1,100%',
    features: ['All 6 coins supported', 'Daily auto-credit', 'Priority payouts', 'Dedicated support', 'Coin-switching AI'],
    color: '#c9a96e',
    gradient: 'linear-gradient(135deg, #c9a96e, #ffd700)',
    popular: true,
  },
];

export default function MiningPage() {
  const { user } = useAuthStore();
  const { data: packagesData } = useMiningPackages();
  const { data: userBotsData } = useUserBots();
  const { mutate: purchaseBot, isPending } = usePurchaseBot();

  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [purchasingPkg, setPurchasingPkg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeBots = userBotsData?.activeBots || userBotsData || [];

  const handlePurchase = (pkgType: string, price: number) => {
    if (!user) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setPurchasingPkg(pkgType);

    purchaseBot({ packageType: pkgType, coin: selectedCoin }, {
      onSuccess: () => {
        setPurchasingPkg(null);
        setSuccessMsg(`${pkgType} bot activated! Mining ${selectedCoin} — first payout within 24 hours.`);
      },
      onError: (err: any) => {
        setPurchasingPkg(null);
        setErrorMsg(err?.response?.data?.error || 'Purchase failed. Check your balance.');
      },
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'linear-gradient(135deg, #060d17 0%, #0a1520 50%, #0d2040 100%)' }}>
      {/* Header */}
      <div className="px-4 py-8 relative overflow-hidden" style={{ background: 'rgba(13,32,64,0.4)', borderBottom: '1px solid #1a3050' }}>
        <div className="glow-orb" style={{ width: 500, height: 500, top: '-150px', right: '5%', background: 'rgba(201,169,110,0.04)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2 gold-text" style={{ fontFamily: 'Orbitron, system-ui' }}>Cloud Mining</h1>
            <p style={{ color: '#6b7e96' }}>AI-powered bots. Daily payouts. Real earnings.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Alerts */}
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

        {/* Coin selector */}
        <div className="mb-10">
          <h2 className="font-bold mb-4" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', color: '#6b7e96', letterSpacing: '0.1em' }}>
            SELECT MINING COIN
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {COIN_CONFIGS.map((coin) => (
              <button
                key={coin.symbol}
                onClick={() => setSelectedCoin(coin.symbol)}
                className="p-4 rounded-xl text-center transition-all"
                style={{
                  background: selectedCoin === coin.symbol ? `${coin.color}20` : 'rgba(13,32,64,0.6)',
                  border: `1.5px solid ${selectedCoin === coin.symbol ? coin.color : '#1a3050'}`,
                  boxShadow: selectedCoin === coin.symbol ? `0 0 16px ${coin.color}30` : 'none',
                }}
              >
                <div className="text-2xl mb-1" style={{ color: coin.color }}>{coin.icon}</div>
                <div className="font-bold text-xs mb-0.5" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>{coin.symbol}</div>
                <div className="text-xs" style={{ color: '#4a5a6a', fontSize: '0.65rem' }}>{coin.algo}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Packages */}
        <div className="mb-14">
          <h2 className="font-bold mb-6" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', color: '#6b7e96', letterSpacing: '0.1em' }}>
            MINING PACKAGES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.type}
                className={`relative rounded-xl p-8 ${pkg.popular ? 'card-gold card' : 'card'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                style={{ borderColor: pkg.popular ? 'rgba(201,169,110,0.35)' : undefined }}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="px-4 py-1 rounded-full text-xs font-black"
                      style={{ background: pkg.gradient, color: '#060d17', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.1em' }}>
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black" style={{ fontFamily: 'Orbitron, system-ui', color: pkg.color }}>{pkg.type}</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7e96' }}>Mining {selectedCoin}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>${pkg.price}</div>
                    <div className="text-xs" style={{ color: '#4a5a6a' }}>one-time</div>
                  </div>
                </div>

                <div className="divider mb-5" />

                <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                  <div className="py-2 rounded-lg" style={{ background: 'rgba(6,13,23,0.5)' }}>
                    <div className="font-bold text-sm" style={{ color: pkg.color, fontFamily: 'Orbitron, system-ui' }}>${pkg.daily}</div>
                    <div className="text-xs" style={{ color: '#4a5a6a', fontSize: '0.65rem' }}>daily</div>
                  </div>
                  <div className="py-2 rounded-lg" style={{ background: 'rgba(6,13,23,0.5)' }}>
                    <div className="font-bold text-sm" style={{ color: '#fff', fontFamily: 'Orbitron, system-ui' }}>{pkg.days}d</div>
                    <div className="text-xs" style={{ color: '#4a5a6a', fontSize: '0.65rem' }}>duration</div>
                  </div>
                  <div className="py-2 rounded-lg" style={{ background: 'rgba(6,13,23,0.5)' }}>
                    <div className="font-bold text-sm" style={{ color: '#c9a96e', fontFamily: 'Orbitron, system-ui' }}>${pkg.total}</div>
                    <div className="text-xs" style={{ color: '#4a5a6a', fontSize: '0.65rem' }}>est. total</div>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs" style={{ color: '#d9d5c8' }}>
                      <span style={{ color: pkg.color }}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                {user ? (
                  <button
                    onClick={() => handlePurchase(pkg.type, pkg.price)}
                    disabled={isPending && purchasingPkg === pkg.type}
                    className={pkg.popular ? 'btn-gold w-full' : 'btn-primary w-full'}
                    style={{ padding: '12px' }}
                  >
                    {isPending && purchasingPkg === pkg.type ? 'Activating...' : `Activate Bot — $${pkg.price}`}
                  </button>
                ) : (
                  <Link href="/auth/signup">
                    <button className={pkg.popular ? 'btn-gold w-full' : 'btn-primary w-full'} style={{ padding: '12px' }}>
                      Sign Up to Start
                    </button>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Bots */}
        <div>
          <h2 className="font-bold mb-6" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', color: '#6b7e96', letterSpacing: '0.1em' }}>
            YOUR ACTIVE BOTS
          </h2>
          {activeBots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeBots.map((bot: any) => {
                const coin = COIN_CONFIGS.find((c) => c.symbol === bot.coin);
                const elapsed = Math.max(0, (Date.now() - new Date(bot.activatedAt || bot.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                const duration = bot.packageType === 'BASIC' ? 90 : 120;
                const progress = Math.min(100, (elapsed / duration) * 100);
                const remaining = Math.max(0, duration - Math.floor(elapsed));
                return (
                  <motion.div key={bot.id} className="card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} whileHover={{ y: -3 }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                          style={{ background: `${coin?.color || '#00c4b4'}20`, color: coin?.color || '#00c4b4' }}>
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
                      <div>
                        <div style={{ color: '#4a5a6a' }}>Daily Rate</div>
                        <div className="font-bold" style={{ color: '#00c4b4', fontFamily: 'Orbitron, system-ui' }}>${bot.dailyRate?.toFixed(2)}</div>
                      </div>
                      <div>
                        <div style={{ color: '#4a5a6a' }}>Total Mined</div>
                        <div className="font-bold" style={{ color: '#c9a96e', fontFamily: 'Orbitron, system-ui' }}>${(bot.totalMined || 0).toFixed(2)}</div>
                      </div>
                      <div>
                        <div style={{ color: '#4a5a6a' }}>Days Left</div>
                        <div className="font-bold" style={{ color: '#fff', fontFamily: 'Orbitron, system-ui' }}>{remaining}d</div>
                      </div>
                      <div>
                        <div style={{ color: '#4a5a6a' }}>End Date</div>
                        <div className="font-bold" style={{ color: '#fff', fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem' }}>
                          {new Date(bot.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1" style={{ color: '#4a5a6a' }}>
                        <span>Progress</span>
                        <span>{progress.toFixed(0)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill-gold" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="card text-center py-16" style={{ borderColor: 'rgba(201,169,110,0.15)' }}>
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.9rem' }}>No Active Mining Bots</h3>
              <p className="text-sm mb-6" style={{ color: '#6b7e96' }}>Activate a package above to start earning daily</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

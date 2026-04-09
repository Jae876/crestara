'use client';

import { useState } from 'react';
import { useGames } from '@/hooks/useApi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const GAME_META: Record<string, { icon: string; desc: string; category: string; tag?: string }> = {
  CRASH:    { icon: '📈', desc: 'Watch the multiplier climb — cash out before it crashes!', category: 'originals', tag: 'HOT' },
  PLINKO:   { icon: '⚙️', desc: 'Drop a ball through pegs, watch multipliers rain down', category: 'originals' },
  DICE:     { icon: '🎲', desc: 'Classic over/under — instant results, infinite strategies', category: 'originals' },
  MINES:    { icon: '💣', desc: 'Navigate the grid avoiding mines, multiplier grows with each safe pick', category: 'originals', tag: 'NEW' },
  KENO:     { icon: '🎱', desc: 'Pick your lucky numbers, up to 10,000x multiplier', category: 'originals' },
  COINFLIP: { icon: '🪙', desc: '50/50 pure chance — heads or tails', category: 'originals' },
  SLOTS:    { icon: '🎰', desc: 'Premium video slots from leading providers', category: 'slots' },
  ROULETTE: { icon: '🔴', desc: 'American and European roulette tables', category: 'table' },
};

const STATIC_GAMES = [
  { type: 'CRASH', houseEdge: 1.5, minBet: 0.01, maxBet: 10000, enabled: true },
  { type: 'PLINKO', houseEdge: 2.0, minBet: 0.01, maxBet: 5000, enabled: true },
  { type: 'DICE', houseEdge: 1.0, minBet: 0.01, maxBet: 10000, enabled: true },
  { type: 'MINES', houseEdge: 2.5, minBet: 0.05, maxBet: 1000, enabled: true },
  { type: 'KENO', houseEdge: 2.0, minBet: 0.10, maxBet: 500, enabled: true },
  { type: 'COINFLIP', houseEdge: 1.0, minBet: 0.01, maxBet: 10000, enabled: true },
];

const TABS = [
  { id: 'all', label: 'All Games' },
  { id: 'originals', label: 'Originals' },
  { id: 'slots', label: 'Slots' },
  { id: 'table', label: 'Table' },
];

const LIVE_WINS = [
  { user: 'u***7', game: 'Crash', amount: 4200, mult: '42x' },
  { user: 'k***3', game: 'Dice', amount: 310, mult: '3.1x' },
  { user: 'r***8', game: 'Plinko', amount: 880, mult: '8.8x' },
  { user: 'j***1', game: 'Mines', amount: 1500, mult: '15x' },
  { user: 'p***5', game: 'Crash', amount: 6000, mult: '60x' },
];

export default function CasinoPage() {
  const { data: gamesData, isLoading } = useGames();
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const games = gamesData || STATIC_GAMES;
  const filteredGames = activeTab === 'all' ? games : games.filter((g: any) => {
    const meta = GAME_META[g.type || g.gameType];
    return meta?.category === activeTab;
  });

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'linear-gradient(135deg, #060d17 0%, #0a1520 50%, #0d2040 100%)' }}>
      {/* Header */}
      <div className="px-4 pb-8 pt-6 relative overflow-hidden" style={{ background: 'rgba(13,32,64,0.4)', borderBottom: '1px solid #1a3050' }}>
        <div className="glow-orb" style={{ width: 400, height: 400, top: '-100px', right: '10%', background: 'rgba(0,196,180,0.04)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500" style={{ boxShadow: '0 0 6px #48bb78' }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: '#48bb78', fontFamily: 'Orbitron, system-ui' }}>Live</span>
            </div>
            <h1 className="text-4xl font-bold mb-2 neon-text" style={{ fontFamily: 'Orbitron, system-ui' }}>Casino</h1>
            <p style={{ color: '#6b7e96', fontSize: '0.9rem' }}>Premium house-edge gaming — new members enjoy boosted win rates</p>
          </motion.div>
        </div>
      </div>

      {/* Live wins ticker */}
      <div className="relative overflow-hidden py-2" style={{ background: 'rgba(0,196,180,0.04)', borderBottom: '1px solid rgba(0,196,180,0.1)' }}>
        <div className="flex" style={{ animation: 'ticker 20s linear infinite', width: 'max-content' }}>
          {[...LIVE_WINS, ...LIVE_WINS, ...LIVE_WINS].map((w, i) => (
            <div key={i} className="flex items-center gap-2 px-6 whitespace-nowrap text-xs" style={{ color: '#6b7e96' }}>
              <span>🏆</span>
              <span className="font-mono">{w.user}</span>
              <span className="text-white">{w.game}</span>
              <span className="font-bold" style={{ color: '#00c4b4' }}>+${w.amount.toLocaleString()}</span>
              <span style={{ color: '#c9a96e' }}>{w.mult}</span>
              <span className="text-gray-700 mx-3">|</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-shrink-0 px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                fontFamily: 'Orbitron, system-ui',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #00c4b4, #1e90ff)' : 'rgba(13,32,64,0.6)',
                color: activeTab === tab.id ? '#fff' : '#6b7e96',
                border: activeTab === tab.id ? 'none' : '1px solid #1a3050',
                boxShadow: activeTab === tab.id ? '0 0 20px rgba(0,196,180,0.3)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Games grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse" style={{ height: 200 }}>
                    <div className="w-12 h-12 rounded-lg mb-4" style={{ background: '#1a3050' }} />
                    <div className="h-4 rounded mb-2" style={{ background: '#1a3050', width: '60%' }} />
                    <div className="h-3 rounded" style={{ background: '#1a3050', width: '80%' }} />
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredGames.map((game: any, i: number) => {
                    const type = game.type || game.gameType;
                    const meta = GAME_META[type] || { icon: '🎮', desc: 'Play now', category: 'originals' };
                    return (
                      <motion.div
                        key={type}
                        className="card p-6 cursor-pointer relative overflow-hidden group"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        whileHover={{ y: -4 }}
                        onHoverStart={() => setHoveredGame(type)}
                        onHoverEnd={() => setHoveredGame(null)}
                      >
                        {meta.tag && (
                          <span
                            className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded"
                            style={{
                              background: meta.tag === 'HOT' ? 'rgba(245,101,101,0.2)' : 'rgba(0,196,180,0.2)',
                              color: meta.tag === 'HOT' ? '#f56565' : '#00c4b4',
                              border: `1px solid ${meta.tag === 'HOT' ? 'rgba(245,101,101,0.3)' : 'rgba(0,196,180,0.3)'}`,
                              fontFamily: 'Orbitron, system-ui',
                              fontSize: '0.6rem',
                              letterSpacing: '0.08em',
                            }}
                          >
                            {meta.tag}
                          </span>
                        )}
                        <div className="text-4xl mb-3">{meta.icon}</div>
                        <h3 className="font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.9rem' }}>
                          {type.charAt(0) + type.slice(1).toLowerCase()}
                        </h3>
                        <p className="text-xs mb-4 leading-relaxed" style={{ color: '#6b7e96' }}>{meta.desc}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs" style={{ color: '#4a5a6a' }}>
                            Edge: <span style={{ color: '#00c4b4' }}>{game.houseEdge || game.houseEdgePercent || 2}%</span>
                          </div>
                          <button
                            className="text-xs font-bold px-4 py-1.5 rounded-lg transition-all"
                            style={{
                              background: 'linear-gradient(135deg, #00c4b4, #1e90ff)',
                              color: '#fff',
                              fontFamily: 'Orbitron, system-ui',
                              letterSpacing: '0.06em',
                              boxShadow: hoveredGame === type ? '0 0 15px rgba(0,196,180,0.4)' : 'none',
                            }}
                          >
                            Play
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* New player advantage */}
            <div className="card p-5" style={{ borderColor: 'rgba(201,169,110,0.25)' }}>
              <h3 className="font-bold mb-3 text-xs uppercase tracking-widest" style={{ fontFamily: 'Orbitron, system-ui', color: '#c9a96e' }}>
                🎯 New Player Boost
              </h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#6b7e96' }}>
                New members enjoy an <span style={{ color: '#ffd700', fontWeight: 700 }}>80% win-rate advantage</span> on all games during their first sessions — giving you the best chance to build your bankroll fast.
              </p>
              <div className="w-full rounded-full overflow-hidden mb-2" style={{ height: 6, background: 'rgba(26,48,80,0.8)' }}>
                <div style={{ width: '80%', height: '100%', background: 'linear-gradient(90deg, #c9a96e, #ffd700)', borderRadius: 3 }} />
              </div>
              <p className="text-xs text-right" style={{ color: '#c9a96e' }}>80% win rate</p>
            </div>

            {/* Live wins */}
            <div className="card p-5">
              <h3 className="font-bold mb-4 text-xs uppercase tracking-widest" style={{ fontFamily: 'Orbitron, system-ui', color: '#c9a96e' }}>
                🏆 Recent Big Wins
              </h3>
              <div className="space-y-3">
                {LIVE_WINS.map((w, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono" style={{ color: '#6b7e96' }}>{w.user}</span>
                      <span className="ml-2" style={{ color: '#d9d5c8' }}>{w.game}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: '#48bb78' }}>+${w.amount.toLocaleString()}</div>
                      <div style={{ color: '#c9a96e', fontSize: '0.65rem' }}>{w.mult}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bonus */}
            <div className="card card-gold p-5">
              <div className="text-2xl mb-2">🎁</div>
              <p className="font-bold text-xs mb-2" style={{ color: '#c9a96e', fontFamily: 'Orbitron, system-ui' }}>First Deposit Bonus</p>
              <p className="text-xs mb-4" style={{ color: '#6b7e96' }}>300% match up to $3,000 + 2 free spins on signup</p>
              <Link href="/auth/signup">
                <button className="btn-gold w-full" style={{ padding: '10px', fontSize: '0.72rem' }}>Claim Now</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

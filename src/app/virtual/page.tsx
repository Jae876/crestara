'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const SPORT_META: Record<string, { icon: string; label: string; color: string }> = {
  FOOTBALL:     { icon: '⚽', label: 'Football',     color: '#48bb78' },
  BASKETBALL:   { icon: '🏀', label: 'Basketball',   color: '#f6ad55' },
  HORSE_RACING: { icon: '🐎', label: 'Horse Racing', color: '#c9a96e' },
  DOG_RACING:   { icon: '🐕', label: 'Dog Racing',   color: '#1e90ff' },
  TENNIS:       { icon: '🎾', label: 'Tennis',       color: '#00c4b4' },
  MOTOR_RACING: { icon: '🏎️', label: 'Motor Racing', color: '#f56565' },
};

interface MarketOption {
  key: string;
  label: string;
  odds: number;
}

interface Market {
  id: string;
  name: string;
  options: MarketOption[];
  isOpen: boolean;
}

interface VirtualEvent {
  id: string;
  sportType: string;
  participants: string[];
  startTime: string;
  status: string;
  outcome: string | null;
  resultDetails: Record<string, unknown> | null;
  markets: Market[];
}

interface VirtualSport {
  sportType: string;
  isEnabled: boolean;
  minBet: number;
  maxBet: number;
}

interface RecentResult {
  id: string;
  sportType: string;
  participants: string[];
  startTime: string;
  outcome: string | null;
  resultDetails: Record<string, unknown> | null;
}

function Countdown({ startTime }: { startTime: string }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(startTime).getTime() - Date.now()) / 1000));
      setSeconds(diff);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  if (seconds <= 0) return <span style={{ color: '#f56565', fontFamily: 'Orbitron, system-ui', fontSize: '0.75rem' }}>LIVE</span>;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.72rem', color: '#00c4b4' }}>
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  );
}

interface BetSlip {
  eventId: string;
  marketId: string;
  selection: string;
  selectionLabel: string;
  odds: number;
  sportType: string;
  eventLabel: string;
  minBet: number;
  maxBet: number;
}

export default function VirtualPage() {
  const { token, user } = useAuthStore();
  const [activeSport, setActiveSport] = useState('ALL');
  const [sports, setSports] = useState<VirtualSport[]>([]);
  const [events, setEvents] = useState<VirtualEvent[]>([]);
  const [recent, setRecent] = useState<RecentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [betSlip, setBetSlip] = useState<BetSlip | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [betMsg, setBetMsg] = useState('');
  const [placing, setPlacing] = useState(false);

  const fetchData = useCallback(() => {
    const url = activeSport === 'ALL' ? '/api/virtual' : `/api/virtual?sport=${activeSport}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setSports(d.sports || []);
        setEvents(d.events || []);
        setRecent(d.recent || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeSport]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const selectOdds = (event: VirtualEvent, market: Market, option: MarketOption) => {
    const sport = sports.find((s) => s.sportType === event.sportType);
    const participants = event.participants as string[];
    const eventLabel = participants.slice(0, 2).join(' vs ');
    setBetSlip({
      eventId: event.id,
      marketId: market.id,
      selection: option.key,
      selectionLabel: option.label,
      odds: option.odds,
      sportType: event.sportType,
      eventLabel,
      minBet: sport?.minBet ?? 0.5,
      maxBet: sport?.maxBet ?? 1000,
    });
    setBetAmount('');
    setBetMsg('');
  };

  const placeBet = async () => {
    if (!betSlip || !token) { setBetMsg('Please log in to place bets'); return; }
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount < betSlip.minBet) {
      setBetMsg(`Minimum bet is $${betSlip.minBet}`);
      return;
    }
    if (amount > betSlip.maxBet) {
      setBetMsg(`Maximum bet is $${betSlip.maxBet}`);
      return;
    }
    setPlacing(true);
    setBetMsg('');
    try {
      const res = await fetch('/api/virtual/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          eventId: betSlip.eventId,
          marketId: betSlip.marketId,
          selection: betSlip.selection,
          betAmount: amount,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBetMsg(`✓ Bet placed! Potential win: $${(amount * betSlip.odds).toFixed(2)}`);
        setBetSlip(null);
        setBetAmount('');
        fetchData();
      } else {
        setBetMsg(data.error || 'Failed to place bet');
      }
    } catch {
      setBetMsg('Network error');
    } finally {
      setPlacing(false);
    }
  };

  const filteredEvents = activeSport === 'ALL'
    ? events
    : events.filter((e) => e.sportType === activeSport);

  const allSportTypes = ['ALL', ...Object.keys(SPORT_META)];

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'linear-gradient(135deg, #060d17 0%, #0a1520 50%, #0d2040 100%)' }}>
      {/* Header */}
      <div className="px-4 pb-8 pt-6 relative overflow-hidden" style={{ background: 'rgba(13,32,64,0.4)', borderBottom: '1px solid #1a3050' }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#1e90ff', boxShadow: '0 0 6px #1e90ff' }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: '#1e90ff', fontFamily: 'Orbitron, system-ui' }}>Virtual</span>
            </div>
            <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', color: '#fff' }}>
              Virtual Sports
            </h1>
            <p style={{ color: '#6b7e96', fontSize: '0.9rem' }}>
              Simulated sports events running 24/7 — bet on outcomes, collect winnings instantly
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sport tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {allSportTypes.map((st) => {
            const meta = SPORT_META[st];
            const isActive = activeSport === st;
            return (
              <button
                key={st}
                onClick={() => setActiveSport(st)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  fontFamily: 'Orbitron, system-ui',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  background: isActive ? 'linear-gradient(135deg, #1e90ff, #00c4b4)' : 'rgba(13,32,64,0.6)',
                  color: isActive ? '#fff' : '#6b7e96',
                  border: isActive ? 'none' : '1px solid #1a3050',
                  boxShadow: isActive ? '0 0 20px rgba(30,144,255,0.3)' : 'none',
                }}
              >
                {meta ? <span>{meta.icon}</span> : <span>🏟️</span>}
                {meta ? meta.label : 'All Sports'}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Events grid */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="card p-6 animate-pulse" style={{ height: 160 }}>
                    <div className="h-4 rounded mb-3" style={{ background: '#1a3050', width: '40%' }} />
                    <div className="h-6 rounded mb-4" style={{ background: '#1a3050', width: '70%' }} />
                    <div className="flex gap-3">
                      {[...Array(3)].map((_, j) => (
                        <div key={j} className="h-12 rounded-lg flex-1" style={{ background: '#1a3050' }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="card p-12 text-center" style={{ color: '#4a5a6a' }}>
                <div className="text-4xl mb-4">🏟️</div>
                <p style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem' }}>No upcoming events right now</p>
                <p className="text-sm mt-2">Check back in a few minutes</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event, i) => {
                  const meta = SPORT_META[event.sportType];
                  const participants = event.participants as string[];
                  return (
                    <motion.div
                      key={event.id}
                      className="card p-5 relative overflow-hidden"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      {/* Sport badge + countdown */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{meta?.icon}</span>
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-widest"
                            style={{
                              fontFamily: 'Orbitron, system-ui',
                              fontSize: '0.6rem',
                              background: `${meta?.color}20`,
                              color: meta?.color,
                              border: `1px solid ${meta?.color}40`,
                            }}
                          >
                            {meta?.label}
                          </span>
                          {event.status === 'LIVE' && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded uppercase" style={{ background: 'rgba(245,101,101,0.15)', color: '#f56565', border: '1px solid rgba(245,101,101,0.3)', fontFamily: 'Orbitron, system-ui', fontSize: '0.6rem' }}>
                              ● LIVE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#4a5a6a' }}>
                          <span>Starts in</span>
                          <Countdown startTime={event.startTime} />
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="mb-4">
                        {(event.sportType === 'FOOTBALL' || event.sportType === 'BASKETBALL' || event.sportType === 'TENNIS') ? (
                          <div className="flex items-center gap-3">
                            <span className="font-bold" style={{ color: '#d9d5c8', fontFamily: 'Orbitron, system-ui', fontSize: '0.88rem' }}>{participants[0]}</span>
                            <span className="text-xs" style={{ color: '#4a5a6a' }}>vs</span>
                            <span className="font-bold" style={{ color: '#d9d5c8', fontFamily: 'Orbitron, system-ui', fontSize: '0.88rem' }}>{participants[1]}</span>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {participants.slice(0, 6).map((p, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(26,48,80,0.5)', color: '#8aabb8' }}>
                                {idx + 1}. {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Markets */}
                      {event.markets.map((market) => (
                        <div key={market.id}>
                          <p className="text-xs mb-2 uppercase tracking-widest" style={{ color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', fontSize: '0.62rem' }}>
                            {market.name}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {(market.options as MarketOption[]).map((option) => {
                              const isSelected = betSlip?.eventId === event.id && betSlip?.marketId === market.id && betSlip?.selection === option.key;
                              return (
                                <button
                                  key={option.key}
                                  onClick={() => market.isOpen && event.status === 'UPCOMING' ? selectOdds(event, market, option) : undefined}
                                  disabled={!market.isOpen || event.status !== 'UPCOMING'}
                                  className="flex-1 min-w-[100px] p-3 rounded-lg transition-all text-left"
                                  style={{
                                    background: isSelected ? 'linear-gradient(135deg, #1e90ff20, #00c4b420)' : 'rgba(13,32,64,0.6)',
                                    border: `1px solid ${isSelected ? '#1e90ff' : '#1a3050'}`,
                                    cursor: market.isOpen && event.status === 'UPCOMING' ? 'pointer' : 'not-allowed',
                                    opacity: market.isOpen && event.status === 'UPCOMING' ? 1 : 0.5,
                                  }}
                                >
                                  <div className="text-xs mb-1" style={{ color: '#6b7e96', fontSize: '0.7rem' }}>{option.label}</div>
                                  <div className="font-bold" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.9rem', color: isSelected ? '#1e90ff' : '#c9a96e' }}>
                                    {option.odds.toFixed(2)}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {/* Recent Results */}
            {recent.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-bold mb-4 uppercase tracking-widest" style={{ fontFamily: 'Orbitron, system-ui', color: '#c9a96e' }}>
                  Recent Results
                </h2>
                <div className="space-y-2">
                  {recent.map((r) => {
                    const meta = SPORT_META[r.sportType];
                    const participants = r.participants as string[];
                    const details = r.resultDetails as Record<string, unknown> | null;
                    return (
                      <div key={r.id} className="card p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-base">{meta?.icon}</span>
                          <div>
                            <div className="text-xs font-bold" style={{ color: '#d9d5c8', fontFamily: 'Orbitron, system-ui', fontSize: '0.72rem' }}>
                              {participants.slice(0, 2).join(' vs ')}
                            </div>
                            <div className="text-xs" style={{ color: '#4a5a6a' }}>
                              {new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {details?.score && (
                            <div className="font-bold text-sm" style={{ fontFamily: 'Orbitron, system-ui', color: '#00c4b4' }}>
                              {details.score as string}
                            </div>
                          )}
                          {details?.finishing_order && (
                            <div className="text-xs" style={{ color: '#6b7e96' }}>
                              1st: {(details.finishing_order as string[])[0]}
                            </div>
                          )}
                          {details?.sets && (
                            <div className="font-bold text-sm" style={{ fontFamily: 'Orbitron, system-ui', color: '#00c4b4' }}>
                              Sets: {details.sets as string}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Bet Slip + Info */}
          <div className="space-y-5">
            {/* Bet slip */}
            <AnimatePresence>
              {betSlip && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="card p-5"
                  style={{ borderColor: 'rgba(30,144,255,0.3)', background: 'rgba(13,32,64,0.8)' }}
                >
                  <h3 className="font-bold mb-3 text-xs uppercase tracking-widest" style={{ fontFamily: 'Orbitron, system-ui', color: '#1e90ff' }}>
                    🎫 Bet Slip
                  </h3>
                  <div className="space-y-2 mb-4 text-xs" style={{ color: '#6b7e96' }}>
                    <div><span style={{ color: '#8aabb8' }}>Event:</span> {betSlip.eventLabel}</div>
                    <div><span style={{ color: '#8aabb8' }}>Pick:</span> <span style={{ color: '#d9d5c8' }}>{betSlip.selectionLabel}</span></div>
                    <div><span style={{ color: '#8aabb8' }}>Odds:</span> <span style={{ color: '#c9a96e', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>{betSlip.odds.toFixed(2)}x</span></div>
                    <div><span style={{ color: '#6b7e96' }}>Min: ${betSlip.minBet} / Max: ${betSlip.maxBet}</span></div>
                  </div>
                  <input
                    type="number"
                    min={betSlip.minBet}
                    max={betSlip.maxBet}
                    step="0.01"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    placeholder={`Amount ($${betSlip.minBet}–$${betSlip.maxBet})`}
                    style={{
                      width: '100%',
                      background: 'rgba(6,13,23,0.8)',
                      border: '1px solid rgba(30,144,255,0.3)',
                      borderRadius: 8,
                      padding: '9px 12px',
                      color: '#fff',
                      fontSize: '0.85rem',
                      marginBottom: 8,
                    }}
                  />
                  {betAmount && !isNaN(parseFloat(betAmount)) && (
                    <div className="text-xs mb-3" style={{ color: '#48bb78' }}>
                      Potential win: <strong style={{ fontFamily: 'Orbitron, system-ui' }}>${(parseFloat(betAmount) * betSlip.odds).toFixed(2)}</strong>
                    </div>
                  )}
                  {betMsg && (
                    <div className="text-xs mb-3 p-2 rounded" style={{
                      background: betMsg.startsWith('✓') ? 'rgba(72,187,120,0.1)' : 'rgba(245,101,101,0.1)',
                      color: betMsg.startsWith('✓') ? '#48bb78' : '#f56565',
                      border: `1px solid ${betMsg.startsWith('✓') ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`,
                    }}>
                      {betMsg}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={placeBet}
                      disabled={placing || !user}
                      className="flex-1 py-2 rounded-lg font-bold text-xs transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #1e90ff, #00c4b4)',
                        color: '#fff',
                        fontFamily: 'Orbitron, system-ui',
                        letterSpacing: '0.06em',
                        opacity: placing ? 0.7 : 1,
                        cursor: placing ? 'wait' : 'pointer',
                      }}
                    >
                      {placing ? 'Placing...' : user ? 'Place Bet' : 'Login to Bet'}
                    </button>
                    <button
                      onClick={() => { setBetSlip(null); setBetMsg(''); }}
                      className="px-3 py-2 rounded-lg text-xs transition-all"
                      style={{ background: 'rgba(26,48,80,0.6)', color: '#6b7e96', border: '1px solid #1a3050', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* How it works */}
            <div className="card p-5" style={{ borderColor: 'rgba(0,196,180,0.2)' }}>
              <h3 className="font-bold mb-4 text-xs uppercase tracking-widest" style={{ fontFamily: 'Orbitron, system-ui', color: '#00c4b4' }}>
                ⚡ How It Works
              </h3>
              <div className="space-y-3">
                {[
                  { icon: '1', text: 'Pick a sport and upcoming event' },
                  { icon: '2', text: 'Click an odds button to add to bet slip' },
                  { icon: '3', text: 'Enter your stake and confirm' },
                  { icon: '4', text: 'Winners paid out automatically at event end' },
                ].map((item) => (
                  <div key={item.icon} className="flex items-start gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(0,196,180,0.15)', color: '#00c4b4', border: '1px solid rgba(0,196,180,0.3)', fontFamily: 'Orbitron, system-ui' }}
                    >
                      {item.icon}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: '#6b7e96' }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sports schedule info */}
            <div className="card p-5">
              <h3 className="font-bold mb-4 text-xs uppercase tracking-widest" style={{ fontFamily: 'Orbitron, system-ui', color: '#c9a96e' }}>
                🏟️ All Sports
              </h3>
              <div className="space-y-2">
                {Object.entries(SPORT_META).map(([key, meta]) => {
                  const sport = sports.find((s) => s.sportType === key);
                  return (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span>{meta.icon}</span>
                        <span style={{ color: '#8aabb8' }}>{meta.label}</span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded text-xs"
                        style={{
                          fontFamily: 'Orbitron, system-ui',
                          fontSize: '0.6rem',
                          background: sport?.isEnabled ? 'rgba(72,187,120,0.1)' : 'rgba(245,101,101,0.1)',
                          color: sport?.isEnabled ? '#48bb78' : '#f56565',
                          border: `1px solid ${sport?.isEnabled ? 'rgba(72,187,120,0.2)' : 'rgba(245,101,101,0.2)'}`,
                        }}
                      >
                        {sport?.isEnabled ? 'LIVE' : 'OFF'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

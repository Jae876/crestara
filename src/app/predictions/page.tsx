'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PredictionOption {
  id: string;
  label: string;
  odds: number;
}

interface Prediction {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  status: string;
  bettingStartsAt: string;
  bettingEndsAt: string;
  resolvedOptionId?: string;
  options: PredictionOption[];
  totalPool: number;
  _count: { bets: number };
}

interface UserBet {
  id: string;
  amount: number;
  lockedOdds: number;
  potentialPayout: number;
  settlement: string;
  createdAt: string;
  prediction: { id: string; title: string; status: string; resolvedOptionId?: string };
  option: { id: string; label: string; odds: number };
}

const CATEGORIES = ['ALL', 'CRYPTO', 'SPORTS', 'POLITICS', 'ENTERTAINMENT', 'OTHER'];

const SETTLEMENT_BADGE: Record<string, { color: string; bg: string; border: string }> = {
  PENDING: { color: '#ffd700', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.3)' },
  WON:     { color: '#48bb78', bg: 'rgba(72,187,120,0.12)', border: 'rgba(72,187,120,0.3)' },
  LOST:    { color: '#f56565', bg: 'rgba(245,101,101,0.1)', border: 'rgba(245,101,101,0.3)' },
  REFUNDED:{ color: '#6b7e96', bg: 'rgba(107,126,150,0.12)', border: 'rgba(107,126,150,0.3)' },
};

function Countdown({ endsAt }: { endsAt: string }) {
  const [left, setLeft] = useState('');
  useEffect(() => {
    const tick = () => {
      const ms = new Date(endsAt).getTime() - Date.now();
      if (ms <= 0) { setLeft('Ended'); return; }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setLeft(h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [endsAt]);
  return <span>{left}</span>;
}

export default function PredictionsPage() {
  const { user, accessToken: token } = useAuthStore();
  const router = useRouter();

  const [tab, setTab] = useState<'predictions' | 'my-bets'>('predictions');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [myBets, setMyBets] = useState<UserBet[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const [loadingBets, setLoadingBets] = useState(false);

  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [selectedOption, setSelectedOption] = useState<PredictionOption | null>(null);
  const [betAmount, setBetAmount] = useState('');
  const [placing, setPlacing] = useState(false);
  const [betMsg, setBetMsg] = useState('');
  const [betMsgType, setBetMsgType] = useState<'success' | 'error'>('success');

  const fetchPredictions = useCallback(() => {
    setLoadingPredictions(true);
    const qs = categoryFilter !== 'ALL' ? `?status=OPEN&category=${categoryFilter}` : '?status=OPEN';
    fetch(`/api/predictions${qs}`)
      .then((r) => r.json())
      .then((d) => { setPredictions(d.predictions || []); setLoadingPredictions(false); })
      .catch(() => setLoadingPredictions(false));
  }, [categoryFilter]);

  const fetchMyBets = useCallback(() => {
    if (!token) return;
    setLoadingBets(true);
    fetch('/api/predictions/my-bets', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setMyBets(d.bets || []); setLoadingBets(false); })
      .catch(() => setLoadingBets(false));
  }, [token]);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    fetchPredictions();
  }, [user, router, fetchPredictions]);

  useEffect(() => {
    if (tab === 'my-bets') fetchMyBets();
  }, [tab, fetchMyBets]);

  const openBetSlip = (prediction: Prediction, option: PredictionOption) => {
    setSelectedPrediction(prediction);
    setSelectedOption(option);
    setBetAmount('');
    setBetMsg('');
  };

  const placeBet = async () => {
    if (!selectedPrediction || !selectedOption) return;
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      setBetMsg('Enter a valid bet amount');
      setBetMsgType('error');
      return;
    }
    setPlacing(true);
    setBetMsg('');
    const res = await fetch('/api/predictions/bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ predictionId: selectedPrediction.id, optionId: selectedOption.id, amount }),
    });
    const data = await res.json();
    setPlacing(false);
    if (res.ok) {
      setBetMsg(`Bet placed! Potential payout: $${data.bet.potentialPayout.toFixed(2)}`);
      setBetMsgType('success');
      fetchPredictions();
    } else {
      setBetMsg(data.error || 'Failed to place bet');
      setBetMsgType('error');
    }
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(6,13,23,0.8)', border: '1px solid #1a3050', borderRadius: 8,
    padding: '9px 14px', color: '#fff', fontSize: '0.85rem', width: '100%',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060d17', paddingTop: 80 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.6rem', fontWeight: 900, color: '#fff', marginBottom: 6 }}>
              🔮 Predictions Market
            </h1>
            <p style={{ color: '#6b7e96', fontSize: '0.85rem' }}>Bet on real-world outcomes. Admin-curated events.</p>
          </div>
          <Link href="/dashboard">
            <button style={{ padding: '8px 16px', borderRadius: 10, background: 'rgba(0,196,180,0.07)', color: '#00c4b4', fontSize: '0.78rem', cursor: 'pointer', border: '1px solid rgba(0,196,180,0.2)', fontFamily: 'Orbitron, system-ui' }}>
              ← Dashboard
            </button>
          </Link>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {(['predictions', 'my-bets'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '8px 20px', borderRadius: 10, fontFamily: 'Orbitron, system-ui', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em', border: '1px solid', transition: 'all 0.15s',
                background: tab === t ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: tab === t ? '#f97316' : '#4a5a6a',
                borderColor: tab === t ? 'rgba(249,115,22,0.4)' : '#1a3050',
              }}>
              {t === 'predictions' ? 'Active Predictions' : 'My Bets'}
            </button>
          ))}
        </div>

        {tab === 'predictions' && (
          <>
            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategoryFilter(c)}
                  style={{ padding: '5px 14px', borderRadius: 8, fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.04em', border: '1px solid', transition: 'all 0.15s',
                    background: categoryFilter === c ? 'rgba(0,196,180,0.12)' : 'transparent',
                    color: categoryFilter === c ? '#00c4b4' : '#4a5a6a',
                    borderColor: categoryFilter === c ? 'rgba(0,196,180,0.35)' : '#1a3050',
                  }}>
                  {c}
                </button>
              ))}
            </div>

            {loadingPredictions ? (
              <div style={{ color: '#4a5a6a', textAlign: 'center', padding: 60 }}>Loading predictions...</div>
            ) : predictions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#4a5a6a', background: 'rgba(13,32,64,0.4)', borderRadius: 16, border: '1px solid #1a3050' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔮</div>
                <p>No open predictions at the moment. Check back soon!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                {predictions.map((p) => (
                  <div key={p.id} style={{ background: 'rgba(13,32,64,0.7)', border: '1px solid #1a3050', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {p.imageUrl && (
                      <div style={{ height: 140, overflow: 'hidden', background: '#0d2040' }}>
                        <img src={p.imageUrl} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                      </div>
                    )}
                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(201,169,110,0.1)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.2)', fontFamily: 'Orbitron, system-ui', fontWeight: 700, letterSpacing: '0.06em' }}>{p.category}</span>
                        <span style={{ fontSize: '0.68rem', color: '#f56565', fontFamily: 'Orbitron, system-ui' }}>⏱ <Countdown endsAt={p.bettingEndsAt} /></span>
                      </div>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: 6, lineHeight: 1.4 }}>{p.title}</h3>
                      <p style={{ fontSize: '0.77rem', color: '#6b7e96', marginBottom: 12, lineHeight: 1.5, flex: 1 }}>{p.description}</p>

                      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginBottom: 14, fontSize: '0.72rem', color: '#4a5a6a' }}>
                        <span>Pool: <span style={{ color: '#ffd700', fontWeight: 700, fontFamily: 'Orbitron, system-ui' }}>${(p.totalPool || 0).toFixed(2)}</span></span>
                        <span>Bets: <span style={{ color: '#00c4b4' }}>{p._count.bets}</span></span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {p.options.map((opt) => (
                          <button key={opt.id}
                            onClick={() => openBetSlip(p, opt)}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: 'rgba(0,196,180,0.06)', border: '1px solid rgba(0,196,180,0.15)', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,196,180,0.12)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,196,180,0.3)'; }}
                            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,196,180,0.06)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,196,180,0.15)'; }}
                          >
                            <span style={{ fontSize: '0.82rem', color: '#d9d5c8', fontWeight: 500 }}>{opt.label}</span>
                            <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.8rem', fontWeight: 900, color: '#00c4b4' }}>{opt.odds}x</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'my-bets' && (
          <div>
            {loadingBets ? (
              <div style={{ color: '#4a5a6a', textAlign: 'center', padding: 60 }}>Loading your bets...</div>
            ) : myBets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#4a5a6a', background: 'rgba(13,32,64,0.4)', borderRadius: 16, border: '1px solid #1a3050' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📊</div>
                <p>You haven't placed any prediction bets yet.</p>
                <button onClick={() => setTab('predictions')} style={{ marginTop: 14, padding: '8px 20px', borderRadius: 10, background: 'rgba(249,115,22,0.15)', color: '#f97316', fontSize: '0.78rem', cursor: 'pointer', border: '1px solid rgba(249,115,22,0.3)', fontFamily: 'Orbitron, system-ui' }}>
                  View Predictions
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {myBets.map((b) => {
                  const badge = SETTLEMENT_BADGE[b.settlement] || SETTLEMENT_BADGE.PENDING;
                  return (
                    <div key={b.id} style={{ background: 'rgba(13,32,64,0.7)', border: '1px solid #1a3050', borderRadius: 12, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: 4 }}>{b.prediction.title}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7e96' }}>
                          Option: <span style={{ color: '#d9d5c8' }}>{b.option.label}</span>
                          <span style={{ marginLeft: 8, color: '#00c4b4', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>{b.lockedOdds}x</span>
                        </p>
                        <p style={{ fontSize: '0.7rem', color: '#4a5a6a', marginTop: 2 }}>{new Date(b.createdAt).toLocaleString()}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.9rem', fontWeight: 900, color: '#ffd700' }}>${b.amount.toFixed(2)}</span>
                          <span style={{ fontSize: '0.72rem', color: '#6b7e96' }}>→</span>
                          <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', fontWeight: 700, color: '#48bb78' }}>${b.potentialPayout.toFixed(2)}</span>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: 'Orbitron, system-ui',
                          background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                        }}>
                          {b.settlement}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bet Slip Side Panel */}
      {selectedPrediction && selectedOption && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setSelectedPrediction(null); setSelectedOption(null); } }}>
          <div style={{ width: 360, height: '100%', background: '#0d2040', borderLeft: '1px solid #1a3050', padding: 28, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Orbitron, system-ui', color: '#f97316', fontSize: '0.95rem', fontWeight: 700 }}>Bet Slip</h2>
              <button onClick={() => { setSelectedPrediction(null); setSelectedOption(null); }} style={{ color: '#6b7e96', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ background: 'rgba(6,13,23,0.6)', border: '1px solid #1a3050', borderRadius: 10, padding: '14px 16px' }}>
              <p style={{ fontSize: '0.78rem', color: '#6b7e96', marginBottom: 4 }}>{selectedPrediction.title}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontSize: '0.85rem', color: '#d9d5c8', fontWeight: 600 }}>{selectedOption.label}</span>
                <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1rem', fontWeight: 900, color: '#00c4b4' }}>{selectedOption.odds}x</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.7rem', color: '#6b7e96', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                Bet Amount (USD)
              </label>
              <input style={inputStyle} type="number" min="0.01" step="0.01" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} placeholder="0.00" />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {[5, 10, 25, 50].map((q) => (
                  <button key={q} onClick={() => setBetAmount(q.toString())}
                    style={{ flex: 1, padding: '5px 0', borderRadius: 8, background: 'rgba(0,196,180,0.06)', color: '#00c4b4', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(0,196,180,0.2)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                    ${q}
                  </button>
                ))}
              </div>
            </div>

            {betAmount && parseFloat(betAmount) > 0 && (
              <div style={{ background: 'rgba(72,187,120,0.07)', border: '1px solid rgba(72,187,120,0.2)', borderRadius: 10, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                  <span style={{ color: '#6b7e96' }}>Stake</span>
                  <span style={{ color: '#d9d5c8', fontWeight: 600 }}>${parseFloat(betAmount).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 4 }}>
                  <span style={{ color: '#6b7e96' }}>Odds</span>
                  <span style={{ color: '#00c4b4', fontWeight: 700, fontFamily: 'Orbitron, system-ui' }}>{selectedOption.odds}x</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(72,187,120,0.2)' }}>
                  <span style={{ color: '#48bb78', fontWeight: 700, fontFamily: 'Orbitron, system-ui', fontSize: '0.75rem', letterSpacing: '0.06em' }}>POTENTIAL PAYOUT</span>
                  <span style={{ color: '#48bb78', fontWeight: 900, fontFamily: 'Orbitron, system-ui' }}>${(parseFloat(betAmount) * selectedOption.odds).toFixed(2)}</span>
                </div>
              </div>
            )}

            {betMsg && (
              <div style={{ padding: '10px 14px', borderRadius: 8, fontSize: '0.8rem',
                background: betMsgType === 'success' ? 'rgba(72,187,120,0.1)' : 'rgba(245,101,101,0.1)',
                border: `1px solid ${betMsgType === 'success' ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`,
                color: betMsgType === 'success' ? '#48bb78' : '#f56565',
              }}>
                {betMsg}
              </div>
            )}

            <button onClick={placeBet} disabled={placing}
              style={{ width: '100%', padding: '12px', borderRadius: 12, background: placing ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.15)', color: '#f97316', fontWeight: 700, fontSize: '0.85rem', cursor: placing ? 'default' : 'pointer', border: '1px solid rgba(249,115,22,0.35)', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.06em' }}>
              {placing ? 'Placing Bet...' : 'Place Bet'}
            </button>

            <p style={{ fontSize: '0.68rem', color: '#3a4a5a', textAlign: 'center', lineHeight: 1.5 }}>
              Odds are locked at the time of your bet. Balance is deducted immediately.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


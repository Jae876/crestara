'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SPORT_META: Record<string, { icon: string; label: string }> = {
  FOOTBALL:     { icon: '⚽', label: 'Football' },
  BASKETBALL:   { icon: '🏀', label: 'Basketball' },
  HORSE_RACING: { icon: '🐎', label: 'Horse Racing' },
  DOG_RACING:   { icon: '🐕', label: 'Dog Racing' },
  TENNIS:       { icon: '🎾', label: 'Tennis' },
  MOTOR_RACING: { icon: '🏎️', label: 'Motor Racing' },
};

interface VirtualSport {
  id: string;
  sportType: string;
  isEnabled: boolean;
  minBet: number;
  maxBet: number;
  oddsConfig: Record<string, number>;
}

interface VirtualBet {
  id: string;
  betAmount: number;
  odds: number;
  payout: number;
  status: string;
  selection: string;
  createdAt: string;
  settledAt: string | null;
  user: { email: string };
  event: { sportType: string; participants: string[]; startTime: string; status: string; outcome: string | null };
  market: { name: string };
}

interface VirtualEvent {
  id: string;
  sportType: string;
  participants: string[];
  startTime: string;
  status: string;
  outcome: string | null;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#060d17', paddingTop: 80 }}>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        <aside style={{ width: 220, background: 'rgba(13,32,64,0.5)', borderRight: '1px solid #1a3050', padding: '24px 0', flexShrink: 0 }}>
          <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #1a3050', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.12em' }}>Admin Panel</div>
          </div>
          {[
            { href: '/admin',             label: 'Dashboard',     icon: '📊' },
            { href: '/admin/withdrawals', label: 'Withdrawals',   icon: '✅' },
            { href: '/admin/wallets',     label: 'Wallets',       icon: '👛' },
            { href: '/admin/users',       label: 'Users',         icon: '👤' },
            { href: '/admin/virtual',     label: 'Virtual Games', icon: '🏟️' },
            { href: '/dashboard',         label: '← Back to App', icon: '🏠' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.82rem', color: '#8aabb8', cursor: 'pointer' }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,196,180,0.06)'; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = '#8aabb8'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span>{item.icon}</span><span>{item.label}</span>
              </div>
            </Link>
          ))}
        </aside>
        <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}

export default function AdminVirtualPage() {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sports' | 'events' | 'bets'>('sports');
  const [sports, setSports] = useState<VirtualSport[]>([]);
  const [events, setEvents] = useState<VirtualEvent[]>([]);
  const [bets, setBets] = useState<VirtualBet[]>([]);
  const [betsTotal, setBetsTotal] = useState(0);
  const [betsPage, setBetsPage] = useState(1);
  const [betsSearch, setBetsSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<Record<string, { minBet: string; maxBet: string; oddsConfig: string }>>({});
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    if (user.role !== 'ADMIN') { router.push('/dashboard'); return; }
  }, [user, router]);

  const fetchSports = useCallback(() => {
    fetch('/api/admin/virtual?action=sports', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setSports(d.sports || []);
        const initEdit: Record<string, { minBet: string; maxBet: string; oddsConfig: string }> = {};
        (d.sports || []).forEach((s: VirtualSport) => {
          initEdit[s.id] = {
            minBet: String(s.minBet),
            maxBet: String(s.maxBet),
            oddsConfig: JSON.stringify(s.oddsConfig, null, 2),
          };
        });
        setEditState(initEdit);
        setLoading(false);
      });
  }, [token]);

  const fetchEvents = useCallback(() => {
    fetch('/api/admin/virtual?action=events', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events || []);
        setLoading(false);
      });
  }, [token]);

  const fetchBets = useCallback(() => {
    const params = new URLSearchParams({
      action: 'bets',
      page: String(betsPage),
      pageSize: '25',
    });
    if (betsSearch) params.set('search', betsSearch);
    fetch(`/api/admin/virtual?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        setBets(d.bets || []);
        setBetsTotal(d.total || 0);
        setLoading(false);
      });
  }, [token, betsPage, betsSearch]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    if (activeTab === 'sports') fetchSports();
    else if (activeTab === 'events') fetchEvents();
    else fetchBets();
  }, [activeTab, token, fetchSports, fetchEvents, fetchBets]);

  const toggleSport = async (sport: VirtualSport) => {
    setSavingId(sport.id);
    setMsg('');
    const res = await fetch('/api/admin/virtual', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ sportType: sport.sportType, isEnabled: !sport.isEnabled }),
    });
    if (res.ok) {
      setMsg(`✓ ${SPORT_META[sport.sportType]?.label} ${!sport.isEnabled ? 'enabled' : 'disabled'}`);
      fetchSports();
    } else {
      const d = await res.json();
      setMsg(d.error || 'Failed');
    }
    setSavingId(null);
  };

  const saveSportConfig = async (sport: VirtualSport) => {
    setSavingId(sport.id);
    setMsg('');
    const edit = editState[sport.id];
    let oddsConfig: Record<string, number>;
    try {
      oddsConfig = JSON.parse(edit.oddsConfig);
    } catch {
      setMsg('Invalid odds config JSON');
      setSavingId(null);
      return;
    }
    const res = await fetch('/api/admin/virtual', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        sportType: sport.sportType,
        minBet: parseFloat(edit.minBet),
        maxBet: parseFloat(edit.maxBet),
        oddsConfig,
      }),
    });
    if (res.ok) {
      setMsg(`✓ ${SPORT_META[sport.sportType]?.label} config saved`);
      fetchSports();
    } else {
      const d = await res.json();
      setMsg(d.error || 'Failed');
    }
    setSavingId(null);
  };

  const resolveEvent = async (eventId: string) => {
    setSavingId(eventId);
    setMsg('');
    const res = await fetch('/api/admin/virtual', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: 'resolve_event', eventId }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg('✓ Event resolved and bets settled');
      fetchEvents();
    } else {
      setMsg(data.error || 'Failed to resolve event');
    }
    setSavingId(null);
  };

  const statusColor = (s: string) => s === 'WON' ? '#48bb78' : s === 'LOST' ? '#f56565' : '#ffd700';
  const eventStatusColor = (s: string) => s === 'UPCOMING' ? '#1e90ff' : s === 'LIVE' ? '#f56565' : '#48bb78';

  return (
    <AdminShell>
      <h1 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 6 }}>
        Virtual Games
      </h1>
      <p style={{ color: '#6b7e96', fontSize: '0.85rem', marginBottom: 24 }}>Configure sports, manage events, and review all virtual bets.</p>

      {msg && (
        <div style={{ marginBottom: 14, padding: '9px 14px', borderRadius: 8, background: msg.startsWith('✓') ? 'rgba(72,187,120,0.1)' : 'rgba(245,101,101,0.1)', border: `1px solid ${msg.startsWith('✓') ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`, color: msg.startsWith('✓') ? '#48bb78' : '#f56565', fontSize: '0.82rem' }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([
          { id: 'sports', label: '🏟️ Sports Config' },
          { id: 'events', label: '⚡ Events / Resolve' },
          { id: 'bets',   label: '🎫 All Bets' },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setLoading(true); }}
            style={{
              padding: '8px 18px', borderRadius: 8, fontFamily: 'Orbitron, system-ui', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em',
              background: activeTab === tab.id ? 'rgba(0,196,180,0.15)' : 'transparent',
              color: activeTab === tab.id ? '#00c4b4' : '#4a5a6a',
              border: `1px solid ${activeTab === tab.id ? 'rgba(0,196,180,0.4)' : '#1a3050'}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#4a5a6a', textAlign: 'center', padding: 60 }}>Loading...</div>
      ) : activeTab === 'sports' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {sports.map((sport) => {
            const meta = SPORT_META[sport.sportType] ?? { icon: '🏅', label: sport.sportType };
            const edit = editState[sport.id] ?? { minBet: String(sport.minBet), maxBet: String(sport.maxBet), oddsConfig: JSON.stringify(sport.oddsConfig) };
            return (
              <div key={sport.id} style={{ background: 'rgba(13,32,64,0.6)', border: '1px solid #1a3050', borderRadius: 12, padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 22 }}>{meta.icon}</span>
                    <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.9rem', fontWeight: 700, color: '#d9d5c8' }}>{meta.label}</span>
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: 'Orbitron, system-ui',
                      background: sport.isEnabled ? 'rgba(72,187,120,0.12)' : 'rgba(245,101,101,0.12)',
                      color: sport.isEnabled ? '#48bb78' : '#f56565',
                      border: `1px solid ${sport.isEnabled ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`,
                    }}>
                      {sport.isEnabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleSport(sport)}
                    disabled={savingId === sport.id}
                    style={{
                      padding: '6px 14px', borderRadius: 8, fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer',
                      background: sport.isEnabled ? 'rgba(245,101,101,0.1)' : 'rgba(72,187,120,0.1)',
                      color: sport.isEnabled ? '#f56565' : '#48bb78',
                      border: `1px solid ${sport.isEnabled ? 'rgba(245,101,101,0.3)' : 'rgba(72,187,120,0.3)'}`,
                    }}
                  >
                    {savingId === sport.id ? '...' : sport.isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Min Bet ($)</label>
                    <input
                      type="number"
                      value={edit.minBet}
                      onChange={(e) => setEditState((prev) => ({ ...prev, [sport.id]: { ...prev[sport.id], minBet: e.target.value } }))}
                      style={{ width: '100%', background: 'rgba(6,13,23,0.8)', border: '1px solid #1a3050', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Max Bet ($)</label>
                    <input
                      type="number"
                      value={edit.maxBet}
                      onChange={(e) => setEditState((prev) => ({ ...prev, [sport.id]: { ...prev[sport.id], maxBet: e.target.value } }))}
                      style={{ width: '100%', background: 'rgba(6,13,23,0.8)', border: '1px solid #1a3050', borderRadius: 8, padding: '7px 10px', color: '#fff', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Odds Config (JSON)</label>
                    <textarea
                      value={edit.oddsConfig}
                      onChange={(e) => setEditState((prev) => ({ ...prev, [sport.id]: { ...prev[sport.id], oddsConfig: e.target.value } }))}
                      rows={3}
                      style={{ width: '100%', background: 'rgba(6,13,23,0.8)', border: '1px solid #1a3050', borderRadius: 8, padding: '7px 10px', color: '#d9d5c8', fontSize: '0.75rem', fontFamily: 'monospace', resize: 'vertical' }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => saveSportConfig(sport)}
                    disabled={savingId === sport.id}
                    style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(0,196,180,0.12)', color: '#00c4b4', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', border: '1px solid rgba(0,196,180,0.3)', fontFamily: 'Orbitron, system-ui' }}
                  >
                    {savingId === sport.id ? 'Saving...' : '✓ Save Config'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : activeTab === 'events' ? (
        <div>
          <p style={{ color: '#6b7e96', fontSize: '0.8rem', marginBottom: 16 }}>
            View upcoming and live events. Use "Resolve Now" to manually settle an event and pay out all pending bets.
          </p>
          {events.length === 0 ? (
            <div style={{ color: '#4a5a6a', textAlign: 'center', padding: 60 }}>No active events found</div>
          ) : (
            <div style={{ background: 'rgba(13,32,64,0.6)', border: '1px solid #1a3050', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(6,13,23,0.6)' }}>
                      {['Sport', 'Participants', 'Start Time', 'Status', 'Outcome', 'Actions'].map((h) => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((event, i) => {
                      const meta = SPORT_META[event.sportType];
                      const participants = event.participants as string[];
                      return (
                        <tr key={event.id} style={{ borderTop: '1px solid rgba(26,48,80,0.4)', background: i % 2 === 0 ? 'transparent' : 'rgba(13,32,64,0.2)' }}>
                          <td style={{ padding: '9px 12px', color: '#8aabb8' }}>{meta?.icon} {meta?.label}</td>
                          <td style={{ padding: '9px 12px', color: '#d9d5c8', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {participants.slice(0, 2).join(' vs ')}
                          </td>
                          <td style={{ padding: '9px 12px', color: '#6b7e96' }}>
                            {new Date(event.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </td>
                          <td style={{ padding: '9px 12px' }}>
                            <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, fontFamily: 'Orbitron, system-ui', background: eventStatusColor(event.status) + '18', color: eventStatusColor(event.status), border: `1px solid ${eventStatusColor(event.status)}40` }}>
                              {event.status}
                            </span>
                          </td>
                          <td style={{ padding: '9px 12px', color: event.outcome ? '#48bb78' : '#3a4a5a', fontFamily: 'Orbitron, system-ui', fontSize: '0.72rem' }}>
                            {event.outcome || '—'}
                          </td>
                          <td style={{ padding: '9px 12px' }}>
                            {event.status !== 'SETTLED' && (
                              <button
                                onClick={() => resolveEvent(event.id)}
                                disabled={savingId === event.id}
                                style={{
                                  padding: '5px 12px', borderRadius: 7, fontFamily: 'Orbitron, system-ui', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer',
                                  background: 'rgba(201,169,110,0.1)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.3)',
                                }}
                              >
                                {savingId === event.id ? '...' : '⚡ Resolve Now'}
                              </button>
                            )}
                            {event.status === 'SETTLED' && (
                              <span style={{ fontSize: '0.65rem', color: '#4a5a6a' }}>Settled</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
            <input
              value={betsSearch}
              onChange={(e) => { setBetsSearch(e.target.value); setBetsPage(1); }}
              placeholder="Search by email..."
              style={{ flex: 1, maxWidth: 320, background: 'rgba(13,32,64,0.7)', border: '1px solid #1a3050', borderRadius: 8, padding: '9px 14px', color: '#fff', fontSize: '0.82rem' }}
            />
            <span style={{ color: '#4a5a6a', fontSize: '0.8rem' }}>{betsTotal.toLocaleString()} bets total</span>
          </div>
          <div style={{ background: 'rgba(13,32,64,0.6)', border: '1px solid #1a3050', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(6,13,23,0.6)' }}>
                    {['User', 'Sport', 'Event', 'Market / Pick', 'Odds', 'Amount', 'Payout', 'Status', 'Date'].map((h) => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', fontSize: '0.62rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bets.map((bet, i) => {
                    const participants = bet.event.participants as string[];
                    const eventLabel = participants.slice(0, 2).join(' vs ');
                    const meta = SPORT_META[bet.event.sportType];
                    return (
                      <tr key={bet.id} style={{ borderTop: '1px solid rgba(26,48,80,0.4)', background: i % 2 === 0 ? 'transparent' : 'rgba(13,32,64,0.2)' }}>
                        <td style={{ padding: '9px 12px', color: '#d9d5c8' }}>{bet.user.email}</td>
                        <td style={{ padding: '9px 12px', color: '#8aabb8' }}>{meta?.icon} {meta?.label}</td>
                        <td style={{ padding: '9px 12px', color: '#6b7e96', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{eventLabel}</td>
                        <td style={{ padding: '9px 12px', color: '#8aabb8' }}>
                          <div style={{ fontSize: '0.7rem', color: '#4a5a6a' }}>{bet.market.name}</div>
                          <div style={{ color: '#d9d5c8' }}>{bet.selection}</div>
                        </td>
                        <td style={{ padding: '9px 12px', fontFamily: 'Orbitron, system-ui', color: '#c9a96e', fontWeight: 700 }}>{bet.odds.toFixed(2)}x</td>
                        <td style={{ padding: '9px 12px', fontFamily: 'Orbitron, system-ui', color: '#d9d5c8', fontWeight: 700 }}>${bet.betAmount.toFixed(2)}</td>
                        <td style={{ padding: '9px 12px', fontFamily: 'Orbitron, system-ui', color: bet.payout > 0 ? '#48bb78' : '#4a5a6a', fontWeight: 700 }}>
                          {bet.payout > 0 ? `$${bet.payout.toFixed(2)}` : '-'}
                        </td>
                        <td style={{ padding: '9px 12px' }}>
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, fontFamily: 'Orbitron, system-ui', background: statusColor(bet.status) + '18', color: statusColor(bet.status), border: `1px solid ${statusColor(bet.status)}40` }}>
                            {bet.status}
                          </span>
                        </td>
                        <td style={{ padding: '9px 12px', color: '#3a4a5a' }}>
                          {new Date(bet.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {betsTotal > 25 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 14, borderTop: '1px solid #1a3050' }}>
                <button onClick={() => setBetsPage((p) => Math.max(1, p - 1))} disabled={betsPage === 1}
                  style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(13,32,64,0.7)', color: '#6b7e96', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #1a3050' }}>
                  ← Prev
                </button>
                <span style={{ padding: '6px 10px', color: '#6b7e96', fontSize: '0.75rem' }}>Page {betsPage} of {Math.ceil(betsTotal / 25)}</span>
                <button onClick={() => setBetsPage((p) => p + 1)} disabled={betsPage >= Math.ceil(betsTotal / 25)}
                  style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(13,32,64,0.7)', color: '#6b7e96', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #1a3050' }}>
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

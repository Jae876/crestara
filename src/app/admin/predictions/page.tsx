'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PredictionOption {
  id: string;
  label: string;
  odds: number;
  _count?: { bets: number };
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

interface PredictionBet {
  id: string;
  amount: number;
  lockedOdds: number;
  potentialPayout: number;
  settlement: string;
  createdAt: string;
  user: { id: string; email: string };
  option: { id: string; label: string };
}

const CATEGORIES = ['ALL', 'CRYPTO', 'SPORTS', 'POLITICS', 'ENTERTAINMENT', 'OTHER'];
const STATUSES = ['ALL', 'DRAFT', 'OPEN', 'SUSPENDED', 'RESOLVED', 'CANCELLED'];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#6b7e96',
  OPEN: '#48bb78',
  SUSPENDED: '#ffd700',
  RESOLVED: '#1e90ff',
  CANCELLED: '#f56565',
};

const SETTLEMENT_COLORS: Record<string, string> = {
  PENDING: '#ffd700',
  WON: '#48bb78',
  LOST: '#f56565',
  REFUNDED: '#6b7e96',
};

function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#060d17', paddingTop: 80 }}>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        <aside style={{ width: 220, background: 'rgba(13,32,64,0.5)', borderRight: '1px solid #1a3050', padding: '24px 0', flexShrink: 0 }}>
          <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #1a3050', marginBottom: 16 }}>
            <div style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.12em' }}>Admin Panel</div>
          </div>
          {[
            { href: '/admin', label: 'Dashboard', icon: '📊' },
            { href: '/admin/withdrawals', label: 'Withdrawals', icon: '✅' },
            { href: '/admin/wallets', label: 'Wallets', icon: '👛' },
            { href: '/admin/users', label: 'Users', icon: '👤' },
            { href: '/admin/predictions', label: 'Predictions', icon: '🔮' },
            { href: '/dashboard', label: '← Back to App', icon: '🏠' },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.82rem', color: '#8aabb8', cursor: 'pointer' }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = '#8aabb8'; }}>
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

const emptyForm = {
  title: '', description: '', category: 'OTHER', imageUrl: '',
  bettingStartsAt: '', bettingEndsAt: '',
  options: [{ label: '', odds: 2 }, { label: '', odds: 2 }],
};

export default function AdminPredictionsPage() {
  const { user, accessToken: token } = useAuthStore();
  const router = useRouter();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ ...emptyForm, options: [{ label: '', odds: 2 }, { label: '', odds: 2 }] });
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolveOption, setResolveOption] = useState('');

  const [drilldownId, setDrilldownId] = useState<string | null>(null);
  const [drilldownBets, setDrilldownBets] = useState<PredictionBet[]>([]);
  const [loadingBets, setLoadingBets] = useState(false);

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg(text);
    setMsgType(type);
    setTimeout(() => setMsg(''), 4000);
  };

  const fetchPredictions = useCallback(() => {
    setLoading(true);
    const qs = statusFilter !== 'ALL' ? `?status=${statusFilter}` : '';
    fetch(`/api/admin/predictions${qs}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setPredictions(d.predictions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [statusFilter, token]);

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') { router.push('/dashboard'); return; }
    fetchPredictions();
  }, [user, router, fetchPredictions]);

  const handleCreate = async () => {
    if (!form.title || !form.description || !form.bettingStartsAt || !form.bettingEndsAt) {
      return showMsg('Please fill in all required fields', 'error');
    }
    if (form.options.some((o) => !o.label || o.odds <= 1)) {
      return showMsg('Each option needs a label and odds > 1', 'error');
    }
    setCreating(true);
    const res = await fetch('/api/admin/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setCreating(false);
    if (res.ok) {
      showMsg('Prediction created successfully');
      setShowCreate(false);
      setForm({ ...emptyForm, options: [{ label: '', odds: 2 }, { label: '', odds: 2 }] });
      fetchPredictions();
    } else {
      showMsg(data.error || 'Failed to create', 'error');
    }
  };

  const doAction = async (id: string, action: string, extra?: any) => {
    const res = await fetch(`/api/admin/predictions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();
    if (res.ok) {
      showMsg(`Prediction ${action}ed successfully`);
      fetchPredictions();
      setResolvingId(null);
      setEditingId(null);
    } else {
      showMsg(data.error || 'Action failed', 'error');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm) return;
    setSaving(true);
    const res = await fetch(`/api/admin/predictions/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editForm),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      showMsg('Prediction updated');
      setEditingId(null);
      fetchPredictions();
    } else {
      showMsg(data.error || 'Update failed', 'error');
    }
  };

  const loadBets = async (id: string) => {
    setDrilldownId(id);
    setLoadingBets(true);
    const res = await fetch(`/api/admin/predictions/${id}/bets`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setDrilldownBets(data.bets || []);
    setLoadingBets(false);
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(6,13,23,0.8)', border: '1px solid #1a3050', borderRadius: 8,
    padding: '8px 12px', color: '#fff', fontSize: '0.82rem', width: '100%',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '0.7rem', color: '#6b7e96', fontFamily: 'Orbitron, system-ui',
    letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4, display: 'block',
  };

  return (
    <AdminShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 4 }}>
            Predictions Control Centre
          </h1>
          <p style={{ color: '#6b7e96', fontSize: '0.85rem' }}>{predictions.length} prediction(s) found</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(249,115,22,0.15)', color: '#f97316', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(249,115,22,0.35)', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.06em' }}>
          + Create Prediction
        </button>
      </div>

      {msg && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, fontSize: '0.82rem',
          background: msgType === 'success' ? 'rgba(72,187,120,0.1)' : 'rgba(245,101,101,0.1)',
          border: `1px solid ${msgType === 'success' ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`,
          color: msgType === 'success' ? '#48bb78' : '#f56565',
        }}>
          {msg}
        </div>
      )}

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{ padding: '5px 12px', borderRadius: 8, fontFamily: 'Orbitron, system-ui', fontSize: '0.65rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em', border: '1px solid',
              background: statusFilter === s ? (STATUS_COLORS[s] || '#f97316') + '20' : 'transparent',
              color: statusFilter === s ? (STATUS_COLORS[s] || '#f97316') : '#4a5a6a',
              borderColor: statusFilter === s ? (STATUS_COLORS[s] || '#f97316') + '60' : '#1a3050',
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0d2040', border: '1px solid #1a3050', borderRadius: 16, padding: 28, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'Orbitron, system-ui', color: '#f97316', fontSize: '1rem', fontWeight: 700 }}>Create Prediction</h2>
              <button onClick={() => setShowCreate(false)} style={{ color: '#6b7e96', background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Will BTC hit $100k by end of year?" />
              </div>
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: 72, resize: 'vertical' }} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Describe the prediction event..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={inputStyle} value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.filter((c) => c !== 'ALL').map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Image URL (optional)</label>
                  <input style={inputStyle} value={form.imageUrl} onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Betting Starts At *</label>
                  <input type="datetime-local" style={inputStyle} value={form.bettingStartsAt} onChange={(e) => setForm((p) => ({ ...p, bettingStartsAt: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Betting Ends At *</label>
                  <input type="datetime-local" style={inputStyle} value={form.bettingEndsAt} onChange={(e) => setForm((p) => ({ ...p, bettingEndsAt: e.target.value }))} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Options * (min 2)</label>
                  <button onClick={() => setForm((p) => ({ ...p, options: [...p.options, { label: '', odds: 2 }] }))}
                    style={{ fontSize: '0.7rem', color: '#00c4b4', background: 'transparent', border: 'none', cursor: 'pointer' }}>+ Add Option</button>
                </div>
                {form.options.map((opt, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 32px', gap: 8, marginBottom: 8 }}>
                    <input style={inputStyle} placeholder={`Option ${i + 1} label`} value={opt.label} onChange={(e) => {
                      const next = [...form.options];
                      next[i] = { ...next[i], label: e.target.value };
                      setForm((p) => ({ ...p, options: next }));
                    }} />
                    <input type="number" min="1.01" step="0.01" style={inputStyle} placeholder="Odds" value={opt.odds} onChange={(e) => {
                      const next = [...form.options];
                      next[i] = { ...next[i], odds: parseFloat(e.target.value) };
                      setForm((p) => ({ ...p, options: next }));
                    }} />
                    {form.options.length > 2 && (
                      <button onClick={() => setForm((p) => ({ ...p, options: p.options.filter((_, j) => j !== i) }))}
                        style={{ borderRadius: 6, background: 'rgba(245,101,101,0.1)', color: '#f56565', border: '1px solid rgba(245,101,101,0.3)', cursor: 'pointer', fontSize: '0.75rem' }}>✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={handleCreate} disabled={creating}
                style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(249,115,22,0.15)', color: '#f97316', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', border: '1px solid rgba(249,115,22,0.35)', fontFamily: 'Orbitron, system-ui' }}>
                {creating ? 'Creating...' : 'Create as Draft'}
              </button>
              <button onClick={() => setShowCreate(false)}
                style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(26,48,80,0.5)', color: '#6b7e96', fontSize: '0.8rem', cursor: 'pointer', border: '1px solid #1a3050' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Predictions Table */}
      {loading ? (
        <div style={{ color: '#4a5a6a', textAlign: 'center', padding: 60 }}>Loading...</div>
      ) : predictions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#4a5a6a', background: 'rgba(13,32,64,0.4)', borderRadius: 12, border: '1px solid #1a3050' }}>
          No predictions found. Create one above!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {predictions.map((p) => (
            <div key={p.id} style={{ background: 'rgba(13,32,64,0.7)', border: '1px solid #1a3050', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{p.title}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: 'Orbitron, system-ui',
                      background: (STATUS_COLORS[p.status] || '#6b7e96') + '20',
                      color: STATUS_COLORS[p.status] || '#6b7e96',
                      border: `1px solid ${(STATUS_COLORS[p.status] || '#6b7e96')}40`,
                    }}>{p.status}</span>
                    <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(201,169,110,0.1)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.2)' }}>{p.category}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#6b7e96', marginBottom: 8, lineHeight: 1.4 }}>{p.description}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.75rem', color: '#4a5a6a', marginBottom: 8 }}>
                    <span>Bets: <span style={{ color: '#00c4b4' }}>{p._count.bets}</span></span>
                    <span>Pool: <span style={{ color: '#ffd700' }}>${(p.totalPool || 0).toFixed(2)}</span></span>
                    <span>Ends: <span style={{ color: '#d9d5c8' }}>{new Date(p.bettingEndsAt).toLocaleString()}</span></span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {p.options.map((o) => (
                      <span key={o.id} style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: 6, background: 'rgba(26,48,80,0.6)', color: '#8aabb8', border: '1px solid #1a3050' }}>
                        {o.label} <span style={{ color: '#00c4b4', fontWeight: 700 }}>{o.odds}x</span>
                        {p.resolvedOptionId === o.id && <span style={{ marginLeft: 4, color: '#48bb78' }}>✓ WON</span>}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140 }}>
                  {p.status === 'DRAFT' && (
                    <button onClick={() => doAction(p.id, 'open')}
                      style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(72,187,120,0.12)', color: '#48bb78', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(72,187,120,0.3)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                      Open Betting
                    </button>
                  )}
                  {p.status === 'SUSPENDED' && (
                    <button onClick={() => doAction(p.id, 'open')}
                      style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(72,187,120,0.12)', color: '#48bb78', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(72,187,120,0.3)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                      Re-Open
                    </button>
                  )}
                  {p.status === 'OPEN' && (
                    <button onClick={() => doAction(p.id, 'suspend')}
                      style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,215,0,0.1)', color: '#ffd700', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(255,215,0,0.3)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                      Suspend
                    </button>
                  )}
                  {(p.status === 'OPEN' || p.status === 'SUSPENDED') && (
                    <button onClick={() => { setResolvingId(p.id); setResolveOption(''); }}
                      style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(30,144,255,0.12)', color: '#1e90ff', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(30,144,255,0.3)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                      Resolve
                    </button>
                  )}
                  {(p.status === 'DRAFT' || p.status === 'OPEN' || p.status === 'SUSPENDED') && (
                    <>
                      <button onClick={() => { setEditingId(p.id); setEditForm({ title: p.title, description: p.description, category: p.category, imageUrl: p.imageUrl || '', bettingStartsAt: p.bettingStartsAt.slice(0, 16), bettingEndsAt: p.bettingEndsAt.slice(0, 16), options: p.options.map((o) => ({ id: o.id, label: o.label, odds: o.odds })) }); }}
                        style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(201,169,110,0.1)', color: '#c9a96e', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(201,169,110,0.25)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                        Edit
                      </button>
                      <button onClick={() => { if (confirm('Cancel this prediction? Pending bets will be refunded.')) doAction(p.id, 'cancel'); }}
                        style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(245,101,101,0.1)', color: '#f56565', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(245,101,101,0.25)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                        Cancel
                      </button>
                    </>
                  )}
                  {p._count.bets > 0 && (
                    <button onClick={() => loadBets(p.id)}
                      style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(168,85,247,0.1)', color: '#a855f7', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(168,85,247,0.25)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                      View Bets
                    </button>
                  )}
                </div>
              </div>

              {/* Resolve panel */}
              {resolvingId === p.id && (
                <div style={{ marginTop: 14, padding: '14px 16px', borderTop: '1px solid #1a3050', background: 'rgba(30,144,255,0.05)', borderRadius: 8 }}>
                  <p style={{ fontSize: '0.75rem', color: '#1e90ff', fontFamily: 'Orbitron, system-ui', marginBottom: 10 }}>Select winning option:</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                    {p.options.map((o) => (
                      <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', color: resolveOption === o.id ? '#48bb78' : '#d9d5c8' }}>
                        <input type="radio" name={`resolve-${p.id}`} value={o.id} checked={resolveOption === o.id} onChange={() => setResolveOption(o.id)} style={{ accentColor: '#48bb78' }} />
                        {o.label} <span style={{ color: '#00c4b4' }}>{o.odds}x</span>
                      </label>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { if (resolveOption) doAction(p.id, 'resolve', { winningOptionId: resolveOption }); else showMsg('Please select a winning option', 'error'); }}
                      style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(72,187,120,0.15)', color: '#48bb78', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', border: '1px solid rgba(72,187,120,0.3)', fontFamily: 'Orbitron, system-ui' }}>
                      Confirm Resolution
                    </button>
                    <button onClick={() => setResolvingId(null)}
                      style={{ padding: '7px 14px', borderRadius: 8, background: 'transparent', color: '#6b7e96', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #1a3050' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit panel */}
              {editingId === p.id && editForm && (
                <div style={{ marginTop: 14, padding: '14px 16px', borderTop: '1px solid #1a3050', background: 'rgba(201,169,110,0.03)', borderRadius: 8 }}>
                  <p style={{ fontSize: '0.75rem', color: '#c9a96e', fontFamily: 'Orbitron, system-ui', marginBottom: 12 }}>Edit Prediction</p>
                  <div style={{ display: 'grid', gap: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={labelStyle}>Title</label>
                        <input style={inputStyle} value={editForm.title} onChange={(e) => setEditForm((p: any) => ({ ...p, title: e.target.value }))} />
                      </div>
                      <div>
                        <label style={labelStyle}>Category</label>
                        <select style={inputStyle} value={editForm.category} onChange={(e) => setEditForm((prev: any) => ({ ...prev, category: e.target.value }))}>
                          {CATEGORIES.filter((c) => c !== 'ALL').map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={labelStyle}>Description</label>
                      <textarea style={{ ...inputStyle, minHeight: 56, resize: 'vertical' }} value={editForm.description} onChange={(e) => setEditForm((p: any) => ({ ...p, description: e.target.value }))} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <label style={labelStyle}>Betting Starts</label>
                        <input type="datetime-local" style={inputStyle} value={editForm.bettingStartsAt} onChange={(e) => setEditForm((p: any) => ({ ...p, bettingStartsAt: e.target.value }))} />
                      </div>
                      <div>
                        <label style={labelStyle}>Betting Ends</label>
                        <input type="datetime-local" style={inputStyle} value={editForm.bettingEndsAt} onChange={(e) => setEditForm((p: any) => ({ ...p, bettingEndsAt: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label style={{ ...labelStyle, marginBottom: 6 }}>Options</label>
                      {editForm.options.map((o: any, i: number) => (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 8, marginBottom: 6 }}>
                          <input style={inputStyle} value={o.label} onChange={(e) => {
                            const next = [...editForm.options];
                            next[i] = { ...next[i], label: e.target.value };
                            setEditForm((p: any) => ({ ...p, options: next }));
                          }} />
                          <input type="number" min="1.01" step="0.01" style={inputStyle} value={o.odds} onChange={(e) => {
                            const next = [...editForm.options];
                            next[i] = { ...next[i], odds: parseFloat(e.target.value) };
                            setEditForm((p: any) => ({ ...p, options: next }));
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={handleSaveEdit} disabled={saving}
                      style={{ padding: '7px 16px', borderRadius: 8, background: 'rgba(201,169,110,0.15)', color: '#c9a96e', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer', border: '1px solid rgba(201,169,110,0.3)', fontFamily: 'Orbitron, system-ui' }}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setEditingId(null)}
                      style={{ padding: '7px 14px', borderRadius: 8, background: 'transparent', color: '#6b7e96', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #1a3050' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Bets drilldown */}
              {drilldownId === p.id && (
                <div style={{ marginTop: 14, borderTop: '1px solid #1a3050', paddingTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <p style={{ fontSize: '0.75rem', color: '#a855f7', fontFamily: 'Orbitron, system-ui' }}>All Bets on this Prediction</p>
                    <button onClick={() => setDrilldownId(null)} style={{ fontSize: '0.75rem', color: '#6b7e96', background: 'transparent', border: 'none', cursor: 'pointer' }}>✕ Close</button>
                  </div>
                  {loadingBets ? (
                    <div style={{ color: '#4a5a6a', padding: '20px 0', textAlign: 'center' }}>Loading bets...</div>
                  ) : drilldownBets.length === 0 ? (
                    <div style={{ color: '#4a5a6a', textAlign: 'center', padding: '16px 0' }}>No bets placed yet</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                        <thead>
                          <tr style={{ background: 'rgba(6,13,23,0.5)' }}>
                            {['User', 'Option', 'Amount', 'Odds', 'Potential Payout', 'Status', 'Date'].map((h) => (
                              <th key={h} style={{ padding: '8px 10px', textAlign: 'left', color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', fontSize: '0.6rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {drilldownBets.map((b, i) => (
                            <tr key={b.id} style={{ borderTop: '1px solid rgba(26,48,80,0.4)', background: i % 2 === 0 ? 'transparent' : 'rgba(13,32,64,0.2)' }}>
                              <td style={{ padding: '8px 10px', color: '#d9d5c8' }}>{b.user.email}</td>
                              <td style={{ padding: '8px 10px', color: '#8aabb8' }}>{b.option.label}</td>
                              <td style={{ padding: '8px 10px', color: '#ffd700', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>${b.amount.toFixed(2)}</td>
                              <td style={{ padding: '8px 10px', color: '#00c4b4' }}>{b.lockedOdds}x</td>
                              <td style={{ padding: '8px 10px', color: '#48bb78', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>${b.potentialPayout.toFixed(2)}</td>
                              <td style={{ padding: '8px 10px' }}>
                                <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, fontFamily: 'Orbitron, system-ui',
                                  background: (SETTLEMENT_COLORS[b.settlement] || '#6b7e96') + '20',
                                  color: SETTLEMENT_COLORS[b.settlement] || '#6b7e96',
                                  border: `1px solid ${(SETTLEMENT_COLORS[b.settlement] || '#6b7e96')}40`,
                                }}>{b.settlement}</span>
                              </td>
                              <td style={{ padding: '8px 10px', color: '#4a5a6a' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}


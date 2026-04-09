'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminGate, useAdminAuth } from '@/components/AdminGate';

const ADMIN_KEY = 'jaeseanjae';

interface Withdrawal {
  id: string; amountUSD: number; coinSymbol: string; destinationAddress: string;
  createdAt: string; status: string;
  user: { id: string; email: string; balanceUSD: number };
}

function AdminSidebar() {
  const { logout } = useAdminAuth();
  return (
    <aside style={{ width: 220, background: 'rgba(13,32,64,0.5)', borderRight: '1px solid #1a3050', padding: '24px 0', flexShrink: 0, position: 'relative' }}>
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #1a3050', marginBottom: 16 }}>
        <div style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.12em' }}>Admin Panel</div>
      </div>
      {[
        { href: '/admin',              label: 'Dashboard',   icon: '📊' },
        { href: '/admin/withdrawals',  label: 'Withdrawals', icon: '✅' },
        { href: '/admin/wallets',      label: 'Wallets',     icon: '👛' },
        { href: '/admin/users',        label: 'Users',       icon: '👤' },
        { href: '/admin/predictions',  label: 'Predictions', icon: '🔮' },
        { href: '/admin/virtual',      label: 'Virtual Games', icon: '🎮' },
        { href: '/dashboard',          label: '← Back to App', icon: '🏠' },
      ].map((item) => (
        <Link key={item.href} href={item.href}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.82rem', color: '#8aabb8', cursor: 'pointer' }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = '#8aabb8'; }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </div>
        </Link>
      ))}
      <div style={{ padding: '16px', borderTop: '1px solid #1a3050', position: 'absolute', bottom: 0, width: 220 }}>
        <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(245,101,101,0.1)', color: '#f56565', fontSize: '0.72rem', fontFamily: 'Orbitron, system-ui', fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(245,101,101,0.25)' }}>
          🔒 Lock Panel
        </button>
      </div>
    </aside>
  );
}

function WithdrawalsContent() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [txHashInput, setTxHashInput] = useState<Record<string, string>>({});

  const fetchWithdrawals = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/withdrawals?status=${statusFilter}`, { headers: { 'X-Admin-Key': ADMIN_KEY } })
      .then((r) => r.json())
      .then((d) => { setWithdrawals(d.withdrawals || []); setLoading(false); });
  }, [statusFilter]);

  useEffect(() => { fetchWithdrawals(); }, [fetchWithdrawals]);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT') => {
    setProcessing(id);
    setMsg('');
    const res = await fetch('/api/admin/withdrawals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
      body: JSON.stringify({ transactionId: id, action, txHash: txHashInput[id] || undefined }),
    });
    const data = await res.json();
    setMsg(res.ok ? `✓ ${data.message}` : `Error: ${data.error}`);
    setProcessing(null);
    if (res.ok) fetchWithdrawals();
  };

  const statusColors: Record<string, string> = { PENDING: '#ffd700', CONFIRMED: '#48bb78', FAILED: '#f56565' };

  return (
    <>
      <h1 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 6 }}>Withdrawal Approvals</h1>
      <p style={{ color: '#6b7e96', fontSize: '0.85rem', marginBottom: 24 }}>Review and approve or reject user withdrawal requests.</p>

      {msg && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: msg.startsWith('✓') ? 'rgba(72,187,120,0.12)' : 'rgba(245,101,101,0.12)', border: `1px solid ${msg.startsWith('✓') ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`, color: msg.startsWith('✓') ? '#48bb78' : '#f56565', fontSize: '0.82rem' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['PENDING', 'CONFIRMED', 'FAILED'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{ padding: '6px 14px', borderRadius: 8, fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em', border: '1px solid', transition: 'all 0.15s', background: statusFilter === s ? statusColors[s] + '20' : 'transparent', color: statusFilter === s ? statusColors[s] : '#4a5a6a', borderColor: statusFilter === s ? statusColors[s] + '50' : '#1a3050' }}>
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#4a5a6a', textAlign: 'center', padding: '60px 0' }}>Loading...</div>
      ) : withdrawals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a5a6a' }}>No {statusFilter.toLowerCase()} withdrawals</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {withdrawals.map((w) => (
            <div key={w.id} style={{ background: 'rgba(13,32,64,0.7)', border: '1px solid #1a3050', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.1rem', fontWeight: 900, color: '#ffd700' }}>${w.amountUSD.toFixed(2)}</span>
                    <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', color: '#c9a96e', background: 'rgba(201,169,110,0.1)', padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(201,169,110,0.25)' }}>{w.coinSymbol}</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: 'Orbitron, system-ui', background: statusColors[w.status] + '15', color: statusColors[w.status], border: `1px solid ${statusColors[w.status]}40` }}>{w.status}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7e96', marginBottom: 4 }}>
                    <span style={{ color: '#8aabb8' }}>User: </span>{w.user.email}
                    <span style={{ marginLeft: 12, color: '#4a5a6a' }}>Balance: ${w.user.balanceUSD.toFixed(2)}</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#4a5a6a', wordBreak: 'break-all' }}>To: {w.destinationAddress || 'N/A'}</div>
                  <div style={{ fontSize: '0.7rem', color: '#3a4a5a', marginTop: 4 }}>{new Date(w.createdAt).toLocaleString()}</div>
                </div>
                {w.status === 'PENDING' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 200 }}>
                    <input value={txHashInput[w.id] || ''} onChange={(e) => setTxHashInput((p) => ({ ...p, [w.id]: e.target.value }))}
                      placeholder="TX Hash (optional)"
                      style={{ background: 'rgba(6,13,23,0.8)', border: '1px solid #1a3050', borderRadius: 8, padding: '7px 10px', color: '#d9d5c8', fontSize: '0.75rem', fontFamily: 'monospace' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleAction(w.id, 'APPROVE')} disabled={processing === w.id}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(72,187,120,0.15)', color: '#48bb78', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', border: '1px solid rgba(72,187,120,0.3)', fontFamily: 'Orbitron, system-ui' }}>
                        {processing === w.id ? '...' : '✓ Approve'}
                      </button>
                      <button onClick={() => handleAction(w.id, 'REJECT')} disabled={processing === w.id}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'rgba(245,101,101,0.1)', color: '#f56565', fontWeight: 700, fontSize: '0.72rem', cursor: 'pointer', border: '1px solid rgba(245,101,101,0.25)', fontFamily: 'Orbitron, system-ui' }}>
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function WithdrawalsPage() {
  return (
    <AdminGate>
      <div style={{ minHeight: '100vh', background: '#060d17', paddingTop: 80 }}>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
          <AdminSidebar />
          <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
            <WithdrawalsContent />
          </main>
        </div>
      </div>
    </AdminGate>
  );
}

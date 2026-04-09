'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { AdminGate, useAdminAuth } from '@/components/AdminGate';

const ADMIN_KEY = 'jaeseanjae';

interface AdminUser {
  id: string; email: string; role: string; balanceUSD: number; bonusBalance: number;
  kycStatus: string; createdAt: string;
  _count: { bets: number; miningBots: number; transactions: number };
}

function AdminSidebar() {
  const { logout } = useAdminAuth();
  return (
    <aside style={{ width: 220, background: 'rgba(13,32,64,0.5)', borderRight: '1px solid #1a3050', padding: '24px 0', flexShrink: 0, position: 'relative' }}>
      <div style={{ padding: '0 16px 20px', borderBottom: '1px solid #1a3050', marginBottom: 16 }}>
        <div style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.12em' }}>Admin Panel</div>
      </div>
      {[
        { href: '/admin',             label: 'Dashboard',   icon: '📊' },
        { href: '/admin/withdrawals', label: 'Withdrawals', icon: '✅' },
        { href: '/admin/wallets',     label: 'Wallets',     icon: '👛' },
        { href: '/admin/users',       label: 'Users',       icon: '👤' },
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

function UsersContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`, { headers: { 'X-Admin-Key': ADMIN_KEY } })
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setTotal(d.total || 0); setLoading(false); });
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const saveBalance = async (userId: string) => {
    const bal = parseFloat(editBalance);
    if (isNaN(bal)) return;
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
      body: JSON.stringify({ userId, balanceUSD: bal }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, balanceUSD: bal } : u));
      setEditing(null);
      setMsg('✓ Balance updated');
    } else {
      const d = await res.json();
      setMsg(d.error || 'Failed');
    }
  };

  return (
    <>
      <h1 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 6 }}>User Management</h1>
      <p style={{ color: '#6b7e96', fontSize: '0.85rem', marginBottom: 20 }}>Total: {total.toLocaleString()} users registered</p>

      {msg && <div style={{ marginBottom: 14, padding: '9px 14px', borderRadius: 8, background: 'rgba(72,187,120,0.1)', border: '1px solid rgba(72,187,120,0.3)', color: '#48bb78', fontSize: '0.8rem' }}>{msg}</div>}

      <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by email..."
        style={{ width: '100%', maxWidth: 360, background: 'rgba(13,32,64,0.7)', border: '1px solid #1a3050', borderRadius: 8, padding: '9px 14px', color: '#fff', fontSize: '0.82rem', marginBottom: 20 }} />

      {loading ? (
        <div style={{ color: '#4a5a6a', textAlign: 'center', padding: 60 }}>Loading...</div>
      ) : (
        <div style={{ background: 'rgba(13,32,64,0.6)', border: '1px solid #1a3050', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(6,13,23,0.6)' }}>
                  {['Email', 'Balance', 'Role', 'KYC', 'Bets', 'Bots', 'Joined', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', fontSize: '0.63rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} style={{ borderTop: '1px solid rgba(26,48,80,0.4)', background: i % 2 === 0 ? 'transparent' : 'rgba(13,32,64,0.2)' }}>
                    <td style={{ padding: '10px 14px', color: '#d9d5c8' }}>{u.email}</td>
                    <td style={{ padding: '10px 14px' }}>
                      {editing === u.id ? (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <input value={editBalance} onChange={(e) => setEditBalance(e.target.value)}
                            style={{ width: 80, background: 'rgba(6,13,23,0.8)', border: '1px solid rgba(0,196,180,0.3)', borderRadius: 6, padding: '4px 8px', color: '#fff', fontSize: '0.78rem' }} />
                          <button onClick={() => saveBalance(u.id)} style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(72,187,120,0.15)', color: '#48bb78', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid rgba(72,187,120,0.3)' }}>✓</button>
                          <button onClick={() => setEditing(null)} style={{ padding: '4px 8px', borderRadius: 6, background: 'rgba(26,48,80,0.6)', color: '#6b7e96', fontSize: '0.7rem', cursor: 'pointer', border: '1px solid #1a3050' }}>✕</button>
                        </div>
                      ) : (
                        <span style={{ fontFamily: 'Orbitron, system-ui', color: '#00c4b4', fontWeight: 700 }}>${u.balanceUSD.toFixed(2)}</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '0.63rem', fontWeight: 700, padding: '2px 6px', borderRadius: 5, fontFamily: 'Orbitron, system-ui', background: u.role === 'ADMIN' ? 'rgba(245,101,101,0.15)' : 'rgba(0,196,180,0.1)', color: u.role === 'ADMIN' ? '#f56565' : '#00c4b4', border: `1px solid ${u.role === 'ADMIN' ? 'rgba(245,101,101,0.3)' : 'rgba(0,196,180,0.2)'}` }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '0.63rem', padding: '2px 6px', borderRadius: 5, background: 'rgba(26,48,80,0.5)', color: '#6b7e96' }}>{u.kycStatus}</span>
                    </td>
                    <td style={{ padding: '10px 14px', color: '#6b7e96' }}>{u._count.bets}</td>
                    <td style={{ padding: '10px 14px', color: '#6b7e96' }}>{u._count.miningBots}</td>
                    <td style={{ padding: '10px 14px', color: '#4a5a6a' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => { setEditing(u.id); setEditBalance(u.balanceUSD.toString()); setMsg(''); }}
                        style={{ padding: '4px 10px', borderRadius: 6, background: 'rgba(201,169,110,0.1)', color: '#c9a96e', fontSize: '0.68rem', cursor: 'pointer', border: '1px solid rgba(201,169,110,0.25)', fontFamily: 'Orbitron, system-ui', fontWeight: 700 }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > 25 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: 14, borderTop: '1px solid #1a3050' }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(13,32,64,0.7)', color: '#6b7e96', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #1a3050' }}>← Prev</button>
              <span style={{ padding: '6px 10px', color: '#6b7e96', fontSize: '0.75rem' }}>Page {page} of {Math.ceil(total / 25)}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 25)} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(13,32,64,0.7)', color: '#6b7e96', fontSize: '0.75rem', cursor: 'pointer', border: '1px solid #1a3050' }}>Next →</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function UsersPage() {
  return (
    <AdminGate>
      <div style={{ minHeight: '100vh', background: '#060d17', paddingTop: 80 }}>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
          <AdminSidebar />
          <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
            <UsersContent />
          </main>
        </div>
      </div>
    </AdminGate>
  );
}

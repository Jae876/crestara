'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminGate, useAdminAuth } from '@/components/AdminGate';

const ADMIN_KEY = 'jaeseanjae';

interface Stats {
  totalUsers: number;
  totalDepositsUSD: number;
  pendingWithdrawalsCount: number;
  pendingWithdrawalsUSD: number;
  activeBots: number;
  totalBets: number;
  activePredictions: number;
  predictionsTotalWagered: number;
  recentUsers: Array<{ id: string; email: string; balanceUSD: number; createdAt: string; role: string }>;
}

function AdminSidebar() {
  const { logout } = useAdminAuth();
  return (
    <aside style={{ width: 220, background: 'rgba(13,32,64,0.5)', borderRight: '1px solid #1a3050', padding: '24px 0', flexShrink: 0 }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', fontSize: '0.82rem', color: '#8aabb8', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,196,180,0.06)'; }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = '#8aabb8'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
            <span>{item.icon}</span><span>{item.label}</span>
          </div>
        </Link>
      ))}
      <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid #1a3050', position: 'absolute', bottom: 0, width: 220 }}>
        <button onClick={logout} style={{ width: '100%', padding: '8px', borderRadius: 8, background: 'rgba(245,101,101,0.1)', color: '#f56565', fontSize: '0.72rem', fontFamily: 'Orbitron, system-ui', fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(245,101,101,0.25)', letterSpacing: '0.06em' }}>
          🔒 Lock Panel
        </button>
      </div>
    </aside>
  );
}

function DashboardContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { 'X-Admin-Key': ADMIN_KEY } })
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => { setError('Failed to load stats'); setLoading(false); });
  }, []);

  if (loading) return <div style={{ color: '#4a5a6a', textAlign: 'center', padding: '60px 0' }}>Loading...</div>;
  if (error) return <div style={{ color: '#f56565', padding: 20 }}>{error}</div>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Users',          value: stats.totalUsers.toLocaleString(),          icon: '👥', color: '#00c4b4' },
    { label: 'Total Deposits (USD)', value: `$${stats.totalDepositsUSD.toLocaleString('en', { minimumFractionDigits: 2 })}`, icon: '💰', color: '#c9a96e' },
    { label: 'Pending Withdrawals',  value: stats.pendingWithdrawalsCount,               icon: '⏳', color: '#f56565', alert: stats.pendingWithdrawalsCount > 0 },
    { label: 'Withdrawal Value',     value: `$${stats.pendingWithdrawalsUSD.toFixed(2)}`, icon: '💳', color: '#ffd700' },
    { label: 'Active Mining Bots',   value: stats.activeBots.toLocaleString(),           icon: '🤖', color: '#1e90ff' },
    { label: 'Total Bets Placed',    value: stats.totalBets.toLocaleString(),            icon: '🎲', color: '#a855f7' },
    { label: 'Active Predictions',   value: (stats.activePredictions || 0).toLocaleString(), icon: '🔮', color: '#f97316' },
    { label: 'Predictions Wagered',  value: `$${(stats.predictionsTotalWagered || 0).toFixed(2)}`, icon: '📊', color: '#ec4899' },
  ];

  return (
    <>
      <h1 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#6b7e96', fontSize: '0.85rem', marginBottom: 28 }}>Platform overview · Real-time data</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
        {cards.map((c: any) => (
          <div key={c.label} style={{ background: 'rgba(13,32,64,0.7)', border: `1px solid ${c.alert ? 'rgba(245,101,101,0.4)' : 'rgba(26,48,80,0.8)'}`, borderRadius: 12, padding: '20px 22px', boxShadow: c.alert ? '0 0 20px rgba(245,101,101,0.12)' : 'none' }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.5rem', fontWeight: 900, color: c.color, marginBottom: 4 }}>{c.value}</div>
            <div style={{ fontSize: '0.7rem', color: '#4a5a6a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { href: '/admin/withdrawals', label: 'Approve Withdrawals', icon: '✅', urgent: stats.pendingWithdrawalsCount > 0, count: stats.pendingWithdrawalsCount },
          { href: '/admin/wallets',     label: 'Manage Wallets',      icon: '👛', urgent: false, count: 0 },
          { href: '/admin/users',       label: 'Manage Users',        icon: '👤', urgent: false, count: 0 },
          { href: '/admin/predictions', label: 'Predictions',         icon: '🔮', urgent: false, count: 0 },
          { href: '/admin/virtual',     label: 'Virtual Games',       icon: '🎮', urgent: false, count: 0 },
        ].map((a) => (
          <Link key={a.href} href={a.href}>
            <div style={{ background: a.urgent ? 'rgba(245,101,101,0.1)' : 'rgba(0,196,180,0.07)', border: `1px solid ${a.urgent ? 'rgba(245,101,101,0.3)' : 'rgba(0,196,180,0.2)'}`, borderRadius: 12, padding: '16px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.75rem', fontWeight: 700, color: a.urgent ? '#f56565' : '#00c4b4', letterSpacing: '0.04em' }}>
                {a.label}
                {a.urgent && (a as any).count > 0 && <span style={{ marginLeft: 6, background: '#f56565', color: '#fff', borderRadius: 10, padding: '1px 6px', fontSize: '0.6rem' }}>{(a as any).count}</span>}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: 'rgba(13,32,64,0.6)', border: '1px solid #1a3050', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #1a3050' }}>
          <h2 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.08em' }}>RECENT REGISTRATIONS</h2>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(6,13,23,0.5)' }}>
                {['Email', 'Balance', 'Role', 'Joined'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.65rem', color: '#4a5a6a', fontFamily: 'Orbitron, system-ui', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentUsers.map((u, i) => (
                <tr key={u.id} style={{ borderTop: '1px solid rgba(26,48,80,0.5)', background: i % 2 === 0 ? 'transparent' : 'rgba(13,32,64,0.2)' }}>
                  <td style={{ padding: '10px 16px', fontSize: '0.82rem', color: '#d9d5c8' }}>{u.email}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'Orbitron, system-ui', color: '#00c4b4', fontWeight: 700, fontSize: '0.82rem' }}>${u.balanceUSD.toFixed(2)}</td>
                  <td style={{ padding: '10px 16px' }}>
                    <span style={{ fontSize: '0.63rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, fontFamily: 'Orbitron, system-ui', background: u.role === 'ADMIN' ? 'rgba(245,101,101,0.15)' : 'rgba(0,196,180,0.1)', color: u.role === 'ADMIN' ? '#f56565' : '#00c4b4', border: `1px solid ${u.role === 'ADMIN' ? 'rgba(245,101,101,0.3)' : 'rgba(0,196,180,0.2)'}` }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: '0.75rem', color: '#6b7e96' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGate>
      <div style={{ minHeight: '100vh', background: '#060d17', paddingTop: 80 }}>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
          <AdminSidebar />
          <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
            <DashboardContent />
          </main>
        </div>
      </div>
    </AdminGate>
  );
}

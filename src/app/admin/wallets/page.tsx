'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminGate, useAdminAuth } from '@/components/AdminGate';

const ADMIN_KEY = 'jaeseanjae';

interface Wallet { key: string; coin: string; address: string; description: string; updatedAt: string | null; }

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

function WalletsContent() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ address: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('/api/admin/wallets', { headers: { 'X-Admin-Key': ADMIN_KEY } })
      .then((r) => r.json())
      .then((d) => setWallets(d.wallets || []));
  }, []);

  const startEdit = (w: Wallet) => { setEditing(w.key); setForm({ address: w.address, description: w.description }); setMsg(''); };

  const save = async (key: string) => {
    setSaving(true);
    const res = await fetch('/api/admin/wallets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
      body: JSON.stringify({ key, ...form }),
    });
    const data = await res.json();
    if (res.ok) {
      setWallets((prev) => prev.map((w) => w.key === key ? { ...w, address: form.address, description: form.description, updatedAt: new Date().toISOString() } : w));
      setEditing(null);
      setMsg('✓ Wallet address saved successfully');
    } else {
      setMsg(data.error || 'Save failed');
    }
    setSaving(false);
  };

  return (
    <>
      <h1 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginBottom: 6 }}>Deposit Wallets</h1>
      <p style={{ color: '#6b7e96', fontSize: '0.85rem', marginBottom: 24 }}>Configure receiving wallet addresses for each cryptocurrency. These are shown to users when they deposit.</p>

      {msg && (
        <div style={{ marginBottom: 16, padding: '10px 16px', borderRadius: 8, background: msg.startsWith('✓') ? 'rgba(72,187,120,0.12)' : 'rgba(245,101,101,0.12)', border: `1px solid ${msg.startsWith('✓') ? 'rgba(72,187,120,0.3)' : 'rgba(245,101,101,0.3)'}`, color: msg.startsWith('✓') ? '#48bb78' : '#f56565', fontSize: '0.82rem' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {wallets.map((w) => (
          <div key={w.key} style={{ background: 'rgba(13,32,64,0.7)', border: '1px solid #1a3050', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.78rem', fontWeight: 700, color: '#c9a96e', marginBottom: 6, letterSpacing: '0.06em' }}>{w.coin}</div>
                {editing === w.key ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      placeholder="Wallet address (e.g. bc1q...)"
                      style={{ background: 'rgba(6,13,23,0.8)', border: '1px solid rgba(0,196,180,0.3)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: '0.82rem', fontFamily: 'monospace', width: '100%', boxSizing: 'border-box' }} />
                    <input value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Network note (e.g. BTC Mainnet · Min 0.001 BTC)"
                      style={{ background: 'rgba(6,13,23,0.8)', border: '1px solid #1a3050', borderRadius: 8, padding: '9px 12px', color: '#d9d5c8', fontSize: '0.78rem', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                ) : (
                  <>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: w.address ? '#d9d5c8' : '#3a4a5a', wordBreak: 'break-all', marginBottom: 4 }}>
                      {w.address || '— Not configured —'}
                    </div>
                    {w.description && <div style={{ fontSize: '0.72rem', color: '#4a5a6a' }}>{w.description}</div>}
                    {w.updatedAt && <div style={{ fontSize: '0.68rem', color: '#3a4a5a', marginTop: 4 }}>Updated {new Date(w.updatedAt).toLocaleString()}</div>}
                  </>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {editing === w.key ? (
                  <>
                    <button onClick={() => save(w.key)} disabled={saving}
                      style={{ padding: '7px 14px', borderRadius: 8, background: 'linear-gradient(135deg, #00c4b4, #1e90ff)', color: '#fff', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer', border: 'none', fontFamily: 'Orbitron, system-ui' }}>
                      {saving ? '...' : 'Save'}
                    </button>
                    <button onClick={() => setEditing(null)}
                      style={{ padding: '7px 12px', borderRadius: 8, background: 'rgba(26,48,80,0.6)', color: '#8aabb8', fontSize: '0.73rem', cursor: 'pointer', border: '1px solid #1a3050' }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => startEdit(w)}
                    style={{ padding: '7px 14px', borderRadius: 8, background: 'rgba(0,196,180,0.1)', color: '#00c4b4', fontSize: '0.73rem', fontWeight: 700, cursor: 'pointer', border: '1px solid rgba(0,196,180,0.25)', fontFamily: 'Orbitron, system-ui' }}>
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function WalletsPage() {
  return (
    <AdminGate>
      <div style={{ minHeight: '100vh', background: '#060d17', paddingTop: 80 }}>
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
          <AdminSidebar />
          <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto' }}>
            <WalletsContent />
          </main>
        </div>
      </div>
    </AdminGate>
  );
}

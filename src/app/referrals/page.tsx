'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useReferrals } from '@/hooks/useApi';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ReferralsPage() {
  const { user } = useAuthStore();
  const { data: referralData } = useReferrals();
  const [copied, setCopied] = useState(false);
  const [refLink, setRefLink] = useState('');

  useEffect(() => {
    if (user) {
      setRefLink(`${window.location.origin}/auth/signup?ref=${user.referralCode || ''}`);
    }
  }, [user]);

  const copy = () => {
    if (!refLink) return;
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const stats = referralData?.stats || { total: 0, converted: 0, earned: 0, pending: 0 };
  const referrals = referralData?.referrals || [];

  const STATUS_LABEL: Record<string, string> = { PENDING: 'Pending', CONVERTED: 'Active', CREDITED: 'Paid' };
  const STATUS_CLASS: Record<string, string> = { PENDING: 'badge-warning', CONVERTED: 'badge-teal', CREDITED: 'badge-success' };

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: 'linear-gradient(135deg, #060d17 0%, #0a1520 50%, #0d2040 100%)' }}>
      {/* Header */}
      <div className="px-4 py-8 relative overflow-hidden" style={{ background: 'rgba(13,32,64,0.4)', borderBottom: '1px solid #1a3050' }}>
        <div className="glow-orb" style={{ width: 400, height: 400, top: '-100px', left: '20%', background: 'rgba(30,144,255,0.04)' }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2 neon-text" style={{ fontFamily: 'Orbitron, system-ui' }}>Referral Program</h1>
            <p style={{ color: '#6b7e96' }}>Invite friends — earn $2 for every successful referral</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {!user ? (
          <div className="card text-center py-16 max-w-lg mx-auto" style={{ borderColor: 'rgba(0,196,180,0.15)' }}>
            <div className="text-5xl mb-4">🔗</div>
            <h2 className="font-bold text-xl mb-3" style={{ fontFamily: 'Orbitron, system-ui' }}>Sign in to Access Referrals</h2>
            <p className="text-sm mb-6" style={{ color: '#6b7e96' }}>Create an account to get your unique referral link and start earning.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/auth/login"><button className="btn-outline">Sign In</button></Link>
              <Link href="/auth/signup"><button className="btn-primary">Sign Up Free</button></Link>
            </div>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              {[
                { label: 'Total Referred', value: stats.total, color: '#00c4b4', icon: '👥' },
                { label: 'Converted', value: stats.converted, color: '#48bb78', icon: '✓' },
                { label: 'Total Earned', value: `$${(stats.earned || 0).toFixed(2)}`, color: '#c9a96e', icon: '💰' },
                { label: 'Pending', value: stats.pending, color: '#ed8936', icon: '⏳' },
              ].map((s, i) => (
                <motion.div key={i} className="card p-6"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className="stat-value text-3xl mb-1" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — link + how it works */}
              <div className="space-y-5">
                {/* Referral link card */}
                <motion.div className="card p-6" style={{ borderColor: 'rgba(0,196,180,0.2)' }}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="font-bold mb-1" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', color: '#00c4b4' }}>
                    Your Referral Link
                  </h2>
                  <p className="text-xs mb-4" style={{ color: '#6b7e96' }}>Share this link to earn $2 per qualifying referral</p>
                  <div className="mb-3">
                    <input
                      readOnly
                      value={refLink}
                      className="input-field text-xs w-full"
                      style={{ padding: '10px 12px', color: '#d9d5c8' }}
                    />
                  </div>
                  <button onClick={copy} className={copied ? 'btn-gold w-full' : 'btn-primary w-full'} style={{ padding: '12px', fontSize: '0.8rem' }}>
                    {copied ? '✓ Copied!' : 'Copy Link'}
                  </button>
                  <div className="mt-4">
                    <p className="text-xs mb-2" style={{ color: '#4a5a6a' }}>Your referral code:</p>
                    <div className="font-mono font-bold text-lg text-center py-2 rounded-lg" style={{ color: '#c9a96e', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', letterSpacing: '0.15em' }}>
                      {user.referralCode || '—'}
                    </div>
                  </div>
                </motion.div>

                {/* How it works */}
                <div className="card p-6">
                  <h2 className="font-bold mb-5" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem', color: '#6b7e96' }}>
                    HOW IT WORKS
                  </h2>
                  <div className="space-y-5">
                    {[
                      { step: '01', title: 'Share Your Link', desc: 'Send your unique link to friends, family, or followers.' },
                      { step: '02', title: 'Friend Signs Up', desc: 'They create a free account using your referral link.' },
                      { step: '03', title: 'They Deposit', desc: 'Friend deposits ≥ $10 and starts betting or activates a mining bot.' },
                      { step: '04', title: 'You Earn $2', desc: '$2 is instantly credited to your balance. No limit on referrals.' },
                    ].map((s) => (
                      <div key={s.step} className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                          style={{ background: 'linear-gradient(135deg, #00c4b4, #1e90ff)', color: '#fff', fontFamily: 'Orbitron, system-ui' }}>
                          {s.step}
                        </div>
                        <div>
                          <p className="font-bold text-xs mb-0.5" style={{ color: '#fff', fontFamily: 'Orbitron, system-ui' }}>{s.title}</p>
                          <p className="text-xs" style={{ color: '#6b7e96' }}>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — referrals table */}
              <div className="lg:col-span-2">
                <div className="card p-6">
                  <h2 className="font-bold mb-5" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem' }}>
                    Your Referrals
                  </h2>
                  {referrals.length > 0 ? (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Joined</th>
                          <th>Status</th>
                          <th>Reward</th>
                        </tr>
                      </thead>
                      <tbody>
                        {referrals.map((r: any, i: number) => (
                          <tr key={i}>
                            <td className="font-mono text-xs" style={{ color: '#d9d5c8' }}>
                              {r.email ? r.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : `User #${i + 1}`}
                            </td>
                            <td className="text-xs" style={{ color: '#4a5a6a' }}>
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td>
                              <span className={`badge ${STATUS_CLASS[r.status] || 'badge-warning'}`}>
                                {STATUS_LABEL[r.status] || r.status}
                              </span>
                            </td>
                            <td>
                              {r.status === 'CREDITED' ? (
                                <span className="font-bold text-sm" style={{ color: '#48bb78', fontFamily: 'Orbitron, system-ui' }}>+$2.00</span>
                              ) : (
                                <span className="text-xs" style={{ color: '#4a5a6a' }}>Pending</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-16">
                      <div className="text-5xl mb-4">👥</div>
                      <h3 className="font-bold mb-2" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.85rem' }}>No Referrals Yet</h3>
                      <p className="text-sm" style={{ color: '#6b7e96', maxWidth: 300, margin: '0 auto' }}>
                        Copy your link above and share it on social media, crypto forums, or with friends.
                      </p>
                    </div>
                  )}
                </div>

                {/* Earnings breakdown */}
                <div className="card card-gold mt-5 p-6">
                  <h3 className="font-bold mb-4" style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.8rem', color: '#c9a96e' }}>
                    💰 EARNINGS STRUCTURE
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-4 rounded-lg" style={{ background: 'rgba(6,13,23,0.5)' }}>
                      <div className="font-bold text-lg mb-1" style={{ color: '#c9a96e', fontFamily: 'Orbitron, system-ui' }}>$2.00</div>
                      <div className="text-xs" style={{ color: '#6b7e96' }}>Per referral who deposits ≥ $10 and bets or mines</div>
                    </div>
                    <div className="p-4 rounded-lg" style={{ background: 'rgba(6,13,23,0.5)' }}>
                      <div className="font-bold text-lg mb-1" style={{ color: '#ffd700', fontFamily: 'Orbitron, system-ui' }}>∞</div>
                      <div className="text-xs" style={{ color: '#6b7e96' }}>No limit on how many friends you can refer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

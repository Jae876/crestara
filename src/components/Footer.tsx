'use client';

import Link from 'next/link';
import { CrestanaLogo } from './CrestanaLogo';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer style={{ background: '#060d17', borderTop: '1px solid #1a3050' }}>

      {/* ── Partner / Trust strip ── */}
      <div style={{ borderBottom: '1px solid #1a3050', padding: '20px 0', background: 'rgba(13,32,64,0.4)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '12px 32px' }}>
            <span style={{ fontSize: '0.7rem', color: '#4a5a6a', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'Orbitron, system-ui', flexShrink: 0 }}>
              Strategic Partners &amp; Integrations
            </span>
            {[
              { label: 'Stake',       icon: '♠', color: '#00c4b4', desc: 'Official Technology Partner' },
              { label: 'Curaçao eGaming', icon: '🌐', color: '#1e90ff', desc: 'Licensed & Regulated' },
              { label: 'Cloudflare', icon: '🛡️', color: '#f38020', desc: 'DDoS Protection' },
              { label: 'Chainalysis', icon: '🔗', color: '#a855f7', desc: 'AML Compliance' },
            ].map((p) => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.9rem' }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: p.color, fontFamily: 'Orbitron, system-ui', letterSpacing: '0.04em' }}>{p.label}</div>
                  <div style={{ fontSize: '0.62rem', color: '#3a4a5a' }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10 mb-12">

          {/* Brand col — 2 wide */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <CrestanaLogo size="small" animated={false} />
              <span style={{ fontFamily: 'Orbitron, system-ui', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.12em',
                background: 'linear-gradient(135deg, #8aa0b0, #eef2f4, #c9a96e)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                CRESTARA
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: '#6b7e96', maxWidth: 280, lineHeight: 1.75 }}>
              Premium crypto casino & AI-powered cloud mining platform. Built for serious players worldwide. Curaçao licensed. SSL secured.
            </p>
            {/* Security badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
              {['🔒 SSL', '🌐 Licensed', '⚡ Instant Pay', '🛡️ KYC/AML'].map((b) => (
                <span key={b} style={{ fontSize: '0.65rem', padding: '3px 8px', borderRadius: 6, background: 'rgba(0,196,180,0.07)', border: '1px solid rgba(0,196,180,0.15)', color: '#6b7e96' }}>{b}</span>
              ))}
            </div>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { icon: '🐦', label: 'Twitter', href: '#' },
                { icon: '✈️', label: 'Telegram', href: 'https://t.me/crestaraio' },
                { icon: '💬', label: 'Discord', href: '#' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  title={s.label}
                  style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, background: 'rgba(26,48,80,0.5)', border: '1px solid #1a3050', fontSize: '0.9rem', textDecoration: 'none', transition: 'all 0.18s' }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#00c4b4'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#1a3050'; }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, color: '#00c4b4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/casino',    label: 'Casino'           },
                { href: '/mining',    label: 'AI Cloud Mining'  },
                { href: '/referrals', label: 'Referral Program' },
                { href: '/dashboard', label: 'My Dashboard'     },
                { href: '/admin',     label: 'Admin Panel'      },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: '#6b7e96', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = '#6b7e96'; }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, color: '#00c4b4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { href: '/terms',       label: 'Terms of Service'    },
                { href: '/privacy',     label: 'Privacy Policy'      },
                { href: '/aml',         label: 'AML Policy'          },
                { href: '/responsible', label: 'Responsible Gaming'  },
                { href: '/kyc',         label: 'KYC Policy'          },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: '#6b7e96', fontSize: '0.85rem', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = '#6b7e96'; }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mining tiers */}
          <div>
            <h4 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, color: '#c9a96e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Mining Bots</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Starter — $10',  sub: '$0.50/day · 90d' },
                { label: 'Basic — $50',    sub: '$2.50/day · 90d' },
                { label: 'Standard — $100', sub: '$5.00/day · 120d' },
                { label: 'Advanced — $250', sub: '$12.50/day · 150d' },
                { label: 'Elite — $500',   sub: '$25.00/day · 180d' },
                { label: 'Diamond — $1,000', sub: '$55.00/day · 365d' },
              ].map((t) => (
                <li key={t.label}>
                  <Link href="/mining" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '0.78rem', color: '#6b7e96', transition: 'color 0.15s' }}
                      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = '#c9a96e'; }}
                      onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = '#6b7e96'; }}>
                      {t.label}
                      <span style={{ display: 'block', fontSize: '0.65rem', color: '#3a4a5a' }}>{t.sub}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.7rem', fontWeight: 700, color: '#00c4b4', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { icon: '✉️', label: 'Email', value: 'support@crestara.io', href: 'mailto:support@crestara.io' },
                { icon: '📱', label: 'WhatsApp', value: 'Chat 24/7', href: '#' },
                { icon: '✈️', label: 'Telegram', value: '@crestaraio', href: 'https://t.me/crestaraio' },
                { icon: '💬', label: 'Live Chat', value: 'Avg 3 min reply', href: '#' },
              ].map((s) => (
                <a key={s.label} href={s.href} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, textDecoration: 'none' }}>
                  <span style={{ fontSize: '0.85rem', marginTop: 1 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#8aabb8' }}>{s.label}</div>
                    <div style={{ fontSize: '0.72rem', color: '#4a5a6a' }}>{s.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div style={{ borderTop: '1px solid #1a3050', paddingTop: 20, marginBottom: 16 }}>
          <p style={{ fontSize: '0.72rem', color: '#3a4a5a', lineHeight: 1.75, textAlign: 'center', maxWidth: 820, margin: '0 auto 12px' }}>
            ⚠️ Gambling involves risk and may be addictive. Must be 18+ to participate. Crestara is licensed under Curaçao eGaming and is not available in restricted jurisdictions including the United States, United Kingdom, France, and Australia. Please gamble responsibly. If you feel you have a gambling problem, visit <a href="https://www.gamblersanonymous.org" style={{ color: '#4a5a6a' }}>gamblersanonymous.org</a>.
          </p>
          <p style={{ fontSize: '0.68rem', color: '#2a3a4a', lineHeight: 1.65, textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
            Crestara is operated in strategic partnership with Stake.com infrastructure technology. All games and mining operations are independently audited. RNG certified. Transactions processed on-chain for full transparency.
          </p>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: '1px solid #1a3050', paddingTop: 16, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <p style={{ fontSize: '0.75rem', color: '#3a4a5a' }}>
            &copy; {year} Crestara Technologies Ltd. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: '#3a4a5a' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#48bb78', display: 'inline-block', boxShadow: '0 0 6px #48bb78' }} />
              All systems operational
            </div>
            <span style={{ fontSize: '0.72rem', color: '#3a4a5a' }}>v2.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

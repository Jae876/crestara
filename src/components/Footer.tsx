'use client';

import Link from 'next/link';
import { CrestanaLogo } from './CrestanaLogo';

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer style={{ background: 'rgba(6,13,23,0.95)', borderTop: '1px solid #1a3050' }} className="mt-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <CrestanaLogo size="small" animated={false} />
              <span
                className="text-lg font-bold tracking-widest"
                style={{
                  fontFamily: 'Orbitron, system-ui, sans-serif',
                  background: 'linear-gradient(135deg, #8aa0b0, #eef2f4, #8aa0b0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CRESTARA
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#6b7e96', maxWidth: 280 }}>
              Premium crypto casino & AI-powered cloud mining platform. Built for serious traders and miners worldwide.
            </p>
            <div className="flex gap-3">
              {['🐦', '💬', '📱'].map((icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors"
                  style={{ background: 'rgba(26,48,80,0.6)', border: '1px solid #1a3050' }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold mb-5 text-xs tracking-widest uppercase" style={{ color: '#00c4b4', fontFamily: 'Orbitron, system-ui, sans-serif' }}>
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/casino', label: 'Casino' },
                { href: '/mining', label: 'Cloud Mining' },
                { href: '/referrals', label: 'Referral Program' },
                { href: '/dashboard', label: 'Dashboard' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: '#6b7e96' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-5 text-xs tracking-widest uppercase" style={{ color: '#00c4b4', fontFamily: 'Orbitron, system-ui, sans-serif' }}>
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/aml', label: 'AML Policy' },
                { href: '/responsible', label: 'Responsible Gaming' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm transition-colors hover:text-white" style={{ color: '#6b7e96' }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-5 text-xs tracking-widest uppercase" style={{ color: '#00c4b4', fontFamily: 'Orbitron, system-ui, sans-serif' }}>
              Support
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: '#6b7e96' }}>
              <li>
                <a href="mailto:support@crestara.io" className="hover:text-white transition-colors">
                  support@crestara.io
                </a>
              </li>
              <li>Live Chat: 24/7</li>
              <li>Discord: /crestara</li>
              <li>Telegram: @crestaraio</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="divider mb-6" />
        <p className="text-xs text-center mb-4" style={{ color: '#4a5a6a', lineHeight: 1.7 }}>
          ⚠️ Gambling involves risk. Must be 18+ to participate. Please gamble responsibly.
          Crestara is not available in restricted jurisdictions.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: '#4a5a6a' }}>
            &copy; {year} Crestara Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#4a5a6a' }}>
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" style={{ boxShadow: '0 0 6px #48bb78' }} />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import Link from 'next/link';
import { CrestanaLogo } from './CrestanaLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-crestara-dark border-t border-crestara-border mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CrestanaLogo size="small" animated={false} />
              <span className="text-lg font-bold">CRESTARA</span>
            </div>
            <p className="text-crestara-silver text-sm">
              Premium crypto casino & cloud mining platform. Built for serious traders and miners.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4 text-crestara-teal">Platform</h4>
            <ul className="space-y-2 text-sm text-crestara-silver">
              <li>
                <Link href="/casino" className="hover:text-white transition">
                  Casino
                </Link>
              </li>
              <li>
                <Link href="/mining" className="hover:text-white transition">
                  Mining
                </Link>
              </li>
              <li>
                <Link href="/referrals" className="hover:text-white transition">
                  Referrals
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-crestara-teal">Legal</h4>
            <ul className="space-y-2 text-sm text-crestara-silver">
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-crestara-teal">Support</h4>
            <ul className="space-y-2 text-sm text-crestara-silver">
              <li>Email: support@crestara.io</li>
              <li>Discord: /crestara</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-crestara-border pt-8 text-center text-crestara-silver text-sm">
          <p>&copy; {currentYear} Crestara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

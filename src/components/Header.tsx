'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CrestanaLogo } from './CrestanaLogo';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  return (
    <header className="fixed w-full top-0 z-50 bg-gradient-to-b from-crestara-dark via-crestara-blue to-transparent backdrop-blur border-b border-crestara-border">
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <CrestanaLogo size="small" />
          <span className="text-xl font-bold neon-text hidden sm:inline">CRESTARA</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/casino" className="hover:text-crestara-teal transition">
            Casino
          </Link>
          <Link href="/mining" className="hover:text-crestara-teal transition">
            Mining
          </Link>
          <Link href="/referrals" className="hover:text-crestara-teal transition">
            Referrals
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-crestara-teal transition">
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <button className="px-4 py-2 border border-crestara-teal text-crestara-teal rounded hover:bg-crestara-teal hover:text-crestara-dark transition">
                  Login
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="px-4 py-2 bg-gradient-neon text-white rounded hover:shadow-glow transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-crestara-blue border-t border-crestara-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="px-4 py-4 space-y-4">
            <Link href="/casino" className="block hover:text-crestara-teal transition">
              Casino
            </Link>
            <Link href="/mining" className="block hover:text-crestara-teal transition">
              Mining
            </Link>
            <Link href="/referrals" className="block hover:text-crestara-teal transition">
              Referrals
            </Link>
            {user && (
              <Link href="/dashboard" className="block hover:text-crestara-teal transition">
                Dashboard
              </Link>
            )}
            {!user && (
              <>
                <Link href="/auth/login">
                  <button className="w-full px-4 py-2 border border-crestara-teal text-crestara-teal rounded">
                    Login
                  </button>
                </Link>
                <Link href="/auth/signup">
                  <button className="w-full px-4 py-2 bg-gradient-neon text-white rounded">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}

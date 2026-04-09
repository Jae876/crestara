'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CrestanaLogo } from './CrestanaLogo';
import { useAuthStore } from '@/store/authStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/casino', label: 'Casino' },
    { href: '/mining', label: 'AI Cloud Mining' },
    { href: '/referrals', label: 'Referrals' },
  ];

  return (
    <header
      className="fixed w-full top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(6,13,23,0.95)'
          : 'linear-gradient(to bottom, rgba(6,13,23,0.9), transparent)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(26,48,80,0.8)' : '1px solid transparent',
      }}
    >
      <nav className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
          <CrestanaLogo size="small" animated={false} />
          <span
            className="text-lg font-bold tracking-widest hidden sm:inline"
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
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200 tracking-wide"
              style={{ fontFamily: 'Orbitron, system-ui, sans-serif', fontSize: '0.78rem', letterSpacing: '0.1em' }}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <button className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
                  Dashboard
                </button>
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-red-400 transition-colors"
                style={{ fontFamily: 'Orbitron, system-ui, sans-serif', fontSize: '0.75rem', letterSpacing: '0.08em' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <button className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
                  Login
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.75rem' }}>
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: 'rgba(6,13,23,0.98)', borderBottom: '1px solid #1a3050' }}
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white py-2 border-b border-gray-800 transition-colors"
                  style={{ fontFamily: 'Orbitron, system-ui, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em' }}
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <div className="flex flex-col gap-3 pt-2">
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <button className="btn-outline w-full">Dashboard</button>
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-red-400 text-sm py-2">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <button className="btn-outline w-full">Login</button>
                  </Link>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <button className="btn-primary w-full">Sign Up Free</button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

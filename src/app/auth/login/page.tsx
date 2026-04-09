'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { CrestanaLogo } from '@/components/CrestanaLogo';

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { setAuth, setError, error } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login(formData, {
      onSuccess: (response) => { setAuth(response); router.push('/dashboard'); },
      onError: (err: any) => { setError(err?.response?.data?.error || err.message || 'Invalid credentials'); },
    });
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #060d17 0%, #0a1520 60%, #0d2040 100%)' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 500, height: 500, top: '10%', left: '10%', background: 'rgba(0,196,180,0.05)' }} />
        <div className="glow-orb" style={{ width: 350, height: 350, bottom: '5%', right: '0%', background: 'rgba(30,144,255,0.04)' }} />
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex justify-center mb-8"
          >
            <CrestanaLogo size="xlarge" animated />
          </motion.div>
          <h1 className="text-3xl font-bold mb-3 neon-text" style={{ fontFamily: 'Orbitron, system-ui' }}>CRESTARA</h1>
          <p style={{ color: '#6b7e96', letterSpacing: '0.15em', fontSize: '0.78rem' }}>CRYPTO CASINO &amp; CLOUD MINING</p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left max-w-xs mx-auto">
            {[
              { icon: '🔒', text: 'JWT-secured accounts' },
              { icon: '🎰', text: 'Provably fair games' },
              { icon: '⛏️', text: 'Daily mining payouts' },
              { icon: '💰', text: '130+ crypto deposits' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ color: '#6b7e96' }}>
                <span>{f.icon}</span><span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 pt-20 pb-12">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex justify-center mb-8 lg:hidden">
            <CrestanaLogo size="medium" animated={false} />
          </div>

          <div className="card p-8" style={{ borderColor: 'rgba(0,196,180,0.15)' }}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Orbitron, system-ui' }}>Welcome Back</h2>
              <p className="text-sm" style={{ color: '#6b7e96' }}>Sign in to your Crestara account</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.3)', color: '#f56565' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>
                  Email Address
                </label>
                <input
                  type="email" className="input-field" placeholder="your@email.com" required
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>
                    Password
                  </label>
                  <Link href="#" className="text-xs hover:underline" style={{ color: '#00c4b4' }}>Forgot?</Link>
                </div>
                <input
                  type="password" className="input-field" placeholder="••••••••" required
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button type="submit" disabled={isPending} className="btn-primary w-full" style={{ padding: '14px', fontSize: '0.85rem' }}>
                {isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider my-6" />
            <p className="text-center text-sm" style={{ color: '#6b7e96' }}>
              No account?{' '}
              <Link href="/auth/signup" className="font-semibold hover:underline" style={{ color: '#00c4b4' }}>
                Create one free
              </Link>
            </p>
          </div>

          <div className="card card-gold mt-4 p-4 flex items-start gap-3">
            <span className="text-xl">🎁</span>
            <div>
              <p className="text-xs font-bold mb-0.5" style={{ color: '#c9a96e', fontFamily: 'Orbitron, system-ui' }}>New? Sign up for free</p>
              <p className="text-xs" style={{ color: '#6b7e96' }}>2 free spins + 300% match on first deposit ≥ $10</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

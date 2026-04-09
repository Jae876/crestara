'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSignUp } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { CrestanaLogo } from '@/components/CrestanaLogo';

export default function SignUpPage() {
  const router = useRouter();
  const { mutate: signup, isPending } = useSignUp();
  const { setAuth, setError, error } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', referralCode: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
    signup(
      { email: formData.email, password: formData.password, referralCode: formData.referralCode || undefined },
      {
        onSuccess: (response) => { setAuth(response); router.push('/dashboard'); },
        onError: (err: any) => { setError(err?.response?.data?.error || err.message || 'Registration failed'); },
      }
    );
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #060d17 0%, #0a1520 60%, #0d2040 100%)' }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="glow-orb" style={{ width: 500, height: 500, top: '10%', left: '10%', background: 'rgba(0,196,180,0.05)' }} />
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
          <div className="mt-10 space-y-4 max-w-xs mx-auto text-left">
            {[
              { icon: '🎁', title: 'Welcome Bonus', desc: '2 free spins + 300% on first deposit' },
              { icon: '⛏️', title: 'Daily Earnings', desc: 'Mining bots pay daily to your balance' },
              { icon: '🔗', title: 'Referral Cash', desc: '$2 per friend who deposits' },
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl">{f.icon}</span>
                <div>
                  <p className="font-bold text-xs mb-0.5" style={{ color: '#fff', fontFamily: 'Orbitron, system-ui' }}>{f.title}</p>
                  <p className="text-xs" style={{ color: '#6b7e96' }}>{f.desc}</p>
                </div>
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
              <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Orbitron, system-ui' }}>Create Account</h2>
              <p className="text-sm" style={{ color: '#6b7e96' }}>Join 48,000+ members on Crestara</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-lg text-sm" style={{ background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.3)', color: '#f56565' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>Email</label>
                <input type="email" className="input-field" placeholder="your@email.com" required
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>Password</label>
                <input type="password" className="input-field" placeholder="Min 8 characters" required minLength={8}
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>Confirm Password</label>
                <input type="password" className="input-field" placeholder="Re-enter password" required
                  value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 uppercase tracking-widest" style={{ color: '#6b7e96', fontFamily: 'Orbitron, system-ui' }}>
                  Referral Code <span style={{ color: '#4a5a6a', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                </label>
                <input type="text" className="input-field" placeholder="Enter referral code"
                  value={formData.referralCode} onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })} />
              </div>
              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" required className="mt-1" style={{ accentColor: '#00c4b4' }} />
                <span className="text-xs" style={{ color: '#6b7e96' }}>
                  I am 18+ and agree to the{' '}
                  <Link href="/terms" className="hover:underline" style={{ color: '#00c4b4' }}>Terms of Service</Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="hover:underline" style={{ color: '#00c4b4' }}>Privacy Policy</Link>
                </span>
              </div>
              <button type="submit" disabled={isPending} className="btn-primary w-full" style={{ padding: '14px', fontSize: '0.85rem' }}>
                {isPending ? 'Creating account...' : 'Create Free Account'}
              </button>
            </form>

            <div className="divider my-6" />
            <p className="text-center text-sm" style={{ color: '#6b7e96' }}>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold hover:underline" style={{ color: '#00c4b4' }}>Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

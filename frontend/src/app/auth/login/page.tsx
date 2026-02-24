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
  const setAuth = useAuthStore((state) => state.setAuth);
  const setError = useAuthStore((state) => state.setError);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(formData, {
      onSuccess: (response) => {
        setAuth(response);
        router.push('/dashboard');
      },
      onError: (error) => {
        setError(error.message || 'Login failed');
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-crestara flex items-center justify-center px-4 pt-20">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <CrestanaLogo size="medium" />
        </div>

        <div className="bg-crestara-blue bg-opacity-50 backdrop-blur border border-crestara-border rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 neon-text">Welcome Back</h1>
          <p className="text-center text-crestara-silver mb-6">Sign in to your Crestara account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-crestara-dark border border-crestara-border rounded text-white placeholder-crestara-silver focus:border-crestara-teal focus:outline-none"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-crestara-dark border border-crestara-border rounded text-white placeholder-crestara-silver focus:border-crestara-teal focus:outline-none"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2 px-4 bg-gradient-neon text-white font-bold rounded hover:shadow-glow disabled:opacity-50 transition"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-crestara-silver mt-6">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-crestara-teal hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

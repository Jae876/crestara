'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCoins, useTransactions } from '@/hooks/useApi';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { data: coins } = useCoins();
  const { data: transactions } = useTransactions();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-crestara pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold neon-text">Dashboard</h1>
          <p className="text-crestara-silver mt-2">Welcome back, {user.email}!</p>
        </motion.div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            className="bg-crestara-blue bg-opacity-50 backdrop-blur border border-crestara-border rounded-lg p-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-crestara-silver text-sm mb-2">Available Balance</p>
            <h2 className="text-4xl font-bold text-crestara-teal mb-4">
              ${user.balanceUSD.toFixed(2)}
            </h2>
            <button className="px-6 py-2 bg-gradient-neon text-white rounded hover:shadow-glow transition">
              Add Funds
            </button>
          </motion.div>

          <motion.div
            className="bg-crestara-blue bg-opacity-50 backdrop-blur border border-crestara-border rounded-lg p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-crestara-silver text-sm mb-2">Bonus Balance</p>
            <h2 className="text-4xl font-bold text-crestara-gold">
              ${user.bonusBalance.toFixed(2)}
            </h2>
            <p className="text-crestara-silver text-sm mt-2">40x wagering req.</p>
          </motion.div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="bg-crestara-blue bg-opacity-50 backdrop-blur border border-crestara-border rounded-lg p-6 hover:border-crestara-teal transition cursor-pointer"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl mb-3">🎰</div>
            <h3 className="font-bold text-lg mb-2">Play Casino</h3>
            <p className="text-crestara-silver text-sm">Provably fair games</p>
          </motion.div>

          <motion.div
            className="bg-crestara-blue bg-opacity-50 backdrop-blur border border-crestara-border rounded-lg p-6 hover:border-crestara-teal transition cursor-pointer"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl mb-3">⛏️</div>
            <h3 className="font-bold text-lg mb-2">Start Mining</h3>
            <p className="text-crestara-silver text-sm">Daily earnings</p>
          </motion.div>

          <motion.div
            className="bg-crestara-blue bg-opacity-50 backdrop-blur border border-crestara-border rounded-lg p-6 hover:border-crestara-teal transition cursor-pointer"
            whileHover={{ y: -5 }}
          >
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="font-bold text-lg mb-2">Referrals</h3>
            <p className="text-crestara-silver text-sm">Earn $2 per ref</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

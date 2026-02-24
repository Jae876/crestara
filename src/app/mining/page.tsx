'use client';

import { useMiningPackages, useUserBots } from '@/hooks/useApi';
import { motion } from 'framer-motion';

export default function MiningPage() {
  const { data: packages } = useMiningPackages();
  const { data: userBots } = useUserBots();

  const coins = ['BTC', 'ETH', 'XMR', 'LTC', 'DOGE', 'RVN'];

  return (
    <div className="min-h-screen bg-gradient-crestara pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold neon-text">Cloud Mining</h1>
          <p className="text-crestara-silver mt-2">AI-Powered Mining with Daily Payouts</p>
        </motion.div>

        {/* Mining Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Mining Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages?.map((pkg: any, i: number) => (
              <motion.div
                key={pkg.type}
                className={`border-2 rounded-lg p-8 ${
                  pkg.type === 'PRO'
                    ? 'border-crestara-gold bg-crestara-gold bg-opacity-10'
                    : 'border-crestara-border bg-crestara-blue bg-opacity-50'
                } backdrop-blur`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {pkg.type === 'PRO' && (
                  <div className="text-center mb-4">
                    <span className="px-3 py-1 bg-crestara-gold text-crestara-dark rounded-full text-xs font-bold">
                      POPULAR
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{pkg.type}</h3>
                <p className="text-crestara-silver text-sm mb-4">{pkg.description}</p>
                <div className="text-3xl font-bold text-crestara-teal mb-2">
                  ${pkg.costUSD}
                </div>
                <ul className="space-y-2 text-sm mb-6">
                  <li>✓ Duration: {pkg.days} days</li>
                  <li>✓ Daily Rate: ${pkg.dailyRate}</li>
                  <li className="text-crestara-gold">✓ Est. Return: ${pkg.dailyRate * pkg.days}</li>
                </ul>
                <button className="w-full py-2 px-4 bg-gradient-neon text-white rounded hover:shadow-glow transition">
                  Purchase
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Bots */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Active Bots</h2>
          {userBots && userBots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBots.map((bot: any) => (
                <motion.div
                  key={bot.id}
                  className="bg-crestara-blue bg-opacity-50 backdrop-blur border border-crestara-border rounded-lg p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{bot.coin}</h3>
                      <p className="text-crestara-silver text-sm">{bot.packageType}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-600 rounded text-xs font-bold">
                      {bot.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>Daily Rate: <span className="text-crestara-teal font-bold">${bot.dailyRate}</span></p>
                    <p>Total Mined: <span className="text-crestara-gold font-bold">${bot.totalMined.toFixed(2)}</span></p>
                    <p>Ends: {new Date(bot.endDate).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-crestara-border rounded-lg">
              <p className="text-crestara-silver mb-4">No active mining bots</p>
              <button className="px-6 py-2 bg-gradient-neon text-white rounded hover:shadow-glow transition">
                Start Mining
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

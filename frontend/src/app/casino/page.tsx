'use client';

import { useGames } from '@/hooks/useApi';
import { motion } from 'framer-motion';
import { CrestanaLogo } from '@/components/CrestanaLogo';

export default function CasinoPage() {
  const { data: games, isLoading } = useGames();

  return (
    <div className="min-h-screen bg-gradient-crestara pt-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold neon-text">Crestara Casino</h1>
          <p className="text-crestara-silver mt-2">Provably Fair Gaming Platform</p>
        </motion.div>

        {isLoading ? (
          <div className="text-center text-crestara-silver">Loading games...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games?.map((game: any, i: number) => (
              <motion.div
                key={game.gameType}
                className="bg-crestara-blue bg-opacity-50 backdrop-blur border border-crestara-border rounded-lg p-6 hover:border-crestara-teal transition"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">
                  {game.gameType === 'CRASH' && '📈'}
                  {game.gameType === 'DICE' && '🎲'}
                  {game.gameType === 'PLINKO' && '⚙️'}
                  {game.gameType === 'MINES' && '💣'}
                  {game.gameType === 'KENO' && '🎱'}
                  {game.gameType === 'SLOTS' && '🎰'}
                  {game.gameType === 'COINFLIP' && '🪙'}
                </div>
                <h3 className="text-xl font-bold mb-2">{game.gameType}</h3>
                <p className="text-crestara-silver text-sm mb-4">
                  House Edge: {game.houseEdgePercent}%
                </p>
                <button className="w-full py-2 px-4 bg-gradient-neon text-white rounded hover:shadow-glow transition">
                  Play Now
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

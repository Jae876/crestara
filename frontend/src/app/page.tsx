'use client';

import { motion } from 'framer-motion';
import { CrestanaLogo } from '@/components/CrestanaLogo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-gradient-crestara">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-crestara-cyan opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-crestara-teal opacity-5 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          className="relative z-10 text-center max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div
            className="flex justify-center mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <CrestanaLogo size="large" />
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text">
            CRESTARA
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-crestara-silver mb-8 leading-relaxed">
            Premium Crypto Casino & Cloud Mining Platform
          </p>
          <p className="text-lg text-crestara-gold mb-12">
            Trade • Gamble • Mine • Earn
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/auth/signup">
              <button className="px-8 py-4 bg-gradient-neon text-white font-bold rounded-lg hover:shadow-glow transition-all duration-300">
                Get Started
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-4 border-2 border-crestara-teal text-crestara-teal font-bold rounded-lg hover:bg-crestara-teal hover:text-crestara-dark transition-all duration-300">
                Sign In
              </button>
            </Link>
          </div>

          {/* Features Preview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {[
              { icon: '🎰', title: 'Provably Fair Casino', desc: '130+ cryptos, instant deposits' },
              { icon: '⛏️', title: 'AI Mining Bots', desc: '3 packages, daily earnings' },
              { icon: '💰', title: 'Referral Program', desc: '$2 per successful referral' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white bg-opacity-5 rounded-lg backdrop-blur border border-crestara-border hover:border-crestara-teal transition-all">
                <div className="text-4xl mb-2">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-crestara-silver">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

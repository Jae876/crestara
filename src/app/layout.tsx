import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Crestara — Premium Crypto Casino & Cloud Mining',
  description: 'High-performance crypto casino with AI-powered cloud mining bots. Deposit 130+ cryptos. Trade, mine, earn.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Crestara — Premium Crypto Casino & Cloud Mining',
    description: 'High-performance crypto casino with AI-powered cloud mining bots.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

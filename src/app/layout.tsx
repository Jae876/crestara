import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChatWidget } from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: 'Crestara — Premium Crypto Casino & AI Cloud Mining',
  description: 'Institutional-grade crypto casino with AI-powered cloud mining bots. 300% welcome bonus. Daily payouts. Instant crypto withdrawals.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Crestara — Premium Crypto Casino & AI Cloud Mining',
    description: 'Institutional-grade crypto casino with AI-powered cloud mining bots.',
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
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}

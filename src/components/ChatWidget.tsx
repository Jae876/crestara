'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'bot' | 'user';
  text: string;
};

const FAQS: { label: string; answer: string }[] = [
  {
    label: 'How do I deposit?',
    answer: 'Go to your Dashboard → Deposit. We support BTC, ETH, USDT and more. Your unique address is generated instantly — funds credit within 1 network confirmation.',
  },
  {
    label: 'How do withdrawals work?',
    answer: 'Navigate to Dashboard → Withdraw, enter your wallet address and amount. Most withdrawals process in under 5 minutes. Minimum is $10 equivalent.',
  },
  {
    label: 'When do mining payouts land?',
    answer: 'Mining earnings are credited to your wallet every 24 hours automatically. You can view accrued earnings in real time on your Dashboard.',
  },
  {
    label: 'What is the welcome bonus?',
    answer: 'New accounts receive a 300% first-deposit match plus 2 Free Spins on the Wheel of Fortune. Bonus is subject to a 40× wager requirement before withdrawal.',
  },
  {
    label: 'How do Predictions work?',
    answer: 'Visit the Predictions page to browse open events. Pick an outcome, enter your stake — odds are locked at bet time. Winnings are paid out automatically once the admin resolves the event.',
  },
  {
    label: 'Talk to a human',
    answer: 'Our live support team is available 24/7. You can reach us on WhatsApp, Telegram (@crestaraio) or email support@crestara.io — we usually reply within 3 minutes.',
  },
];

const GREETING: Message = {
  role: 'bot',
  text: "Hey 👋 I'm the Crestara assistant. Ask me anything or pick a topic below:",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function sendUserMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    const query = text.toLowerCase();
    const match = FAQS.find((f) =>
      query.includes(f.label.toLowerCase().split(' ')[0]) ||
      query.includes(f.label.toLowerCase())
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: match
            ? match.answer
            : "I'm not sure about that — for specific account issues our support team is available 24/7 on WhatsApp, Telegram (@crestaraio) or email support@crestara.io.",
        },
      ]);
    }, 520);
  }

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 64,
              right: 0,
              width: 320,
              background: '#0d2040',
              border: '1px solid rgba(0,196,180,0.25)',
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              maxHeight: 480,
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0a3060, #0d2040)', padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,196,180,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                  💬
                </div>
                <div>
                  <div style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.72rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
                    Crestara Support
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#48bb78', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#48bb78', display: 'inline-block', boxShadow: '0 0 4px #48bb78' }} />
                    Online · Avg reply 3 min
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#4a5a6a', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    padding: '9px 12px',
                    borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: m.role === 'user' ? 'linear-gradient(135deg, #00c4b4, #1e90ff)' : 'rgba(255,255,255,0.06)',
                    color: '#e8f0f8',
                    fontSize: '0.76rem',
                    lineHeight: 1.55,
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick-reply chips */}
            <div style={{ padding: '6px 12px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.04)', flexShrink: 0 }}>
              {FAQS.map((f) => (
                <button
                  key={f.label}
                  onClick={() => sendUserMessage(f.label)}
                  style={{
                    fontSize: '0.65rem',
                    padding: '4px 9px',
                    borderRadius: 20,
                    background: 'rgba(0,196,180,0.09)',
                    border: '1px solid rgba(0,196,180,0.22)',
                    color: '#8aabb8',
                    cursor: 'pointer',
                    fontFamily: 'system-ui',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,196,180,0.18)'; (e.currentTarget as HTMLElement).style.color = '#00c4b4'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,196,180,0.09)'; (e.currentTarget as HTMLElement).style.color = '#8aabb8'; }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendUserMessage(input); }}
              style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(0,196,180,0.18)',
                  borderRadius: 10,
                  padding: '8px 12px',
                  color: '#e8f0f8',
                  fontSize: '0.75rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #00c4b4, #1e90ff)',
                  border: 'none',
                  borderRadius: 10,
                  width: 36,
                  height: 36,
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: 15,
                  flexShrink: 0,
                }}
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 52, height: 52,
          borderRadius: '50%',
          background: open ? 'rgba(0,196,180,0.2)' : 'linear-gradient(135deg, #00c4b4, #1e90ff)',
          border: '2px solid rgba(0,196,180,0.5)',
          boxShadow: '0 4px 24px rgba(0,196,180,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: open ? 20 : 22,
          cursor: 'pointer',
          color: '#fff',
        }}
      >
        {open ? '✕' : '💬'}
      </motion.button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = '+1234567890'; // Configure your WhatsApp number
const SUPPORT_EMAIL   = 'support@crestara.io';

export function ChatWidget() {
  const [open, setOpen] = useState(false);

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
              width: 280,
              background: '#0d2040',
              border: '1px solid rgba(0,196,180,0.25)',
              borderRadius: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0a3060, #0d2040)', padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,196,180,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                  💬
                </div>
                <div>
                  <div style={{ fontFamily: 'Orbitron, system-ui', fontSize: '0.75rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
                    Crestara Support
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#48bb78', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#48bb78', display: 'inline-block', boxShadow: '0 0 4px #48bb78' }} />
                    Online · Avg reply 3 min
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: 18 }}>
              <p style={{ fontSize: '0.78rem', color: '#8aabb8', lineHeight: 1.6, marginBottom: 16 }}>
                Hey 👋 Need help with your account, mining bot, or a withdrawal? We're here 24/7.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=Hi%20Crestara%20Support%2C%20I%20need%20help%20with`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 10,
                    background: 'rgba(37,211,102,0.1)',
                    border: '1px solid rgba(37,211,102,0.25)',
                    textDecoration: 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.18)'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.1)'; }}
                >
                  <span style={{ fontSize: 20 }}>📱</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#25d366' }}>WhatsApp</div>
                    <div style={{ fontSize: '0.68rem', color: '#6b7e96' }}>Chat with us instantly</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#25d366', fontSize: '0.75rem' }}>→</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${SUPPORT_EMAIL}?subject=Crestara Support Request`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 10,
                    background: 'rgba(0,196,180,0.08)',
                    border: '1px solid rgba(0,196,180,0.2)',
                    textDecoration: 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,196,180,0.15)'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,196,180,0.08)'; }}
                >
                  <span style={{ fontSize: 20 }}>✉️</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#00c4b4' }}>Email Support</div>
                    <div style={{ fontSize: '0.68rem', color: '#6b7e96' }}>{SUPPORT_EMAIL}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#00c4b4', fontSize: '0.75rem' }}>→</span>
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/crestaraio"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '11px 14px', borderRadius: 10,
                    background: 'rgba(30,144,255,0.08)',
                    border: '1px solid rgba(30,144,255,0.2)',
                    textDecoration: 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,144,255,0.15)'; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(30,144,255,0.08)'; }}
                >
                  <span style={{ fontSize: 20 }}>✈️</span>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e90ff' }}>Telegram</div>
                    <div style={{ fontSize: '0.68rem', color: '#6b7e96' }}>@crestaraio</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: '#1e90ff', fontSize: '0.75rem' }}>→</span>
                </a>
              </div>
            </div>
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

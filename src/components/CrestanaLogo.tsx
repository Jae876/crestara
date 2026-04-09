'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  showText?: boolean;
}

// Colors pulled directly from the logo image
// – warm gold coins, silver/chrome pillar, dark atmospheric background
const GOLD      = '#C9A96E';
const GOLD_LITE = '#E8C47A';
const GOLD_DIM  = '#8B6B2A';
const SILVER    = '#E0E0E8';

export function CrestanaLogo({ size = 'medium', animated = true }: LogoProps) {
  const sizeMap = { small: 44, medium: 80, large: 140, xlarge: 200 };
  const s = sizeMap[size];

  // Ring geometry
  const C = 2 * Math.PI * 104; // circumference of r=104 ring ≈ 653.5
  const sparkLen = 18;
  const gap      = C - sparkLen;

  if (size === 'small') {
    return (
      <div style={{ width: s, height: s, display: 'inline-block' }}>
        <svg viewBox="0 0 240 240" width={s} height={s} style={{ overflow: 'visible' }}>
          <defs>
            <clipPath id="smClip">
              <circle cx="120" cy="120" r="112" />
            </clipPath>
            <filter id="smGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Subtle gold breathing ring */}
          {animated && (
            <motion.circle cx="120" cy="120" r="114"
              fill="none" stroke={GOLD} strokeWidth="1.5"
              animate={{ opacity: [0.25, 0.65, 0.25] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <image href="/crestara-logo.png"
            x="8" y="8" width="224" height="224"
            clipPath="url(#smClip)"
            preserveAspectRatio="xMidYMid slice"
          />
          {/* Thin gold ring over image edge */}
          <circle cx="120" cy="120" r="112"
            fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.45" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{ width: s, height: s, display: 'inline-block' }}>
      <svg viewBox="0 0 240 240" width={s} height={s}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}>
        <defs>
          {/* Clip image to circle */}
          <clipPath id="lgClip">
            <circle cx="120" cy="120" r="88" />
          </clipPath>

          {/* Deep gold radial glow behind image */}
          <radialGradient id="goldBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={GOLD}  stopOpacity="0.18" />
            <stop offset="55%"  stopColor={GOLD}  stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000"  stopOpacity="0"    />
          </radialGradient>

          {/* Edge fade so image blends into bg */}
          <radialGradient id="edgeFade" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="#000" stopOpacity="0"    />
            <stop offset="100%" stopColor="#060d17" stopOpacity="0.6" />
          </radialGradient>

          {/* Spark glow filter — gold hue */}
          <filter id="goldSparkGlow" x="-300%" y="-300%" width="700%" height="700%">
            <feColorMatrix type="matrix"
              values="1 0.5 0 0 0  0.6 0.4 0 0 0  0 0 0 0 0  0 0 0 1 0" result="gold" />
            <feGaussianBlur in="gold" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Overall image glow filter */}
          <filter id="imgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Gold atmospheric glow background ── */}
        <circle cx="120" cy="120" r="110" fill="url(#goldBg)" />

        {/* ── The logo image — floating + breathing ── */}
        {animated ? (
          <motion.g
            style={{ transformOrigin: '120px 120px' }}
            animate={{ scale: [1, 1.025, 1], y: [0, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <image href="/crestara-logo.png"
              x="30" y="26" width="180" height="188"
              clipPath="url(#lgClip)"
              preserveAspectRatio="xMidYMid slice"
            />
            {/* Subtle edge fade overlay */}
            <circle cx="120" cy="120" r="88" fill="url(#edgeFade)" />
          </motion.g>
        ) : (
          <>
            <image href="/crestara-logo.png"
              x="30" y="26" width="180" height="188"
              clipPath="url(#lgClip)"
              preserveAspectRatio="xMidYMid slice"
            />
            <circle cx="120" cy="120" r="88" fill="url(#edgeFade)" />
          </>
        )}

        {/* ── Inner crisp gold ring (tight) ── */}
        <circle cx="120" cy="120" r="89"
          fill="none" stroke={GOLD} strokeWidth="1" opacity="0.5" />

        {/* ── Mid ring — very thin, gold dashes ── */}
        <circle cx="120" cy="120" r="98"
          fill="none" stroke={GOLD_DIM}
          strokeWidth="0.6" strokeDasharray="2 8" opacity="0.4" />

        {/* ── Outer ring — static base ── */}
        <circle cx="120" cy="120" r="104"
          fill="none" stroke={GOLD_DIM} strokeWidth="0.5" opacity="0.2" />

        {/* ── Outer ring — slow rotation sector (gold) ── */}
        {animated && (
          <motion.circle cx="120" cy="120" r="104"
            fill="none" stroke={GOLD} strokeWidth="0.8"
            strokeDasharray="55 598"
            style={{ transformOrigin: '120px 120px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            opacity="0.35"
          />
        )}

        {/* ── Traveling spark (silver/white, gold glow) ── */}
        {animated && (
          <>
            {/* Gold glow halo around spark */}
            <motion.circle cx="120" cy="120" r="104"
              fill="none" stroke={GOLD_LITE} strokeWidth="6"
              strokeDasharray={`${sparkLen} ${gap}`}
              filter="url(#goldSparkGlow)"
              style={{ transformOrigin: '120px 120px' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
              opacity="0.55"
            />
            {/* Bright silver core of spark */}
            <motion.circle cx="120" cy="120" r="104"
              fill="none" stroke={SILVER} strokeWidth="1.5"
              strokeDasharray={`${sparkLen} ${gap}`}
              style={{ transformOrigin: '120px 120px' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}

        {/* ── Cardinal markers — 4 gold diamonds ── */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const mx  = Math.round((120 + 104 * Math.cos(rad)) * 10) / 10;
          const my  = Math.round((120 + 104 * Math.sin(rad)) * 10) / 10;
          return (
            <rect key={deg}
              x={mx - 2.5} y={my - 2.5} width="5" height="5"
              fill={GOLD} opacity="0.85"
              transform={`rotate(45 ${mx} ${my})`}
            />
          );
        })}

        {/* ── Outer breathing pulse ring ── */}
        {animated && (
          <motion.circle cx="120" cy="120" r="112"
            fill="none" stroke={GOLD} strokeWidth="0.6"
            animate={{ opacity: [0, 0.28, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* ── Gold glow on inner ring (breathe in sync with image) ── */}
        {animated && (
          <motion.circle cx="120" cy="120" r="89"
            fill="none" stroke={GOLD_LITE} strokeWidth="2"
            animate={{ opacity: [0.1, 0.45, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            filter="url(#goldSparkGlow)"
          />
        )}
      </svg>
    </div>
  );
}

export default CrestanaLogo;

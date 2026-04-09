'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  showText?: boolean;
}

export function CrestanaLogo({ size = 'medium', animated = true }: LogoProps) {
  const sizeMap = { small: 44, medium: 80, large: 140, xlarge: 200 };
  const s = sizeMap[size];

  // Circumference of the orbit ring (r=96): 2π×96 ≈ 603
  const C = 603;
  const sparkLen = 14;
  const gap = C - sparkLen;

  if (size === 'small') {
    return (
      <div style={{ width: s, height: s, position: 'relative', display: 'inline-block' }}>
        <svg viewBox="0 0 240 240" width={s} height={s} style={{ overflow: 'visible' }}>
          <defs>
            <clipPath id="imgClipSm">
              <circle cx="120" cy="120" r="110" />
            </clipPath>
            <filter id="glowSm" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {animated && (
            <motion.circle cx="120" cy="120" r="113" fill="none" stroke="#00C4B4" strokeWidth="1.5"
              animate={{ opacity: [0.2, 0.55, 0.2] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <image href="/crestara-logo.png" x="10" y="10" width="220" height="220"
            clipPath="url(#imgClipSm)" preserveAspectRatio="xMidYMid slice" />
        </svg>
      </div>
    );
  }

  return (
    <div style={{ width: s, height: s, display: 'inline-block', position: 'relative' }}>
      <svg viewBox="0 0 240 240" width={s} height={s}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}>
        <defs>
          <clipPath id="imgClipLg">
            <circle cx="120" cy="120" r="90" />
          </clipPath>

          {/* Soft radial glow behind the image */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#00C4B4" stopOpacity="0.12" />
            <stop offset="60%"  stopColor="#1E90FF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000"    stopOpacity="0" />
          </radialGradient>

          {/* Glow filter for the traveling spark */}
          <filter id="sparkGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Subtle edge vignette for the image */}
          <radialGradient id="edgeFade" cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#060d17" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* === Glow background === */}
        <circle cx="120" cy="120" r="108" fill="url(#centerGlow)" />

        {/* === The actual logo image, clipped to a clean circle === */}
        <image
          href="/crestara-logo.png"
          x="28" y="28" width="184" height="184"
          clipPath="url(#imgClipLg)"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Edge fade overlay so the image blends into background */}
        <circle cx="120" cy="120" r="90" fill="url(#edgeFade)" />

        {/* === Inner crisp ring === */}
        <circle cx="120" cy="120" r="90" fill="none" stroke="#00C4B4"
          strokeWidth="1" opacity="0.35" />

        {/* === Outer dashed reference ring === */}
        <circle cx="120" cy="120" r="108" fill="none" stroke="#C9A96E"
          strokeWidth="0.7" strokeDasharray="3 9" opacity="0.25" />

        {/* === Animated outer solid ring (slow rotation) === */}
        {animated && (
          <motion.circle cx="120" cy="120" r="108" fill="none"
            stroke="#1E90FF" strokeWidth="0.8" opacity="0.18"
            strokeDasharray="40 563"
            style={{ transformOrigin: '120px 120px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* === Traveling spark on the ring === */}
        {animated && (
          <>
            {/* Blurred glow duplicate */}
            <motion.circle cx="120" cy="120" r="108" fill="none"
              stroke="#00C4B4" strokeWidth="5"
              strokeDasharray={`${sparkLen} ${gap}`}
              filter="url(#sparkGlow)"
              style={{ transformOrigin: '120px 120px' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
            {/* Sharp spark */}
            <motion.circle cx="120" cy="120" r="108" fill="none"
              stroke="#fff" strokeWidth="1.5"
              strokeDasharray={`${sparkLen} ${gap}`}
              style={{ transformOrigin: '120px 120px' }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}

        {/* === Cardinal point markers (4 gold dots) === */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = ((deg - 90) * Math.PI) / 180;
          const px = Math.round((120 + 108 * Math.cos(rad)) * 100) / 100;
          const py = Math.round((120 + 108 * Math.sin(rad)) * 100) / 100;
          return (
            <circle key={deg} cx={px} cy={py} r="2.5"
              fill="#C9A96E" opacity="0.9" />
          );
        })}

        {/* === Outer pulse ring (slow breathe) === */}
        {animated && (
          <motion.circle cx="120" cy="120" r="116" fill="none"
            stroke="#00C4B4" strokeWidth="0.8"
            animate={{ opacity: [0, 0.22, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </svg>
    </div>
  );
}

export default CrestanaLogo;

'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  showText?: boolean;
}

const COINS = [
  { symbol: '₿', color: '#F7931A', bg: '#C9A96E', angle: 0,   r: 115, delay: 0,   size: 14 },
  { symbol: 'Ξ', color: '#fff',    bg: '#627EEA', angle: 72,  r: 118, delay: 0.5, size: 12 },
  { symbol: 'Ł', color: '#fff',    bg: '#B0B0B0', angle: 144, r: 112, delay: 1.0, size: 11 },
  { symbol: '✕', color: '#fff',    bg: '#00AAE4', angle: 216, r: 120, delay: 1.5, size: 10 },
  { symbol: '◎', color: '#fff',    bg: '#E84142', angle: 288, r: 113, delay: 0.8, size: 11 },
];

const R = (v: number) => Math.round(v * 1000) / 1000;

function CircuitRing({ cx, cy }: { cx: number; cy: number }) {
  const nodes = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      <circle cx={cx} cy={cy} r="96" fill="none" stroke="#00C4B4" strokeWidth="1.2" opacity="0.4" />
      {nodes.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const perp = rad + Math.PI / 2;
        const nx = R(cx + 96 * Math.cos(rad));
        const ny = R(cy + 96 * Math.sin(rad));
        const ox = R(cx + 108 * Math.cos(rad));
        const oy = R(cy + 108 * Math.sin(rad));
        return (
          <g key={i}>
            <rect
              x={nx - 3} y={ny - 3} width="6" height="6"
              fill={i % 2 === 0 ? '#00C4B4' : '#1E90FF'}
              opacity="0.85"
              transform={`rotate(${angle}, ${nx}, ${ny})`}
            />
            <line x1={nx} y1={ny} x2={ox} y2={oy} stroke="#1E90FF" strokeWidth="0.8" opacity="0.4" />
            {i % 2 === 0 && (
              <line
                x1={R(nx + 5 * Math.cos(perp))}
                y1={R(ny + 5 * Math.sin(perp))}
                x2={R(nx + 12 * Math.cos(perp))}
                y2={R(ny + 12 * Math.sin(perp))}
                stroke="#00C4B4" strokeWidth="0.7" opacity="0.3"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}

export function CrestanaLogo({ size = 'medium', animated = true }: LogoProps) {
  const sizeMap = { small: 44, medium: 80, large: 140, xlarge: 200 };
  const s = sizeMap[size];

  return (
    <div style={{ width: s, height: s, display: 'inline-block', position: 'relative' }}>
      <svg
        viewBox="0 0 240 240"
        width={s}
        height={s}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d2040" />
            <stop offset="70%" stopColor="#060d17" />
            <stop offset="100%" stopColor="#020508" />
          </radialGradient>
          <clipPath id="imgCircleClip">
            <circle cx="120" cy="120" r="86" />
          </clipPath>
          <filter id="fGold" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fTeal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fCoin" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fGlowBig" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Dark background circle */}
        <circle cx="120" cy="120" r="116" fill="url(#bgGrad)" />

        {/* Ambient gold glow behind center */}
        <circle cx="120" cy="120" r="80" fill="#C9A96E" opacity="0.07" filter="url(#fGlowBig)" />

        {/* The actual Crestara logo image — clipped to circle */}
        <image
          href="/crestara-logo.png"
          x="28"
          y="28"
          width="184"
          height="184"
          clipPath="url(#imgCircleClip)"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Teal edge ring over image */}
        <circle cx="120" cy="120" r="86" fill="none" stroke="#00C4B4" strokeWidth="1.5" opacity="0.3" />

        {/* Inner blue ring */}
        <circle cx="120" cy="120" r="92" fill="none" stroke="#1E90FF" strokeWidth="0.7" opacity="0.25" />

        {/* Animated outer gold pulse ring */}
        {animated ? (
          <motion.circle
            cx="120" cy="120" r="110"
            fill="none"
            stroke="#C9A96E"
            strokeWidth="1"
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <circle cx="120" cy="120" r="110" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.2" />
        )}

        {/* Circuit ring */}
        <CircuitRing cx={120} cy={120} />

        {/* Orbit path hints */}
        <ellipse cx="120" cy="120" rx="116" ry="42" fill="none" stroke="#C9A96E" strokeWidth="0.4" opacity="0.07" transform="rotate(-15 120 120)" />
        <ellipse cx="120" cy="120" rx="113" ry="44" fill="none" stroke="#1E90FF" strokeWidth="0.4" opacity="0.06" transform="rotate(35 120 120)" />

        {/* Orbiting crypto coins */}
        {COINS.map((coin, i) => {
          const rad = (coin.angle * Math.PI) / 180;
          const cx = R(120 + coin.r * Math.cos(rad));
          const cy = R(120 + coin.r * Math.sin(rad));
          const r = coin.size / 2 + 4;

          if (!animated) {
            return (
              <g key={i} opacity="0.8">
                <circle cx={cx} cy={cy} r={r + 1} fill={coin.bg} filter="url(#fCoin)" />
                <circle cx={cx} cy={cy} r={r} fill={coin.bg} />
                <circle cx={cx} cy={cy} r={r - 2} fill={coin.bg} stroke="#ffffff22" strokeWidth="0.5" />
                <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize={coin.size - 4} fill={coin.color} fontWeight="bold">
                  {coin.symbol}
                </text>
              </g>
            );
          }

          return (
            <motion.g
              key={i}
              style={{ transformOrigin: '120px 120px' }}
              animate={{ rotate: [0, 360] }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                ease: 'linear',
                delay: coin.delay,
              }}
            >
              <g opacity="0.92">
                <circle cx={cx} cy={cy} r={r + 2} fill={coin.bg} filter="url(#fCoin)" opacity="0.5" />
                <circle cx={cx} cy={cy} r={r} fill={coin.bg} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffffff30" strokeWidth="1" />
                <circle cx={cx} cy={cy} r={r - 2} fill={coin.bg} stroke="#ffffff20" strokeWidth="0.5" />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize={coin.size - 2} fill={coin.color} fontWeight="bold">
                  {coin.symbol}
                </text>
              </g>
            </motion.g>
          );
        })}

        {/* Spark / particle dots on circuit ring */}
        {[20, 55, 100, 155, 190, 230, 270, 310].map((angle, i) => {
          const r2 = 97 + (i % 3) * 4;
          const rad = (angle * Math.PI) / 180;
          const px = R(120 + r2 * Math.cos(rad));
          const py = R(120 + r2 * Math.sin(rad));
          return (
            <circle
              key={i}
              cx={px} cy={py} r="1.5"
              fill={i % 2 === 0 ? '#C9A96E' : '#00C4B4'}
              opacity="0.65"
              filter={i % 2 === 0 ? 'url(#fGold)' : 'url(#fTeal)'}
            />
          );
        })}

        {/* Corner accent dots */}
        <circle cx="110.5" cy="10"  r="3" fill="#C9A96E" opacity="0.7" filter="url(#fGold)" />
        <circle cx="129.5" cy="10"  r="3" fill="#C9A96E" opacity="0.7" filter="url(#fGold)" />
        <circle cx="110.5" cy="230" r="3" fill="#C9A96E" opacity="0.7" filter="url(#fGold)" />
        <circle cx="129.5" cy="230" r="3" fill="#C9A96E" opacity="0.7" filter="url(#fGold)" />
      </svg>
    </div>
  );
}

export default CrestanaLogo;

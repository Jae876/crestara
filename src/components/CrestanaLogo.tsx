'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  showText?: boolean;
}

export function CrestanaLogo({ size = 'medium', animated = true, showText = false }: LogoProps) {
  const sizeMap = {
    small: 44,
    medium: 80,
    large: 140,
    xlarge: 200,
  };
  const s = sizeMap[size];

  const coins = [
    { symbol: '₿', color: '#F7931A', bg: '#C9A96E', angle: 0, r: 115, delay: 0, size: 14 },
    { symbol: 'Ξ', color: '#fff', bg: '#627EEA', angle: 72, r: 118, delay: 0.5, size: 12 },
    { symbol: 'Ł', color: '#fff', bg: '#B0B0B0', angle: 144, r: 112, delay: 1, size: 11 },
    { symbol: '✕', color: '#fff', bg: '#00AAE4', angle: 216, r: 120, delay: 1.5, size: 10 },
    { symbol: '◎', color: '#fff', bg: '#E84142', angle: 288, r: 113, delay: 0.8, size: 11 },
  ];

  return (
    <div style={{ width: s, height: s, display: 'inline-block', position: 'relative' }}>
      <svg
        viewBox="0 0 240 240"
        width={s}
        height={s}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d2040" />
            <stop offset="70%" stopColor="#060d17" />
            <stop offset="100%" stopColor="#020508" />
          </radialGradient>

          <linearGradient id="metalC" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a7080" />
            <stop offset="25%" stopColor="#b8ccd4" />
            <stop offset="50%" stopColor="#eef2f4" />
            <stop offset="75%" stopColor="#b8ccd4" />
            <stop offset="100%" stopColor="#5a7080" />
          </linearGradient>

          <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a5a6a" stopOpacity="0" />
            <stop offset="15%" stopColor="#8aa0b0" />
            <stop offset="35%" stopColor="#d0dce4" />
            <stop offset="50%" stopColor="#f0f4f6" />
            <stop offset="65%" stopColor="#d0dce4" />
            <stop offset="85%" stopColor="#8aa0b0" />
            <stop offset="100%" stopColor="#4a5a6a" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="bladeEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C4B4" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#1E90FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00C4B4" stopOpacity="0.6" />
          </linearGradient>

          <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#C9A96E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C9A96E" stopOpacity="0" />
          </radialGradient>

          <filter id="fGold" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fTeal" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fSilver" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fBlue" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="fCoin" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <circle cx="120" cy="120" r="116" fill="url(#bgGrad)" />

        {/* Outer blue ring */}
        <circle cx="120" cy="120" r="104" fill="none" stroke="#1E90FF" strokeWidth="1" opacity="0.25" filter="url(#fBlue)" />
        <circle cx="120" cy="120" r="104" fill="none" stroke="#00C4B4" strokeWidth="0.5" opacity="0.5" />

        {/* Circuit ring system (rotates slowly) */}
        {animated ? (
          <motion.g
            style={{ transformOrigin: '120px 120px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <CircuitRing cx={120} cy={120} />
          </motion.g>
        ) : (
          <CircuitRing cx={120} cy={120} />
        )}

        {/* Gold inner glow ring */}
        {animated ? (
          <motion.circle
            cx="120" cy="120" r="76"
            fill="none" stroke="#C9A96E" strokeWidth="10" opacity="0.25"
            filter="url(#fGold)"
            animate={{ opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : (
          <circle cx="120" cy="120" r="76" fill="none" stroke="#C9A96E" strokeWidth="10" opacity="0.25" filter="url(#fGold)" />
        )}
        <circle cx="120" cy="120" r="76" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.5" filter="url(#fGold)" />

        {/* Inner circuit concentric rings */}
        <circle cx="120" cy="120" r="88" fill="none" stroke="#1E90FF" strokeWidth="0.8" opacity="0.3" />
        <circle cx="120" cy="120" r="82" fill="none" stroke="#00C4B4" strokeWidth="0.6" opacity="0.25" />

        {/* Large metallic C — opens to the right */}
        {/* Shadow depth */}
        <path
          d="M 163 46 A 80 80 0 1 0 163 194"
          fill="none"
          stroke="#0a1520"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Main C */}
        <path
          d="M 163 46 A 80 80 0 1 0 163 194"
          fill="none"
          stroke="url(#metalC)"
          strokeWidth="16"
          strokeLinecap="round"
          filter="url(#fSilver)"
        />
        {/* C inner blue edge highlight */}
        <path
          d="M 163 46 A 80 80 0 1 0 163 194"
          fill="none"
          stroke="#1E90FF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.45"
          filter="url(#fTeal)"
        />
        {/* C terminal arm highlights */}
        <line x1="120" y1="46" x2="163" y2="46" stroke="url(#metalC)" strokeWidth="14" strokeLinecap="round" />
        <line x1="120" y1="194" x2="163" y2="194" stroke="url(#metalC)" strokeWidth="14" strokeLinecap="round" />
        <line x1="128" y1="46" x2="163" y2="46" stroke="#00C4B4" strokeWidth="2.5" opacity="0.5" filter="url(#fTeal)" />
        <line x1="128" y1="194" x2="163" y2="194" stroke="#00C4B4" strokeWidth="2.5" opacity="0.5" filter="url(#fTeal)" />

        {/* === TWIN VERTICAL BLADE PILLARS === */}
        {/* Left blade */}
        <polygon
          points="109,6 106,42 104,120 106,198 109,234 112,198 114,120 112,42"
          fill="url(#bladeGrad)"
          filter="url(#fSilver)"
          opacity="0.97"
        />
        <line x1="110.5" y1="6" x2="110.5" y2="234" stroke="url(#bladeEdge)" strokeWidth="0.8" opacity="0.6" />

        {/* Right blade */}
        <polygon
          points="128,6 125,42 123,120 125,198 128,234 131,198 133,120 131,42"
          fill="url(#bladeGrad)"
          filter="url(#fSilver)"
          opacity="0.97"
        />
        <line x1="129.5" y1="6" x2="129.5" y2="234" stroke="url(#bladeEdge)" strokeWidth="0.8" opacity="0.6" />

        {/* Blade center glint */}
        {animated ? (
          <motion.rect
            x="104" y="108" width="26" height="24" rx="2"
            fill="#1E90FF" opacity="0.0"
            filter="url(#fTeal)"
            animate={{ opacity: [0, 0.25, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        ) : null}

        {/* Blade tip top glow */}
        <circle cx="110.5" cy="10" r="3" fill="#C9A96E" opacity="0.7" filter="url(#fGold)" />
        <circle cx="129.5" cy="10" r="3" fill="#C9A96E" opacity="0.7" filter="url(#fGold)" />
        <circle cx="110.5" cy="230" r="3" fill="#C9A96E" opacity="0.7" filter="url(#fGold)" />
        <circle cx="129.5" cy="230" r="3" fill="#C9A96E" opacity="0.7" filter="url(#fGold)" />

        {/* === ORBITING CRYPTO COINS === */}
        {coins.map((coin, i) => {
          const rad = (coin.angle * Math.PI) / 180;
          const cx = Math.round((120 + coin.r * Math.cos(rad)) * 1000) / 1000;
          const cy = Math.round((120 + coin.r * Math.sin(rad)) * 1000) / 1000;
          const r = coin.size / 2 + 4;

          if (!animated) {
            return (
              <g key={i} opacity="0.85">
                <circle cx={cx} cy={cy} r={r + 1} fill={coin.bg} filter="url(#fCoin)" />
                <circle cx={cx} cy={cy} r={r} fill={coin.bg} />
                <circle cx={cx} cy={cy} r={r - 2} fill={coin.bg} stroke="#ffffff22" strokeWidth="0.5" />
                <text x={cx} y={cy + 3.5} textAnchor="middle" fontSize={coin.size - 4} fill={coin.color} fontWeight="bold" style={{ fontSize: coin.size - 4 }}>{coin.symbol}</text>
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
              <g opacity="0.9">
                <circle cx={cx} cy={cy} r={r + 2} fill={coin.bg} filter="url(#fCoin)" opacity="0.5" />
                <circle cx={cx} cy={cy} r={r} fill={coin.bg} />
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffffff30" strokeWidth="1" />
                <circle cx={cx} cy={cy} r={r - 2} fill={coin.bg} stroke="#ffffff20" strokeWidth="0.5" />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize={coin.size - 2} fill={coin.color} fontWeight="bold">{coin.symbol}</text>
              </g>
            </motion.g>
          );
        })}

        {/* Sparks / particle dots */}
        {[20, 55, 100, 155, 190, 230, 270, 310].map((angle, i) => {
          const r2 = 97 + (i % 3) * 4;
          const rad = (angle * Math.PI) / 180;
          const px = Math.round((120 + r2 * Math.cos(rad)) * 1000) / 1000;
          const py = Math.round((120 + r2 * Math.sin(rad)) * 1000) / 1000;
          return (
            <circle key={i} cx={px} cy={py} r="1.5"
              fill={i % 2 === 0 ? '#C9A96E' : '#00C4B4'}
              opacity="0.6"
              filter={i % 2 === 0 ? 'url(#fGold)' : 'url(#fTeal)'}
            />
          );
        })}
      </svg>

      {showText && (
        <div style={{
          position: 'absolute',
          bottom: -s * 0.22,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontSize: s * 0.18,
          fontWeight: 700,
          letterSpacing: '0.05em',
          background: 'linear-gradient(90deg, #8aa0b0, #eef2f4, #8aa0b0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'Orbitron, system-ui, sans-serif',
        }}>
          Crestara
        </div>
      )}
    </div>
  );
}

function CircuitRing({ cx, cy }: { cx: number; cy: number }) {
  const nodes = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      <circle cx={cx} cy={cy} r="96" fill="none" stroke="#00C4B4" strokeWidth="1.2" opacity="0.4" />
      {nodes.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const R = (v: number) => Math.round(v * 1000) / 1000;
        const nx = R(cx + 96 * Math.cos(rad));
        const ny = R(cy + 96 * Math.sin(rad));
        const ox = R(cx + 108 * Math.cos(rad));
        const oy = R(cy + 108 * Math.sin(rad));
        const perp = rad + Math.PI / 2;
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

export default CrestanaLogo;

'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export function CrestanaLogo({ size = 'medium', animated = true }: LogoProps) {
  const sizes = {
    small: 'w-12 h-12',
    medium: 'w-24 h-24',
    large: 'w-40 h-40',
  };

  const svgSize = {
    small: 48,
    medium: 96,
    large: 160,
  };

  const LogoContent = (
    <svg
      viewBox="0 0 200 200"
      width={svgSize[size]}
      height={svgSize[size]}
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Main circle with circuit pattern */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00C4B4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1E90FF" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* Background circle with gradient */}
      <circle cx="100" cy="100" r="95" fill="url(#bgGradient)" />

      {/* Outer circuit ring */}
      <circle cx="100" cy="100" r="90" fill="none" stroke="#00C4B4" strokeWidth="2" opacity="0.6" filter="url(#glow)" />

      {/* Circuit patterns */}
      <g stroke="#00C4B4" strokeWidth="1.5" opacity="0.5">
        <line x1="100" y1="20" x2="100" y2="40" />
        <line x1="145" y1="45" x2="130" y2="60" />
        <line x1="160" y1="100" x2="140" y2="100" />
        <line x1="145" y1="155" x2="130" y2="140" />
        <line x1="100" y1="180" x2="100" y2="160" />
        <line x1="55" y1="155" x2="70" y2="140" />
        <line x1="40" y1="100" x2="60" y2="100" />
        <line x1="55" y1="45" x2="70" y2="60" />
      </g>

      {/* Top vertical blade/pillar */}
      <g fill="none" stroke="#D9D5C8" strokeWidth="4" filter="url(#glow)" strokeLinecap="round">
        <line x1="100" y1="20" x2="85" y2="60" />
        <line x1="100" y1="20" x2="115" y2="60" />
      </g>

      {/* Bottom vertical blade/pillar */}
      <g fill="none" stroke="#D9D5C8" strokeWidth="4" filter="url(#glow)" strokeLinecap="round">
        <line x1="85" y1="140" x2="100" y2="180" />
        <line x1="115" y1="140" x2="100" y2="180" />
      </g>

      {/* Large stylized C */}
      <path
        d="M 140 160 A 60 60 0 0 0 140 40"
        fill="none"
        stroke="#1E90FF"
        strokeWidth="5"
        filter="url(#glow)"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Central core */}
      <circle cx="100" cy="100" r="15" fill="#C9A96E" opacity="0.8" filter="url(#glow)" />

      {/* Orbiting coin indicators */}
      <g>
        <circle cx="160" cy="100" r="4" fill="#C9A96E" opacity="0.7" />
        <circle cx="145" cy="55" r="3" fill="#C9A96E" opacity="0.6" />
        <circle cx="100" cy="30" r="3" fill="#C9A96E" opacity="0.6" />
        <circle cx="55" cy="55" r="3" fill="#C9A96E" opacity="0.6" />
        <circle cx="40" cy="100" r="4" fill="#C9A96E" opacity="0.7" />
      </g>
    </svg>
  );

  if (!animated) {
    return <div className={sizes[size]}>{LogoContent}</div>;
  }

  return (
    <motion.div
      className={sizes[size]}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {LogoContent}
    </motion.div>
  );
}

export default CrestanaLogo;

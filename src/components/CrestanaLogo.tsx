'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  animated?: boolean;
  showText?: boolean;
}

export function CrestanaLogo({ size = 'medium', animated = true, showText = false }: LogoProps) {
  const sizeMap = {
    small:  44,
    medium: 80,
    large:  140,
    xlarge: 200,
  };
  const s = sizeMap[size];

  const imgEl = (
    <Image
      src="/crestara-logo.png"
      alt="Crestara Logo"
      width={s}
      height={s}
      style={{ width: s, height: s, objectFit: 'contain', display: 'block' }}
      priority
    />
  );

  if (animated) {
    return (
      <motion.div
        style={{ width: s, height: s, display: 'inline-block' }}
        animate={{ filter: ['drop-shadow(0 0 8px rgba(0,196,180,0.4))', 'drop-shadow(0 0 22px rgba(0,196,180,0.8))', 'drop-shadow(0 0 8px rgba(0,196,180,0.4))'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {imgEl}
      </motion.div>
    );
  }

  return (
    <div style={{ width: s, height: s, display: 'inline-block' }}>
      {imgEl}
    </div>
  );
}

export default CrestanaLogo;

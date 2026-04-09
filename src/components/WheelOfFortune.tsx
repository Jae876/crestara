'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api-client';

const SEGMENTS = [
  { label: '$500\nJackpot!', color: '#c9a96e', textColor: '#000' },
  { label: '50 Free\nSpins', color: '#00c4b4', textColor: '#000' },
  { label: '2x\nBonus', color: '#1e90ff', textColor: '#fff' },
  { label: '$250\nPrize', color: '#f56565', textColor: '#fff' },
  { label: '100 Free\nSpins', color: '#48bb78', textColor: '#000' },
  { label: '5x\nMultiplier', color: '#9f7aea', textColor: '#fff' },
  { label: '$1,000\nJackpot!', color: '#c9a96e', textColor: '#000' },
  { label: '25 Free\nSpins', color: '#00c4b4', textColor: '#000' },
  { label: '3x\nBonus', color: '#1e90ff', textColor: '#fff' },
  { label: '$100\nPrize', color: '#f56565', textColor: '#fff' },
  { label: '200 Free\nSpins', color: '#48bb78', textColor: '#000' },
  { label: '10x\nMultiplier', color: '#9f7aea', textColor: '#fff' },
];

const NUM_SEGMENTS = SEGMENTS.length;
const SEGMENT_ANGLE = 360 / NUM_SEGMENTS;

interface Props {
  wheelSpinId: string;
  spinsRemaining: number;
  depositAmount?: number;
  onClose: () => void;
  onSpinComplete: (prizeAmount: number) => void;
}

export function WheelOfFortune({ wheelSpinId, spinsRemaining, onClose, onSpinComplete }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ label: string; amount: number } | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(spinsRemaining);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const currentRotationRef = useRef(0);

  useEffect(() => {
    drawWheel(0);
  }, []);

  function drawWheel(angle: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = cx - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    SEGMENTS.forEach((seg, i) => {
      const startAngle = ((i * SEGMENT_ANGLE - 90 + angle) * Math.PI) / 180;
      const endAngle = (((i + 1) * SEGMENT_ANGLE - 90 + angle) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((startAngle + endAngle) / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = seg.textColor;
      ctx.font = 'bold 10px "Orbitron", system-ui';
      const lines = seg.label.split('\n');
      lines.forEach((line, li) => {
        ctx.fillText(line, radius - 10, (li - (lines.length - 1) / 2) * 13);
      });
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#060d17';
    ctx.fill();
    ctx.strokeStyle = '#00c4b4';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  async function handleSpin() {
    if (spinning || spinsLeft <= 0) return;
    setError(null);
    setResult(null);
    setSpinning(true);

    try {
      const { data } = await apiClient.post('/wheel/spin', { wheelSpinId });
      const { prizeLabel, prizeAmount } = data;

      const fullRotations = 5 + Math.floor(Math.random() * 5);
      const targetSegmentIndex = Math.floor(Math.random() * NUM_SEGMENTS);
      const segmentCenter = targetSegmentIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
      const totalRotation = fullRotations * 360 + (360 - segmentCenter);

      const startRotation = currentRotationRef.current;
      const duration = 4000;
      const startTime = performance.now();

      function easeOut(t: number) {
        return 1 - Math.pow(1 - t, 4);
      }

      function animate(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const easedT = easeOut(t);
        const currentAngle = startRotation + easedT * totalRotation;
        currentRotationRef.current = currentAngle;
        drawWheel(currentAngle % 360);

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setSpinning(false);
          setSpinsLeft((prev) => prev - 1);
          setResult({ label: prizeLabel, amount: prizeAmount });
          onSpinComplete(prizeAmount);
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    } catch (err: any) {
      setSpinning(false);
      setError(err?.response?.data?.error || 'Spin failed. Try again.');
    }
  }

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        style={{
          background: 'linear-gradient(135deg, #0a1520 0%, #0d2040 100%)',
          border: '1px solid rgba(0,196,180,0.3)',
          borderRadius: '1.25rem',
          padding: '2rem',
          boxShadow: '0 0 60px rgba(0,196,180,0.15)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl leading-none"
          style={{ color: '#4a5a6a' }}
        >
          ×
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Orbitron, system-ui', color: '#c9a96e' }}>
            🎡 Wheel of Fortune
          </h2>
          <p className="text-sm" style={{ color: '#6b7e96' }}>
            {spinsLeft > 0
              ? `${spinsLeft} spin${spinsLeft !== 1 ? 's' : ''} remaining`
              : 'All spins used!'}
          </p>
        </div>

        <div className="relative flex justify-center mb-6">
          <div style={{ position: 'relative', width: 280, height: 280 }}>
            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              style={{ borderRadius: '50%', boxShadow: '0 0 40px rgba(0,196,180,0.25)' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: -10,
                transform: 'translateY(-50%)',
                width: 0,
                height: 0,
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent',
                borderRight: '22px solid #c9a96e',
                filter: 'drop-shadow(0 0 6px rgba(201,169,110,0.8))',
              }}
            />
          </div>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 rounded-xl text-center"
              style={{ background: 'rgba(0,196,180,0.08)', border: '1px solid rgba(0,196,180,0.3)' }}
            >
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-bold text-lg mb-1" style={{ color: '#c9a96e', fontFamily: 'Orbitron, system-ui' }}>
                You won ${result.amount.toFixed(2)}!
              </p>
              <p className="text-xs" style={{ color: '#6b7e96' }}>
                Credited to your balance instantly
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg text-sm text-center" style={{ background: 'rgba(245,101,101,0.1)', border: '1px solid rgba(245,101,101,0.3)', color: '#f56565' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSpin}
          disabled={spinning || spinsLeft <= 0}
          className="w-full font-bold py-4 rounded-xl text-sm transition-all"
          style={{
            fontFamily: 'Orbitron, system-ui',
            letterSpacing: '0.1em',
            background: spinning || spinsLeft <= 0
              ? 'rgba(26,48,80,0.5)'
              : 'linear-gradient(135deg, #c9a96e, #e8c46a)',
            color: spinning || spinsLeft <= 0 ? '#4a5a6a' : '#000',
            cursor: spinning || spinsLeft <= 0 ? 'not-allowed' : 'pointer',
            boxShadow: spinning || spinsLeft <= 0 ? 'none' : '0 0 20px rgba(201,169,110,0.4)',
          }}
        >
          {spinning ? 'Spinning...' : spinsLeft > 0 ? '🎡 SPIN!' : 'No Spins Left'}
        </button>

        {spinsLeft === 0 && (
          <button
            onClick={onClose}
            className="w-full mt-3 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(13,32,64,0.6)', border: '1px solid #1a3050', color: '#6b7e96' }}
          >
            Close
          </button>
        )}
      </motion.div>
    </div>
  );
}

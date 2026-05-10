'use client';
import { motion } from 'framer-motion';

interface BoxClosedProps {
  templateId: string;
  onClick: () => void;
  shaking: boolean;
}

const TEMPLATE_COLORS: Record<string, { box: string; ribbon: string; lid: string }> = {
  'pastel-pink': { box: '#FFFFFF', ribbon: '#F9A8D4', lid: '#FECDD3' },
  'midnight-blue': { box: '#1E3A5F', ribbon: '#60A5FA', lid: '#1E40AF' },
  'warm-cream': { box: '#FFFBEB', ribbon: '#FCD34D', lid: '#FEF3C7' },
  'confetti': { box: '#FFFFFF', ribbon: '#A855F7', lid: '#F3E8FF' },
};

export function BoxClosed({ templateId, onClick, shaking }: BoxClosedProps) {
  const colors = TEMPLATE_COLORS[templateId] ?? TEMPLATE_COLORS['pastel-pink'];

  return (
    <motion.div
      className="flex flex-col items-center cursor-pointer select-none"
      onClick={onClick}
      animate={shaking ? { rotate: [0, -4, 4, -3, 3, 0] } : { y: [0, -12, 0] }}
      transition={
        shaking
          ? { duration: 0.4, ease: 'easeInOut' }
          : { duration: 3, ease: 'easeInOut', repeat: Infinity }
      }
      whileHover={{ scale: 1.03 }}
    >
      <svg
        width="260"
        height="240"
        viewBox="0 0 260 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        {/* Box body */}
        <rect x="20" y="110" width="220" height="120" rx="6" fill={colors.box} stroke="#E5E7EB" strokeWidth="2"/>
        {/* Vertical ribbon on body */}
        <rect x="115" y="110" width="30" height="120" fill={colors.ribbon} opacity="0.7"/>
        {/* Horizontal ribbon on body */}
        <rect x="20" y="162" width="220" height="18" fill={colors.ribbon} opacity="0.5"/>

        {/* Lid */}
        <rect x="10" y="80" width="240" height="36" rx="6" fill={colors.lid} stroke="#E5E7EB" strokeWidth="2"/>
        {/* Vertical ribbon on lid */}
        <rect x="115" y="80" width="30" height="36" fill={colors.ribbon} opacity="0.7"/>

        {/* Bow left loop */}
        <ellipse cx="100" cy="80" rx="32" ry="20" fill={colors.ribbon} transform="rotate(-20 100 80)"/>
        {/* Bow right loop */}
        <ellipse cx="160" cy="80" rx="32" ry="20" fill={colors.ribbon} transform="rotate(20 160 80)"/>
        {/* Bow center knot */}
        <ellipse cx="130" cy="80" rx="14" ry="11" fill={colors.ribbon}/>

        {/* Bow tails */}
        <path d="M120 88 Q105 105 95 115" stroke={colors.ribbon} strokeWidth="8" strokeLinecap="round"/>
        <path d="M140 88 Q155 105 165 115" stroke={colors.ribbon} strokeWidth="8" strokeLinecap="round"/>

        {/* Sparkles */}
        <text x="30" y="75" fontSize="14" opacity="0.6">✨</text>
        <text x="215" y="90" fontSize="12" opacity="0.5">⭐</text>
        <text x="22" y="200" fontSize="12" opacity="0.4">💫</text>
      </svg>

      <motion.p
        className="mt-4 text-gray-600 text-sm font-medium tracking-wide"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✨ Click to open your gift
      </motion.p>
    </motion.div>
  );
}

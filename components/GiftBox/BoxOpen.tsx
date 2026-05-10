'use client';
import { motion } from 'framer-motion';

interface BoxOpenProps {
  templateId: string;
  children: React.ReactNode;
}

const TEMPLATE_COLORS: Record<string, { box: string; ribbon: string }> = {
  'pastel-pink': { box: '#FFFFFF', ribbon: '#F9A8D4' },
  'midnight-blue': { box: '#1E3A5F', ribbon: '#60A5FA' },
  'warm-cream': { box: '#FFFBEB', ribbon: '#FCD34D' },
  'confetti': { box: '#FFFFFF', ribbon: '#A855F7' },
};

export function BoxOpen({ templateId, children }: BoxOpenProps) {
  const colors = TEMPLATE_COLORS[templateId] ?? TEMPLATE_COLORS['pastel-pink'];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Floating lid */}
      <motion.div
        className="flex justify-center mb-2 pointer-events-none"
        initial={{ y: 0, rotateX: 0, opacity: 1 }}
        animate={{ y: -90, rotateX: -40, opacity: 0.85 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ perspective: 800 }}
      >
        <svg width="320" height="50" viewBox="0 0 320 50" fill="none">
          <rect x="0" y="10" width="320" height="40" rx="6" fill={colors.box} stroke="#E5E7EB" strokeWidth="2"/>
          <rect x="145" y="10" width="30" height="40" fill={colors.ribbon} opacity="0.7"/>
          {/* Bow */}
          <ellipse cx="125" cy="14" rx="28" ry="14" fill={colors.ribbon} transform="rotate(-20 125 14)"/>
          <ellipse cx="195" cy="14" rx="28" ry="14" fill={colors.ribbon} transform="rotate(20 195 14)"/>
          <ellipse cx="160" cy="14" rx="14" ry="10" fill={colors.ribbon}/>
        </svg>
      </motion.div>

      {/* Box body containing the interior */}
      <motion.div
        className="relative rounded-b-2xl overflow-hidden shadow-2xl border-2 border-gray-100"
        style={{ backgroundColor: colors.box, minHeight: 420 }}
        initial={{ scaleY: 0.9, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Ribbon vertical stripe */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-7 opacity-60 pointer-events-none z-10"
          style={{ backgroundColor: colors.ribbon }}
        />
        {children}
      </motion.div>
    </div>
  );
}

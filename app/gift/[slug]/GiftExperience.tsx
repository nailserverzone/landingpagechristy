'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BoxClosed } from '@/components/GiftBox/BoxClosed';
import { BoxOpen } from '@/components/GiftBox/BoxOpen';
import { BoxInterior } from '@/components/GiftBox/BoxInterior';
import { launchConfetti } from '@/lib/confetti';
import type { Gift } from '@/types/gift';

interface GiftExperienceProps {
  gift: Gift;
}

const BG_COLORS: Record<string, string> = {
  'pastel-pink': '#F7D6D6',
  'midnight-blue': '#1a2540',
  'warm-cream': '#FFF3E0',
  'confetti': '#F3E8FF',
};

export function GiftExperience({ gift }: GiftExperienceProps) {
  const [opened, setOpened] = useState(false);
  const [shaking, setShaking] = useState(false);

  // Auto-shake hint after 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = async () => {
    if (opened) return;
    setOpened(true);
    await launchConfetti();
  };

  const bg = BG_COLORS[gift.template_id] ?? BG_COLORS['pastel-pink'];
  const isDark = gift.template_id === 'midnight-blue';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 transition-colors duration-700"
      style={{ backgroundColor: bg }}
    >
      {/* Recipient greeting */}
      <AnimatePresence>
        {!opened && (
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className={`text-sm uppercase tracking-widest mb-2 ${isDark ? 'text-blue-300' : 'text-gray-400'}`}>
              A special {gift.occasion} gift
            </p>
            <h1 className={`font-serif text-3xl md:text-4xl ${isDark ? 'text-white' : 'text-[#1E2D5A]'}`}>
              For {gift.recipient_name} 🎁
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Box */}
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              className="flex justify-center"
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4 }}
            >
              <BoxClosed
                templateId={gift.template_id}
                onClick={handleOpen}
                shaking={shaking}
              />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Greeting after open */}
              <motion.div
                className="text-center mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <p className={`font-serif text-2xl ${isDark ? 'text-white' : 'text-[#1E2D5A]'}`}>
                  Happy {gift.occasion}, {gift.recipient_name}! ✨
                </p>
                <p className={`text-sm mt-1 ${isDark ? 'text-blue-300' : 'text-gray-400'}`}>
                  Tap each item to reveal your gift
                </p>
              </motion.div>

              <BoxOpen templateId={gift.template_id}>
                <BoxInterior gift={gift} />
              </BoxOpen>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <p className={`mt-8 text-xs ${isDark ? 'text-blue-400/50' : 'text-gray-300'}`}>
        Made with ❤️ · Digital Gift Box
      </p>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemModal } from '../ItemModal';
import { Gift } from '@/types/gift';

interface LetterItemProps {
  gift: Gift;
}

export function LetterItem({ gift }: LetterItemProps) {
  const [open, setOpen] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setEnvelopeOpen(false);
    setShowLetter(false);
    // Stagger: open envelope, then reveal letter
    setTimeout(() => setEnvelopeOpen(true), 200);
    setTimeout(() => setShowLetter(true), 1000);
  };

  const handleClose = () => {
    setShowLetter(false);
    setEnvelopeOpen(false);
    setTimeout(() => setOpen(false), 400);
  };

  return (
    <>
      {/* Thumbnail */}
      <motion.button
        onClick={handleOpen}
        className="absolute cursor-pointer focus:outline-none"
        style={{ bottom: '5%', left: '5%', width: '30%', zIndex: 2, transform: 'rotate(2deg)' }}
        whileHover={{ scale: 1.08, rotate: 0, zIndex: 20, transition: { duration: 0.2 } }}
        title="Open Letter"
      >
        {/* Envelope SVG */}
        <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
          <rect x="2" y="2" width="116" height="76" rx="6" fill="#FFF8F0" stroke="#E8C9A0" strokeWidth="2"/>
          {/* Envelope flap */}
          <path d="M2 2 L60 44 L118 2 Z" fill="#F5E6C8" stroke="#E8C9A0" strokeWidth="1.5"/>
          {/* Envelope body fold lines */}
          <path d="M2 78 L42 44" stroke="#E8C9A0" strokeWidth="1.2"/>
          <path d="M118 78 L78 44" stroke="#E8C9A0" strokeWidth="1.2"/>
          {/* Wax seal */}
          <circle cx="60" cy="54" r="10" fill="#C0392B"/>
          <text x="55" y="58" fontSize="10" fill="white">❤</text>
        </svg>
        <p className="text-center text-xs text-gray-500 mt-1 font-medium">💌 Letter</p>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/55 backdrop-blur-[12px]"
              onClick={handleClose}
            />
            <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
              {/* Close */}
              <button
                onClick={handleClose}
                className="absolute -top-3 -right-3 z-20 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-500 hover:scale-110 transition-all"
              >✕</button>

              {/* Envelope flap animation */}
              <AnimatePresence>
                {!showLetter && (
                  <motion.div
                    className="w-64"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Body */}
                      <rect x="2" y="2" width="116" height="76" rx="6" fill="#FFF8F0" stroke="#E8C9A0" strokeWidth="2"/>
                      {/* Animated flap */}
                      <motion.path
                        d="M2 2 L60 44 L118 2 Z"
                        fill="#F5E6C8"
                        stroke="#E8C9A0"
                        strokeWidth="1.5"
                        animate={envelopeOpen ? { scaleY: -1, y: -44 } : { scaleY: 1, y: 0 }}
                        style={{ transformOrigin: '60px 2px' }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                      />
                      <path d="M2 78 L42 44" stroke="#E8C9A0" strokeWidth="1.2"/>
                      <path d="M118 78 L78 44" stroke="#E8C9A0" strokeWidth="1.2"/>
                      <circle cx="60" cy="54" r="10" fill="#C0392B"/>
                      <text x="55" y="58" fontSize="10" fill="white">❤</text>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Letter content */}
              <AnimatePresence>
                {showLetter && (
                  <motion.div
                    className="w-full bg-[#FFF8F0] rounded-2xl shadow-2xl overflow-hidden"
                    initial={{ scale: 0.7, y: 40, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                  >
                    {/* Decorative header */}
                    <div className="flex items-center justify-center py-4 border-b border-amber-100">
                      <div className="w-12 h-px bg-amber-300" />
                      <span className="mx-3 text-amber-400 text-lg">✦</span>
                      <div className="w-12 h-px bg-amber-300" />
                    </div>

                    <div className="p-8 max-h-[60vh] overflow-y-auto">
                      <p className="font-serif italic text-gray-600 text-base mb-4">
                        Dear {gift.recipient_name},
                      </p>
                      <div className="font-serif text-gray-800 leading-relaxed text-base whitespace-pre-line">
                        {gift.letter_html}
                      </div>
                      <div className="mt-6 pt-4 border-t border-amber-100 text-right">
                        <p className="font-serif italic text-gray-500 text-sm">
                          With love, on your {gift.occasion} {gift.occasion_year}
                        </p>
                      </div>
                    </div>

                    {/* Wax seal decoration */}
                    <div className="flex justify-center pb-6">
                      <div className="w-12 h-12 bg-[#C0392B] rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-lg">❤</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

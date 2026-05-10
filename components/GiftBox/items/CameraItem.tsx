'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { Gift } from '@/types/gift';

interface CameraItemProps {
  gift: Gift;
}

export function CameraItem({ gift }: CameraItemProps) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const photos = gift.photos ?? [];

  const next = () => setIdx((i) => (i + 1) % photos.length);
  const prev = () => setIdx((i) => (i - 1 + photos.length) % photos.length);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  if (photos.length === 0) return null;

  return (
    <>
      {/* Thumbnail */}
      <motion.button
        onClick={() => { setOpen(true); setIdx(0); }}
        className="absolute cursor-pointer focus:outline-none"
        style={{ top: '3%', right: '3%', width: '26%', zIndex: 2, transform: 'rotate(3deg)' }}
        whileHover={{ scale: 1.08, rotate: 1, zIndex: 20, transition: { duration: 0.2 } }}
        title="Photos"
      >
        {/* Camera SVG */}
        <svg viewBox="0 0 100 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md w-full">
          <rect x="4" y="16" width="92" height="52" rx="7" fill="#222"/>
          <rect x="4" y="16" width="92" height="12" rx="4" fill="#333"/>
          <rect x="28" y="4" width="44" height="16" rx="5" fill="#333"/>
          <rect x="36" y="7" width="28" height="10" rx="3" fill="#444"/>
          {/* Lens */}
          <circle cx="50" cy="46" r="18" fill="#111"/>
          <circle cx="50" cy="46" r="14" fill="#1a1a2e"/>
          <circle cx="50" cy="46" r="9" fill="#0d1117"/>
          <circle cx="45" cy="41" r="3" fill="white" opacity="0.3"/>
          {/* Flash */}
          <rect x="74" y="22" width="14" height="9" rx="2" fill="#FCD34D"/>
          {/* Shutter */}
          <circle cx="80" cy="12" r="5" fill="#555"/>
        </svg>
        <p className="text-center text-xs text-gray-500 mt-1 font-medium">📸 Photos ({photos.length})</p>
      </motion.button>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg transition-colors"
            >✕</button>

            {/* Counter */}
            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {idx + 1} / {photos.length}
            </p>

            {/* Photo with polaroid frame */}
            <div {...handlers} className="relative flex items-center justify-center w-full px-12">
              <button
                onClick={prev}
                className="absolute left-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg transition-colors"
                disabled={photos.length <= 1}
              >‹</button>

              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white p-3 pb-10 shadow-2xl"
                  style={{ maxWidth: 'min(90vw, 480px)' }}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={photos[idx]}
                      alt={`Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="text-center text-gray-400 text-xs mt-2 font-serif italic">
                    {gift.occasion} {gift.occasion_year} ♥
                  </p>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={next}
                className="absolute right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-lg transition-colors"
                disabled={photos.length <= 1}
              >›</button>
            </div>

            {/* Dot indicators */}
            <div className="flex gap-2 mt-6">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/30'}`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

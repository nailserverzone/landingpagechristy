'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ItemModal } from '../ItemModal';
import { Gift } from '@/types/gift';

interface IdBadgeItemProps {
  gift: Gift;
}

export function IdBadgeItem({ gift }: IdBadgeItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <motion.button
        onClick={() => setOpen(true)}
        className="absolute cursor-pointer focus:outline-none"
        style={{ top: '3%', left: '36%', width: '28%', zIndex: 2, transform: 'rotate(1deg)' }}
        whileHover={{ scale: 1.08, rotate: 0, zIndex: 20, transition: { duration: 0.2 } }}
        title="ID Badge"
      >
        {/* Lanyard */}
        <div className="flex justify-center mb-1">
          <div className="w-1 h-6 bg-[#7C3AED] rounded-full" />
        </div>
        {/* Badge thumbnail */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#7C3AED]/30">
          <div className="bg-[#7C3AED] h-3 w-full" />
          <div className="p-2">
            <div className="flex gap-1 items-start">
              {/* Photo placeholder */}
              <div className="w-8 h-10 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                <span className="text-gray-400 text-lg">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-bold text-[#7C3AED] uppercase truncate">Special</p>
                <p className="text-[7px] text-gray-700 font-semibold truncate">{gift.recipient_name}</p>
                <p className="text-[6px] text-gray-400">{gift.occasion}</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-1 font-medium">🪪 ID Badge</p>
      </motion.button>

      {/* Modal */}
      <ItemModal open={open} onClose={() => setOpen(false)} className="w-full max-w-xs">
        <div className="flex flex-col items-center">
          {/* Lanyard */}
          <div className="w-2 h-12 bg-[#7C3AED] rounded-full mb-0" />
          <div className="w-6 h-3 bg-[#7C3AED]/50 rounded-b-full mb-1" />

          {/* Badge card */}
          <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#7C3AED]/20">
            {/* Header bar */}
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] p-3 flex items-center gap-2">
              <div className="flex-1">
                <p className="text-white/70 text-[10px] uppercase tracking-widest">Special Celebration</p>
                <p className="text-white font-bold text-sm">{gift.occasion}</p>
              </div>
              <div className="text-white text-2xl">🎊</div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex gap-4 items-start mb-4">
                {/* Photo slot */}
                <div className="w-20 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 flex-shrink-0">
                  <span className="text-4xl">👤</span>
                </div>
                {/* Fields */}
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-[10px] text-[#7C3AED] font-semibold uppercase tracking-widest">Name</p>
                    <p className="font-bold text-gray-800 text-base">{gift.recipient_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#7C3AED] font-semibold uppercase tracking-widest">Year</p>
                    <p className="font-semibold text-gray-700">{gift.occasion_year}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#7C3AED] font-semibold uppercase tracking-widest">Title</p>
                    <p className="font-semibold text-gray-700">{gift.occasion} Celebrant</p>
                  </div>
                </div>
              </div>

              {/* ID line */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">ID No.</p>
                <p className="font-mono text-gray-600 text-xs">{gift.slug.toUpperCase()}</p>
              </div>

              {/* Barcode decoration */}
              <div className="mt-3 flex gap-px">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="flex-1 bg-gray-800 rounded-sm" style={{ height: i % 3 === 0 ? 20 : 14 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ItemModal>
    </>
  );
}

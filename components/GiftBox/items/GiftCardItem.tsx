'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ItemModal } from '../ItemModal';
import { Gift } from '@/types/gift';

const BRAND_GRADIENTS: Record<string, string> = {
  amazon: 'from-[#FF9900] to-[#FF6600]',
  starbucks: 'from-[#00704A] to-[#1E3932]',
  target: 'from-[#CC0000] to-[#990000]',
  apple: 'from-gray-800 to-gray-600',
  spotify: 'from-[#1DB954] to-[#158a3e]',
  default: 'from-[#1E2D5A] to-[#2a3d7a]',
};

function getBrandGradient(brand?: string | null) {
  if (!brand) return BRAND_GRADIENTS.default;
  const key = brand.toLowerCase();
  return Object.entries(BRAND_GRADIENTS).find(([k]) => key.includes(k))?.[1] ?? BRAND_GRADIENTS.default;
}

interface GiftCardItemProps {
  gift: Gift;
}

export function GiftCardItem({ gift }: GiftCardItemProps) {
  const [open, setOpen] = useState(false);
  const hasCard = gift.gift_card_image_url || gift.gift_card_code || gift.gift_card_brand;
  if (!hasCard) return null;

  return (
    <>
      {/* Thumbnail */}
      <motion.button
        onClick={() => setOpen(true)}
        className="absolute cursor-pointer focus:outline-none"
        style={{ top: '4%', left: '3%', width: '28%', zIndex: 2, transform: 'rotate(-4deg)' }}
        whileHover={{ scale: 1.08, rotate: -2, zIndex: 20, transition: { duration: 0.2 } }}
        title="Gift Card"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-white/80 aspect-[1.6/1]">
          {gift.gift_card_image_url ? (
            <Image src={gift.gift_card_image_url} alt="Gift card" fill className="object-cover" unoptimized />
          ) : (
            <div className={`h-full w-full bg-gradient-to-br ${getBrandGradient(gift.gift_card_brand)} flex flex-col items-center justify-center p-2`}>
              <p className="text-white font-bold text-xs uppercase tracking-wider">{gift.gift_card_brand || 'Gift Card'}</p>
              {gift.gift_card_code && (
                <p className="text-white/70 font-mono text-[10px] mt-1">{gift.gift_card_code.slice(0, 8)}…</p>
              )}
            </div>
          )}
        </div>
        <p className="text-center text-xs text-gray-500 mt-1 font-medium">🎁 Gift Card</p>
      </motion.button>

      {/* Modal */}
      <ItemModal open={open} onClose={() => setOpen(false)} className="w-full max-w-md">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {gift.gift_card_image_url ? (
            <div className="relative aspect-[1.6/1] w-full">
              <Image src={gift.gift_card_image_url} alt="Gift card" fill className="object-contain" unoptimized />
            </div>
          ) : (
            <div className={`bg-gradient-to-br ${getBrandGradient(gift.gift_card_brand)} p-10 flex flex-col items-center gap-4`}>
              <div className="bg-white/20 rounded-2xl px-8 py-6 text-center">
                <p className="text-white font-bold text-2xl tracking-wide">
                  {gift.gift_card_brand || 'Gift Card'}
                </p>
                {gift.gift_card_code && (
                  <>
                    <p className="text-white/70 text-sm mt-2">Your code</p>
                    <p className="text-white font-mono text-xl tracking-widest mt-1 bg-white/10 rounded-lg px-4 py-2">
                      {gift.gift_card_code}
                    </p>
                  </>
                )}
              </div>
              <p className="text-white/60 text-xs">Tap the code to copy</p>
            </div>
          )}
          {gift.gift_card_code && (
            <button
              className="w-full py-3 bg-gray-50 text-center text-sm font-mono text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => navigator.clipboard.writeText(gift.gift_card_code ?? '')}
            >
              📋 Copy code: {gift.gift_card_code}
            </button>
          )}
        </div>
      </ItemModal>
    </>
  );
}

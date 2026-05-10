'use client';
import { motion } from 'framer-motion';
import { GiftCardItem } from './items/GiftCardItem';
import { LetterItem } from './items/LetterItem';
import { IdBadgeItem } from './items/IdBadgeItem';
import { CameraItem } from './items/CameraItem';
import { CdItem } from './items/CdItem';
import { Gift } from '@/types/gift';

interface BoxInteriorProps {
  gift: Gift;
}

// Decorative shred SVG strip
function Shred({ x, width, height, opacity = 1 }: { x: string; width: string; height: string; opacity?: number }) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        bottom: 0,
        width,
        height,
        backgroundColor: '#B8DCEA',
        borderRadius: '40% 40% 0 0',
        opacity,
        zIndex: 0,
      }}
    />
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 18, stiffness: 220 } },
};

export function BoxInterior({ gift }: BoxInteriorProps) {
  return (
    <div className="relative w-full" style={{ minHeight: 420 }}>
      {/* Blue shreds background */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ backgroundColor: '#D4EDFA', zIndex: 0, borderRadius: '0 0 16px 16px' }}
      >
        <Shred x="2%" width="8%" height="70%" opacity={0.8} />
        <Shred x="11%" width="6%" height="80%" opacity={0.6} />
        <Shred x="18%" width="9%" height="65%" opacity={0.9} />
        <Shred x="28%" width="7%" height="75%" opacity={0.7} />
        <Shred x="36%" width="5%" height="60%" opacity={0.85} />
        <Shred x="42%" width="8%" height="85%" opacity={0.7} />
        <Shred x="51%" width="6%" height="70%" opacity={0.8} />
        <Shred x="58%" width="9%" height="65%" opacity={0.6} />
        <Shred x="68%" width="7%" height="80%" opacity={0.75} />
        <Shred x="76%" width="6%" height="60%" opacity={0.9} />
        <Shred x="83%" width="8%" height="75%" opacity={0.65} />
        <Shred x="92%" width="6%" height="70%" opacity={0.8} />
      </div>

      {/* Items grid — absolutely positioned within the box */}
      <motion.div
        className="relative z-10 w-full"
        style={{ minHeight: 420, padding: '12px 8px' }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="absolute inset-0">
          <GiftCardItem gift={gift} />
        </motion.div>
        <motion.div variants={itemVariants} className="absolute inset-0">
          <IdBadgeItem gift={gift} />
        </motion.div>
        <motion.div variants={itemVariants} className="absolute inset-0">
          <CameraItem gift={gift} />
        </motion.div>
        <motion.div variants={itemVariants} className="absolute inset-0">
          <LetterItem gift={gift} />
        </motion.div>
        <motion.div variants={itemVariants} className="absolute inset-0">
          <CdItem gift={gift} />
        </motion.div>

        {/* Flower decoration — static */}
        <div
          className="absolute pointer-events-none select-none"
          style={{ bottom: '5%', left: '22%', fontSize: '2.5rem', transform: 'rotate(-10deg)', zIndex: 1 }}
        >
          🌸
        </div>
        <div
          className="absolute pointer-events-none select-none"
          style={{ bottom: '8%', left: '28%', fontSize: '2rem', transform: 'rotate(5deg)', zIndex: 1 }}
        >
          🌷
        </div>
      </motion.div>
    </div>
  );
}

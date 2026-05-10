'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ItemModal } from '../ItemModal';
import { Gift } from '@/types/gift';

interface CdItemProps {
  gift: Gift;
}

function getEmbedUrl(url: string): string | null {
  if (!url) return null;
  // Spotify playlist/track
  if (url.includes('spotify.com')) {
    const match = url.match(/spotify\.com\/(track|playlist|album|artist)\/([a-zA-Z0-9]+)/);
    if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`;
  }
  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const listMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}${listMatch ? `?list=${listMatch[1]}` : ''}`;
    if (listMatch) return `https://www.youtube.com/embed/videoseries?list=${listMatch[1]}`;
  }
  // SoundCloud
  if (url.includes('soundcloud.com')) {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
  }
  return null;
}

function isSpotify(url: string) { return url.includes('spotify.com'); }
function isYouTube(url: string) { return url.includes('youtube.com') || url.includes('youtu.be'); }

const STICKERS = ['⭐', '🌸', '🐱', '🎵', '💖', '🦋', '🌈', '✨'];

export function CdItem({ gift }: CdItemProps) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const hasMusic = gift.playlist_url || gift.audio_url;
  if (!hasMusic) return null;

  const embedUrl = gift.playlist_url ? getEmbedUrl(gift.playlist_url) : null;

  return (
    <>
      {/* CD Thumbnail */}
      <motion.button
        onClick={() => setOpen(true)}
        className="absolute cursor-pointer focus:outline-none"
        style={{ bottom: '5%', right: '4%', width: '26%', zIndex: 2, transform: 'rotate(-2deg)' }}
        whileHover={{ scale: 1.08, rotate: 0, zIndex: 20, transition: { duration: 0.2 } }}
        title="Music"
      >
        <div className="relative">
          {/* CD disc */}
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
            {/* Outer ring */}
            <circle cx="50" cy="50" r="48" fill="url(#cdGrad)"/>
            <defs>
              <radialGradient id="cdGrad" cx="0.4" cy="0.35">
                <stop offset="0%" stopColor="#c0c0c0"/>
                <stop offset="40%" stopColor="#e8e8e8"/>
                <stop offset="70%" stopColor="#b0b0b0"/>
                <stop offset="100%" stopColor="#808080"/>
              </radialGradient>
            </defs>
            {/* Iridescent ring effect */}
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(150,100,255,0.3)" strokeWidth="6"/>
            <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(100,200,255,0.2)" strokeWidth="4"/>
            {/* Label */}
            <circle cx="50" cy="50" r="22" fill="#FFF8F0"/>
            <circle cx="50" cy="50" r="5" fill="#aaa"/>
            {/* Label text */}
            <text x="50" y="47" textAnchor="middle" fontSize="7" fill="#1E2D5A" fontFamily="serif" fontStyle="italic">for you</text>
            <text x="50" y="56" textAnchor="middle" fontSize="5" fill="#aaa">♥</text>
          </svg>
          {/* Sticker decorations */}
          {STICKERS.slice(0, 4).map((s, i) => (
            <span
              key={i}
              className="absolute text-sm"
              style={{
                top: ['-8px', '-8px', '65%', '65%'][i],
                left: ['-8px', '70%', '-8px', '70%'][i],
              }}
            >{s}</span>
          ))}
        </div>
        <p className="text-center text-xs text-gray-500 mt-1 font-medium">💿 Music</p>
      </motion.button>

      {/* Modal */}
      <ItemModal open={open} onClose={() => setOpen(false)} className="w-full max-w-lg">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
          {/* CD case header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-5 flex items-center gap-4">
            <motion.div
              animate={playing ? { rotate: 360 } : { rotate: 0 }}
              transition={playing ? { repeat: Infinity, duration: 3, ease: 'linear' } : {}}
            >
              <svg viewBox="0 0 80 80" fill="none" className="w-16 h-16">
                <circle cx="40" cy="40" r="38" fill="url(#cdGrad2)"/>
                <defs>
                  <radialGradient id="cdGrad2" cx="0.4" cy="0.35">
                    <stop offset="0%" stopColor="#c0c0c0"/>
                    <stop offset="60%" stopColor="#d0d0d0"/>
                    <stop offset="100%" stopColor="#909090"/>
                  </radialGradient>
                </defs>
                <circle cx="40" cy="40" r="28" fill="#FFF8F0"/>
                <circle cx="40" cy="40" r="4" fill="#aaa"/>
                <text x="40" y="38" textAnchor="middle" fontSize="7" fill="#1E2D5A" fontFamily="serif" fontStyle="italic">for you</text>
                <text x="40" y="46" textAnchor="middle" fontSize="5" fill="#aaa">♥</text>
              </svg>
            </motion.div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest">Now Playing</p>
              <p className="text-white font-serif italic text-lg">
                {gift.occasion} {gift.occasion_year}
              </p>
              <p className="text-white/60 text-sm">A playlist for {gift.recipient_name}</p>
            </div>
          </div>

          {/* Player content */}
          <div className="p-5">
            {embedUrl ? (
              <div className="rounded-xl overflow-hidden">
                {isSpotify(gift.playlist_url!) && (
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-xl"
                  />
                )}
                {isYouTube(gift.playlist_url!) && (
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="200"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    allowFullScreen
                    className="rounded-xl"
                  />
                )}
                {!isSpotify(gift.playlist_url!) && !isYouTube(gift.playlist_url!) && (
                  <iframe
                    width="100%"
                    height="166"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={embedUrl}
                    className="rounded-xl"
                  />
                )}
              </div>
            ) : gift.audio_url ? (
              <div className="space-y-4">
                <audio
                  ref={audioRef}
                  src={gift.audio_url}
                  controls
                  className="w-full rounded-xl"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onEnded={() => setPlaying(false)}
                />
              </div>
            ) : gift.playlist_url ? (
              <div className="text-center">
                <a
                  href={gift.playlist_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E2D5A] text-white rounded-full hover:bg-[#2a3d7a] transition-colors"
                >
                  🎵 Open Playlist
                </a>
              </div>
            ) : null}

            {/* Sticker row */}
            <div className="flex justify-center gap-3 mt-4">
              {STICKERS.map((s, i) => (
                <span key={i} className="text-xl">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </ItemModal>
    </>
  );
}

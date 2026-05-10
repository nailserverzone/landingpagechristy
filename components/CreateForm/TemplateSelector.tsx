'use client';
import { GiftTemplate } from '@/types/gift';

const TEMPLATES: { id: GiftTemplate; name: string; bg: string; accent: string; emoji: string; desc: string }[] = [
  {
    id: 'pastel-pink',
    name: 'Pastel Pink',
    bg: 'from-pink-100 to-rose-50',
    accent: '#F9C5C5',
    emoji: '🌸',
    desc: 'Soft and romantic',
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    bg: 'from-slate-700 to-blue-900',
    accent: '#60A5FA',
    emoji: '🌙',
    desc: 'Elegant and mysterious',
  },
  {
    id: 'warm-cream',
    name: 'Warm Cream',
    bg: 'from-amber-50 to-orange-50',
    accent: '#FCD34D',
    emoji: '🕯️',
    desc: 'Cozy and warm',
  },
  {
    id: 'confetti',
    name: 'Confetti',
    bg: 'from-purple-100 via-pink-100 to-yellow-100',
    accent: '#A855F7',
    emoji: '🎊',
    desc: 'Fun and celebratory',
  },
];

interface TemplateSelectorProps {
  selected: GiftTemplate;
  onChange: (id: GiftTemplate) => void;
}

export function TemplateSelector({ selected, onChange }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`relative rounded-2xl overflow-hidden transition-all focus:outline-none ${
            selected === t.id
              ? 'ring-4 ring-[#1E2D5A] scale-[1.02] shadow-lg'
              : 'ring-2 ring-transparent hover:ring-gray-300 hover:scale-[1.01] shadow-sm'
          }`}
        >
          {/* Preview box */}
          <div className={`bg-gradient-to-br ${t.bg} p-5 pb-3 flex flex-col items-center`}>
            {/* Mini gift box */}
            <div className="w-16 h-16 relative">
              <div
                className="absolute inset-0 rounded-lg shadow-md"
                style={{ backgroundColor: 'white', border: `3px solid ${t.accent}` }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-5 rounded-t-lg"
                style={{ backgroundColor: t.accent }}
              />
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-full rounded"
                style={{ backgroundColor: t.accent, opacity: 0.6 }}
              />
            </div>
            <div className="text-2xl mt-2">{t.emoji}</div>
          </div>
          {/* Label */}
          <div className="bg-white px-3 py-2 text-left">
            <div className="font-semibold text-gray-800 text-sm">{t.name}</div>
            <div className="text-gray-400 text-xs">{t.desc}</div>
          </div>
          {/* Selected check */}
          {selected === t.id && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-[#1E2D5A] rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

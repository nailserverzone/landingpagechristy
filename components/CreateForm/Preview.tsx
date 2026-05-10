'use client';
import { FormState } from '@/types/gift';

interface PreviewProps {
  form: FormState;
}

const TEMPLATE_LABELS: Record<string, string> = {
  'pastel-pink': '🌸 Pastel Pink',
  'midnight-blue': '🌙 Midnight Blue',
  'warm-cream': '🕯️ Warm Cream',
  'confetti': '🎊 Confetti',
};

export function Preview({ form }: PreviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
        <Row label="Theme" value={TEMPLATE_LABELS[form.template_id] ?? form.template_id} />
        <Row label="Recipient" value={form.recipient_name || '—'} />
        <Row label="Occasion" value={form.occasion || '—'} />
        <Row label="Year" value={String(form.occasion_year)} />
      </div>

      {form.letter_html && (
        <div className="bg-[#FFF8F0] rounded-2xl p-6 border border-amber-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Letter Preview</p>
          <p className="font-serif text-gray-700 text-sm italic leading-relaxed whitespace-pre-line">
            {form.letter_html.slice(0, 400)}{form.letter_html.length > 400 ? '…' : ''}
          </p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
        <p className="text-xs text-gray-400 uppercase tracking-widest">Assets</p>
        <Row label="Photos" value={form.photos.length > 0 ? `${form.photos.length} photo(s)` : 'None'} />
        <Row label="Gift Card" value={
          form.gift_card_image_url
            ? 'Image uploaded'
            : form.gift_card_code
            ? `${form.gift_card_brand || 'Gift'} — code provided`
            : 'None'
        } />
        <Row label="Music" value={
          form.playlist_url ? 'Playlist URL' : form.audio_url ? 'Audio file uploaded' : 'None'
        } />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}

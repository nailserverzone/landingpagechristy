'use client';
import { Textarea } from '@/components/ui/Input';
import { FormState } from '@/types/gift';

const MAX_CHARS = 2000;

interface LetterFormProps {
  form: FormState;
  onChange: (updates: Partial<FormState>) => void;
}

export function LetterForm({ form, onChange }: LetterFormProps) {
  const charCount = form.letter_html.length;
  const isOver = charCount > MAX_CHARS;

  return (
    <div className="space-y-4">
      <p className="text-gray-500 text-sm">
        Write a heartfelt message. It will appear as a letter inside the gift box, styled
        beautifully with your recipient's name.
      </p>
      <div className="relative">
        <Textarea
          id="letter"
          label="Your Message"
          placeholder={`Dear ${form.recipient_name || '[Name]'},\n\nI wanted to take a moment to tell you…`}
          rows={12}
          value={form.letter_html}
          onChange={(e) => onChange({ letter_html: e.target.value })}
          className="pr-4"
          maxLength={MAX_CHARS + 100}
        />
        <div className={`text-right text-xs mt-1 ${isOver ? 'text-red-500' : 'text-gray-400'}`}>
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </div>
      </div>

      {form.letter_html && (
        <div className="bg-[#FFF8F0] rounded-2xl p-6 border border-amber-100">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Preview</p>
          <p className="font-serif italic text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {form.letter_html.slice(0, 300)}{form.letter_html.length > 300 ? '…' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

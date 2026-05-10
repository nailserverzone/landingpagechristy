'use client';
import { Input } from '@/components/ui/Input';
import { FormState } from '@/types/gift';

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Graduation',
  'Wedding',
  'Baby Shower',
  'Valentine\'s Day',
  'Just Because',
  'Other',
];

interface RecipientFormProps {
  form: FormState;
  onChange: (updates: Partial<FormState>) => void;
}

export function RecipientForm({ form, onChange }: RecipientFormProps) {
  return (
    <div className="space-y-5">
      <Input
        id="recipient_name"
        label="Recipient's Name"
        placeholder="e.g. Emma"
        value={form.recipient_name}
        onChange={(e) => onChange({ recipient_name: e.target.value })}
        required
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="occasion" className="text-sm font-medium text-gray-700">Occasion</label>
        <select
          id="occasion"
          value={form.occasion}
          onChange={(e) => onChange({ occasion: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2D5A]/30 focus:border-[#1E2D5A] transition-colors"
        >
          <option value="">Select occasion…</option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>

      <Input
        id="occasion_year"
        label="Year"
        type="number"
        min={2000}
        max={2100}
        value={form.occasion_year}
        onChange={(e) => onChange({ occasion_year: parseInt(e.target.value) })}
      />
    </div>
  );
}

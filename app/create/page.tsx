'use client';
import { useState, useId } from 'react';
import { StepIndicator } from '@/components/CreateForm/StepIndicator';
import { TemplateSelector } from '@/components/CreateForm/TemplateSelector';
import { RecipientForm } from '@/components/CreateForm/RecipientForm';
import { LetterForm } from '@/components/CreateForm/LetterForm';
import { AssetUploader } from '@/components/CreateForm/AssetUploader';
import { Preview } from '@/components/CreateForm/Preview';
import { ShareLink } from '@/components/CreateForm/ShareLink';
import { Button } from '@/components/ui/Button';
import type { FormState } from '@/types/gift';

const STEP_LABELS = ['Theme', 'Recipient', 'Letter', 'Uploads', 'Preview'];
const TOTAL_STEPS = 5;

const initialForm: FormState = {
  step: 1,
  template_id: 'pastel-pink',
  recipient_name: '',
  occasion: '',
  occasion_year: new Date().getFullYear(),
  letter_html: '',
  playlist_url: '',
  audio_url: '',
  gift_card_image_url: '',
  gift_card_code: '',
  gift_card_brand: '',
  photos: [],
};

function validateStep(form: FormState, step: number): string | null {
  if (step === 1 && !form.template_id) return 'Please select a theme.';
  if (step === 2) {
    if (!form.recipient_name.trim()) return "Please enter the recipient's name.";
    if (!form.occasion) return 'Please select an occasion.';
    if (!form.occasion_year) return 'Please enter a year.';
  }
  return null;
}

export default function CreatePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [slug, setSlug] = useState<string | null>(null);
  const [error, setError] = useState('');
  const giftId = useId().replace(/:/g, '');

  const updateForm = (updates: Partial<FormState>) => setForm((f) => ({ ...f, ...updates }));

  const next = () => {
    const err = validateStep(form, step);
    if (err) { setError(err); return; }
    setError('');
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const back = () => { setError(''); setStep((s) => Math.max(s - 1, 1)); };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: form.template_id,
          recipient_name: form.recipient_name,
          occasion: form.occasion,
          occasion_year: form.occasion_year,
          letter_html: form.letter_html,
          playlist_url: form.playlist_url,
          audio_url: form.audio_url,
          gift_card_image_url: form.gift_card_image_url,
          gift_card_code: form.gift_card_code,
          gift_card_brand: form.gift_card_brand,
          photos: form.photos,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create gift');
      setSlug(data.slug);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (slug) {
    return (
      <div className="min-h-screen bg-[#F7D6D6] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <ShareLink slug={slug} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7D6D6] py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#1E2D5A] mb-2">Create Your Gift Box</h1>
          <p className="text-gray-500 text-sm">
            Step {step} of {TOTAL_STEPS}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={step} totalSteps={TOTAL_STEPS} stepLabels={STEP_LABELS} />
        </div>

        {/* Form card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8">
          <h2 className="font-serif text-xl text-[#1E2D5A] mb-6">
            {step === 1 && 'Choose a Box Theme'}
            {step === 2 && 'Recipient Details'}
            {step === 3 && 'Write Your Letter'}
            {step === 4 && 'Upload Assets'}
            {step === 5 && 'Preview & Confirm'}
          </h2>

          {step === 1 && (
            <TemplateSelector selected={form.template_id} onChange={(id) => updateForm({ template_id: id })} />
          )}
          {step === 2 && <RecipientForm form={form} onChange={updateForm} />}
          {step === 3 && <LetterForm form={form} onChange={updateForm} />}
          {step === 4 && <AssetUploader form={form} onChange={updateForm} giftId={giftId} />}
          {step === 5 && <Preview form={form} />}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 gap-3">
            <Button variant="secondary" onClick={back} disabled={step === 1}>
              ← Back
            </Button>
            {step < TOTAL_STEPS ? (
              <Button onClick={next}>
                Next →
              </Button>
            ) : (
              <Button onClick={submit} disabled={submitting} className="min-w-[160px]">
                {submitting ? 'Creating…' : '🎁 Generate Gift Box'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

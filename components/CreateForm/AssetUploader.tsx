'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { FormState } from '@/types/gift';

interface AssetUploaderProps {
  form: FormState;
  onChange: (updates: Partial<FormState>) => void;
  giftId: string;
}

async function uploadFile(file: File, type: string, giftId: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('type', type);
  fd.append('giftId', giftId);
  const res = await fetch('/api/upload', { method: 'POST', body: fd });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Upload failed');
  }
  const data = await res.json();
  return data.url as string;
}

export function AssetUploader({ form, onChange, giftId }: AssetUploaderProps) {
  const [photoUploading, setPhotoUploading] = useState(false);
  const [gcUploading, setGcUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePhotos = useCallback(
    async (files: File[]) => {
      if (form.photos.length + files.length > 10) {
        setErrors((e) => ({ ...e, photos: 'Max 10 photos allowed' }));
        return;
      }
      setErrors((e) => ({ ...e, photos: '' }));
      setPhotoUploading(true);
      try {
        const urls = await Promise.all(files.map((f) => uploadFile(f, 'photo', giftId)));
        onChange({ photos: [...form.photos, ...urls] });
      } catch (err: unknown) {
        setErrors((e) => ({ ...e, photos: err instanceof Error ? err.message : 'Upload failed' }));
      } finally {
        setPhotoUploading(false);
      }
    },
    [form.photos, giftId, onChange]
  );

  const removePhoto = (url: string) => onChange({ photos: form.photos.filter((p) => p !== url) });

  const handleGiftCardImage = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setGcUploading(true);
      try {
        const url = await uploadFile(file, 'gift-card', giftId);
        onChange({ gift_card_image_url: url });
      } catch (err: unknown) {
        setErrors((e) => ({ ...e, giftCard: err instanceof Error ? err.message : 'Upload failed' }));
      } finally {
        setGcUploading(false);
      }
    },
    [giftId, onChange]
  );

  const handleAudio = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setAudioUploading(true);
      try {
        const url = await uploadFile(file, 'audio', giftId);
        onChange({ audio_url: url });
      } catch (err: unknown) {
        setErrors((e) => ({ ...e, audio: err instanceof Error ? err.message : 'Upload failed' }));
      } finally {
        setAudioUploading(false);
      }
    },
    [giftId, onChange]
  );

  return (
    <div className="space-y-8">
      {/* Photos Section */}
      <section>
        <h3 className="font-semibold text-gray-800 mb-1">📸 Photos</h3>
        <p className="text-gray-500 text-sm mb-3">
          Up to 10 photos shown in a slideshow inside the gift box. Max 5 MB each.
        </p>
        {form.photos.length < 10 && (
          <FileDropzone
            accept="image/*"
            multiple
            maxFiles={10 - form.photos.length}
            onFiles={handlePhotos}
            uploading={photoUploading}
            label="Drop photos here or click to browse"
            hint={`${form.photos.length}/10 photos added`}
          />
        )}
        {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
        {form.photos.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
            {form.photos.map((url) => (
              <div key={url} className="relative group aspect-square rounded-lg overflow-hidden">
                <Image src={url} alt="" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gift Card Section */}
      <section>
        <h3 className="font-semibold text-gray-800 mb-1">🎁 Gift Card</h3>
        <p className="text-gray-500 text-sm mb-3">
          Upload an image of the gift card, or enter the brand and code as text.
        </p>
        <div className="space-y-3">
          <FileDropzone
            accept="image/*"
            multiple={false}
            onFiles={handleGiftCardImage}
            uploading={gcUploading}
            label={form.gift_card_image_url ? '✓ Gift card image uploaded' : 'Upload gift card image'}
            hint="Optional – PNG, JPG, WebP"
          />
          {errors.giftCard && <p className="text-red-500 text-sm">{errors.giftCard}</p>}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Brand (e.g. Amazon)"
              value={form.gift_card_brand}
              onChange={(e) => onChange({ gift_card_brand: e.target.value })}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2D5A]/30 focus:border-[#1E2D5A]"
            />
            <input
              type="text"
              placeholder="Gift card code"
              value={form.gift_card_code}
              onChange={(e) => onChange({ gift_card_code: e.target.value })}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2D5A]/30 focus:border-[#1E2D5A] font-mono"
            />
          </div>
        </div>
      </section>

      {/* Playlist / Audio Section */}
      <section>
        <h3 className="font-semibold text-gray-800 mb-1">🎵 Music</h3>
        <p className="text-gray-500 text-sm mb-3">
          Add a Spotify / YouTube / SoundCloud playlist URL, or upload an audio file.
        </p>
        <div className="space-y-3">
          <input
            type="url"
            placeholder="Paste Spotify, YouTube, or SoundCloud URL…"
            value={form.playlist_url}
            onChange={(e) => onChange({ playlist_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1E2D5A]/30 focus:border-[#1E2D5A]"
          />
          <div className="text-center text-gray-400 text-sm">— or —</div>
          <FileDropzone
            accept="audio/mpeg,audio/mp4,audio/x-m4a,audio/aac"
            multiple={false}
            onFiles={handleAudio}
            uploading={audioUploading}
            label={form.audio_url ? '✓ Audio file uploaded' : 'Upload MP3 / M4A (max 20 MB)'}
          />
          {errors.audio && <p className="text-red-500 text-sm">{errors.audio}</p>}
        </div>
      </section>
    </div>
  );
}

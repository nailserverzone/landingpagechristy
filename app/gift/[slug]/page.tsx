import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase';
import { GiftExperience } from './GiftExperience';
import type { Gift } from '@/types/gift';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `A special gift is waiting for you 🎁`,
    description: `Someone sent you an interactive digital gift box. Open it to see photos, a personal letter, music, and more!`,
  };
}

async function getGift(slug: string): Promise<Gift | null> {
  // For demo slug, return mock data
  if (slug === 'demo') {
    return {
      id: 'demo',
      slug: 'demo',
      template_id: 'pastel-pink',
      recipient_name: 'Alex',
      occasion: 'Birthday',
      occasion_year: 2025,
      letter_html: `I wanted to take a moment to let you know how much you mean to me.\n\nEvery day with you is a gift, and I'm so grateful to have you in my life. This little digital box is just a small way to show you how much I care.\n\nMay your day be as bright and beautiful as you are.\n\nWith all my love,\nYour Secret Admirer`,
      playlist_url: null,
      audio_url: null,
      gift_card_image_url: null,
      gift_card_code: 'BDAY-2025-GIFT',
      gift_card_brand: 'Amazon',
      photos: [],
      created_at: new Date().toISOString(),
      is_active: true,
    };
  }

  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    // Increment view counter (non-blocking)
    supabase
      .from('gifts')
      .update({ views: (data.views ?? 0) + 1 })
      .eq('id', data.id)
      .then(() => {});

    return data as Gift;
  } catch {
    return null;
  }
}

export default async function GiftPage({ params }: PageProps) {
  const gift = await getGift(params.slug);

  if (!gift) {
    notFound();
  }

  return <GiftExperience gift={gift} />;
}

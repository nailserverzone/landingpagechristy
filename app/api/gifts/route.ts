import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateSlug } from '@/lib/utils';
import type { CreateGiftPayload } from '@/types/gift';

export async function POST(request: NextRequest) {
  try {
    const body: CreateGiftPayload = await request.json();

    const { recipient_name, occasion, occasion_year, template_id } = body;
    if (!recipient_name || !occasion || !occasion_year || !template_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Generate unique slug
    let slug = generateSlug(8);
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase.from('gifts').select('id').eq('slug', slug).single();
      if (!existing) break;
      slug = generateSlug(8);
      attempts++;
    }

    const { data, error } = await supabase
      .from('gifts')
      .insert({
        slug,
        template_id: body.template_id,
        recipient_name: body.recipient_name,
        occasion: body.occasion,
        occasion_year: body.occasion_year,
        letter_html: body.letter_html || null,
        playlist_url: body.playlist_url || null,
        audio_url: body.audio_url || null,
        gift_card_image_url: body.gift_card_image_url || null,
        gift_card_code: body.gift_card_code || null,
        gift_card_brand: body.gift_card_brand || null,
        photos: body.photos || [],
      })
      .select('slug, id')
      .single();

    if (error) {
      console.error('DB insert error:', error);
      return NextResponse.json({ error: 'Failed to create gift' }, { status: 500 });
    }

    return NextResponse.json({ slug: data.slug, id: data.id }, { status: 201 });
  } catch (err) {
    console.error('Create gift error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

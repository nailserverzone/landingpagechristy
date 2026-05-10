import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('gifts')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
    }

    // Increment view counter (fire-and-forget)
    supabase
      .from('gifts')
      .update({ views: (data.views ?? 0) + 1 })
      .eq('id', data.id)
      .then(() => {});

    return NextResponse.json(data);
  } catch (err) {
    console.error('Get gift error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

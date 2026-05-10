import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_AUDIO_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const uploadType = formData.get('type') as string | null; // 'photo' | 'audio' | 'gift-card'
    const giftId = formData.get('giftId') as string | null;

    if (!file || !uploadType || !giftId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate file type and size
    if (uploadType === 'photo' || uploadType === 'gift-card') {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid image type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 });
      }
      if (file.size > MAX_PHOTO_SIZE) {
        return NextResponse.json({ error: 'Image too large. Max 5MB per photo.' }, { status: 400 });
      }
    } else if (uploadType === 'audio') {
      if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid audio type. Use MP3 or M4A.' }, { status: 400 });
      }
      if (file.size > MAX_AUDIO_SIZE) {
        return NextResponse.json({ error: 'Audio file too large. Max 20MB.' }, { status: 400 });
      }
    }

    const supabase = createServerClient();
    const ext = file.name.split('.').pop() ?? 'bin';
    const timestamp = Date.now();
    const fileName = `${timestamp}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `${giftId}/${uploadType}/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('gift-assets')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from('gift-assets').getPublicUrl(path);

    return NextResponse.json({ url: urlData.publicUrl, path });
  } catch (err) {
    console.error('Upload route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export type GiftTemplate = 'pastel-pink' | 'midnight-blue' | 'warm-cream' | 'confetti';

export interface Gift {
  id: string;
  slug: string;
  template_id: GiftTemplate;
  recipient_name: string;
  occasion: string;
  occasion_year: number;
  letter_html: string | null;
  playlist_url: string | null;
  audio_url: string | null;
  gift_card_image_url: string | null;
  gift_card_code: string | null;
  gift_card_brand: string | null;
  photos: string[];
  created_at: string;
  is_active: boolean;
}

export interface CreateGiftPayload {
  template_id: GiftTemplate;
  recipient_name: string;
  occasion: string;
  occasion_year: number;
  letter_html: string;
  playlist_url: string;
  audio_url: string;
  gift_card_image_url: string;
  gift_card_code: string;
  gift_card_brand: string;
  photos: string[];
}

export interface FormState {
  step: number;
  template_id: GiftTemplate;
  recipient_name: string;
  occasion: string;
  occasion_year: number;
  letter_html: string;
  playlist_url: string;
  audio_url: string;
  gift_card_image_url: string;
  gift_card_code: string;
  gift_card_brand: string;
  photos: string[];
}

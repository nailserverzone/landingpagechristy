/**
 * EVERY external link and contact detail for the site lives here.
 *
 * - Leave a value as '' and the link simply does not render anywhere.
 * - Values ending in `#todo-content` are placeholders. They render (so the
 *   layout can be reviewed) but the production build prints a warning while
 *   any remain. Replace them with the real URL and delete the suffix.
 *
 * TODO(content): every `#todo-content` link below needs the client's real URL.
 */
import type { WordmarkOption } from '@/components/brand/marks';

const env = import.meta.env;
const flag = (v: string | undefined, fallback = false) =>
  v === undefined || v === '' ? fallback : v === 'true' || v === '1';

export const site = {
  name: 'Gage Marvel',
  url: 'https://gagemarvel.com',
  // TODO(content): one-line tagline from the client.
  tagline: '[TAGLINE PLACEHOLDER: client to supply]',
  /** Record label as printed on his releases. */
  label: 'Marvel Records',
  description:
    'The official website of Gage Marvel, independent country music artist. Listen to the music, see upcoming shows, join the fan list and book Gage for your venue or event.',
  locale: 'en_US',
  /** Which wordmark the live site uses. Switch to 2 or 3 once the client picks. */
  wordmark: 1 as WordmarkOption,
  /** Default social share image (1200x630). */
  ogImage: '/og-default.png',
} as const;

export const contact = {
  // Shown on the site. Set in the environment, never hardcoded.
  bookingEmail: env.PUBLIC_BOOKING_EMAIL ?? '',
  fanEmail: env.PUBLIC_FAN_EMAIL ?? '',
};

export const features = {
  merch: flag(env.SHOW_MERCH),
  cms: flag(env.ENABLE_CMS),
  bandsintown: flag(env.ENABLE_BANDSINTOWN),
  bandsintownArtist: env.PUBLIC_BANDSINTOWN_ARTIST ?? '',
  /** Sample shows/videos/photos: on in dev and previews, off in production. */
  sampleContent: flag(env.SHOW_SAMPLE_CONTENT, import.meta.env.DEV),
};

export type StreamingKey =
  | 'spotify'
  | 'appleMusic'
  | 'youtubeMusic'
  | 'youtube'
  | 'amazonMusic'
  | 'deezer'
  | 'pandora'
  | 'tidal'
  | 'bandcamp';

export type SocialKey = 'instagram' | 'tiktok' | 'facebook' | 'youtube' | 'x' | 'threads';

/** Artist profile pages on each streaming service. */
export const streaming: Record<StreamingKey, string> = {
  spotify: 'https://open.spotify.com/#todo-content',
  appleMusic: 'https://music.apple.com/us/artist/gage-marvel/1617484159',
  youtubeMusic: 'https://music.youtube.com/#todo-content',
  youtube: 'https://www.youtube.com/#todo-content',
  amazonMusic: 'https://music.amazon.com/#todo-content',
  deezer: '',
  pandora: '',
  tidal: '',
  bandcamp: '',
};

export const social: Record<SocialKey, string> = {
  // Found publicly, Nov 2026. TODO(content): client to confirm both are the accounts to promote.
  instagram: 'https://www.instagram.com/gagemarvel/',
  tiktok: 'https://www.tiktok.com/#todo-content',
  facebook: 'https://www.facebook.com/gage.marvel/',
  youtube: 'https://www.youtube.com/#todo-content',
  x: '',
  threads: '',
};

/** Display names, in the order buttons appear. */
export const streamingLabels: Record<StreamingKey, string> = {
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  youtubeMusic: 'YouTube Music',
  youtube: 'YouTube',
  amazonMusic: 'Amazon Music',
  deezer: 'Deezer',
  pandora: 'Pandora',
  tidal: 'TIDAL',
  bandcamp: 'Bandcamp',
};

export const socialLabels: Record<SocialKey, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  youtube: 'YouTube',
  x: 'X',
  threads: 'Threads',
};

export const nav = [
  { href: '/music', label: 'Music' },
  { href: '/about', label: 'About' },
  { href: '/media', label: 'Photos & Videos' },
  { href: '/shows', label: 'Shows' },
  ...(features.merch ? [{ href: '/merch', label: 'Merch' }] : []),
  { href: '/contact', label: 'Contact' },
];

export const bookingHref = '/contact#booking';

/** Only the entries that have a value, in display order. */
export function activeLinks<K extends string>(links: Record<K, string>): [K, string][] {
  return (Object.entries(links) as [K, string][]).filter(([, url]) => Boolean(url));
}

/**
 * Adds UTM parameters to outbound links so streaming/social dashboards can
 * attribute traffic to the website. Placeholder links are left untouched.
 */
export function withUtm(url: string, content: string): string {
  if (!url || url.includes('#todo-content')) return url;
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', 'gagemarvel.com');
    u.searchParams.set('utm_medium', 'referral');
    u.searchParams.set('utm_content', content);
    return u.toString();
  } catch {
    return url;
  }
}

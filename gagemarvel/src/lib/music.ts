import type { CollectionEntry } from 'astro:content';
import { streaming, streamingLabels, type StreamingKey } from '@/config/site';

export type Song = CollectionEntry<'songs'>;

export interface PlatformLink {
  key: StreamingKey;
  label: string;
  url: string;
  /** true when this links to the release itself, false for the artist page fallback. */
  direct: boolean;
}

const ORDER = Object.keys(streamingLabels) as StreamingKey[];

/**
 * Every platform button for a release. Uses the release's own link where we
 * have it; otherwise falls back to Gage's artist page on that service (so a
 * fan can still find the song), and hides the platform entirely when neither
 * exists.
 */
export function platformLinks(song: Song, { fallback = true } = {}): PlatformLink[] {
  const own = song.data.links as Partial<Record<StreamingKey, string>>;
  const out: PlatformLink[] = [];
  for (const key of ORDER) {
    const url = own[key] || (fallback ? streaming[key] : '');
    if (url) out.push({ key, label: streamingLabels[key], url, direct: Boolean(own[key]) });
  }
  return out;
}

export const kindLabel = (s: Song) => ({ single: 'Single', ep: 'EP', album: 'Album' })[s.data.kind];

export const releaseYear = (s: Song) => s.data.releaseDate?.slice(0, 4) ?? '';

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = {}) {
  // Parse as a calendar date at noon UTC so no time zone can shift the day.
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  });
}

/** Apple Music embed URL for a release page link, or '' if it isn't one. */
export function appleEmbedUrl(url?: string) {
  if (!url || !url.startsWith('https://music.apple.com/')) return '';
  return url.replace('https://music.apple.com/', 'https://embed.music.apple.com/');
}

export function spotifyEmbedUrl(id?: string, kind: 'track' | 'album' = 'track') {
  return id ? `https://open.spotify.com/embed/${kind}/${id}?utm_source=generator&theme=0` : '';
}

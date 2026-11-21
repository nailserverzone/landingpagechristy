/**
 * Apple Music previews. At build time we ask Apple's public catalog API for
 * the official 30 second preview of each release, so the URLs are always
 * fresh (the daily rebuild refreshes them). If Apple can't be reached the
 * site still builds; preview buttons simply don't render.
 */
import { getSongs } from './content';

let cache: Promise<Map<number, string>> | undefined;

async function load(): Promise<Map<number, string>> {
  const ids = (await getSongs()).map((s) => s.data.appleTrackId).filter(Boolean);
  const map = new Map<number, string>();
  if (!ids.length) return map;
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${ids.join(',')}&entity=song&country=us`,
      { signal: AbortSignal.timeout(10_000) },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { results: { trackId?: number; previewUrl?: string }[] };
    for (const r of json.results) if (r.trackId && r.previewUrl) map.set(r.trackId, r.previewUrl);
  } catch (err) {
    console.warn(`[apple] previews unavailable this build: ${(err as Error).message}`);
  }
  return map;
}

export async function previewUrl(trackId?: number): Promise<string | undefined> {
  if (!trackId) return undefined;
  cache ??= load();
  return (await cache).get(trackId);
}

import { getCollection, type CollectionEntry } from 'astro:content';
import { features } from '@/config/site';

const keep = (e: { data: { sample?: boolean } }) => features.sampleContent || !e.data.sample;
const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) =>
  a.data.order - b.data.order;

/**
 * "Today" for deciding whether a show is upcoming. A show stays upcoming for
 * the whole of its date in US Central time, so a late show never vanishes
 * early. The daily rebuild moves it to Past the next morning.
 * TODO(content): change SHOW_TIMEZONE if Gage mostly plays elsewhere.
 */
export const SHOW_TIMEZONE = 'America/Chicago';
export function todayIso(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SHOW_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export async function getSongs() {
  return (await getCollection('songs')).sort(byOrder);
}

export async function getFeaturedSong(): Promise<CollectionEntry<'songs'> | undefined> {
  const songs = await getSongs();
  return songs.find((s) => s.data.featured) ?? songs[0];
}

export async function getShows() {
  const all = (await getCollection('shows')).filter(keep);
  const today = todayIso();
  const upcoming = all
    .filter((s) => s.data.date >= today)
    .sort((a, b) => a.data.date.localeCompare(b.data.date));
  const past = all
    .filter((s) => s.data.date < today)
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
  return { upcoming, past };
}

export async function getVideos() {
  return (await getCollection('videos')).filter(keep).sort(byOrder);
}

export async function getPhotos() {
  return (await getCollection('photos')).filter(keep).sort(byOrder);
}

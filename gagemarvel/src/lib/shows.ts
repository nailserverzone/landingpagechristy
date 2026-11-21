import type { CollectionEntry } from 'astro:content';
import { site } from '@/config/site';

export type Show = CollectionEntry<'shows'>;

export const showPlace = (s: Show) =>
  [s.data.city, s.data.region, s.data.country !== 'US' ? s.data.country : '']
    .filter(Boolean)
    .join(', ');

export function showDateParts(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`);
  const f = (o: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString('en-US', { timeZone: 'UTC', ...o });
  return {
    weekday: f({ weekday: 'short' }),
    month: f({ month: 'short' }),
    day: f({ day: 'numeric' }),
    year: f({ year: 'numeric' }),
    long: f({ weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
  };
}

/** "8:00 PM" -> [20, 0]; undefined if it can't be read. */
function parseTime(t?: string): [number, number] | undefined {
  const m = t?.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])\.?m\.?$/i);
  if (!m) return undefined;
  let h = Number(m[1]) % 12;
  if (m[3].toLowerCase() === 'p') h += 12;
  return [h, Number(m[2] ?? 0)];
}

const icsEscape = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/**
 * An .ics calendar file for one show. Times are written as "floating" local
 * time (no zone), which calendar apps read as the venue's local time.
 */
export function showIcs(show: Show) {
  const { date, time, venue, notes, ticketUrl } = show.data;
  const ymd = date.replace(/-/g, '');
  const t = parseTime(time);
  const pad = (n: number) => String(n).padStart(2, '0');
  let start: string, end: string;
  if (t) {
    start = `DTSTART:${ymd}T${pad(t[0])}${pad(t[1])}00`;
    const endH = Math.min(t[0] + 2, 23);
    end = `DTEND:${ymd}T${pad(endH)}${pad(t[1])}00`;
  } else {
    const next = new Date(`${date}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    start = `DTSTART;VALUE=DATE:${ymd}`;
    end = `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replace(/-/g, '')}`;
  }
  const desc = [notes, ticketUrl ? `Tickets: ${ticketUrl}` : '', `${site.url}/shows`]
    .filter(Boolean)
    .join('\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//gagemarvel.com//Shows//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${show.id}@gagemarvel.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    start,
    end,
    `SUMMARY:${icsEscape(`Gage Marvel at ${venue}`)}`,
    `LOCATION:${icsEscape(`${venue}, ${showPlace(show)}`)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    `URL:${site.url}/shows`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function showJsonLd(show: Show) {
  const { date, time, venue, city, region, country, ticketUrl, soldOut } = show.data;
  const t = parseTime(time);
  const startDate = t
    ? `${date}T${String(t[0]).padStart(2, '0')}:${String(t[1]).padStart(2, '0')}`
    : date;
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name: `Gage Marvel at ${venue}`,
    startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressRegion: region,
        addressCountry: country,
      },
    },
    performer: { '@type': 'MusicGroup', name: site.name, url: site.url },
    ...(ticketUrl
      ? {
          offers: {
            '@type': 'Offer',
            url: ticketUrl,
            availability: soldOut ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

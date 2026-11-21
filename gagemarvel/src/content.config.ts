/**
 * Content collections. Each song, show, video and photo is one small file in
 * src/content/<collection>/. The schemas below are what each file must
 * contain; the build fails with a clear message if a required field is
 * missing, so typos never reach the live site.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const url = z.url();
// YAML turns an unquoted 2027-03-14 into a Date; normalise both forms to a
// plain YYYY-MM-DD string so time zones never shift a show by a day.
const isoDate = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the format YYYY-MM-DD, for example 2027-03-14'),
);

/** Streaming links for one song. Leave any out and its button is hidden. */
const platformLinks = z
  .object({
    spotify: url.optional(),
    appleMusic: url.optional(),
    youtubeMusic: url.optional(),
    youtube: url.optional(),
    amazonMusic: url.optional(),
    deezer: url.optional(),
    pandora: url.optional(),
    tidal: url.optional(),
    bandcamp: url.optional(),
  })
  .default({});

const songs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/songs' }),
  schema: ({ image }) =>
    z.object({
      /** Title exactly as fans should see it. */
      title: z.string(),
      /** single or ep (an EP also lists its tracks). */
      kind: z.enum(['single', 'ep', 'album']).default('single'),
      /** Leave out until the client confirms the date. Never guess. */
      releaseDate: isoDate.optional(),
      /** Copyright line, for example "℗ 2026 Marvel Records". */
      label: z.string().optional(),
      cover: image(),
      coverAlt: z.string().min(5, 'Describe the cover art for screen reader users'),
      /**
       * A color picked from the cover art. Used for the soft glow behind the
       * cover so each release keeps its own mood. Optional; defaults to gold.
       */
      glow: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex color like #E8B830')
        .optional(),
      /**
       * The live light effect for this release, matched to its cover art:
       * sunset (golden dust), candle, film (black and white grain), fireflies,
       * fire (embers), neon, pollen. Optional.
       */
      mood: z.enum(['sunset', 'candle', 'film', 'fireflies', 'fire', 'neon', 'pollen']).optional(),
      /** Short description, one or two sentences. Optional. */
      description: z.string().optional(),
      /** The featured release gets the home page spotlight and the LISTEN NOW modal. */
      featured: z.boolean().default(false),
      /** Releases sort newest first; use this only to break ties. */
      order: z.number().default(100),
      /** Spotify track or album ID for the embedded player (the part after /track/ or /album/). */
      spotifyId: z.string().optional(),
      links: platformLinks,
      /**
       * Apple Music track ID (the number after ?i= in a song link). Used to
       * fetch Apple's official 30 second preview at build time.
       */
      appleTrackId: z.number().int().optional(),
      /**
       * A few lyric lines supplied by the client, used as decoration (lyric
       * cards, the title marquee). Only ever lines the client provides.
       */
      lyricLines: z.array(z.string()).default([]),
      tracks: z
        .array(z.object({ title: z.string(), appleMusic: url.optional(), spotify: url.optional() }))
        .default([]),
      credits: z.array(z.object({ role: z.string(), name: z.string() })).default([]),
      /** Set true only if the markdown body below holds lyrics the client supplied. */
      hasLyrics: z.boolean().default(false),
    }),
});

const shows = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shows' }),
  schema: z.object({
    date: isoDate,
    /** Local time at the venue, for example "8:00 PM". */
    time: z.string().optional(),
    venue: z.string(),
    city: z.string(),
    /** State, province or region. */
    region: z.string().optional(),
    country: z.string().default('US'),
    ticketUrl: url.optional(),
    eventType: z.enum(['concert', 'festival', 'private', 'appearance']).default('concert'),
    soldOut: z.boolean().default(false),
    notes: z.string().optional(),
    /** Demo entries. Hidden on the production site. */
    sample: z.boolean().default(false),
  }),
});

const videos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/videos' }),
  schema: z.object({
    title: z.string(),
    /** The 11 character ID from the YouTube URL (youtube.com/watch?v=THIS_PART). */
    youtubeId: z
      .string()
      .regex(/^[A-Za-z0-9_-]{11}$/, 'Paste the 11 character ID from the YouTube link')
      .optional(),
    category: z.enum(['music-video', 'live']),
    date: isoDate.optional(),
    description: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    /** Do captions or a transcript exist on YouTube? Tracked for accessibility. */
    captions: z.boolean().default(false),
    sample: z.boolean().default(false),
  }),
});

const photos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/photos' }),
  schema: ({ image }) =>
    z.object({
      image: image(),
      /** Required. Describe what is in the photo for people who cannot see it. */
      alt: z.string().min(5, 'Alt text is required for every photo'),
      caption: z.string().optional(),
      /** Photographer credit, if the client has one. */
      credit: z.string().optional(),
      order: z.number().default(100),
      sample: z.boolean().default(false),
    }),
});

export const collections = { songs, shows, videos, photos };

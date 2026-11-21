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
      title: z.string(),
      /** Leave out until the client confirms the date. Never guess. */
      releaseDate: isoDate.optional(),
      cover: image(),
      coverAlt: z.string().min(5, 'Describe the cover art for screen reader users'),
      /** Short description, one or two sentences. Optional. */
      description: z.string().optional(),
      /** The featured song gets the home page spotlight and the LISTEN NOW modal. */
      featured: z.boolean().default(false),
      /** Lower numbers appear first. */
      order: z.number().default(100),
      /** Spotify track ID for the embedded player (the part after /track/). */
      spotifyTrackId: z.string().optional(),
      links: platformLinks,
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

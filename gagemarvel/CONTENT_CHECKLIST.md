# Content checklist

Everything still needed from the client (Christy and Danielle) before
gagemarvel.com goes live. Nothing on this list should ship as a placeholder.
Find each spot in the code by searching for `TODO(content)`.

The production build prints a warning while any placeholder link
(`#todo-content`) is still on a page.

## Brand

- [ ] Pick a wordmark: Option 1, 2 or 3 (review at `/brand`). Then set
      `wordmark` in `src/config/site.ts` and run `WORDMARK_OPTION=<n> npm run brand`
      to rebuild the favicons from that option's monogram.
- [ ] One-line tagline for the home page hero (`site.tagline` in `src/config/site.ts`).

## Photos

- [ ] Hero photo, landscape 16:9, at least 2400 x 1350 px.
- [ ] Mobile crop of the hero, portrait 4:5, at least 1200 x 1500 px.
- [ ] Portrait for the About page, 4:5, at least 1200 x 1500 px.
- [ ] Gallery photos for Photos & Videos (any mix of landscape and portrait), each
      with a one-sentence description for alt text and the photographer's name if
      credit is required.
- [ ] High-resolution press photos for the press kit download.
- [ ] Written permission to use each photo on the web (photographer release).

## Music

For each song: _You Shoulda Been There_, _If Jesus Were a Cowboy_,
_Tonight's Only Me and You_

- [ ] Cover art, square, at least 1200 x 1200 px (3000 x 3000 preferred).
- [ ] Release date.
- [ ] Links: Spotify, Apple Music, YouTube Music, YouTube, Amazon Music, and any
      others (Deezer, Pandora, TIDAL, Bandcamp).
- [ ] Spotify track ID for the embedded player.
- [ ] Optional: one or two sentence description, credits, lyrics.
- [ ] Which song is featured on the home page (currently _You Shoulda Been There_,
      unconfirmed).

## Links and contacts (`src/config/site.ts` and Netlify environment variables)

- [ ] Artist profile links: Spotify, Apple Music, YouTube Music, YouTube channel,
      Amazon Music, plus Deezer, Pandora, TIDAL, Bandcamp if they exist.
- [ ] Social: Instagram, TikTok, Facebook, YouTube, X, Threads (only the ones Gage
      actually uses).
- [ ] Booking email address (`PUBLIC_BOOKING_EMAIL`, `BOOKING_EMAIL`).
- [ ] Fan message email address (`PUBLIC_FAN_EMAIL`, `FAN_EMAIL`).

## Videos

- [ ] YouTube links for music videos and live performances.
- [ ] Which one is featured on the home page.
- [ ] Captions or transcripts for each video (accessibility requirement).

## Shows

- [ ] Real show dates (the three current entries are samples and never appear on
      the production site).
- [ ] Confirm the time zone used to decide when a show becomes "past"
      (currently US Central, `SHOW_TIMEZONE` in `src/lib/content.ts`).

## About and press kit

- [ ] Bio (short and long versions). We will not write facts about Gage's life,
      hometown, influences or career ourselves.
- [ ] A press quote or a line from Gage for the pull quote.
- [ ] Press kit files (bio PDF, photos) and the booking contact to list.

## Email list, analytics, legal

- [ ] Choose Kit (ConvertKit) or Mailchimp and share the public form URL.
- [ ] Turn on double opt-in at the provider.
- [ ] Plausible account (or GA4 property ID).
- [ ] Privacy policy reviewed by the client or their lawyer.

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

All eight releases are on the site with their real cover art, release dates and
Apple Music links, taken from Apple Music in November 2026: _If Jesus Were a
Cowboy_, _Tonight's Only Me and You_, _You Shoulda Been There_, _Mama Tried_,
_Back In the Country (feat. Aaron Brown)_, _Right Hand Man_, _Me Against Me_
(EP) and _Get Stuck_. Still needed:

- [ ] Spotify, YouTube Music, YouTube and Amazon Music links for each release (the
      buttons currently fall back to Gage's artist page on each service).
- [ ] Spotify track IDs, if the client prefers the Spotify player over Apple Music.
- [ ] Confirm _If Jesus Were a Cowboy_ (the newest release) as the featured song.
- [ ] Confirm the title spelling: the client brief says "Tonight's Only Me and You";
      streaming services list "Tonights Only Me and You" (no apostrophe). The site
      uses the apostrophe.
- [ ] Lyric lines for decoration: two to four short lines per song, approved by
      Gage. They go in `lyricLines` in each song file and appear in the scrolling
      title band and other decorations. Until then the site shows song titles,
      never guessed lyrics.
- [ ] Approve or rewrite the home page line "Songs about faith, family, an ice cold
      beer and the ones who stand beside you." (drawn only from the song titles).
- [ ] Optional: a one or two sentence description, credits and full lyrics per release.
- [ ] Confirm all eight releases should be listed (the brief named three).

## Links and contacts (`src/config/site.ts` and Netlify environment variables)

- [ ] Artist profile links (Apple Music is done): Spotify, YouTube Music, YouTube channel,
      Amazon Music, plus Deezer, Pandora, TIDAL, Bandcamp if they exist.
- [ ] Social: confirm instagram.com/gagemarvel and facebook.com/gage.marvel (found
      publicly) are the accounts to promote; add TikTok, YouTube, X, Threads if used.
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

## Booking form

- [ ] Confirm the budget ranges and audience sizes on the booking form suit Gage's
      pricing (`src/pages/contact.astro`).
- [ ] Set up the Netlify form notifications so `booking-inquiry` and `fan-message`
      go to their own inboxes (README > Forms).

## Email list, analytics, legal

- [ ] Choose Kit (ConvertKit) or Mailchimp and share the public form URL.
- [ ] Turn on double opt-in at the provider.
- [ ] Plausible account (or GA4 property ID).
- [ ] Privacy policy reviewed by the client or their lawyer.

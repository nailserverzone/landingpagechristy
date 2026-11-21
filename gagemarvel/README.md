# gagemarvel.com

The official website of Gage Marvel, independent country music artist. Built
with Astro, TypeScript and Tailwind CSS, hosted on Netlify. Every page is static
HTML, so it's fast and cheap to run.

**Jump to:** [Run it](#1-run-it-locally) ·
[Add a song](#2-add-a-new-song) ·
[Add or remove a show](#3-add-or-remove-a-show) ·
[Videos and photos](#4-add-a-video-or-a-photo) ·
[Links](#5-update-social-and-streaming-links) ·
[Optional features](#6-optional-features) ·
[Environment variables](#7-environment-variables) ·
[Connect the domain](#8-connect-gagemarvelcom) ·
[Analytics events](#9-analytics-event-glossary)

---

## 1. Run it locally

You need Node 22 or newer.

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Open http://localhost:4321.

| Command           | What it does                                                            |
| ----------------- | ----------------------------------------------------------------------- |
| `npm run dev`     | Local server with live reload                                           |
| `npm run build`   | Type-checks, then builds the site into `dist/`. Must pass with 0 errors |
| `npm run preview` | Serves the built `dist/` folder                                         |
| `npm run lint`    | ESLint                                                                  |
| `npm run format`  | Prettier                                                                |
| `npm run brand`   | Rebuilds the wordmark SVGs and favicons                                 |

Building inside a cloud sandbox that sits behind a proxy? Run
`NODE_USE_ENV_PROXY=1 npm run build` so the Apple Music previews can be fetched.
Netlify needs nothing extra.

### Where things live

```
src/
  config/site.ts      Every external link, contact and feature flag
  content/            One small file per song, show, video and photo
    songs/  shows/  videos/  photos/
  content.config.ts   The rules each content file must follow
  assets/covers/      Cover art
  pages/              One file per page (songs/[slug] makes a page per song)
  components/         Header, footer, hero, record deck, player and so on
  styles/global.css   Colors, fonts and type scale
public/brand-assets/  Downloadable logo SVGs in every colorway
```

---

## 2. Add a new song

Each release is one file in `src/content/songs/`. Adding one updates the home
page deck, the Music page, the setlist, the scrolling title band, the sitemap
and a new page at `/songs/<file-name>` with its own share image. Nothing else
to touch.

1. **Add the cover.** Put a square image (at least 1200 x 1200, ideally 3000 x 3000) in `src/assets/covers/`, named like the song:
   `src/assets/covers/new-song-title.jpg`.
2. **Create the song file** `src/content/songs/new-song-title.md`. The file name
   becomes the web address, so use lowercase words and dashes.
3. **Paste this in and fill it out:**

   ```yaml
   ---
   title: 'New Song Title'
   kind: single # single, ep or album
   releaseDate: 2027-01-15 # YYYY-MM-DD. Leave out if not confirmed.
   label: '℗ 2027 Marvel Records'
   cover: ../../assets/covers/new-song-title.jpg
   coverAlt: "Describe the cover for people who can't see it."
   mood: sunset # optional light effect: sunset, candle, film, fireflies, fire, neon, pollen
   glow: '#E8B830' # optional color picked from the cover
   featured: true # true moves the spotlight to this song (set the old one to false)
   appleTrackId: 1234567890 # the number after ?i= in the Apple Music song link
   lyricLines: [] # optional: 2 to 4 approved lyric lines, e.g. ["Line one", "Line two"]
   links:
     spotify: https://open.spotify.com/track/...
     appleMusic: https://music.apple.com/us/album/...
     youtubeMusic: https://music.youtube.com/watch?v=...
     youtube: https://www.youtube.com/watch?v=...
     amazonMusic: https://music.amazon.com/albums/...
   ---
   ```

4. **Commit.** Netlify rebuilds the site in about a minute.

Leave out any link you don't have: that button falls back to Gage's artist page
on that service. Releases sort newest first by `releaseDate`. If something is
wrong (a typo in a date, missing alt text) the build stops and says exactly which
file and field to fix.

**Previews.** With `appleTrackId` set, the site fetches Apple's official 30
second preview at every build and shows a play button. Previews only play when
someone presses play.

---

## 3. Add or remove a show

Each show is one file in `src/content/shows/`.

**To add one**, create `src/content/shows/2027-03-14-venue-name.md`:

```yaml
---
date: 2027-03-14 # YYYY-MM-DD
time: '8:00 PM' # optional, local time at the venue
venue: 'The Venue Name'
city: 'Nashville'
region: 'TN' # state or province
country: 'US'
ticketUrl: https://tickets.example.com/... # optional. Leave out for a free show
eventType: concert # concert, festival, private or appearance
soldOut: false
notes: 'Doors at 7.' # optional
---
```

Commit it. The show appears under **Upcoming** on the Shows page and in the
home page's Dates (next three), with a Tickets button, an **Add to calendar**
download and search-engine event data.

- No `ticketUrl` shows a **Free Show** badge (or **Private event** for private
  shows). `soldOut: true` shows **Sold out**.
- **You never need to move old shows.** The site rebuilds every morning (see
  [Daily rebuild](#daily-rebuild)) and anything dated before today moves to
  **Past shows** on its own.
- **To remove a show** (cancelled), delete its file and commit.
- Files with `sample: true` are demo shows. They appear on previews only, never
  on the live site. Delete them once real dates exist.

### Daily rebuild

`.github/workflows/gagemarvel-daily-rebuild.yml` (at the root of the
repository) pings Netlify every morning to rebuild. One-time setup:

1. Netlify: **Site configuration > Build & deploy > Build hooks > Add build
   hook**, name it "Daily rebuild", copy the URL.
2. GitHub: **Settings > Secrets and variables > Actions > New repository
   secret**, name `NETLIFY_BUILD_HOOK_URL`, paste the URL.

You can also run it by hand from the **Actions** tab.

---

## 4. Add a video or a photo

**Video:** create `src/content/videos/song-name-video.md`:

```yaml
---
title: 'Song Name (Official Video)'
youtubeId: dQw4w9WgXcQ # the 11 characters after watch?v= in the YouTube link
category: music-video # music-video or live
date: 2027-02-01 # optional
featured: true # shows on the home page
captions: true # are captions on YouTube? (please add them)
---
```

**Photo:** put the image in `src/assets/photos/` (create the folder), then
create `src/content/photos/live-at-venue.md`:

```yaml
---
image: ../../assets/photos/live-at-venue.jpg
alt: 'Gage singing at the microphone under a gold spotlight.' # required
caption: 'Live at The Venue, 2027' # optional
credit: 'Photographer Name' # optional
order: 1 # lower numbers first
---
```

Images are resized and converted to modern formats automatically; upload the
largest original you have.

---

## 5. Update social and streaming links

Everything lives in `src/config/site.ts`:

```ts
export const social = {
  instagram: 'https://www.instagram.com/gagemarvel/',
  tiktok: '', // empty = not shown anywhere
  // ...
};
```

- An empty value hides that link everywhere.
- A link ending in `#todo-content` is a placeholder. The build prints a warning
  naming every page that still has one.
- Outbound links get UTM tags automatically, so streaming and social dashboards
  show traffic coming from gagemarvel.com.

Contact emails are **not** in code; they're environment variables (section 7).

---

## 6. Optional features

| Feature                                           | How to turn it on                                                         | Status                |
| ------------------------------------------------- | ------------------------------------------------------------------------- | --------------------- |
| Bandsintown widget on Shows                       | Set `ENABLE_BANDSINTOWN=true` and `PUBLIC_BANDSINTOWN_ARTIST=Gage Marvel` | Ready, off by default |
| Merch page and nav link                           | `SHOW_MERCH=true`                                                         | Phase 5               |
| Decap CMS (edit content in a browser at `/admin`) | `ENABLE_CMS=true`                                                         | Phase 5               |

### Forms: where messages go

| Form                                 | Netlify name      | Send notifications to                | Event                |
| ------------------------------------ | ----------------- | ------------------------------------ | -------------------- |
| Booking inquiry (`/contact#booking`) | `booking-inquiry` | the booking inbox (`BOOKING_EMAIL`)  | `booking_submit`     |
| Fan message (`/contact#fan-message`) | `fan-message`     | the fan inbox (`FAN_EMAIL`)          | `fan_message_submit` |
| Fan list signup (site-wide)          | `fan-list`        | export or sync to Kit / Mailchimp    | `fan_signup`         |
| Song request (the setlist)           | `song-request`    | anyone curious; it's a running tally | `song_request`       |

After the first deploy: in Netlify open **Forms** (enable form detection if
asked, then redeploy once), then **Site configuration > Notifications > Form
submission notifications**: add one email notification for `booking-inquiry` to
the booking address and one for `fan-message` to the fan address. Every form has
a honeypot and Netlify spam filtering. To use Formspree instead, set
`PUBLIC_BOOKING_FORM_ENDPOINT` and `PUBLIC_FAN_FORM_ENDPOINT`.

### Fan email list

Set `PUBLIC_EMAIL_PROVIDER` to `kit` or `mailchimp` and `PUBLIC_EMAIL_FORM_ACTION`
to the provider's public form URL. **Turn on double opt-in at the provider** (in
Kit it's in the form's incentive email settings; in Mailchimp under Audience >
Settings). The consent box is never pre-ticked and the privacy policy is linked
under every form, which covers the basics of CAN-SPAM, CASL and GDPR. Until a
provider is chosen, signups are stored as the Netlify form `fan-list`.

---

## 7. Environment variables

Set on Netlify under **Site configuration > Environment variables**. All are
listed in `.env.example`. `PUBLIC_` values are visible in the browser, so no
secrets there.

| Variable                                                   | What it is                                                                                | Where it comes from |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------- |
| `PUBLIC_BOOKING_EMAIL`                                     | Booking address shown in the footer, press kit and contact page                           | Client              |
| `PUBLIC_FAN_EMAIL`                                         | Fan/general address (privacy contact)                                                     | Client              |
| `BOOKING_EMAIL`, `FAN_EMAIL`                               | Reminder of where Netlify form notifications should go                                    | Client              |
| `PUBLIC_BOOKING_FORM_ENDPOINT`, `PUBLIC_FAN_FORM_ENDPOINT` | Optional Formspree URLs                                                                   | Formspree           |
| `PUBLIC_EMAIL_PROVIDER`                                    | `kit`, `mailchimp` or `netlify`                                                           | Your choice         |
| `PUBLIC_EMAIL_FORM_ACTION`                                 | The provider's public form URL                                                            | Kit or Mailchimp    |
| `PUBLIC_ANALYTICS_PROVIDER`                                | `plausible` (default), `ga4` or `none`                                                    | Your choice         |
| `PUBLIC_PLAUSIBLE_DOMAIN`                                  | Usually `gagemarvel.com`                                                                  | Plausible           |
| `PUBLIC_PLAUSIBLE_SCRIPT_SRC`                              | Plausible script URL (the default includes custom events and outbound links)              | Plausible           |
| `PUBLIC_GA4_ID`                                            | `G-XXXXXXX` if using GA4                                                                  | Google Analytics    |
| `SHOW_MERCH`, `ENABLE_CMS`, `ENABLE_BANDSINTOWN`           | Feature flags (`true` / `false`)                                                          | Your choice         |
| `PUBLIC_BANDSINTOWN_ARTIST`                                | Artist name on Bandsintown                                                                | Bandsintown         |
| `SHOW_SAMPLE_CONTENT`                                      | Show demo shows/videos/photos. Set by `netlify.toml`: on for previews, off for production | Automatic           |

---

## 8. Connect gagemarvel.com

The client owns the domain, so these are steps for whoever has the login at the
registrar (GoDaddy, Namecheap, Squarespace Domains and so on).

**In Netlify** (done by the developer):

1. **Domain management > Add a domain**, enter `gagemarvel.com`. Netlify adds
   `www.gagemarvel.com` too. Make `gagemarvel.com` the **primary domain**.
2. While this site lives in the `gagemarvel/` folder of the repository, set
   **Base directory** to `gagemarvel` under Build settings.

**At the registrar** (done by the client): open the DNS settings for
gagemarvel.com, remove any existing `A` record for `@` and `CNAME` for `www`
(often "parking" records), then add:

| Type    | Host / Name | Value                          | TTL                |
| ------- | ----------- | ------------------------------ | ------------------ |
| `A`     | `@`         | `75.2.60.5`                    | Automatic / 1 hour |
| `CNAME` | `www`       | `<your-site-name>.netlify.app` | Automatic / 1 hour |

Use the exact values Netlify shows on its **Domain management** page: Netlify
occasionally updates its load-balancer address, and its page is the source of
truth. Some registrars write "@" for the bare domain and some leave Host blank;
both mean the same thing.

**HTTPS:** once DNS has spread (minutes to a few hours), Netlify issues a free
Let's Encrypt certificate automatically. Under **Domain management > HTTPS**,
click **Verify DNS configuration** if it hasn't appeared after an hour, and keep
**Force HTTPS** on.

**www to apex:** with `gagemarvel.com` as primary, Netlify redirects
`www.gagemarvel.com` to it automatically, and `netlify.toml` states the same 301
redirect explicitly.

**Email is untouched:** these records only change the website. Leave any `MX`
or `TXT` records alone.

---

## 9. Analytics event glossary

Visits are counted automatically. These custom events show what fans actually
do. In Plausible, add each name under **Site settings > Goals > Custom event**
so it appears on the dashboard.

| Event                | When it fires                                                | Details recorded                                                                                                              |
| -------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `listen_click`       | Someone clicks through to a music service, or loads a player | `platform` (spotify, appleMusic...), `song`, `location` (modal, home_featured, music_page, song_page, embed, now_spinning...) |
| `preview_play`       | Someone plays a 30 second Apple Music preview                | `song`, `location` (hero, deck, home_featured, music_page, song_page)                                                         |
| `follow_click`       | Someone clicks a social link                                 | `network` (instagram, tiktok...), `location` (hero, footer, mobile_menu, about)                                               |
| `fan_signup`         | A fan list signup succeeds                                   | `location` (footer, home_band, music_page...)                                                                                 |
| `booking_submit`     | A booking inquiry is sent                                    | none                                                                                                                          |
| `fan_message_submit` | A fan message is sent                                        | none                                                                                                                          |
| `song_request`       | A fan sends a request from the setlist                       | `song`                                                                                                                        |
| `video_play`         | Someone starts a video                                       | `videoTitle`                                                                                                                  |
| `ticket_click`       | Someone clicks Tickets for a show                            | `venue`, `date`                                                                                                               |

In plain terms: `listen_click` by `platform` shows which streaming services
Gage's fans use; `preview_play` and `song_request` show which songs pull people
in; `location` shows which part of the site sent them.

---

## Brand

Colors are defined once in `src/styles/global.css` (`@theme`) and are available
as Tailwind classes (`bg-gold`) and CSS variables (`var(--gold)`). Every text
pairing passes WCAG 2.1 AA; ratios are listed in that file and on the hidden
`/brand` page, which shows the three wordmark options. To switch the live mark,
set `wordmark` in `src/config/site.ts` and run `WORDMARK_OPTION=<n> npm run brand`
to rebuild the favicons.

## Quality bar

- Lighthouse (mobile) 95+ in Performance, Accessibility, Best Practices and SEO
  on every page.
- Keyboard: every control is reachable, with a gold focus ring. Dialogs (menu,
  LISTEN NOW, photo viewer) trap focus and close with Esc. The record deck takes
  arrow keys.
- `prefers-reduced-motion`: the hero renders already open, nothing drifts or
  spins, and the light effects show a still frame.
- No audio or video ever plays without a click.

## Placeholders

Everything still needed from the client is in
[`CONTENT_CHECKLIST.md`](./CONTENT_CHECKLIST.md), and each spot is marked
`TODO(content)` in the code.

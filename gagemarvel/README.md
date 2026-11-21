# gagemarvel.com

The official website for Gage Marvel, independent country music artist.
Built with Astro, TypeScript and Tailwind CSS, and hosted on Netlify.

> **Status: Phase 1 (foundation) of 5.** Layout, header, footer, brand system,
> content schemas and the `/brand` review page are in place. The home, music,
> about and shows pages come in Phase 2. This README grows with each phase. The
> full non-developer guide (DNS, analytics glossary and so on) lands in Phase 4.

## Run it locally

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

Open http://localhost:4321. The brand review page is at http://localhost:4321/brand.

| Command           | What it does                                                           |
| ----------------- | ---------------------------------------------------------------------- |
| `npm run dev`     | Local server with live reload                                          |
| `npm run build`   | Type-checks, then builds the static site into `dist/`                  |
| `npm run preview` | Serves the built `dist/` folder                                        |
| `npm run lint`    | ESLint                                                                 |
| `npm run format`  | Prettier (writes changes)                                              |
| `npm run brand`   | Rebuilds the wordmark SVGs and favicons from `scripts/build-brand.mjs` |

## Where things live

```
src/
  config/site.ts        Every external link, contact and feature flag. Edit links here.
  content/              One small file per song, show, video and photo
    songs/  shows/  videos/  photos/
  content.config.ts     The rules (schema) each content file must follow
  components/
    brand/Wordmark.astro  The logo. One component, three options.
    layout/               Header and footer
    ui/FanSignup.astro    JOIN THE FAN LIST form, used site-wide
  layouts/BaseLayout.astro  Page shell: SEO tags, header, footer
  styles/global.css     Design tokens (colors, fonts, type scale) and base styles
  assets/placeholders/  Dark stand-in images. Every one gets replaced.
public/
  brand-assets/         Downloadable logo SVGs in every colorway
scripts/                Generators for the wordmarks and placeholder images
```

## Brand

- **Colors** are defined once in `src/styles/global.css` under `@theme` and are
  available as Tailwind classes (`bg-gold`, `text-ivory-muted`) and CSS variables
  (`var(--gold)`). All text pairings pass WCAG 2.1 AA; the ratios are listed in
  that file and on `/brand`.
- **Fonts:** Big Shoulders Display (headings) and Source Sans 3 (body),
  self-hosted through Fontsource. No requests to Google.
- **Wordmark:** three options are on `/brand`. The live site uses whichever number
  is set as `wordmark` in `src/config/site.ts`. To switch:
  1. Change `wordmark: 1` to `2` or `3`.
  2. Run `WORDMARK_OPTION=2 npm run brand` to rebuild the favicons from that
     option's monogram.

The marks are drawn as outlined paths (not live text), so the SVGs in
`public/brand-assets/` can go straight to a print or merch vendor.

## Content

Each song, show, video and photo is one markdown file. Add a file, commit, and
the site rebuilds. Step-by-step guides with copy-paste examples arrive with the
pages that use them (Phases 2 and 3). The schema in `src/content.config.ts`
explains every field, and the build stops with a plain-English message if a
required field is missing.

Entries with `sample: true` are demo content. They show in local development and
on Netlify deploy previews, and never on the production site.

## Environment variables

All of them are listed, with comments, in `.env.example`. Set them on Netlify
under **Site configuration > Environment variables**. Anything starting with
`PUBLIC_` is visible in the browser, so no secrets go there.

## Placeholders

Every placeholder is marked `TODO(content)` in the code and listed in
[`CONTENT_CHECKLIST.md`](./CONTENT_CHECKLIST.md). Placeholder links end in
`#todo-content`, and `npm run build` prints a warning naming every page that
still has one.

## Deploying (summary)

`netlify.toml` holds the build settings. While this site lives in the
`gagemarvel/` folder of the `landingpagechristy` repository, set **Base
directory** to `gagemarvel` when creating the Netlify site. Domain and DNS
instructions for gagemarvel.com come in Phase 4.

/**
 * Decap CMS configuration, generated so it always matches the content schemas
 * in src/content.config.ts. JSON is valid YAML, so Decap reads it as-is.
 *
 * Env (all optional):
 *   CMS_BACKEND       github (default, sign in with GitHub via Netlify OAuth)
 *                     or git-gateway (Netlify Identity)
 *   CMS_REPO          owner/name of the GitHub repository
 *   CMS_BRANCH        branch the live site deploys from (default main)
 *   CMS_CONTENT_ROOT  folder holding this site inside the repo (default gagemarvel)
 */
import type { APIRoute } from 'astro';

const env = import.meta.env;
const root = (env.CMS_CONTENT_ROOT ?? 'gagemarvel').replace(/\/$/, '');
const at = (p: string) => (root ? `${root}/${p}` : p);

const urlPattern = ['^https?://.+', 'Must be a full link starting with https://'];
const optional = { required: false };
const linkField = (name: string, label: string) => ({
  name,
  label,
  widget: 'string',
  ...optional,
  pattern: urlPattern,
});
const dateOnly = (name: string, label: string, required = true) => ({
  name,
  label,
  widget: 'datetime',
  format: 'YYYY-MM-DD',
  date_format: 'YYYY-MM-DD',
  time_format: false,
  picker_utc: true,
  required,
});
const sample = {
  name: 'sample',
  label: 'Sample (shown on previews only, never on the live site)',
  widget: 'boolean',
  default: false,
  required: false,
};

const config = {
  backend:
    (env.CMS_BACKEND || 'github') === 'git-gateway'
      ? { name: 'git-gateway', branch: env.CMS_BRANCH || 'main' }
      : {
          name: 'github',
          repo: env.CMS_REPO || 'nailserverzone/landingpagechristy',
          branch: env.CMS_BRANCH || 'main',
          base_url: 'https://api.netlify.com',
          auth_endpoint: 'auth',
        },
  // Every edit opens as a draft you can preview before it goes live.
  publish_mode: 'editorial_workflow',
  site_url: 'https://gagemarvel.com',
  display_url: 'https://gagemarvel.com',
  logo_url: '/favicon.svg',
  media_folder: at('src/assets/uploads'),
  public_folder: '../../assets/uploads',
  slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-' },
  collections: [
    {
      name: 'shows',
      label: 'Shows',
      label_singular: 'Show',
      description: 'Add a show here. It moves to Past shows on its own the day after.',
      folder: at('src/content/shows'),
      create: true,
      extension: 'md',
      format: 'frontmatter',
      identifier_field: 'venue',
      slug: '{{year}}-{{month}}-{{day}}-{{venue}}',
      summary: '{{date}} · {{venue}}, {{city}}',
      sortable_fields: ['date', 'venue'],
      fields: [
        dateOnly('date', 'Date'),
        { name: 'time', label: 'Time (e.g. 8:00 PM)', widget: 'string', ...optional },
        { name: 'venue', label: 'Venue', widget: 'string' },
        { name: 'city', label: 'City', widget: 'string' },
        { name: 'region', label: 'State or region', widget: 'string', ...optional },
        { name: 'country', label: 'Country', widget: 'string', default: 'US' },
        { ...linkField('ticketUrl', 'Ticket link (leave empty for a free show)') },
        {
          name: 'eventType',
          label: 'Event type',
          widget: 'select',
          options: ['concert', 'festival', 'private', 'appearance'],
          default: 'concert',
        },
        { name: 'soldOut', label: 'Sold out', widget: 'boolean', default: false, required: false },
        { name: 'notes', label: 'Notes', widget: 'text', ...optional },
        sample,
      ],
    },
    {
      name: 'songs',
      label: 'Songs',
      label_singular: 'Release',
      description: 'One entry per single, EP or album. Newest release date shows first.',
      folder: at('src/content/songs'),
      create: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{slug}}',
      summary: '{{title}} ({{kind}}, {{releaseDate}})',
      media_folder: '../../assets/covers',
      public_folder: '../../assets/covers',
      fields: [
        { name: 'title', label: 'Title', widget: 'string' },
        {
          name: 'kind',
          label: 'Type',
          widget: 'select',
          options: ['single', 'ep', 'album'],
          default: 'single',
        },
        dateOnly('releaseDate', 'Release date (leave empty until confirmed)', false),
        {
          name: 'label',
          label: 'Copyright line, e.g. ℗ 2027 Marvel Records',
          widget: 'string',
          ...optional,
        },
        { name: 'cover', label: 'Cover art (square, 1200px or larger)', widget: 'image' },
        {
          name: 'coverAlt',
          label: 'Describe the cover for people who cannot see it',
          widget: 'string',
          pattern: ['.{5,}', 'Please write at least a short sentence'],
        },
        {
          name: 'featured',
          label: 'Featured (home page spotlight and LISTEN NOW). Only one at a time.',
          widget: 'boolean',
          default: false,
          required: false,
        },
        {
          name: 'mood',
          label: 'Light effect (matches the cover)',
          widget: 'select',
          options: ['sunset', 'candle', 'film', 'fireflies', 'fire', 'neon', 'pollen'],
          ...optional,
        },
        {
          name: 'glow',
          label: 'Glow color from the cover (hex, e.g. #E8B830)',
          widget: 'string',
          ...optional,
          pattern: ['^#[0-9a-fA-F]{6}$', 'Use a hex color like #E8B830'],
        },
        { name: 'description', label: 'Short description', widget: 'text', ...optional },
        {
          name: 'appleTrackId',
          label: 'Apple Music track ID (number after ?i= in the song link, for the preview)',
          widget: 'number',
          value_type: 'int',
          ...optional,
        },
        {
          name: 'spotifyId',
          label: 'Spotify ID (for the Spotify player)',
          widget: 'string',
          ...optional,
        },
        {
          name: 'links',
          label: 'Streaming links',
          widget: 'object',
          collapsed: false,
          fields: [
            linkField('spotify', 'Spotify'),
            linkField('appleMusic', 'Apple Music'),
            linkField('youtubeMusic', 'YouTube Music'),
            linkField('youtube', 'YouTube'),
            linkField('amazonMusic', 'Amazon Music'),
            linkField('deezer', 'Deezer'),
            linkField('pandora', 'Pandora'),
            linkField('tidal', 'TIDAL'),
            linkField('bandcamp', 'Bandcamp'),
          ],
        },
        {
          name: 'lyricLines',
          label: 'Lyric lines for decoration (2 to 4 short lines Gage approved)',
          widget: 'list',
          ...optional,
        },
        {
          name: 'tracks',
          label: 'Tracks (EPs and albums only)',
          widget: 'list',
          ...optional,
          fields: [
            { name: 'title', label: 'Title', widget: 'string' },
            linkField('appleMusic', 'Apple Music link'),
            linkField('spotify', 'Spotify link'),
          ],
        },
        {
          name: 'credits',
          label: 'Credits',
          widget: 'list',
          ...optional,
          fields: [
            { name: 'role', label: 'Role', widget: 'string' },
            { name: 'name', label: 'Name', widget: 'string' },
          ],
        },
        {
          name: 'hasLyrics',
          label: 'The text below contains the full lyrics',
          widget: 'boolean',
          default: false,
          required: false,
        },
        { name: 'body', label: 'Full lyrics (optional)', widget: 'markdown', ...optional },
      ],
    },
    {
      name: 'videos',
      label: 'Videos',
      label_singular: 'Video',
      folder: at('src/content/videos'),
      create: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{slug}}',
      summary: '{{title}} ({{category}})',
      fields: [
        { name: 'title', label: 'Title', widget: 'string' },
        {
          name: 'youtubeId',
          label: 'YouTube ID (the 11 characters after watch?v=)',
          widget: 'string',
          pattern: ['^[A-Za-z0-9_-]{11}$', 'Paste just the 11 character ID'],
        },
        {
          name: 'category',
          label: 'Category',
          widget: 'select',
          options: [
            { label: 'Music video', value: 'music-video' },
            { label: 'Live performance', value: 'live' },
          ],
        },
        dateOnly('date', 'Date', false),
        { name: 'description', label: 'Description', widget: 'text', ...optional },
        {
          name: 'featured',
          label: 'Show on the home page',
          widget: 'boolean',
          default: false,
          required: false,
        },
        {
          name: 'order',
          label: 'Order (lower first)',
          widget: 'number',
          default: 100,
          value_type: 'int',
        },
        {
          name: 'captions',
          label: 'Captions are on YouTube',
          widget: 'boolean',
          default: false,
          required: false,
        },
        sample,
      ],
    },
    {
      name: 'photos',
      label: 'Photos',
      label_singular: 'Photo',
      folder: at('src/content/photos'),
      create: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{slug}}',
      identifier_field: 'alt',
      summary: '{{alt}}',
      media_folder: '../../assets/photos',
      public_folder: '../../assets/photos',
      fields: [
        { name: 'image', label: 'Photo', widget: 'image' },
        {
          name: 'alt',
          label: 'Describe the photo for people who cannot see it (required)',
          widget: 'string',
          pattern: ['.{5,}', 'Please write at least a short sentence'],
        },
        { name: 'caption', label: 'Caption', widget: 'string', ...optional },
        { name: 'credit', label: 'Photographer', widget: 'string', ...optional },
        {
          name: 'order',
          label: 'Order (lower first)',
          widget: 'number',
          default: 100,
          value_type: 'int',
        },
        sample,
      ],
    },
    {
      name: 'merch',
      label: 'Merch',
      label_singular: 'Product',
      description: 'Shown on /merch when SHOW_MERCH is on.',
      folder: at('src/content/merch'),
      create: true,
      extension: 'md',
      format: 'frontmatter',
      slug: '{{slug}}',
      summary: '{{name}}',
      media_folder: '../../assets/merch',
      public_folder: '../../assets/merch',
      fields: [
        { name: 'name', label: 'Product name', widget: 'string' },
        { name: 'image', label: 'Product photo', widget: 'image' },
        {
          name: 'alt',
          label: 'Describe the photo (required)',
          widget: 'string',
          pattern: ['.{5,}', 'Please write at least a short sentence'],
        },
        { name: 'price', label: 'Price as shown, e.g. $30', widget: 'string', ...optional },
        linkField('url', 'Store link for this product'),
        {
          name: 'shopifyProductId',
          label: 'Shopify product ID (for the Buy Button)',
          widget: 'string',
          ...optional,
        },
        { name: 'soldOut', label: 'Sold out', widget: 'boolean', default: false, required: false },
        {
          name: 'order',
          label: 'Order (lower first)',
          widget: 'number',
          default: 100,
          value_type: 'int',
        },
        sample,
      ],
    },
  ],
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(config, null, 2), {
    headers: { 'Content-Type': 'text/yaml; charset=utf-8' },
  });

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Fails loudly (in the log) if any placeholder link made it into a
 * production build. Placeholder URLs end in `#todo-content`.
 */
/** @type {import('astro').AstroIntegration} */
const placeholderGuard = {
  name: 'placeholder-guard',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      const root = dir.pathname;
      const hits = new Set();
      /** @param {string} d */
      const walk = (d) => {
        for (const f of fs.readdirSync(d, { withFileTypes: true })) {
          const p = path.join(d, f.name);
          if (f.isDirectory()) walk(p);
          else if (f.name.endsWith('.html') && fs.readFileSync(p, 'utf8').includes('#todo-content'))
            hits.add(path.relative(root, p));
        }
      };
      walk(root);
      if (hits.size) {
        logger.warn(
          `Placeholder links (#todo-content) still present in ${hits.size} page(s): ${[...hits].join(', ')}. See CONTENT_CHECKLIST.md.`,
        );
      }
    },
  },
};

// Feature flags, read from .env locally and from Netlify's environment in builds.
const env = { ...loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), ''), ...process.env };
const on = (/** @type {string | undefined} */ v) => v === 'true' || v === '1';

/**
 * Pages that only exist when their flag is on. With the flag off they are not
 * hidden: they are simply not built, so nothing can leak.
 *   SHOW_MERCH=true  -> /merch (and the Merch nav link, see src/config/site.ts)
 *   ENABLE_CMS=true  -> /admin (Decap CMS) and /admin-config.yml
 */
/** @type {import('astro').AstroIntegration} */
const featureRoutes = {
  name: 'feature-routes',
  hooks: {
    'astro:config:setup': ({ injectRoute, logger }) => {
      if (on(env.SHOW_MERCH)) {
        injectRoute({ pattern: '/merch', entrypoint: './src/flagged/merch.astro' });
        logger.info('Merch page on');
      }
      if (on(env.ENABLE_CMS)) {
        injectRoute({ pattern: '/admin', entrypoint: './src/flagged/admin.astro' });
        injectRoute({
          pattern: '/admin-config.yml',
          entrypoint: './src/flagged/admin-config.yml.ts',
        });
        logger.info('Decap CMS on at /admin');
      }
    },
  },
};

export default defineConfig({
  site: 'https://gagemarvel.com',
  trailingSlash: 'never',
  // Inline the (small) CSS into each page: no render-blocking stylesheet requests.
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      // Hidden and utility pages stay out of the sitemap.
      filter: (page) => !/\/(brand|admin|admin-config\.yml|404)(\/|$)/.test(page),
    }),
    placeholderGuard,
    featureRoutes,
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

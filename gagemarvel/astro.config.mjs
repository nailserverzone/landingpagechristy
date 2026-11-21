// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
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

export default defineConfig({
  site: 'https://gagemarvel.com',
  trailingSlash: 'never',
  // Inline the (small) CSS into each page: no render-blocking stylesheet requests.
  build: { format: 'file', inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      // Hidden and utility pages stay out of the sitemap.
      filter: (page) => !/\/(brand|admin|404)(\/|$)/.test(page),
    }),
    placeholderGuard,
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});

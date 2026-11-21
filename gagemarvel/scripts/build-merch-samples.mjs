/**
 * Sample merch mockups made from the real wordmarks, so /merch can be reviewed
 * before product photos exist. Marked sample: true; never shown on the live site.
 * TODO(content): replace with real product photos.
 * Run: node scripts/build-merch-samples.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'src/assets/merch');
fs.mkdirSync(out, { recursive: true });
const brand = (f) => fs.readFileSync(path.join(root, 'public/brand-assets', f));

const S = 1200;
const tee = (
  fill,
  shade,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 1000 1000">
  <defs><radialGradient id="bg" cx=".5" cy=".42" r=".7"><stop offset="0" stop-color="#2b2b2b"/><stop offset="1" stop-color="#101010"/></radialGradient>
  <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="${shade}"/><stop offset=".5" stop-color="${fill}"/><stop offset="1" stop-color="${shade}"/></linearGradient></defs>
  <rect width="1000" height="1000" fill="url(#bg)"/>
  <ellipse cx="500" cy="930" rx="330" ry="26" fill="#000" opacity=".45"/>
  <path d="M330 130 L420 100 Q500 160 580 100 L670 130 L880 250 L815 410 L735 372 L735 905 L265 905 L265 372 L185 410 L120 250 Z" fill="url(#t)"/>
  <path d="M420 100 Q500 160 580 100" fill="none" stroke="${shade}" stroke-width="14"/>
</svg>`;

async function product(file, base, mark, markWidth, top) {
  const art = await sharp(mark).resize({ width: markWidth }).png().toBuffer();
  const meta = await sharp(art).metadata();
  await sharp(Buffer.from(base))
    .composite([{ input: art, left: Math.round((S - meta.width) / 2), top }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(path.join(out, file));
}

await product(
  'sample-stacked-logo-tee.jpg',
  tee('#141414', '#0a0a0a'),
  brand('gage-marvel-option-1-full-ivory-transparent.svg'),
  330,
  360,
);
await product(
  'sample-gm-monogram-tee.jpg',
  tee('#e8b830', '#c99a1c'),
  brand('gage-marvel-option-1-mono-black-transparent.svg'),
  200,
  380,
);
const patchBg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}"><defs><radialGradient id="bg" cx=".5" cy=".45" r=".7"><stop offset="0" stop-color="#3a3428"/><stop offset="1" stop-color="#121212"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#bg)"/><ellipse cx="600" cy="1010" rx="330" ry="30" fill="#000" opacity=".45"/></svg>`;
await product(
  'sample-badge-patch.jpg',
  patchBg,
  brand('gage-marvel-option-3-full-ivory-on-black.svg'),
  640,
  260,
);
console.log('Merch samples written to src/assets/merch');

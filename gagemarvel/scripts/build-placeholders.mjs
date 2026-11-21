/**
 * Generates neutral, dark placeholder images at the aspect ratios the real
 * photography will need. No stock photos of real people.
 * TODO(content): every file in src/assets/placeholders is replaced by a real
 * photo or cover before launch (see CONTENT_CHECKLIST.md).
 *
 * Run: node scripts/build-placeholders.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'src/assets/placeholders');
fs.mkdirSync(out, { recursive: true });

function svg(w, h, label, sub, tone = 0) {
  const fs1 = Math.round(Math.min(w, h) * 0.05);
  const fs2 = Math.round(fs1 * 0.45);
  // A soft off-centre "stage light" so layouts can be judged with a light
  // source in frame, like the real photos will have.
  const cx = [0.68, 0.35, 0.55, 0.25, 0.75, 0.5][tone % 6];
  const cy = [0.3, 0.25, 0.4, 0.35, 0.2, 0.3][tone % 6];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="g" cx="${cx}" cy="${cy}" r="0.85">
      <stop offset="0" stop-color="#3a3428"/>
      <stop offset="0.45" stop-color="#1c1a17"/>
      <stop offset="1" stop-color="#0d0d0d"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <g fill="none" stroke="#4a4436" stroke-width="${Math.max(2, w / 600)}">
    <rect x="${w * 0.04}" y="${h * 0.04}" width="${w * 0.92}" height="${h * 0.92}"/>
  </g>
  <text x="50%" y="${h * 0.86}" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" letter-spacing="${fs1 * 0.2}" font-size="${fs1}" fill="#6d6655">${label}</text>
  <text x="50%" y="${h * 0.86 + fs1 * 1.1}" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" letter-spacing="${fs2 * 0.2}" font-size="${fs2}" fill="#5b5547">${sub}</text>
</svg>`;
}

const items = [
  ['hero-16x9.jpg', 2400, 1350, 'HERO PHOTO', '16:9  ·  CLIENT TO SUPPLY', 0],
  ['hero-4x5.jpg', 1200, 1500, 'HERO PHOTO', '4:5 MOBILE CROP', 0],
  ['portrait-4x5.jpg', 1200, 1500, 'PORTRAIT', '4:5  ·  CLIENT TO SUPPLY', 1],
  ['cover-you-shoulda-been-there.jpg', 1200, 1200, 'COVER ART', '1:1', 2],
  ['cover-if-jesus-were-a-cowboy.jpg', 1200, 1200, 'COVER ART', '1:1', 3],
  ['cover-tonights-only-me-and-you.jpg', 1200, 1200, 'COVER ART', '1:1', 4],
  ['photo-1.jpg', 1600, 1067, 'LIVE PHOTO', '3:2', 5],
  ['photo-2.jpg', 1200, 1500, 'PORTRAIT', '4:5', 1],
  ['photo-3.jpg', 1600, 1067, 'STAGE', '3:2', 2],
  ['photo-4.jpg', 1200, 1500, 'BACKSTAGE', '4:5', 3],
  ['photo-5.jpg', 1600, 1067, 'CROWD', '3:2', 4],
  ['photo-6.jpg', 1200, 1200, 'DETAIL', '1:1', 0],
];

for (const [file, w, h, label, sub, tone] of items) {
  await sharp(Buffer.from(svg(w, h, label, sub, tone)))
    .jpeg({ quality: 70, mozjpeg: true })
    .toFile(path.join(out, file));
}
console.log(`Wrote ${items.length} placeholders to ${path.relative(root, out)}`);

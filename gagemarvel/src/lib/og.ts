/**
 * Social share images (1200x630), rendered at build time with sharp.
 * Text is drawn as outlined paths from the site's own display font, so the
 * cards look right no matter which fonts the build machine has installed.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp, { type OverlayOptions } from 'sharp';
import opentype from 'opentype.js';
import { marks } from '@/components/brand/marks';
import { site } from '@/config/site';
import type { Song } from './music';

const W = 1200;
const H = 630;
const INK = '#F4EEDF';
const GOLD = '#E8B830';

let font: opentype.Font | undefined;
function display() {
  if (!font) {
    const file = path.resolve(
      'node_modules/@fontsource/big-shoulders-display/files/big-shoulders-display-latin-900-normal.woff',
    );
    const b = fs.readFileSync(file);
    font = opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
  }
  return font;
}

const n = (v: number) => String(Math.round(v * 10) / 10);
/** Own serializer: opentype's toPathData can print NaN for some values. */
function pathData(p: opentype.Path) {
  return p.commands
    .map((c) => {
      if (c.type === 'M' || c.type === 'L') return `${c.type}${n(c.x)} ${n(c.y)}`;
      if (c.type === 'Q') return `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
      if (c.type === 'C') return `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
      return 'Z';
    })
    .join('');
}

/** Text as an SVG path, wrapped to maxWidth. Returns path data and height used. */
function textPaths(str: string, x: number, y: number, size: number, maxWidth: number, lead = 0.9) {
  const f = display();
  const words = str.toUpperCase().split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (f.getAdvanceWidth(next, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  const d = lines.map((l, i) => pathData(f.getPath(l, x, y + i * size * lead, size))).join('');
  return { d, height: lines.length * size * lead };
}

function wordmark(x: number, y: number, width: number, ink: string, accent: string) {
  const m = marks[site.wordmark].full;
  const [vx, vy, vw] = m.viewBox.split(' ').map(Number);
  const s = width / vw;
  return `<g transform="translate(${x} ${y}) scale(${s}) translate(${-vx} ${-vy})"><path d="${m.ink}" fill="${ink}"/><path d="${m.accent}" fill="${accent}"/></g>`;
}

const fsPathOf = (img: unknown) => (img as { fsPath?: string }).fsPath;

export async function songOg(song: Song): Promise<Buffer> {
  const src = fsPathOf(song.data.cover);
  const coverBuf = src ? fs.readFileSync(src) : undefined;
  const glow = song.data.glow ?? GOLD;

  const bg = coverBuf
    ? await sharp(coverBuf)
        .resize(W, H, { fit: 'cover' })
        .blur(40)
        .modulate({ brightness: 0.38 })
        .toBuffer()
    : await sharp({ create: { width: W, height: H, channels: 3, background: '#0B0B0B' } })
        .png()
        .toBuffer();

  const title = textPaths(song.data.title.replace(/\s*\(feat\..*\)/, ''), 64, 330, 78, 560);
  const kind = { single: 'SINGLE', ep: 'EP', album: 'ALBUM' }[song.data.kind];
  const kicker = textPaths(
    `${kind} · ${song.data.releaseDate?.slice(0, 4) ?? ''}`,
    64,
    262,
    28,
    600,
  );
  const cta = textPaths('LISTEN NOW · GAGEMARVEL.COM', 64, 566, 26, 600);

  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#0B0B0B" stop-opacity=".92"/><stop offset=".62" stop-color="#0B0B0B" stop-opacity=".55"/><stop offset="1" stop-color="#0B0B0B" stop-opacity=".1"/></linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    ${wordmark(64, 60, 150, INK, GOLD)}
    <path d="${kicker.d}" fill="${GOLD}"/>
    <path d="${title.d}" fill="${INK}"/>
    <rect x="64" y="${330 + title.height - 30}" width="80" height="5" fill="${glow}"/>
    <path d="${cta.d}" fill="${INK}" fill-opacity=".8"/>
    <rect x="${W - 540 - 8}" y="${(H - 480) / 2 - 8}" width="496" height="496" fill="${GOLD}"/>
  </svg>`;

  const layers: OverlayOptions[] = [{ input: Buffer.from(overlay) }];
  if (coverBuf) {
    layers.push({
      input: await sharp(coverBuf).resize(480, 480).toBuffer(),
      left: W - 540,
      top: (H - 480) / 2,
    });
  }
  return sharp(bg).composite(layers).png({ compressionLevel: 9 }).toBuffer();
}

export async function defaultOg(): Promise<Buffer> {
  const line = textPaths('COUNTRY MUSIC · MARVEL RECORDS', 80, 548, 30, 900);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="r" cx=".5" cy=".5" r=".5">
        <stop offset="0" stop-color="${GOLD}"/><stop offset=".33" stop-color="${GOLD}"/>
        <stop offset=".335" stop-color="#151515"/><stop offset="1" stop-color="#151515"/>
      </radialGradient>
      <pattern id="grooves" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="5" cy="5" r="4" fill="none" stroke="#222" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="#0B0B0B"/>
    <circle cx="1030" cy="315" r="330" fill="url(#r)"/>
    ${Array.from({ length: 26 }, (_, i) => `<circle cx="1030" cy="315" r="${118 + i * 8}" fill="none" stroke="#1f1f1f" stroke-width="1.2"/>`).join('')}
    <circle cx="1030" cy="315" r="10" fill="#0B0B0B"/>
    ${wordmark(80, 92, 560, INK, GOLD)}
    <path d="${line.d}" fill="${INK}" fill-opacity=".75"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

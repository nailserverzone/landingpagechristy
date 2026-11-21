/**
 * Builds the GAGE MARVEL wordmarks as outlined SVG paths.
 *
 * Why outlines: the marks must work on merch, posters and in print where the
 * web font is not installed. Glyphs come from Big Shoulders Display (SIL Open
 * Font License, which permits use in logos), then each lockup is hand-tuned
 * here: tracking, line widths, rule weights and the emblems are all set by the
 * numbers below rather than by the font's defaults.
 *
 * Run:  npm run brand
 * Writes:
 *   src/components/brand/marks.ts   path data used by <Wordmark />
 *   public/brand-assets/*.svg              standalone files in every colourway
 *   public/favicon.svg, public/*.png favicon set from the live monogram
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fontFile = (w) =>
  path.join(
    root,
    `node_modules/@fontsource/big-shoulders-display/files/big-shoulders-display-latin-${w}-normal.woff`,
  );
const loadFont = (w) => {
  const b = fs.readFileSync(fontFile(w));
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
};
const F = { 700: loadFont(700), 800: loadFont(800), 900: loadFont(900) };

const r = (n) => Math.round(n * 100) / 100;

/** Lay out a string glyph by glyph with kerning and tracking (in em). */
function setText(font, str, size, tracking = 0, x = 0, baseline = 0) {
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(str);
  const out = new opentype.Path();
  let cx = x;
  glyphs.forEach((g, i) => {
    const p = g.getPath(cx, baseline, size);
    out.extend(p);
    cx += g.advanceWidth * scale;
    if (i < glyphs.length - 1) {
      // Some pairs come back NaN from the kern lookup; treat those as zero.
      const k = font.getKerningValue(g, glyphs[i + 1]);
      cx += (Number.isFinite(k) ? k : 0) * scale + tracking * size;
    }
  });
  return out;
}

const bbox = (p) => p.getBoundingBox();
const inkWidth = (p) => {
  const b = bbox(p);
  return b.x2 - b.x1;
};

/** Set text so its ink starts exactly at x (removes side bearing). */
function setAt(font, str, size, tracking, x, baseline) {
  const probe = setText(font, str, size, tracking, 0, baseline);
  const dx = x - bbox(probe).x1;
  return setText(font, str, size, tracking, dx, baseline);
}

/** Tracking (em) that makes `str` exactly `target` wide. */
function trackTo(font, str, size, target) {
  const base = inkWidth(setText(font, str, size, 0));
  const n = font.stringToGlyphs(str).length;
  return (target - base) / ((n - 1) * size);
}

// Own serializer: opentype's toPathData occasionally prints NaN for values
// that round to whole numbers.
const n2 = (v) => {
  if (!Number.isFinite(v)) throw new Error(`Bad coordinate ${v}`);
  return String(Math.round(v * 100) / 100);
};
const d = (p) =>
  p.commands
    .map((c) => {
      switch (c.type) {
        case 'M':
        case 'L':
          return `${c.type}${n2(c.x)} ${n2(c.y)}`;
        case 'Q':
          return `Q${n2(c.x1)} ${n2(c.y1)} ${n2(c.x)} ${n2(c.y)}`;
        case 'C':
          return `C${n2(c.x1)} ${n2(c.y1)} ${n2(c.x2)} ${n2(c.y2)} ${n2(c.x)} ${n2(c.y)}`;
        default:
          return 'Z';
      }
    })
    .join('');
const rect = (x, y, w, h) => `M${r(x)} ${r(y)}h${r(w)}v${r(h)}h${r(-w)}Z`;

/**
 * Original emblem for Option 2: a four point "spotlight star". The vertical
 * points are longer than the horizontal ones (a beam of light on a stage) and
 * the centre is knocked out as a small diamond so it stays crisp when tiny.
 */
function spotlightStar(cx, cy, h) {
  const v = h / 2; // vertical reach
  const hz = v * 0.62; // horizontal reach
  const w = v * 0.16; // waist
  const hole = v * 0.13;
  const outer =
    `M${r(cx)} ${r(cy - v)}` +
    `Q${r(cx + w * 0.35)} ${r(cy - w)} ${r(cx + hz)} ${r(cy)}` +
    `Q${r(cx + w * 0.35)} ${r(cy + w)} ${r(cx)} ${r(cy + v)}` +
    `Q${r(cx - w * 0.35)} ${r(cy + w)} ${r(cx - hz)} ${r(cy)}` +
    `Q${r(cx - w * 0.35)} ${r(cy - w)} ${r(cx)} ${r(cy - v)}Z`;
  // Counter-clockwise inner diamond so nonzero fill punches a hole.
  const inner =
    `M${r(cx)} ${r(cy - hole)}L${r(cx - hole * 0.8)} ${r(cy)}` +
    `L${r(cx)} ${r(cy + hole)}L${r(cx + hole * 0.8)} ${r(cy)}Z`;
  return outer + inner;
}

/** Chamfered rectangle (octagon) outline as a ring, for the Option 3 badge. */
function chamferRing(x, y, w, h, c, t) {
  const oct = (x, y, w, h, c, ccw) => {
    const pts = [
      [x + c, y],
      [x + w - c, y],
      [x + w, y + c],
      [x + w, y + h - c],
      [x + w - c, y + h],
      [x + c, y + h],
      [x, y + h - c],
      [x, y + c],
    ];
    if (ccw) pts.reverse();
    return 'M' + pts.map(([a, b]) => `${r(a)} ${r(b)}`).join('L') + 'Z';
  };
  // Inner chamfer shrinks by t * tan(22.5deg) so the stroke stays even.
  const ci = c - t * 0.414;
  return oct(x, y, w, h, c, false) + oct(x + t, y + t, w - 2 * t, h - 2 * t, ci, true);
}

// ---------------------------------------------------------------------------
// Option 1: Stacked condensed. GAGE over MARVEL, justified to one width,
// a thin gold rule between, tight leading.
// ---------------------------------------------------------------------------
function option1() {
  const S = 100; // MARVEL size
  const cap = 0.8 * S;
  const marvelTrack = 0.035;
  const marvel0 = setText(F[800], 'MARVEL', S, marvelTrack);
  const W = inkWidth(marvel0);
  const gageSize = S * 1.3;
  const gageCap = 0.8 * gageSize;
  const gageTrack = trackTo(F[900], 'GAGE', gageSize, W);
  const gap = S * 0.085;
  const rule = S * 0.035;
  const gage = setAt(F[900], 'GAGE', gageSize, gageTrack, 0, gageCap);
  const ruleY = gageCap + gap;
  const marvelBase = ruleY + rule + gap + cap;
  const marvel = setAt(F[800], 'MARVEL', S, marvelTrack, 0, marvelBase);
  // G and E overshoot the cap line slightly; take real ink extents.
  const top = Math.min(bbox(gage).y1, 0);
  const bottom = Math.max(bbox(marvel).y2, marvelBase);
  const full = {
    viewBox: `0 ${r(top)} ${r(W)} ${r(bottom - top)}`,
    ink: d(gage) + d(marvel),
    accent: rect(0, ruleY, W, rule),
  };

  // Monogram: GM with the same gold rule beneath.
  const ms = 100;
  const gm = setAt(F[900], 'GM', ms, 0.04, 0, 0.8 * ms);
  const mw = inkWidth(gm);
  const mRuleY = 0.8 * ms + ms * 0.1;
  const mRule = ms * 0.085;
  const mono = {
    viewBox: `0 ${r(Math.min(bbox(gm).y1, 0))} ${r(mw)} ${r(mRuleY + mRule - Math.min(bbox(gm).y1, 0))}`,
    ink: d(gm),
    accent: rect(0, mRuleY, mw, mRule),
  };
  return { full, mono };
}

// ---------------------------------------------------------------------------
// Option 2: Single line, with the spotlight star standing in for the space.
// ---------------------------------------------------------------------------
function option2() {
  const S = 100;
  const cap = 0.8 * S;
  const track = 0.07;
  const gage = setAt(F[800], 'GAGE', S, track, 0, cap);
  const starH = cap * 0.92;
  const sp = S * 0.17;
  const starX = bbox(gage).x2 + sp + starH * 0.31;
  const star = spotlightStar(starX, cap / 2, starH);
  const marvel = setAt(F[800], 'MARVEL', S, track, starX + starH * 0.31 + sp, cap);
  const W = bbox(marvel).x2;
  const top = Math.min(bbox(gage).y1, 0);
  const bottom = Math.max(bbox(gage).y2, cap);
  const full = {
    viewBox: `0 ${r(top)} ${r(W)} ${r(bottom - top)}`,
    ink: d(gage) + d(marvel),
    accent: star,
  };

  const ms = 100;
  const mc = 0.8 * ms;
  const g = setAt(F[900], 'G', ms, 0, 0, mc);
  const mStarH = mc * 0.82;
  const msp = ms * 0.07;
  const mStarX = bbox(g).x2 + msp + mStarH * 0.31;
  const m = setAt(F[900], 'M', ms, 0, mStarX + mStarH * 0.31 + msp, mc);
  const mTop = Math.min(bbox(g).y1, 0);
  const mono = {
    viewBox: `0 ${r(mTop)} ${r(bbox(m).x2)} ${r(Math.max(bbox(g).y2, mc) - mTop)}`,
    ink: d(g) + d(m),
    accent: spotlightStar(mStarX, mc / 2, mStarH),
  };
  return { full, mono };
}

// ---------------------------------------------------------------------------
// Option 3: Badge. The name stacked inside a chamfered frame with a star
// notched into the top edge. Geometric and flat, not a vintage seal.
// ---------------------------------------------------------------------------
function option3() {
  const S = 100;
  const cap = 0.8 * S;
  const track = 0.06;
  const marvelW = inkWidth(setText(F[800], 'MARVEL', S, track));
  const padX = S * 0.42;
  const starH = S * 0.46;
  const padTop = S * 0.4 + starH + S * 0.16;
  const padBottom = S * 0.42;
  const lead = S * 0.2;
  const t = S * 0.07; // frame weight
  const W = marvelW + padX * 2;
  const gageW = inkWidth(setText(F[800], 'GAGE', S, track));
  const gage = setAt(F[800], 'GAGE', S, track, padX + (marvelW - gageW) / 2, padTop + cap);
  const marvel = setAt(F[800], 'MARVEL', S, track, padX, padTop + cap + lead + cap);
  const H = padTop + cap + lead + cap + padBottom;
  const c = S * 0.32;
  // Thin inner hairline in the accent colour, inset from the frame.
  const inset = t + S * 0.07;
  const hair = S * 0.022;
  const full = {
    viewBox: `0 0 ${r(W)} ${r(H)}`,
    ink: chamferRing(0, 0, W, H, c, t) + d(gage) + d(marvel),
    accent:
      chamferRing(inset, inset, W - inset * 2, H - inset * 2, c - inset * 0.414, hair) +
      spotlightStar(W / 2, S * 0.4 + starH / 2, starH),
  };

  // Monogram: GM inside a square chamfered frame.
  const ms = 100;
  const mc = 0.8 * ms;
  const gmW = inkWidth(setText(F[900], 'GM', ms, 0.03));
  const side = Math.max(gmW, mc) + ms * 0.62;
  const mt = ms * 0.1;
  const gm = setAt(F[900], 'GM', ms, 0.03, (side - gmW) / 2, (side + mc) / 2);
  const mono = {
    viewBox: `0 0 ${r(side)} ${r(side)}`,
    ink: chamferRing(0, 0, side, side, side * 0.22, mt) + d(gm),
    accent: chamferRing(
      mt * 1.9,
      mt * 1.9,
      side - mt * 3.8,
      side - mt * 3.8,
      side * 0.22 - mt * 0.79,
      ms * 0.035,
    ),
  };
  return { full, mono };
}

const marks = { 1: option1(), 2: option2(), 3: option3() };

// ---------------------------------------------------------------------------
// Outputs
// ---------------------------------------------------------------------------
const header = `// GENERATED by scripts/build-brand.mjs. Do not edit by hand; run \`npm run brand\`.\n`;
const ts =
  header +
  `export interface MarkPaths {\n  viewBox: string;\n  ink: string;\n  accent: string;\n}\n` +
  `export type WordmarkOption = 1 | 2 | 3;\n` +
  `export const marks: Record<WordmarkOption, { full: MarkPaths; mono: MarkPaths }> = ${JSON.stringify(marks, null, 2)};\n`;
fs.mkdirSync(path.join(root, 'src/components/brand'), { recursive: true });
fs.writeFileSync(path.join(root, 'src/components/brand/marks.ts'), ts);

const colourways = {
  'ivory-on-black': { bg: '#0B0B0B', ink: '#F4EEDF', accent: '#E8B830' },
  'black-on-gold': { bg: '#E8B830', ink: '#0B0B0B', accent: '#0B0B0B' },
  'black-on-white': { bg: '#FFFFFF', ink: '#0B0B0B', accent: '#0B0B0B' },
  // Transparent versions for print and merch vendors.
  'ivory-transparent': { bg: null, ink: '#F4EEDF', accent: '#E8B830' },
  'black-transparent': { bg: null, ink: '#0B0B0B', accent: '#0B0B0B' },
};

function svgFile(m, cw, pad = 0.12, square = false) {
  let [x, y, w, h] = m.viewBox.split(' ').map(Number);
  const p = Math.max(w, h) * pad;
  x -= p;
  y -= p;
  w += 2 * p;
  h += 2 * p;
  if (square) {
    const s = Math.max(w, h);
    x -= (s - w) / 2;
    y -= (s - h) / 2;
    w = h = s;
  }
  const bg = cw.bg
    ? `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" fill="${cw.bg}"/>`
    : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r(x)} ${r(y)} ${r(w)} ${r(h)}" role="img" aria-label="Gage Marvel">` +
    `<title>Gage Marvel</title>${bg}<path d="${m.ink}" fill="${cw.ink}"/><path d="${m.accent}" fill="${cw.accent}"/></svg>\n`
  );
}

const brandDir = path.join(root, 'public/brand-assets');
fs.mkdirSync(brandDir, { recursive: true });
for (const [n, set] of Object.entries(marks)) {
  for (const [kind, m] of Object.entries(set)) {
    for (const [name, cw] of Object.entries(colourways)) {
      fs.writeFileSync(
        path.join(brandDir, `gage-marvel-option-${n}-${kind}-${name}.svg`),
        svgFile(m, cw, 0.1, kind === 'mono'),
      );
    }
  }
}

// Favicons from the live option's monogram (Option 1 until the client picks).
const LIVE = Number(process.env.WORDMARK_OPTION ?? 1);
const favMark = marks[LIVE].mono;
const fav = svgFile(favMark, colourways['ivory-on-black'], 0.16, true).replace(
  /<rect ([^>]*)\/>/,
  (_, a) => `<rect ${a} rx="${r(Number(/width="([\d.]+)"/.exec(a)[1]) * 0.18)}"/>`,
);
fs.writeFileSync(path.join(root, 'public/favicon.svg'), fav);
const fullBleed = svgFile(favMark, colourways['ivory-on-black'], 0.2, true);
for (const [file, size] of [
  ['favicon-32.png', 32],
  ['apple-touch-icon.png', 180],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
]) {
  await sharp(Buffer.from(file.startsWith('favicon') ? fav : fullBleed))
    .resize(size, size)
    .png()
    .toFile(path.join(root, 'public', file));
}

console.log('Brand assets written.');

/**
 * "Every record has its own light." A tiny canvas particle system with one
 * preset per cover mood. Each [data-mood] element gets a canvas behind its
 * content. Animation runs only while the element is on screen; with reduced
 * motion a single still frame is drawn, so the mood is there but nothing moves.
 */
type Mood = 'sunset' | 'candle' | 'film' | 'fireflies' | 'fire' | 'neon' | 'pollen';

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
  seed: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

interface Preset {
  density: number; // particles per 100k px²
  spawn(w: number, h: number, initial: boolean): P;
  draw(g: CanvasRenderingContext2D, p: P, t: number): void;
  step?(p: P, t: number, w: number, h: number): void;
  background?(g: CanvasRenderingContext2D, w: number, h: number, t: number): void;
}

const basic = (x: number, y: number, vx: number, vy: number, r: number, max: number): P => ({
  x,
  y,
  vx,
  vy,
  r,
  life: 0,
  max,
  seed: Math.random() * 1000,
});

const fade = (p: P) => {
  const k = p.life / p.max;
  return Math.min(1, k * 4) * Math.min(1, (1 - k) * 3);
};

const presets: Record<Mood, Preset> = {
  // Golden dust drifting through low sun.
  sunset: {
    density: 2.2,
    spawn: (w, h, init) =>
      basic(
        rand(0, w),
        init ? rand(0, h) : h + 10,
        rand(-0.08, 0.08),
        rand(-0.12, -0.35),
        rand(0.6, 2.2),
        rand(600, 1100),
      ),
    step(p, t) {
      p.vx += Math.sin((t + p.seed) * 0.0011) * 0.002;
    },
    draw(g, p) {
      g.globalAlpha = fade(p) * 0.75;
      g.fillStyle = '#f2c46b';
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, 7);
      g.fill();
    },
  },
  // Rising embers off a fire pit.
  fire: {
    density: 3.2,
    spawn: (w, h, init) =>
      basic(
        rand(0, w),
        init ? rand(h * 0.3, h) : h + 6,
        rand(-0.25, 0.25),
        rand(-0.6, -1.6),
        rand(0.8, 2.4),
        rand(180, 420),
      ),
    step(p, t) {
      p.vx += Math.sin((t + p.seed) * 0.006) * 0.02;
      p.r *= 0.998;
    },
    draw(g, p, t) {
      const flick = 0.6 + 0.4 * Math.sin((t + p.seed * 50) * 0.04);
      g.globalAlpha = fade(p) * flick;
      g.fillStyle = p.r > 1.6 ? '#ffb347' : '#ff6a1f';
      g.shadowColor = '#ff7a2a';
      g.shadowBlur = 8;
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, 7);
      g.fill();
      g.shadowBlur = 0;
    },
  },
  // Fireflies wandering at the edge of the woods.
  fireflies: {
    density: 0.9,
    spawn: (w, h) =>
      basic(
        rand(0, w),
        rand(h * 0.15, h),
        rand(-0.3, 0.3),
        rand(-0.3, 0.3),
        rand(1.4, 2.4),
        rand(500, 900),
      ),
    step(p, t) {
      p.vx += Math.cos((t + p.seed) * 0.003) * 0.01;
      p.vy += Math.sin((t + p.seed * 2) * 0.0025) * 0.01;
      p.vx *= 0.98;
      p.vy *= 0.98;
    },
    draw(g, p, t) {
      const pulse = Math.max(0, Math.sin((t + p.seed * 40) * 0.004)) ** 3;
      g.globalAlpha = fade(p) * pulse;
      g.fillStyle = '#e9f27a';
      g.shadowColor = '#d8ec5a';
      g.shadowBlur = 14;
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, 7);
      g.fill();
      g.shadowBlur = 0;
    },
  },
  // Yellow wildflower pollen floating up out of the field.
  pollen: {
    density: 2,
    spawn: (w, h, init) =>
      basic(
        rand(0, w),
        init ? rand(h * 0.2, h) : h + 6,
        rand(-0.15, 0.15),
        rand(-0.15, -0.45),
        rand(1, 2.6),
        rand(500, 900),
      ),
    step(p, t) {
      p.vx += Math.sin((t + p.seed) * 0.002) * 0.006;
    },
    draw(g, p) {
      g.globalAlpha = fade(p) * 0.85;
      g.fillStyle = p.seed % 3 < 1 ? '#f7e15a' : '#e8b830';
      g.beginPath();
      g.ellipse(p.x, p.y, p.r, p.r * 0.7, p.seed, 0, 7);
      g.fill();
    },
  },
  // Black and white film: grain, the odd scratch, a projector flicker.
  film: {
    density: 0,
    spawn: () => basic(0, 0, 0, 0, 0, 1),
    draw() {},
    background(g, w, h, t) {
      const s = 3;
      const cols = Math.ceil(w / s);
      const rows = Math.ceil(h / s);
      for (let i = 0; i < cols * rows * 0.06; i++) {
        const v = Math.random() * 255;
        g.fillStyle = `rgba(${v},${v},${v},0.16)`;
        g.fillRect(((Math.random() * cols) | 0) * s, ((Math.random() * rows) | 0) * s, s, s);
      }
      if (Math.random() < 0.12) {
        g.fillStyle = 'rgba(235,235,235,0.12)';
        g.fillRect(Math.random() * w, 0, 1, h);
      }
      g.fillStyle = `rgba(255,255,255,${0.02 + 0.02 * Math.sin(t * 0.05)})`;
      g.fillRect(0, 0, w, h);
    },
  },
  // Candle and string lights: a warm pool that breathes and flickers.
  candle: {
    density: 0.5,
    spawn: (w, h) => basic(rand(0, w), rand(0, h * 0.6), 0, 0, rand(1, 2.2), rand(400, 900)),
    draw(g, p, t) {
      g.globalAlpha = fade(p) * (0.4 + 0.3 * Math.sin((t + p.seed * 30) * 0.01));
      g.fillStyle = '#ffd38a';
      g.shadowColor = '#ffb85c';
      g.shadowBlur = 10;
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, 7);
      g.fill();
      g.shadowBlur = 0;
    },
    background(g, w, h, t) {
      const f =
        0.22 +
        0.05 * Math.sin(t * 0.09) +
        0.04 * Math.sin(t * 0.23 + 1) +
        0.03 * Math.sin(t * 0.61);
      const grad = g.createRadialGradient(
        w * 0.3,
        h * 0.55,
        0,
        w * 0.3,
        h * 0.55,
        Math.max(w, h) * 0.6,
      );
      grad.addColorStop(0, `rgba(255,170,80,${f})`);
      grad.addColorStop(1, 'rgba(255,140,60,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
    },
  },
  // Neon: the light is handled in CSS on the title; here, faint electric haze.
  neon: {
    density: 0.6,
    spawn: (w, h) =>
      basic(
        rand(0, w),
        rand(0, h),
        rand(-0.05, 0.05),
        rand(-0.05, 0.05),
        rand(0.8, 1.6),
        rand(300, 700),
      ),
    draw(g, p) {
      g.globalAlpha = fade(p) * 0.5;
      g.fillStyle = p.seed % 2 < 1 ? '#4fd6ef' : '#ff5fa8';
      g.beginPath();
      g.arc(p.x, p.y, p.r, 0, 7);
      g.fill();
    },
  },
};

export function initMoods(root: ParentNode = document) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.querySelectorAll<HTMLElement>('[data-mood]').forEach((host) => {
    const mood = host.dataset.mood as Mood;
    const preset = presets[mood];
    const canvas = host.querySelector<HTMLCanvasElement>('canvas[data-mood-canvas]');
    if (!preset || !canvas) return;
    const g = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let ps: P[] = [];
    let raf = 0;
    let t = 0;

    const target = () => Math.round(((w * h) / 100_000) * preset.density);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      ps = Array.from({ length: target() }, () => {
        const p = preset.spawn(w, h, true);
        p.life = Math.random() * p.max;
        return p;
      });
      // Resizing clears the canvas, so redraw the still frame when motion is off.
      if (reduce) frame();
    };
    const frame = () => {
      t++;
      g.globalAlpha = 1;
      g.clearRect(0, 0, w, h);
      preset.background?.(g, w, h, t);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        preset.step?.(p, t, w, h);
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.max || p.y < -20 || p.x < -20 || p.x > w + 20)
          ps[i] = preset.spawn(w, h, false);
        else preset.draw(g, p, t);
      }
      g.globalAlpha = 1;
    };
    const loop = () => {
      frame();
      raf = requestAnimationFrame(loop);
    };

    new ResizeObserver(resize).observe(canvas);
    if (reduce) return;
    new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    }).observe(host);
  });
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { Sky } from "./moon";

/* Static ASCII forest: three depth slices filling the bottom BAND_VH. */

/** how much of the viewport height the forest covers, from the bottom up */
const BAND_VH = 2 / 3;

type LayerSpec = {
  key: string;
  fontSize: number;
  alpha: number;
  /** trees per 100 columns */
  density: number;
  minH: number;
  maxH: number;
  /** peak dot weight for this slice, 0-1 */
  weight: number;
  /** flat screen laid under the trees, so the band reads as one surface */
  air: number;
  /** lowest row a tree may stand on, as a fraction of the slice */
  treeTo: number;
  /** opacity of this slice's firelit copy; 0 skips it */
  warmAlpha: number;
  /** slice extent as fractions of the band; slices overlap so there are no seams */
  from: number;
  to: number;
  /** where the top-edge fade starts, as a % of the slice (100 = no fade) */
  maskTop: number;
  /** share of the clearing this slice respects; 0 grows straight through it */
  clear: number;
  seed: number;
};

/* The far slice spans the whole band and carries the screen; its trees are
   held to the top of it, so what sits low in the frame is the near forest. */
const LAYERS: LayerSpec[] = [
  { key: "far",  fontSize: 8,  alpha: 0.28, density: 13, minH: 10, maxH: 20, weight: 0.80, air: 0.09, treeTo: 0.6, warmAlpha: 0,    from: 0,     to: 1,    maskTop: 34,  clear: 0,    seed: 1337 },
  { key: "mid",  fontSize: 10, alpha: 0.36, density: 6, minH: 18, maxH: 32, weight: 0.95, air: 0,    treeTo: 1,   warmAlpha: 0.34, from: 0.14,  to: 0.7,  maskTop: 80,  clear: 0.55, seed: 90210 },
  { key: "near", fontSize: 13, alpha: 0.46, density: 3.2,  minH: 24, maxH: 42, weight: 1.05, air: 0,    treeTo: 1,   warmAlpha: 0.52, from: -0.08, to: 0.5,  maskTop: 100, clear: 1,    seed: 4242 },
];

/** the near slice draws above the campfire, so its trees pass in front of it */
const FRONT = "near";

/* Night draws pale trees on a dark ground; day inverts that, so the ink gets
   darker and the firelight stops carrying. */
const PALETTE: Record<Sky, { cool: string; warm: string; coolK: number; warmK: number }> = {
  night: { cool: "150, 196, 166", warm: "236, 154, 82", coolK: 1, warmK: 1 },
  day: { cool: "34, 66, 46", warm: "150, 96, 40", coolK: 1.3, warmK: 0.4 },
};
/** how far the firelight carries across the trees, in px */
const FIRE_REACH = 470;
/** the light leaves partway up the flame, not off the log line */
const FIRE_LIFT = 44;
/** how much ground the fire gets to itself at the near edge, in px */
const CLEARING_PX = 104;

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "DejaVu Sans Mono", monospace';
const LINE_RATIO = 0.66;

/** Tree size is in px — without this a near tree covers ~70% of a phone's width. */
function forestScale(vw: number): number {
  if (vw < 640) return 0.55;
  if (vw < 1024) return 0.78;
  return 1;
}

/* deterministic PRNG so a given viewport always grows the same forest */
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Menlo, Consolas and DejaVu differ; guessing 0.6em warps the trees. */
function measureCharWidth(fontSize: number): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return fontSize * 0.6;
  ctx.font = `${fontSize}px ${MONO}`;
  return ctx.measureText("M".repeat(50)).width / 50 || fontSize * 0.6;
}

/* Ordered dither: a 4x4 Bayer screen. A fixed threshold lattice is what makes
   the canopies read as a printed halftone rather than as noise — the same
   value dithers to the same pattern everywhere, so the grain stays regular. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

/** dot weights, lightest first; index 0 is empty */
const DOTS = [" ", "\u00b7", ":"];

/* Per-cell hash. A light hand only: the dither already carries the grain,
   and this just keeps the canopy from reading as a solid poured shape. */
function clump(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed) * 43758.5453;
  return n - Math.floor(n);
}

/** a gap kept clear of trunks, in this layer's grid columns */
type Clearing = { cx: number; half: number };

/* Lays a fir into the mass field. There is no silhouette to draw: the shape
   is entirely weight, and the dither turns weight into dots further down. */
function growTree(
  mass: Float32Array,
  cols: number,
  rows: number,
  cx: number,
  baseY: number,
  h: number,
  rand: () => number,
  floor: number
) {
  // max() for litter, which should settle around whatever is already there
  const put = (y: number, x: number, m: number) => {
    if (y < 0 || y >= rows || x < 0 || x >= cols) return;
    const i = y * cols + x;
    if (m > mass[i]) mass[i] = m;
  };
  // ...but the crown overwrites. Trees are laid back to front, so a nearer one
  // has to cut its edge into the one behind or they merge into a single slab.
  const set = (y: number, x: number, m: number) => {
    if (y < 0 || y >= rows || x < 0 || x >= cols) return;
    mass[y * cols + x] = m;
  };

  const trunkH = Math.max(1, Math.round(h * 0.16));
  const crownH = Math.max(3, h - trunkH);
  const crownBase = baseY - trunkH;
  // more tiers on a taller tree, so the boughs stay a consistent size
  const tiers = Math.max(2, Math.round(h / 5));
  const maxHalf = h * 0.52 * (0.86 + rand() * 0.28);
  const lean = (rand() - 0.5) * 0.3;
  const seed = rand() * 1000;

  for (let t = 0; t < trunkH; t++) {
    put(baseY - t, cx, 0.95);
    if (h >= 15) put(baseY - t, cx + 1, 0.78);
  }

  for (let y = crownBase; y > crownBase - crownH; y--) {
    const v = (crownBase - y) / crownH; // 0 at the lowest boughs, 1 at the tip
    // Sawtooth, not a sine: each tier is its own small cone, widest where its
    // branches spring and narrowing upward until the next tier starts over.
    const inTier = (v * tiers) % 1;
    const half = maxHalf * Math.pow(1 - v, 0.85) * (1 - 0.44 * inTier);
    const axis = cx + lean * v * maxHalf;

    // clear back to the screen first, so the silhouette reads against whatever
    // stands behind it rather than blending into it
    for (let x = Math.round(axis - half - 1.6); x <= Math.round(axis + half + 1.6); x++) {
      set(y, x, floor);
    }

    if (half < 0.6) {
      set(y, Math.round(axis), 0.85);
      continue;
    }

    // the branch line packs tighter than the needles carried above it
    const bough = Math.max(0, 1 - inTier * 2.6);

    for (let x = Math.round(axis - half); x <= Math.round(axis + half); x++) {
      const u = (x - axis) / half;
      if (Math.abs(u) > 1) continue;
      const m = (0.88 - 0.34 * u * u) * (1 + 0.14 * bough);
      set(y, x, Math.min(1, m * (0.9 + 0.1 * clump(x, y, seed))));
    }
  }

  // litter at the foot, so the trunk meets the ground rather than stopping on it
  const spread = Math.max(2, Math.round(h * 0.55));
  for (let k = 0; k < spread; k++) {
    put(
      baseY + (rand() < 0.65 ? 0 : 1),
      Math.round(cx + (rand() * 2 - 1) * spread),
      0.2 + rand() * 0.28
    );
  }
}

function growLayer(
  cols: number,
  rows: number,
  spec: LayerSpec,
  clearing: Clearing | null
): string {
  const rand = mulberry32(spec.seed + cols * 31 + rows * 17);
  const mass = new Float32Array(cols * rows);

  // the flat screen the trees are printed onto
  if (spec.air > 0) mass.fill(spec.air);

  const count = Math.max(4, Math.round((cols / 100) * spec.density));
  const lowest = Math.max(1, Math.round((rows - 1) * spec.treeTo));

  const trees: { cx: number; baseY: number; h: number }[] = [];
  // resampled rather than filtered, so carving the clearing doesn't thin the rest
  for (let tries = 0; trees.length < count && tries < count * 12; tries++) {
    const h = spec.minH + Math.floor(rand() * (spec.maxH - spec.minH + 1));
    // scattered baselines, not one ground line — the receding floor fills the band
    const baseY = Math.min(lowest, h + Math.floor(rand() * Math.max(1, lowest - h)));
    const cx = Math.floor(rand() * cols);

    // The clearing narrows with distance, so it reads as an opening in the
    // trees rather than a corridor cut straight through them.
    if (clearing) {
      const nearness = baseY / Math.max(1, rows - 1);
      // canopies may lean in; it's trunks standing in the fire that read wrong
      const keep = clearing.half * (0.35 + 0.65 * nearness) + h * 0.28;
      if (Math.abs(cx - clearing.cx) < keep) continue;
    }

    trees.push({ cx, baseY, h });
  }

  // trees lower in the frame are nearer, so they lay down last and occlude
  trees.sort((a, b) => a.baseY - b.baseY || b.h - a.h);
  for (const t of trees) growTree(mass, cols, rows, t.cx, t.baseY, t.h, rand, spec.air);

  const top = DOTS.length - 1;
  const lines: string[] = [];
  for (let y = 0; y < rows; y++) {
    const screen = BAYER[y & 3];
    let line = "";
    for (let x = 0; x < cols; x++) {
      const v = Math.min(top, mass[y * cols + x] * spec.weight * top);
      const lo = Math.floor(v);
      line += DOTS[v - lo > screen[x & 3] ? Math.min(top, lo + 1) : lo];
    }
    lines.push(line.replace(/\s+$/, ""));
  }
  return lines.join("\n");
}


/* Fireflies drifting over the band, each blinking on its own period. */

/** sin^n envelope for the blink: lower = longer flare (width ~ 1/sqrt(n)) */
const FLASH_SHARPNESS = 3.5;

const FLY_MIN = 9;
const FLY_MAX = 18;

type Fly = {
  x0: number;
  y0: number;
  ax: number;
  ay: number;
  wx: number;
  wy: number;
  wx2: number;
  phx: number;
  phy: number;
  phx2: number;
  period: number;
  phase: number;
  size: number;
};

function makeFlies(vw: number, vh: number, band: number): Fly[] {
  const rand = mulberry32(Math.floor(Math.random() * 1e9));
  const min = vw < 640 ? 6 : FLY_MIN;
  const count = Math.max(min, Math.min(FLY_MAX, Math.round(vw / 110)));
  const bandTop = vh - band;

  return Array.from({ length: count }, () => ({
    x0: rand() * vw,
    y0: bandTop + band * (0.12 + rand() * 0.76),
    ax: 30 + rand() * 70,
    ay: 14 + rand() * 34,
    wx: 0.07 + rand() * 0.1,
    wy: 0.11 + rand() * 0.14,
    wx2: 0.29 + rand() * 0.23,
    phx: rand() * Math.PI * 2,
    phy: rand() * Math.PI * 2,
    phx2: rand() * Math.PI * 2,
    period: 3.4 + rand() * 3.2,
    phase: rand(),
    size: 9 + Math.round(rand() * 5),
  }));
}

function Fireflies({ band }: { band: number }) {
  const [flies, setFlies] = useState<Fly[]>([]);
  const els = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!band) return;
    setFlies(makeFlies(window.innerWidth, window.innerHeight, band));
  }, [band]);

  useEffect(() => {
    if (!flies.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      for (let i = 0; i < flies.length; i++) {
        const el = els.current[i];
        if (!el) continue;
        const f = flies[i];
        const x = f.x0 + f.ax * Math.sin(f.wx * t + f.phx) + f.ax * 0.35 * Math.sin(f.wx2 * t + f.phx2);
        const y = f.y0 + f.ay * Math.sin(f.wy * t + f.phy);
        const flash = Math.pow(Math.max(0, Math.sin(Math.PI * 2 * (t / f.period + f.phase))), FLASH_SHARPNESS);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        el.style.opacity = String(0.04 + 0.96 * flash);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    // don't burn frames on a tab nobody is looking at
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [flies]);

  return (
    <>
      {flies.map((f, i) => (
        <span
          key={i}
          className="firefly"
          ref={(el) => {
            els.current[i] = el;
          }}
          style={{
            fontSize: f.size,
            opacity: 0.3,
            transform: `translate3d(${f.x0}px, ${f.y0}px, 0)`,
          }}
        >
          &middot;
        </span>
      ))}
    </>
  );
}

type Built = { spec: LayerSpec; art: string; bottom: number; fontSize: number; lineH: number };
type Fire = { x: number; y: number };

function Slice({ b, sky, warm }: { b: Built; sky: Sky; warm?: boolean }) {
  const { spec, art, bottom, fontSize, lineH } = b;
  const p = PALETTE[sky];
  const alpha = warm ? spec.warmAlpha * p.warmK : spec.alpha * p.coolK;
  return (
    <pre
      className="forest-art"
      style={{
        bottom,
        fontSize,
        lineHeight: `${lineH}px`,
        color: `rgba(${warm ? p.warm : p.cool}, ${alpha})`,
        ...(spec.maskTop < 100
          ? {
              WebkitMaskImage: `linear-gradient(to top, #000 0%, #000 ${spec.maskTop}%, transparent 100%)`,
              maskImage: `linear-gradient(to top, #000 0%, #000 ${spec.maskTop}%, transparent 100%)`,
            }
          : null),
      }}
    >
      {art}
    </pre>
  );
}

/** Wrapping rather than compositing masks: the slice keeps its own top fade. */
function Firelight({ fire, slices, sky }: { fire: Fire | null; slices: Built[]; sky: Sky }) {
  const lit = slices.filter((b) => b.spec.warmAlpha > 0);
  if (!fire || !lit.length) return null;

  const mask = `radial-gradient(circle ${FIRE_REACH}px at ${fire.x}px ${fire.y}px, #000 0%, rgba(0,0,0,0.5) 46%, transparent 78%)`;
  return (
    <div className="firelight" style={{ WebkitMaskImage: mask, maskImage: mask }}>
      {lit.map((b) => (
        <Slice key={b.spec.key} b={b} sky={sky} warm />
      ))}
    </div>
  );
}

export default function AsciiForest({ sky }: { sky: Sky }) {
  const [layers, setLayers] = useState<Built[]>([]);
  const [band, setBand] = useState(0);
  const [fire, setFire] = useState<Fire | null>(null);
  const anchor = useRef<HTMLElement>(null);

  useEffect(() => {
    const build = () => {
      const vw = window.innerWidth;
      const band = window.innerHeight * BAND_VH;
      const scale = forestScale(vw);
      setBand(band);

      // the fire's own CSS decides where it stands; read it back rather than
      // keeping a second copy of those breakpoints here
      const at = anchor.current?.getBoundingClientRect();
      setFire(at ? { x: at.left, y: at.top - FIRE_LIFT } : null);

      setLayers(
        LAYERS.map((spec) => {
          const fontSize = Math.max(6, Math.round(spec.fontSize * scale));
          const charW = measureCharWidth(fontSize);
          const lineH = fontSize * LINE_RATIO;
          const cols = Math.ceil(vw / charW) + 2;
          const bottom = Math.round(band * spec.from);
          const rows = Math.max(spec.maxH + 2, Math.ceil((band * (spec.to - spec.from)) / lineH));
          const clearing =
            at && spec.clear > 0
              ? { cx: at.left / charW, half: (CLEARING_PX * scale * spec.clear) / charW }
              : null;
          return { spec, art: growLayer(cols, rows, spec, clearing), bottom, fontSize, lineH };
        })
      );
    };

    build();

    let timer: ReturnType<typeof setTimeout>;
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const onResize = () => {
      // ignore the height-only resize mobile chrome fires on scroll
      const dw = Math.abs(window.innerWidth - lastW);
      const dh = Math.abs(window.innerHeight - lastH);
      if (dw < 40 && dh < 130) return;
      lastW = window.innerWidth;
      lastH = window.innerHeight;
      clearTimeout(timer);
      timer = setTimeout(build, 180);
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  const back = layers.filter((b) => b.spec.key !== FRONT);
  const front = layers.filter((b) => b.spec.key === FRONT);

  return (
    <>
      <div className="forest" aria-hidden="true">
        <i className="fire-anchor" ref={anchor} />
        {back.map((b) => (
          <Slice key={b.spec.key} b={b} sky={sky} />
        ))}
        <Firelight fire={fire} slices={back} sky={sky} />
        {/* nothing blinks at noon */}
        {sky === "night" && <Fireflies band={band} />}
      </div>

      <div className="forest forest-front" aria-hidden="true">
        {front.map((b) => (
          <Slice key={b.spec.key} b={b} sky={sky} />
        ))}
        <Firelight fire={fire} slices={front} sky={sky} />
      </div>
    </>
  );
}

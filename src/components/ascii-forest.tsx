"use client";

import { useEffect, useRef, useState } from "react";

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
  /** chance an interior cell gets stippled */
  stipple: number;
  /** slice extent as fractions of the band; slices overlap so there are no seams */
  from: number;
  to: number;
  /** where the top-edge fade starts, as a % of the slice (100 = no fade) */
  maskTop: number;
  seed: number;
};

const LAYERS: LayerSpec[] = [
  { key: "far",  fontSize: 10, alpha: 0.16, density: 24, minH: 5,  maxH: 11, stipple: 0,    from: 0.4,   to: 1,    maskTop: 34,  seed: 1337 },
  { key: "mid",  fontSize: 14, alpha: 0.24, density: 16, minH: 9,  maxH: 17, stipple: 0.12, from: 0.14,  to: 0.7,  maskTop: 80,  seed: 90210 },
  { key: "near", fontSize: 19, alpha: 0.34, density: 9,  minH: 14, maxH: 24, stipple: 0.2,  from: -0.08, to: 0.5,  maskTop: 100, seed: 4242 },
];

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

function drawTree(
  grid: string[][],
  cols: number,
  rows: number,
  cx: number,
  baseY: number,
  h: number,
  stipple: number,
  rand: () => number
) {
  const put = (y: number, x: number, ch: string) => {
    if (y < 0 || y >= rows || x < 0 || x >= cols) return;
    grid[y][x] = ch;
  };

  const trunkH = Math.max(1, Math.round(h * 0.15));
  const crownH = Math.max(3, h - trunkH);
  const tiers = h >= 18 ? 3 : h >= 11 ? 2 : 1;
  const maxHalf = Math.max(1, Math.round(h * 0.5));

  // Tiers, tallest at the bottom. The underscore base closing each one is
  // what makes the silhouette read as a fir rather than loose diagonals.
  const tierRows: number[] = [];
  const base = Math.floor(crownH / tiers);
  for (let t = 0; t < tiers; t++) tierRows.push(base);
  for (let t = 0; t < crownH - base * tiers; t++) tierRows[tiers - 1 - t] += 1;

  let y = baseY - trunkH - crownH + 1;
  for (let t = 0; t < tiers; t++) {
    const rowsInTier = tierRows[t];
    const endHalf = Math.round((maxHalf * (t + 1)) / tiers);
    const startHalf = t === 0 ? 0 : Math.round(((maxHalf * t) / tiers) * 0.45);

    for (let j = 0; j < rowsInTier; j++, y++) {
      const half =
        rowsInTier === 1
          ? endHalf
          : Math.round(startHalf + (endHalf - startHalf) * (j / (rowsInTier - 1)));
      const isTierBase = j === rowsInTier - 1;

      if (half <= 0) {
        put(y, cx, "^");
        continue;
      }
      put(y, cx - half, "/");
      put(y, cx + half, "\\");
      for (let x = cx - half + 1; x < cx + half; x++) {
        if (isTierBase) put(y, x, "_");
        else if (stipple > 0 && rand() < stipple) put(y, x, rand() < 0.5 ? "." : ":");
      }
    }
  }

  const thick = h >= 14;
  for (let t = 0; t < trunkH; t++) {
    put(baseY - t, cx, "|");
    if (thick) put(baseY - t, cx + 1, "|");
  }
}

function growLayer(cols: number, rows: number, spec: LayerSpec): string {
  const rand = mulberry32(spec.seed + cols * 31 + rows * 17);
  const grid: string[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => " ")
  );

  const count = Math.max(4, Math.round((cols / 100) * spec.density));
  const trees = Array.from({ length: count }, () => {
    const h = spec.minH + Math.floor(rand() * (spec.maxH - spec.minH + 1));
    // scattered baselines, not one ground line — the receding floor fills the band
    const baseY = Math.min(rows - 1, h + Math.floor(rand() * Math.max(1, rows - h)));
    return { cx: Math.floor(rand() * cols), baseY, h };
  });

  // trees lower in the frame are nearer, so they draw last and occlude
  trees.sort((a, b) => a.baseY - b.baseY || b.h - a.h);

  for (const t of trees) {
    drawTree(grid, cols, rows, t.cx, t.baseY, t.h, spec.stipple, rand);

    // a little undergrowth at the foot of each tree
    const spread = Math.max(2, Math.round(t.h * 0.55));
    for (let k = 0; k < 5; k++) {
      const x = t.cx + Math.round((rand() * 2 - 1) * spread);
      const y = t.baseY + (rand() < 0.5 ? 0 : 1);
      if (y >= 0 && y < rows && x >= 0 && x < cols && grid[y][x] === " ") {
        grid[y][x] = [".", ",", "'", '"'][Math.floor(rand() * 4)];
      }
    }
  }

  // thin the soft fill only — a broken / \ _ | silhouette reads as noise
  const soft = new Set([".", ":", ",", "'", '"']);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (soft.has(grid[y][x]) && rand() < 0.3) grid[y][x] = " ";
    }
  }

  return grid.map((r) => r.join("").replace(/\s+$/, "")).join("\n");
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

export default function AsciiForest() {
  const [layers, setLayers] = useState<Built[]>([]);
  const [band, setBand] = useState(0);

  useEffect(() => {
    const build = () => {
      const vw = window.innerWidth;
      const band = window.innerHeight * BAND_VH;
      const scale = forestScale(vw);
      setBand(band);

      setLayers(
        LAYERS.map((spec) => {
          const fontSize = Math.max(6, Math.round(spec.fontSize * scale));
          const charW = measureCharWidth(fontSize);
          const lineH = fontSize * LINE_RATIO;
          const cols = Math.ceil(vw / charW) + 2;
          const bottom = Math.round(band * spec.from);
          const rows = Math.max(spec.maxH + 2, Math.ceil((band * (spec.to - spec.from)) / lineH));
          return { spec, art: growLayer(cols, rows, spec), bottom, fontSize, lineH };
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

  return (
    <div className="forest" aria-hidden="true">
      {layers.map(({ spec, art, bottom, fontSize, lineH }) => (
        <pre
          key={spec.key}
          className="forest-art"
          style={{
            bottom,
            fontSize,
            lineHeight: `${lineH}px`,
            color: `rgba(150, 196, 166, ${spec.alpha})`,
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
      ))}
      <Fireflies band={band} />
    </div>
  );
}

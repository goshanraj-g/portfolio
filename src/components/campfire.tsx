"use client";

import { useEffect, useRef } from "react";
import type { Sky } from "./moon";

/* Animated ASCII flames and rising smoke. */

const FLAME_ROWS = 9;
const FLAME_HALF = 6;
/** Flame redraws per second. */
const FLAME_FPS = 11;

/** Seconds to extinguish and relight the fire. */
const DIE_S = 1.6;
const LIGHT_S = 0.9;
/** Seconds for extinguishing smoke to build and clear. */
const BILLOW_S = 0.5;
const CLEAR_S = 3.4;

const PUFFS = 32;
/** Puff rise distance in pixels. */
const RISE = 460;
/** Puff drift over its lifetime. */
const DRIFT = 92;

// Wispy at the tips and dense at the base.
const FLAME_PALETTE: string[][] = [
  [" ", ".", "'", " ", " "],
  [" ", ".", "'", "^", " "],
  [".", "'", "^", " ", "'"],
  ["'", "^", "(", " ", "'"],
  ["^", "(", ")", "*", "'"],
  ["(", ")", "*", "^", "("],
  ["(", ")", "*", "%", "("],
  ["(", ")", "%", "#", "("],
  ["(", ")", "%", "#", ")"],
];

// Hottest at the base, red at the tips. Index 0 is the top of the flame.
const FLAME_COLORS = [
  "rgba(198, 72, 34, 0.72)",
  "rgba(222, 92, 38, 0.80)",
  "rgba(240, 118, 46, 0.86)",
  "rgba(250, 148, 56, 0.90)",
  "rgba(255, 176, 72, 0.93)",
  "rgba(255, 202, 100, 0.95)",
  "rgba(255, 224, 140, 0.96)",
  "rgba(255, 240, 180, 0.96)",
  "rgba(255, 250, 214, 0.95)",
];

const LOGS = ["    \\\\|//    ", " __/_____\\__ "];
const STONES = ".oOo(___)oOo.";

const GROUND_COLS = 34;

const SMOKE_CHARS = [".", ":", "o", "~", "'"];

/* Deterministic first frame avoids a hydration mismatch. */
function seeded(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GROUND = (() => {
  const rand = seeded(77);
  const glyphs = [".", ",", "'", '"'];
  return [0, 1]
    .map((row) =>
      Array.from({ length: GROUND_COLS }, (_, i) => {
        const near = 1 - Math.abs(i - GROUND_COLS / 2) / (GROUND_COLS / 2);
        const chance = (row === 0 ? 0.16 : 0.08) + near * 0.38;
        return rand() < chance ? glyphs[Math.floor(rand() * 4)] : " ";
      }).join("")
    )
    .join("\n");
})();

function flameRow(row: number, rand: () => number): string {
  const t = (row + 1) / FLAME_ROWS;
  const half = Math.max(1, Math.round(FLAME_HALF * t));
  const palette = FLAME_PALETTE[row];
  const cells: string[] = [];

  for (let x = -FLAME_HALF; x <= FLAME_HALF; x++) {
    const edge = Math.abs(x) > half - (rand() < 0.4 ? 0 : 1);
    if (Math.abs(x) > half || (edge && rand() < 0.45)) {
      cells.push(" ");
      continue;
    }
    cells.push(rand() < 0.14 ? " " : palette[Math.floor(rand() * palette.length)]);
  }
  return cells.join("");
}

type Puff = {
  born: number;
  life: number;
  x0: number;
  drift: number;
  wobble: number;
  phase: number;
  size: number;
};

function newPuff(now: number, rand: () => number, stagger = 0): Puff {
  return {
    born: now - stagger,
    life: 5 + rand() * 3.6,
    x0: (rand() - 0.5) * 16,
    drift: DRIFT * (0.55 + rand() * 0.9),
    wobble: 10 + rand() * 16,
    phase: rand() * Math.PI * 2,
    size: 12 + rand() * 7,
  };
}

export default function Campfire({ sky }: { sky: Sky }) {
  const flameEls = useRef<(HTMLSpanElement | null)[]>([]);
  const puffEls = useRef<(HTMLSpanElement | null)[]>([]);
  const glowEl = useRef<HTMLDivElement>(null);

  // Refs preserve animation state when the sky changes.
  const skyRef = useRef(sky);
  const wake = useRef(() => {});

  useEffect(() => {
    skyRef.current = sky;
    if (sky === "night") wake.current();
  }, [sky]);

  const initialFlame = useRef(
    Array.from({ length: FLAME_ROWS }, (_, r) => flameRow(r, seeded(9001 + r)))
  ).current;

  /* Set the final state directly when animation is disabled. */
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const out = sky === "day";
    for (let r = 0; r < FLAME_ROWS; r++) {
      const el = flameEls.current[r];
      if (el) el.textContent = out ? "\n" : flameRow(r, seeded(9001 + r)) + "\n";
    }
    if (glowEl.current) glowEl.current.style.opacity = out ? "0" : "0.86";
  }, [sky]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const rand = Math.random;
    const start = performance.now();
    const puffs: Puff[] = Array.from({ length: PUFFS }, (_, i) =>
      // Fill the smoke column on the first frame.
      newPuff(0, rand, (i / PUFFS) * 7)
    );

    let raf = 0;
    let lastFlame = 0;
    let lastNow = 0;
    /** 1 is burning; 0 is out. */
    let burn = skyRef.current === "night" ? 1 : 0;
    /** Extra smoke while the fire goes out. */
    let billow = 0;

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0;
      lastNow = now;

      const target = skyRef.current === "night" ? 1 : 0;
      if (burn < target) burn = Math.min(target, burn + dt / LIGHT_S);
      else if (burn > target) burn = Math.max(target, burn - dt / DIE_S);

      // Smoke builds as the fire dies and clears faster when relit.
      if (target === 0 && burn > 0) billow = Math.min(1, billow + dt / BILLOW_S);
      else if (target === 0) billow = Math.max(0, billow - dt / CLEAR_S);
      else billow = Math.max(0, billow - dt / 0.7);

      if (now - lastFlame > 1000 / FLAME_FPS) {
        lastFlame = now;
        // Remove rows from the top so the last rows read as embers.
        const alive = Math.ceil(FLAME_ROWS * burn);
        for (let r = 0; r < FLAME_ROWS; r++) {
          const el = flameEls.current[r];
          if (el) el.textContent = r >= FLAME_ROWS - alive ? flameRow(r, rand) + "\n" : "\n";
        }
        if (glowEl.current) {
          glowEl.current.style.opacity = String((0.72 + rand() * 0.28) * burn);
        }
      }

      let smoking = false;

      for (let i = 0; i < puffs.length; i++) {
        const el = puffEls.current[i];
        if (!el) continue;
        let p = puffs[i];
        let age = (t - p.born) / p.life;
        if (age >= 1) {
          // Existing smoke finishes rising after the fire goes out.
          if (burn <= 0.02 && billow <= 0.04) {
            el.style.opacity = "0";
            continue;
          }
          p = puffs[i] = newPuff(t, rand);
          age = 0;
        }
        smoking = true;

        const x = p.x0 + p.drift * age * age + p.wobble * Math.sin(p.phase + age * 5.5);
        const y = -RISE * age;
        const alpha = Math.min(1, Math.sin(Math.PI * Math.pow(age, 0.7)) * 0.62 * (1 + 1.5 * billow));

        // Smoke cools from firelit orange to grey as it rises.
        const warm = Math.min(1, age * 2.2 + (1 - burn));
        const r = Math.round(238 + (194 - 238) * warm);
        const b = Math.round(174 + (202 - 174) * warm);

        el.textContent = SMOKE_CHARS[Math.min(SMOKE_CHARS.length - 1, Math.floor(age * 5))];
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 + age * (1.9 + 1.3 * billow)})`;
        el.style.color = `rgb(${r}, 206, ${b})`;
        el.style.opacity = String(alpha);
      }

      // Pause the loop until the fire is relit.
      if (burn === 0 && burn === target && billow === 0 && !smoking) {
        raf = 0;
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    wake.current = () => {
      if (raf) return;
      lastNow = 0;
      lastFlame = 0;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        lastFlame = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="campfire" aria-hidden="true">
      <div className="campfire-light" ref={glowEl}>
        <div className="campfire-pool" />
        <div className="campfire-glow" />
      </div>

      <div className="smoke">
        {Array.from({ length: PUFFS }, (_, i) => (
          <span
            key={i}
            className="puff"
            ref={(el) => {
              puffEls.current[i] = el;
            }}
            style={{ fontSize: 10, opacity: 0 }}
          />
        ))}
      </div>

      <pre className="flame">
        {initialFlame.map((row, i) => (
          <span
            key={i}
            style={{ color: FLAME_COLORS[i] }}
            ref={(el) => {
              flameEls.current[i] = el;
            }}
          >
            {row + "\n"}
          </span>
        ))}
        <span className="logs">{LOGS.join("\n") + "\n"}</span>
        <span className="stones">{STONES}</span>
      </pre>

      <pre className="ground">{GROUND}</pre>
    </div>
  );
}

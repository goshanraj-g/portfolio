"use client";

import { useEffect, useRef } from "react";

/* Campfire: a flame grid redrawn a few times a second, plus rising smoke. */

const FLAME_ROWS = 9;
const FLAME_HALF = 6;
/** flame redraws per second */
const FLAME_FPS = 11;

const PUFFS = 32;
/** how far a puff climbs before it's spent, in px */
const RISE = 460;
/** sideways travel over a puff's life — the prevailing wind */
const DRIFT = 92;

// tips are wispy, the base is dense
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

const SMOKE_CHARS = [".", ":", "o", "~", "'"];

/* First painted frame only, so SSR and hydration agree. */
function seeded(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

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

export default function Campfire() {
  const flameEls = useRef<(HTMLSpanElement | null)[]>([]);
  const puffEls = useRef<(HTMLSpanElement | null)[]>([]);
  const glowEl = useRef<HTMLDivElement>(null);

  const initialFlame = useRef(
    Array.from({ length: FLAME_ROWS }, (_, r) => flameRow(r, seeded(9001 + r)))
  ).current;

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const rand = Math.random;
    const start = performance.now();
    const puffs: Puff[] = Array.from({ length: PUFFS }, (_, i) =>
      // stagger births so the column is already full on first paint
      newPuff(0, rand, (i / PUFFS) * 7)
    );

    let raf = 0;
    let lastFlame = 0;

    const tick = (now: number) => {
      const t = (now - start) / 1000;

      if (now - lastFlame > 1000 / FLAME_FPS) {
        lastFlame = now;
        for (let r = 0; r < FLAME_ROWS; r++) {
          const el = flameEls.current[r];
          if (el) el.textContent = flameRow(r, rand) + "\n";
        }
        if (glowEl.current) {
          glowEl.current.style.opacity = String(0.72 + rand() * 0.28);
        }
      }

      for (let i = 0; i < puffs.length; i++) {
        const el = puffEls.current[i];
        if (!el) continue;
        let p = puffs[i];
        let age = (t - p.born) / p.life;
        if (age >= 1) {
          p = puffs[i] = newPuff(t, rand);
          age = 0;
        }

        const x = p.x0 + p.drift * age * age + p.wobble * Math.sin(p.phase + age * 5.5);
        const y = -RISE * age;
          const alpha = Math.sin(Math.PI * Math.pow(age, 0.7)) * 0.62;

        // young smoke catches firelight, then cools
        const warm = Math.min(1, age * 2.2);
        const r = Math.round(238 + (194 - 238) * warm);
        const b = Math.round(174 + (202 - 174) * warm);

        el.textContent = SMOKE_CHARS[Math.min(SMOKE_CHARS.length - 1, Math.floor(age * 5))];
        el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${1 + age * 1.9})`;
        el.style.color = `rgb(${r}, 206, ${b})`;
        el.style.opacity = String(alpha);
      }

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
      <div className="campfire-glow" ref={glowEl} />

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
        <span className="logs">{LOGS.join("\n")}</span>
      </pre>
    </div>
  );
}

/* Deterministic ASCII crescent and sun used as the sky toggle. */

/** Disc radius in character rows. */
const RADIUS = 7;
/** Monospace cell aspect ratio: width / line height. */
const CELL_ASPECT = 0.6 / 0.66;

/** Lit disc fraction; lower values create a thinner crescent. */
const PHASE = 0.22;
/** Terminator ellipse: +1 is new; -1 is full. */
const TERMINATOR = 1 - 2 * PHASE;
/** Terminator feathering in disc radii. */
const TERMINATOR_SOFTNESS = 0.2;

const RAMP = [".", ":", "-", "=", "+", "*", "#", "%", "@"];

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawMoon(): string {
  const rand = mulberry32(20260904);
  const colsHalf = Math.ceil(RADIUS / CELL_ASPECT);

  const craters = Array.from({ length: 6 }, () => {
    const ang = rand() * Math.PI * 2;
    const d = rand() * 0.66 * RADIUS;
    return {
      x: Math.cos(ang) * d,
      y: Math.sin(ang) * d,
      r: RADIUS * (0.11 + rand() * 0.19),
      depth: 0.16 + rand() * 0.16,
    };
  });

  const lines: string[] = [];
  for (let dy = -RADIUS; dy <= RADIUS; dy++) {
    let line = "";
    for (let dx = -colsHalf; dx <= colsHalf; dx++) {
      // Convert column offsets to row units for a round screen shape.
      const nx = dx * CELL_ASPECT;
      const dist = Math.sqrt(nx * nx + dy * dy) / RADIUS;

      // Slight overscan prevents pointed poles.
      if (dist > 1.04) {
        line += " ";
        continue;
      }

      // Limb darkening and upper-right light make the disc spherical.
      let b = 1 - 0.34 * Math.min(1, dist) ** 2;
      b += 0.1 * ((nx - dy) / RADIUS);

      for (const c of craters) {
        const cd = Math.sqrt((nx - c.x) ** 2 + (dy - c.y) ** 2);
        if (cd < c.r) b -= c.depth * (1 - cd / c.r);
      }

      // Place the elliptical terminator along each row's half-chord.
      const halfChord = Math.sqrt(Math.max(0, 1 - (dy / RADIUS) ** 2));
      const t = (nx / RADIUS - TERMINATOR * halfChord) / TERMINATOR_SOFTNESS;
      const lit = Math.max(0, Math.min(1, t * 0.5 + 0.5));

      // Omit the unlit side.
      if (lit <= 0.02) {
        line += " ";
        continue;
      }

      b *= lit;
      b += (rand() - 0.5) * 0.05;

      if (b <= 0.05) {
        line += " ";
        continue;
      }

      const i = Math.max(0, Math.min(RAMP.length - 1, Math.round(b * (RAMP.length - 1))));
      line += RAMP[i];
    }
    lines.push(line.replace(/\s+$/, ""));
  }
  return lines.join("\n");
}

/** Supersamples per axis for cell coverage. */
const SUN_SS = 6;

/* Supersampled cell coverage softens the sun's otherwise stair-stepped edge. */
function drawSun(): string {
  const colsHalf = Math.ceil(RADIUS / CELL_ASPECT);

  const lines: string[] = [];
  for (let dy = -RADIUS; dy <= RADIUS; dy++) {
    let line = "";
    for (let dx = -colsHalf; dx <= colsHalf; dx++) {
      let inside = 0;
      let distSum = 0;
      for (let sy = 0; sy < SUN_SS; sy++) {
        for (let sx = 0; sx < SUN_SS; sx++) {
          // Convert column offsets to row units.
          const nx = (dx + (sx + 0.5) / SUN_SS - 0.5) * CELL_ASPECT;
          const ny = dy + (sy + 0.5) / SUN_SS - 0.5;
          const d = Math.sqrt(nx * nx + ny * ny) / RADIUS;
          if (d <= 1) {
            inside++;
            distSum += d;
          }
        }
      }

      if (inside === 0) {
        line += " ";
        continue;
      }

      const cover = inside / (SUN_SS * SUN_SS);
      // Average only covered samples so partial edge cells stay dim.
      const dist = distSum / inside;

      const b = (1 - 0.34 * dist ** 4) * cover;

      const i = Math.max(0, Math.min(RAMP.length - 1, Math.round(b * (RAMP.length - 1))));
      line += RAMP[i];
    }
    lines.push(line.replace(/\s+$/, ""));
  }
  return lines.join("\n");
}

export type Sky = "night" | "day";

const MOON = drawMoon();
const SUN = drawSun();

export default function Moon({ sky, onToggle }: { sky: Sky; onToggle: () => void }) {
  const day = sky === "day";
  return (
    <button
      type="button"
      className="moon"
      onClick={onToggle}
      aria-pressed={day}
      aria-label={day ? "Switch to night" : "Switch to day"}
      title={day ? "Night" : "Day"}
    >
      <span className="moon-halo" aria-hidden="true" />
      <pre className="moon-disc" aria-hidden="true">
        {day ? SUN : MOON}
      </pre>
    </button>
  );
}

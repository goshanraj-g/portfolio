/* ASCII moon. Drawn light-on-dark, so denser glyphs read as brighter.
   Deterministic, so it renders server-side and never moves. */

/** disc radius, in character rows */
const RADIUS = 7;
/** monospace cell aspect (advance width / line height) */
const CELL_ASPECT = 0.6 / 0.66;

/** lit fraction of the disc: 0.5 is a half moon, lower is a thinner crescent */
const PHASE = 0.22;
/** the terminator ellipse, from the lit fraction. +1 is new, -1 is full */
const TERMINATOR = 1 - 2 * PHASE;
/** how far the terminator feathers, in disc radii */
const TERMINATOR_SOFTNESS = 0.2;
/** earthshine: how densely the unlit limb is dotted in */
const EARTHSHINE = 0.7;

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
      // column offsets into row units, so the disc is round on screen
      const nx = dx * CELL_ASPECT;
      const dist = Math.sqrt(nx * nx + dy * dy) / RADIUS;

      // a hair past 1, else the disc comes to a point at the poles
      if (dist > 1.04) {
        line += " ";
        continue;
      }

      // limb darkening, plus a lift toward the upper right so it reads as a ball
      let b = 1 - 0.34 * Math.min(1, dist) ** 2;
      b += 0.1 * ((nx - dy) / RADIUS);

      for (const c of craters) {
        const cd = Math.sqrt((nx - c.x) ** 2 + (dy - c.y) ** 2);
        if (cd < c.r) b -= c.depth * (1 - cd / c.r);
      }

      // The terminator is an ellipse: at each row it crosses the disc at
      // TERMINATOR of that row's half-chord. Lit to the right of it.
      const halfChord = Math.sqrt(Math.max(0, 1 - (dy / RADIUS) ** 2));
      const t = (nx / RADIUS - TERMINATOR * halfChord) / TERMINATOR_SOFTNESS;
      const lit = Math.max(0, Math.min(1, t * 0.5 + 0.5));

      // Earthshine: the unlit side is dropped, bar a sparse dotting of the
      // limb, so the dark half of the disc still has an edge to it.
      if (lit <= 0.02) {
        const rim = (dist - 0.84) / 0.18;
        line += rim > 0 && rand() < rim * EARTHSHINE ? "." : " ";
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

const MOON = drawMoon();

export default function Moon() {
  return (
    <div className="moon" aria-hidden="true">
      <div className="moon-halo" />
      <pre className="moon-disc">{MOON}</pre>
    </div>
  );
}

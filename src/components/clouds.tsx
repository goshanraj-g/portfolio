/* Deterministic ASCII clouds animated in CSS. */

/* A shared glyph set keeps the cloud drawings visually consistent. */
const SMALL = ["  .-.", " (   ).", "(__(___)"] as const;

const MEDIUM = ["   .--.", ".-(    ).", "(___.__)__)"] as const;

const LARGE = [
  "      .---.",
  "  .--(     )--.",
  " (              )",
  "  `--.._____..--'",
] as const;

const HUGE = [
  "        .--.      .-.",
  "    .--(    )----(   )--.",
  "  .(                      ).",
  " (                          )",
  "  `--.._______________..--'",
] as const;

type Shape = readonly string[];

type Cloud = {
  shape: Shape;
  /** Lane top in vh. */
  y: number;
  /** Font size in vh before the CSS viewport scale. */
  size: number;
  a: number;
  /** Seconds per crossing. */
  dur: number;
  delay: number;
  /** Static horizontal position. */
  x: number;
};

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Range = readonly [number, number];

type Band = {
  shapes: readonly Shape[];
  /** Font size in vh before the CSS viewport scale. */
  size: Range;
  a: Range;
  /** Shared crossing duration for the lane. */
  dur: number;
  /** Cloud top range in vh. */
  y: Range;
  count: number;
};

/* Non-overlapping depth lanes, nearest and fastest first. Shared lane speeds
   and evenly spaced starts keep horizontal gaps stable. */
const BANDS: readonly Band[] = [
  { shapes: [HUGE], size: [2.7, 3.0], a: [0.58, 0.72], dur: 135, y: [1.5, 2.3], count: 1 },
  { shapes: [LARGE, MEDIUM], size: [1.95, 2.3], a: [0.42, 0.55], dur: 200, y: [18.5, 19.5], count: 2 },
  { shapes: [MEDIUM, SMALL], size: [1.15, 1.42], a: [0.25, 0.38], dur: 300, y: [29.5, 31], count: 4 },
];

/* Give each cloud a jittered slice to guarantee an irregular spread. */
function spread(i: number, n: number, [lo, hi]: Range, jitter: number): number {
  return lo + ((i + jitter * 0.9) / n) * (hi - lo);
}

const CLOUDS: Cloud[] = (() => {
  const rand = mulberry32(60712);
  const pick = ([lo, hi]: Range) => lo + rand() * (hi - lo);

  return BANDS.flatMap((band) =>
    Array.from({ length: band.count }, (_, i) => ({
      // Cycle shapes so every drawing in a lane appears.
      shape: band.shapes[i % band.shapes.length],
      y: spread(i, band.count, band.y, rand()),
      size: pick(band.size),
      a: pick(band.a),
      dur: band.dur,
      // Half-slice jitter prevents clouds in a lane from touching.
      delay: -((i + rand() * 0.5) / band.count) * band.dur,
      x: spread(i, band.count, [2, 92], rand()),
    })),
  );
})();

export default function Clouds() {
  return (
    <div className="clouds" aria-hidden="true">
      {CLOUDS.map((c, i) => (
        <pre
          key={i}
          className="cloud"
          style={
            {
              top: `${c.y}vh`,
              // vh preserves lanes; the CSS scale constrains mobile width.
              fontSize: `calc(${c.size}vh * var(--cloud-scale, 1))`,
              // Larger clouds win if font metrics make lanes overlap.
              zIndex: Math.round(c.size * 100),
              "--a": c.a,
              "--dur": `${c.dur}s`,
              "--delay": `${c.delay * c.dur}s`,
              "--x": `${c.x}vw`,
            } as React.CSSProperties
          }
        >
          {c.shape.join("\n")}
        </pre>
      ))}
    </div>
  );
}

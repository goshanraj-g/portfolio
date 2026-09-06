/* Daytime clouds: a handful of line-drawn ASCII puffs crossing the sky.
   Deterministic, so they render server-side and never pop in, and drifted in
   CSS rather than on a frame loop — same bargain the stars make. */

/* Kept to the ( ) - _ . family so they read as one hand's drawing. Four sizes
   rather than three, and the new one is a good deal wider than the old
   largest: depth in a flat sky comes from the spread between the nearest
   shape and the farthest, and three drawings within a few characters of each
   other left the sky reading as one distance. */
const SMALL = ["  .-.", " (   ).", "(__(___)"] as const;

const MEDIUM = ["   .--.", ".-(    ).", "(___.__)__)"] as const;

const LARGE = [
  "      .---.",
  "  .--(     )--.",
  " (              )",
  "  `--.._____..--'",
] as const;

/* Two humps on one base, so the nearest cloud reads as a cloud with weather in
   it rather than as a small one held up to the eye. */
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
  /** lane top, in vh */
  y: number;
  /** font size in vh, before the viewport scale in the stylesheet */
  size: number;
  a: number;
  /** one crossing, in seconds */
  dur: number;
  delay: number;
  /** where it sits with the drift switched off */
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
  /** font size in vh, before the viewport scale in the stylesheet */
  size: Range;
  a: Range;
  /** seconds for one crossing — one figure for the whole lane, see below */
  dur: number;
  /** the lane the band sits in: cloud top, in vh */
  y: Range;
  count: number;
};

/* Three lanes, nearest first, and they do not overlap — that is the whole
   point of the shape of this table.

   Vertically: every lane's floor (its top plus the tallest cloud it can hold)
   clears the next lane's ceiling. That holds at any window height because the
   sizes are in vh, not px — a cloud's height in vh is the same on a laptop as
   on a monitor, so the lanes can be checked once here rather than hoped for.

   Horizontally: every cloud in a lane crosses at the same speed, and they are
   started evenly around the loop, so the gaps between them are fixed for as
   long as the page is open. Per-cloud durations were what let clouds catch
   each other up — with those, any two of them overlap sooner or later no
   matter where they start out.

   Nearest is highest, which is the way a sky actually reads: the treeline is
   the horizon, so distance runs toward it and the far puffs bunch just above
   it. Near still moves fastest. */
const BANDS: readonly Band[] = [
  { shapes: [HUGE], size: [2.7, 3.0], a: [0.58, 0.72], dur: 135, y: [1.5, 2.3], count: 1 },
  { shapes: [LARGE, MEDIUM], size: [1.95, 2.3], a: [0.42, 0.55], dur: 200, y: [18.5, 19.5], count: 2 },
  { shapes: [MEDIUM, SMALL], size: [1.15, 1.42], a: [0.25, 0.38], dur: 300, y: [29.5, 31], count: 4 },
];

/* A roll inside a slice rather than across the whole range: free rolls put
   five of these clouds in the top eighth of the sky and left the rest bare.
   Each cloud owns a slice and jitters within it, so the spread is guaranteed
   and the spacing still isn't regular. */
function spread(i: number, n: number, [lo, hi]: Range, jitter: number): number {
  return lo + ((i + jitter * 0.9) / n) * (hi - lo);
}

const CLOUDS: Cloud[] = (() => {
  const rand = mulberry32(60712);
  const pick = ([lo, hi]: Range) => lo + rand() * (hi - lo);

  return BANDS.flatMap((band) =>
    Array.from({ length: band.count }, (_, i) => ({
      // cycled, not rolled: a band of two is meant to show both its shapes,
      // and a roll happily hands back the same drawing twice
      shape: band.shapes[i % band.shapes.length],
      y: spread(i, band.count, band.y, rand()),
      size: pick(band.size),
      a: pick(band.a),
      dur: band.dur,
      // Spaced around the loop rather than over it: the jitter is kept to half
      // a slice so no two in a lane can start close enough to touch.
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
              // vh through a scale the stylesheet owns — the vh is what keeps
              // the lanes honest, the scale is what keeps a phone from wearing
              // the near cloud edge to edge
              fontSize: `calc(${c.size}vh * var(--cloud-scale, 1))`,
              // The lanes mean this should never be asked to settle anything.
              // It is here for the case they don't cover — a mono face whose
              // advance is wider than the 0.6em the lane widths assume — and
              // the answer there is the one you'd want: bigger wins.
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

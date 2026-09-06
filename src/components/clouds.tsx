/* Daytime clouds: a handful of line-drawn ASCII puffs crossing the sky.
   Deterministic, so they render server-side and never pop in, and drifted in
   CSS rather than on a frame loop — same bargain the stars make. */

/* Kept to the ( ) - _ . family so they read as one hand's drawing, and to
   three sizes so the sky has some depth to it. */
const SHAPES = [
  ["   .--.", ".-(    ).", "(___.__)__)"],
  ["  .-.", " (   ).", "(__(___)"],
  [
    "      .---.",
    "  .--(     )--.",
    " (              )",
    "  `--.._____..--'",
  ],
] as const;

type Cloud = {
  shape: readonly string[];
  /** band top, in vh */
  y: number;
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

const COUNT = 6;
/** how far down the sky a cloud may sit, well clear of the treeline */
const BAND_VH = 34;

const CLOUDS: Cloud[] = (() => {
  const rand = mulberry32(60712);
  return Array.from({ length: COUNT }, (_, i) => {
    // one per size, then the pick goes back to chance
    const shape = SHAPES[i < SHAPES.length ? i : Math.floor(rand() * SHAPES.length)];
    // the big shape reads as the nearest, so it sits lowest and moves fastest
    const near = shape === SHAPES[2];
    return {
      shape,
      y: 4 + rand() * BAND_VH,
      size: near ? 15 + rand() * 4 : 10 + rand() * 4,
      a: near ? 0.5 + rand() * 0.18 : 0.3 + rand() * 0.16,
      dur: near ? 150 + rand() * 60 : 220 + rand() * 120,
      // spread over the crossing, so they start scattered rather than in file
      delay: -((i + rand() * 0.6) / COUNT),
      x: rand() * 100,
    };
  });
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
              fontSize: c.size,
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

"use client";

import { useEffect, useState } from "react";

/* Sparse stars over the top of the sky, thinning toward the treeline.
   Twinkled in CSS rather than on a frame loop — there is nothing here the
   compositor can't do on its own. */

const COUNT = 74;
/** how far down the viewport stars reach, before the trees take over */
const SKY_VH = 62;

type Star = {
  x: number;
  y: number;
  size: number;
  glyph: string;
  a: number;
  dur: number;
  delay: number;
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

export default function Stars() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const rand = mulberry32(80231);
    const n = Math.round(COUNT * Math.min(1.3, Math.max(0.5, window.innerWidth / 1280)));

    setStars(
      Array.from({ length: n }, () => {
        // squared toward the zenith, so they thin out as they near the trees
        const depth = Math.pow(rand(), 0.62);
        return {
          x: 1 + rand() * 97,
          y: depth * SKY_VH,
          size: 7 + rand() * 5,
          glyph: rand() < 0.11 ? "*" : "·",
          // dimmer toward the horizon, where the air is thicker
          a: (0.48 + rand() * 0.5) * (1 - 0.45 * depth),
          dur: 2.8 + rand() * 4.6,
          delay: -rand() * 6,
        };
      })
    );
  }, []);

  return (
    <div className="sky" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={
            {
              left: `${s.x}vw`,
              top: `${s.y}vh`,
              fontSize: s.size,
              "--a": s.a,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
}

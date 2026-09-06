"use client";

import { useEffect, useState } from "react";

/* Stars thin toward the treeline and twinkle in CSS. */

const COUNT = 74;
/** Star field depth in viewport height. */
const SKY_VH = 44;

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
        // Bias stars toward the zenith.
        const depth = Math.pow(rand(), 1.45);
        return {
          x: 1 + rand() * 97,
          y: depth * SKY_VH,
          size: 7 + rand() * 5,
          glyph: rand() < 0.11 ? "*" : "·",
          // Dim stars toward the horizon.
          a: (0.48 + rand() * 0.5) * (1 - 0.5 * depth),
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

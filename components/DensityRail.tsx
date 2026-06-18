"use client";

import { useMemo } from "react";
import { EVENTS } from "@/lib/events";
import { RECENT } from "@/lib/recent";
import { DIMENSIONS, PALETTE } from "@/lib/constants";

/**
 * A thin sparkline of events-per-year across the full timeline, mapped to
 * 0-100% width. Designed to sit just above the scrubber's decade track —
 * the X axis lines up with the scrubber so users can see "this year had
 * a lot going on" at the same X as the playhead.
 *
 * Visualizes the exponential pace of the field — the right edge towers
 * over the left.
 */
export function DensityRail() {
  const { bars, maxCount } = useMemo(() => {
    const counts = new Map<number, number>();
    for (let y = DIMENSIONS.MIN_YEAR; y <= DIMENSIONS.MAX_YEAR; y++) counts.set(y, 0);
    for (const ev of EVENTS) {
      counts.set(ev.year, (counts.get(ev.year) ?? 0) + 1);
    }
    for (const ev of RECENT) {
      counts.set(ev.year, (counts.get(ev.year) ?? 0) + 1);
    }
    let max = 0;
    const arr: { year: number; count: number }[] = [];
    for (let y = DIMENSIONS.MIN_YEAR; y <= DIMENSIONS.MAX_YEAR; y++) {
      const c = counts.get(y) ?? 0;
      max = Math.max(max, c);
      arr.push({ year: y, count: c });
    }
    return { bars: arr, maxCount: max };
  }, []);

  const span = DIMENSIONS.MAX_YEAR - DIMENSIONS.MIN_YEAR;
  // Bar widths in % so the rail tracks the scrubber regardless of pixel
  // width. Each year gets 1/span of the rail.
  const barW = 100 / span;

  return (
    <div
      className="pointer-events-none relative h-7 w-full"
      aria-hidden
      style={{ overflow: "hidden" }}
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 100 28"
      >
        {/* Baseline */}
        <line
          x1={0}
          y1={27}
          x2={100}
          y2={27}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.4}
        />
        {bars.map(({ year, count }) => {
          if (count === 0) return null;
          const x = ((year - DIMENSIONS.MIN_YEAR) / span) * 100;
          // Square-root scaling so 1956's single event still reads while
          // 2024's twelve-event year doesn't dwarf everything else.
          const h = Math.max(1.2, (Math.sqrt(count) / Math.sqrt(maxCount)) * 25);
          return (
            <rect
              key={year}
              x={x}
              y={27 - h}
              width={barW * 0.85}
              height={h}
              fill={PALETTE.gold}
              opacity={0.45}
            />
          );
        })}
      </svg>
      <div
        className="absolute left-0 top-0 text-[8.5px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: PALETTE.inkFaint,
          letterSpacing: "0.1em",
        }}
      >
        EVENTS / YEAR
      </div>
    </div>
  );
}

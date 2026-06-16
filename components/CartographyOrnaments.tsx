"use client";

import { decades, totalWidth, yearToX } from "@/lib/layout";
import { DIMENSIONS, LANES, PALETTE } from "@/lib/constants";

interface OrnamentsProps {
  stageHeight: number;
}

/**
 * In-SVG chrome: alternating lane bands, ink rules between lanes,
 * year ruler with decade labels, and the "Terra incognita →" marginalia.
 * The lane labels themselves live in <LaneRail/>.
 */
export function CartographyOrnaments({ stageHeight }: OrnamentsProps) {
  const decs = decades();
  const w = totalWidth();

  // Each lane occupies a band [topY, bottomY] bounded by midpoints with
  // its neighbours (or the SVG top/bottom for the edge lanes).
  const bands = LANES.map((lane, i) => {
    const top = i === 0 ? 0 : (LANES[i - 1].y + lane.y) / 2;
    const bottom = i === LANES.length - 1 ? 1 : (lane.y + LANES[i + 1].y) / 2;
    return { lane, topY: top * stageHeight, bottomY: bottom * stageHeight };
  });

  const abandonedLaneY = (LANES.find((l) => l.id === "abandoned")?.y ?? 0.84) * stageHeight;

  return (
    <g aria-hidden>
      {/* Alternating lane band tints */}
      {bands.map(({ lane, topY, bottomY }, i) => {
        const isTrunk = lane.id === "trunk";
        const isAbandoned = lane.id === "abandoned";
        const fill = isTrunk
          ? "rgba(217, 175, 58, 0.07)" // gold wash for the canonical lane
          : isAbandoned
            ? "rgba(179, 49, 36, 0.05)" // vermilion wash for the dragons' lane
            : i % 2 === 0
              ? "rgba(94, 74, 42, 0.06)"
              : "rgba(94, 74, 42, 0.00)";
        return (
          <rect
            key={lane.id}
            x={0}
            y={topY}
            width={w}
            height={bottomY - topY}
            fill={fill}
          />
        );
      })}

      {/* Ink rules between lane bands (every band boundary except the very top). */}
      {bands.slice(1).map(({ lane, topY }) => (
        <line
          key={`rule-${lane.id}`}
          x1={0}
          y1={topY}
          x2={w}
          y2={topY}
          stroke={PALETTE.inkSoft}
          strokeWidth={0.35}
          opacity={0.4}
        />
      ))}

      {/* Top year ruler */}
      <RuledBand y={32} w={w} />

      {/* Decade labels above the ruler */}
      {decs.map((d) => (
        <text
          key={d}
          x={yearToX(d)}
          y={22}
          textAnchor="middle"
          fontFamily="var(--font-script)"
          fontSize={12}
          fill={PALETTE.inkSoft}
          letterSpacing={3}
        >
          {d}s
        </text>
      ))}

      {/* "Terra incognita →" anchored a safe distance above the abandoned lane. */}
      <text
        x={w - 12}
        y={Math.min(stageHeight - 24, abandonedLaneY - 28)}
        textAnchor="end"
        fontFamily="var(--font-script)"
        fontSize={16}
        fill={PALETTE.cinnabar}
        fontStyle="italic"
        opacity={0.85}
      >
        Terra incognita →
      </text>
    </g>
  );
}

function RuledBand({ y, w }: { y: number; w: number }) {
  const ticks: { x: number; major: boolean }[] = [];
  const yearStep = DIMENSIONS.PX_PER_YEAR;
  for (let i = 0; i * yearStep <= w; i++) {
    ticks.push({ x: i * yearStep, major: i % 10 === 0 });
  }
  return (
    <g aria-hidden>
      <line x1={0} y1={y} x2={w} y2={y} stroke={PALETTE.inkSoft} strokeWidth={0.6} />
      {ticks.map((t) => (
        <line
          key={t.x}
          x1={t.x}
          y1={y}
          x2={t.x}
          y2={y + (t.major ? 7 : 3)}
          stroke={PALETTE.inkSoft}
          strokeWidth={t.major ? 0.7 : 0.4}
        />
      ))}
    </g>
  );
}

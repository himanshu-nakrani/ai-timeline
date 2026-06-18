"use client";

import { decades, totalWidth, yearToX } from "@/lib/layout";
import { DIMENSIONS, LANES, PALETTE } from "@/lib/constants";

interface GridProps {
  stageHeight: number;
}

/**
 * In-SVG chrome: alternating lane bands, ink rules between lanes,
 * year ruler with decade labels, future horizon marker.
 * Lane labels themselves live in <LaneRail/>.
 */
export function TimelineGrid({ stageHeight }: GridProps) {
  const decs = decades();
  const w = totalWidth();

  const bands = LANES.map((lane, i) => {
    const top = i === 0 ? 0 : (LANES[i - 1].y + lane.y) / 2;
    const bottom = i === LANES.length - 1 ? 1 : (lane.y + LANES[i + 1].y) / 2;
    return { lane, topY: top * stageHeight, bottomY: bottom * stageHeight };
  });

  return (
    <g aria-hidden>
      {bands.map(({ lane, topY, bottomY }, i) => {
        const isTrunk = lane.id === "trunk";
        const isAbandoned = lane.id === "abandoned";
        const fill = isTrunk
          ? "rgba(6, 182, 212, 0.06)"
          : isAbandoned
            ? "rgba(244, 63, 94, 0.05)"
            : i % 2 === 0
              ? "rgba(255, 255, 255, 0.02)"
              : "rgba(255, 255, 255, 0.01)";
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

      {bands.slice(1).map(({ lane, topY }) => (
        <line
          key={`rule-${lane.id}`}
          x1={0}
          y1={topY}
          x2={w}
          y2={topY}
          stroke="rgba(255, 255, 255, 0.10)"
          strokeWidth={0.7}
        />
      ))}

      {/* Top year ruler */}
      <RuledBand y={32} w={w} />

      {/* Decade labels with a short anchor tick. The long dashed-to-trunk
          leader was removed — it competed with branch curves. */}
      {decs.map((d) => {
        const x = yearToX(d);
        return (
          <g key={d}>
            <text
              x={x}
              y={20}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={11}
              fontWeight={600}
              fill={PALETTE.ink}
              letterSpacing={1.5}
            >
              {d}
            </text>
            <line
              x1={x}
              y1={26}
              x2={x}
              y2={44}
              stroke={PALETTE.inkFaint}
              strokeOpacity={0.7}
              strokeWidth={0.8}
            />
          </g>
        );
      })}

      <text
        x={w - 12}
        y={stageHeight - 16}
        textAnchor="end"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fill={PALETTE.inkSoft}
        letterSpacing={1.2}
        opacity={0.6}
      >
        FUTURE HORIZON →
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
      <line x1={0} y1={y} x2={w} y2={y} stroke="rgba(255, 255, 255, 0.18)" strokeWidth={0.8} />
      {ticks.map((t) => (
        <line
          key={t.x}
          x1={t.x}
          y1={y}
          x2={t.x}
          y2={y + (t.major ? 10 : 3)}
          stroke={t.major ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.1)"}
          strokeWidth={t.major ? 1.2 : 0.4}
        />
      ))}
    </g>
  );
}

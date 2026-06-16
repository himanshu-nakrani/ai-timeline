"use client";

import { decades, totalWidth, trunkY, yearToX } from "@/lib/layout";
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
      {/* Alternating lane band tints — bumped to be visible against the
          near-black background. Cyan-tinted trunk band anchors the canonical
          lineage; rose-tinted abandoned band signals the graveyard; the rest
          alternate subtly. */}
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

      {/* Rules between lane bands — bumped to 0.10 alpha so the lane system
          reads as deliberate. */}
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

      {/* Decade labels above the ruler, with a thin anchor line that runs
          from the year label all the way down to the trunk. Two stroke weights
          so the upper segment reads as a year tick and the lower segment
          fades into a subtle lane-anchoring line. */}
      {decs.map((d) => {
        const x = yearToX(d);
        const yToTrunk = trunkY(stageHeight);
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
            {/* Upper segment — year tick, opaque. */}
            <line
              x1={x}
              y1={26}
              x2={x}
              y2={44}
              stroke={PALETTE.inkFaint}
              strokeOpacity={0.7}
              strokeWidth={0.8}
            />
            {/* Lower segment — fades to the trunk. */}
            <line
              x1={x}
              y1={44}
              x2={x}
              y2={yToTrunk}
              stroke={PALETTE.gold}
              strokeOpacity={0.25}
              strokeWidth={0.6}
              strokeDasharray="2 4"
            />
          </g>
        );
      })}

      {/* Horizon label */}
      <text
        x={w - 12}
        y={Math.min(stageHeight - 24, abandonedLaneY - 28)}
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
      {/* Top rule line — slightly brighter than the lane separators. */}
      <line x1={0} y1={y} x2={w} y2={y} stroke="rgba(255, 255, 255, 0.18)" strokeWidth={0.8} />
      {ticks.map((t) => (
        <line
          key={t.x}
          x1={t.x}
          y1={y}
          x2={t.x}
          y2={y + (t.major ? 10 : 3)}
          // Major ticks are 2.5x more visible than minor ones.
          stroke={t.major ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.1)"}
          strokeWidth={t.major ? 1.2 : 0.4}
        />
      ))}
    </g>
  );
}

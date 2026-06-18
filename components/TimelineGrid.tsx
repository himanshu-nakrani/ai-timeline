"use client";

import { decades, totalWidth, yearToX } from "@/lib/layout";
import { DIMENSIONS, ERAS, LANES, PALETTE } from "@/lib/constants";

interface GridProps {
  stageHeight: number;
}

/**
 * In-SVG chrome: era-tinted vertical bands, faint lane separators,
 * year ruler with decade labels, era title rail, future horizon marker.
 * Lane labels themselves live in <LaneRail/>.
 */
export function TimelineGrid({ stageHeight }: GridProps) {
  const decs = decades();
  const w = totalWidth();

  const laneBands = LANES.map((lane, i) => {
    const top = i === 0 ? 0 : (LANES[i - 1].y + lane.y) / 2;
    const bottom = i === LANES.length - 1 ? 1 : (lane.y + LANES[i + 1].y) / 2;
    return { lane, topY: top * stageHeight, bottomY: bottom * stageHeight };
  });

  // Era band geometry — full-height vertical tints, plus a title sitting in
  // the rail row between the year ruler and the lane content.
  const eraTitleY = 60;
  const eraBands = ERAS.map((era, i) => {
    const x0 = yearToX(Math.max(era.from, DIMENSIONS.MIN_YEAR));
    const nextFrom = i + 1 < ERAS.length ? ERAS[i + 1].from : DIMENSIONS.MAX_YEAR;
    const x1 = yearToX(Math.min(nextFrom, DIMENSIONS.MAX_YEAR));
    return { era, x0, x1, width: x1 - x0 };
  });

  return (
    <g aria-hidden>
      {/* Era vertical bands — they sit under everything else. */}
      {eraBands.map(({ era, x0, width }) => (
        <rect
          key={`era-bg-${era.id}`}
          x={x0}
          y={0}
          width={width}
          height={stageHeight}
          fill={era.tint}
        />
      ))}

      {/* Vertical separators between eras — faint full-height rules. */}
      {eraBands.slice(1).map(({ era, x0 }) => (
        <line
          key={`era-rule-${era.id}`}
          x1={x0}
          y1={48}
          x2={x0}
          y2={stageHeight - 24}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={0.7}
          strokeDasharray="2 6"
        />
      ))}

      {/* Subtle highlight for the trunk lane only — keeps the mainline
          legible against era tints. */}
      {laneBands
        .filter(({ lane }) => lane.id === "trunk")
        .map(({ topY, bottomY }) => (
          <rect
            key="trunk-band"
            x={0}
            y={topY}
            width={w}
            height={bottomY - topY}
            fill="rgba(255, 255, 255, 0.02)"
          />
        ))}

      {/* Horizontal lane separators. */}
      {laneBands.slice(1).map(({ lane, topY }) => (
        <line
          key={`lane-rule-${lane.id}`}
          x1={0}
          y1={topY}
          x2={w}
          y2={topY}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={0.6}
        />
      ))}

      {/* Year ruler */}
      <RuledBand y={32} w={w} />

      {/* Decade labels with a short anchor tick. */}
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

      {/* Era titles — centered in each era band, sitting in the rail row
          between the year ruler and the lane content. */}
      {eraBands.map(({ era, x0, width }) => {
        const cx = x0 + width / 2;
        return (
          <g key={`era-title-${era.id}`}>
            <text
              x={cx}
              y={eraTitleY}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fontWeight={700}
              fill={PALETTE.gold}
              letterSpacing={2}
              opacity={0.85}
            >
              {era.label.toUpperCase()}
            </text>
            <text
              x={cx}
              y={eraTitleY + 14}
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize={12}
              fontWeight={600}
              fill={PALETTE.ink}
              opacity={0.7}
            >
              {era.subtitle}
            </text>
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

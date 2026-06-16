"use client";

import { LANES, PALETTE } from "@/lib/constants";

interface LaneRailProps {
  stageHeight: number;
}

/**
 * Lane labels rendered in a fixed left rail. The rail itself is positioned
 * by the parent; this component fills its parent and lays each lane label
 * at the same fractional Y its lane occupies in the SVG.
 */
export function LaneRail({ stageHeight }: LaneRailProps) {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background: PALETTE.parchment,
        borderRight: `1px solid ${PALETTE.ink}`,
      }}
    >
      {LANES.map((lane) => {
        const top = lane.y * stageHeight;
        const isTrunk = lane.id === "trunk";
        const isAbandoned = lane.id === "abandoned";
        return (
          <div
            key={lane.id}
            className="absolute right-3 flex flex-col items-end"
            style={{
              top,
              transform: "translateY(-50%)",
              color: isAbandoned ? PALETTE.vermilion : PALETTE.ink,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: isTrunk ? 19 : 16,
                fontWeight: isTrunk ? 600 : 500,
                letterSpacing: "0.01em",
                lineHeight: 1,
              }}
            >
              {lane.label}
            </div>
            <div
              className="mt-1"
              style={{
                fontFamily: "var(--font-script)",
                fontSize: 10,
                color: isAbandoned ? PALETTE.vermilion : PALETTE.inkFaint,
                letterSpacing: 3,
                lineHeight: 1,
              }}
            >
              {lane.sublabel.toUpperCase()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { BranchPlacement } from "@/lib/layout";
import { PALETTE } from "@/lib/constants";
import type { BranchFate } from "@/lib/events";

interface BranchProps {
  placement: BranchPlacement;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onSelect: (id: string) => void;
}

const FATE_LABEL: Record<Exclude<BranchFate, "trunk">, string> = {
  active: "Active",
  rejoined: "Returned",
  pruned: "Abandoned",
  constrains: "Constraint",
};

const FATE_CLASS: Record<Exclude<BranchFate, "trunk">, string> = {
  active: "branch-active",
  rejoined: "branch-rejoined",
  pruned: "branch-pruned",
  constrains: "branch-constrains",
};

/**
 * A single landmark on its category lane. Renders:
 *   - a horizontal segment from eventX → toX along the lane Y
 *   - a small dot at the event year
 *   - a label below or above the lane (slot-staggered to avoid collisions)
 */
export function Branch({ placement, scrollRef, onSelect }: BranchProps) {
  const { event, laneYPx, eventX, toX, slot } = placement;
  const fate = event.fate as Exclude<BranchFate, "trunk">;

  const pathRef = useRef<SVGLineElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  // Reveal on first viewport entry.
  useEffect(() => {
    if (!pathRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin: "0px 240px 0px 240px" },
    );
    io.observe(pathRef.current);
    return () => io.disconnect();
  }, []);

  // Pruned routes don't need a scroll listener anymore — they're rendered
  // in their own lane with vermilion stroke + dashed pattern from the start.
  void scrollRef;

  // slot ∈ {-2, -1, 1, 2}. Negative = above the line, positive = below.
  // |slot|=1 sits close to the line; |slot|=2 sits a row further out.
  const dir = slot > 0 ? 1 : -1;
  const rowHeight = 30; // distance between successive label rows
  const baseGap = 14;
  const labelOuterY = laneYPx + dir * (baseGap + (Math.abs(slot) - 1) * rowHeight);

  const dotColor =
    fate === "pruned"
      ? PALETTE.vermilion
      : fate === "active"
        ? PALETTE.blue
        : fate === "rejoined"
          ? PALETTE.wax
          : "#f59e0b"; // constrains: amber
  const titleColor =
    fate === "pruned"
      ? PALETTE.vermilion
      : fate === "active"
        ? PALETTE.blueBright
        : fate === "rejoined"
          ? PALETTE.wax
          : "#fbbf24"; // constrains: brighter amber for legibility

  // Segment goes from the event year to the terminal year (active: edge).
  return (
    <g
      aria-label={`${event.title} — ${FATE_LABEL[fate]}`}
      style={{ opacity: revealed ? 1 : 0, transition: "opacity 360ms ease" }}
    >
      {/* Connected curve and lane segment for this event. */}
      <path
        ref={pathRef}
        d={placement.pathD}
        className={`branch-path ${FATE_CLASS[fate]}`}
      />

      {/* Cross-mark at the terminal of pruned routes. */}
      {fate === "pruned" && <PruneMarker cx={toX} cy={laneYPx} />}

      {/* Leader line from the dot to the row-2 label. Offset 6px to the
          right so it doesn't sit on top of a row-1 label that shares X. */}
      {Math.abs(slot) === 2 && (
        <>
          <line
            x1={eventX}
            y1={laneYPx + dir * 5}
            x2={eventX + 6}
            y2={laneYPx + dir * 22}
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={0.7}
          />
          <line
            x1={eventX + 6}
            y1={laneYPx + dir * 22}
            x2={eventX + 6}
            y2={labelOuterY - dir * 4}
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={0.7}
          />
        </>
      )}
      {/* Event dot. */}
      <circle
        cx={eventX}
        cy={laneYPx}
        r={3}
        fill={dotColor}
        stroke={PALETTE.parchment}
        strokeWidth={1.2}
      />

      {/* Clickable label. */}
      <g
        transform={`translate(${eventX} ${labelOuterY})`}
        className="cursor-pointer focus-ring outline-none"
        tabIndex={0}
        role="button"
        aria-label={`${event.title} (${event.year}) — ${FATE_LABEL[fate]}`}
        onClick={() => onSelect(event.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(event.id);
          }
        }}
      >
        {/* Year — closer to the line */}
        <text
          y={0}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={8.5}
          fontWeight={600}
          fill={PALETTE.inkSoft}
          letterSpacing={1.2}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {event.year}
        </text>
        {/* Title — further out */}
        <text
          y={dir * 13}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize={11}
          fontWeight={600}
          fill={titleColor}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          {truncate(event.title, 32)}
        </text>
      </g>
    </g>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function PruneMarker({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`} aria-hidden>
      <line x1={-5} y1={-5} x2={5} y2={5} stroke={PALETTE.vermilion} strokeWidth={1.6} strokeLinecap="round" />
      <line x1={-5} y1={5} x2={5} y2={-5} stroke={PALETTE.vermilion} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

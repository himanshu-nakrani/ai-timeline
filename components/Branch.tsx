"use client";

import { useEffect, useRef, useState } from "react";
import type { BranchPlacement } from "@/lib/layout";
import { PALETTE } from "@/lib/constants";
import type { BranchFate, TimelineEvent } from "@/lib/events";

interface BranchProps {
  placement: BranchPlacement;
  onSelect: (id: string) => void;
}

const FATE_LABEL: Record<Exclude<BranchFate, "trunk">, string> = {
  active: "Active",
  rejoined: "Rejoined",
  pruned: "Abandoned",
  constrains: "Constraint",
};

const CATEGORY_BADGE: Partial<Record<TimelineEvent["category"], string>> = {
  hardware: "HW",
  policy: "REG",
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
export function Branch({ placement, onSelect }: BranchProps) {
  const { event, laneYPx, eventX, labelX, toX, slot } = placement;
  const fate = event.fate as Exclude<BranchFate, "trunk">;

  const pathRef = useRef<SVGPathElement | null>(null);
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

  // slot ∈ {-3, -2, -1, 1, 2, 3}. Negative = above the line, positive = below.
  // |slot|=1 sits close to the line; outer slots stack further out.
  const dir = slot > 0 ? 1 : -1;
  const rowHeight = 30;
  const baseGap = 14;
  const labelOuterY = laneYPx + dir * (baseGap + (Math.abs(slot) - 1) * rowHeight);
  const labelDX = labelX - eventX;
  const hasLeader = Math.abs(slot) >= 2 || Math.abs(labelDX) > 1;

  const dotColor =
    fate === "pruned"
      ? PALETTE.vermilion
      : fate === "active"
        ? PALETTE.blue
        : fate === "rejoined"
          ? PALETTE.wax
          : PALETTE.amber;
  const titleColor =
    fate === "pruned"
      ? PALETTE.vermilion
      : fate === "active"
        ? PALETTE.blueBright
        : fate === "rejoined"
          ? PALETTE.wax
          : PALETTE.amberBright;
  const badge = CATEGORY_BADGE[event.category];

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

      {/* Arrow at the terminal of active routes — signals "ongoing". */}
      {fate === "active" && <ActiveMarker cx={toX} cy={laneYPx} />}

      {/* Transparent hitbox over the dot so clicks on the dot itself
          register on this branch (otherwise the <g> label is the only target). */}
      <rect
        x={eventX - 10}
        y={laneYPx - 10}
        width={20}
        height={20}
        fill="transparent"
        aria-hidden
      />

      {/* Leader line connecting the dot to the (potentially offset) label. */}
      {hasLeader && (
        <>
          <line
            x1={eventX}
            y1={laneYPx + dir * 5}
            x2={eventX}
            y2={laneYPx + dir * 14}
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth={0.7}
          />
          <line
            x1={eventX}
            y1={laneYPx + dir * 14}
            x2={labelX}
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

      {/* Category badge for hardware/policy (formerly own lanes). */}
      {badge && (
        <g transform={`translate(${eventX + 7} ${laneYPx - 1})`} aria-hidden>
          <rect
            x={0}
            y={-5}
            rx={2}
            width={badge.length * 5.4 + 4}
            height={10}
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={0.5}
          />
          <text
            x={badge.length * 2.7 + 2}
            y={3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={7}
            fontWeight={700}
            fill={PALETTE.inkSoft}
            letterSpacing={1}
            style={{ pointerEvents: "none", userSelect: "none" }}
          >
            {badge}
          </text>
        </g>
      )}

      {/* Clickable label. */}
      <g
        transform={`translate(${labelX} ${labelOuterY})`}
        className="event-node focus-ring"
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
        {/* Invisible focus halo — styled via .event-node:focus in globals.css */}
        <circle
          r={Math.max(28, (event.title.length * 3.2) / 2)}
          className="focus-halo"
          aria-hidden
        />
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

function ActiveMarker({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`} aria-hidden>
      <polyline
        points="-6,-4 0,0 -6,4"
        fill="none"
        stroke={PALETTE.blueBright}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

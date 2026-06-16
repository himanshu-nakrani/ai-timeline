"use client";

import { useMemo } from "react";
import { buildTrunkPath, totalWidth, trunkY, yearToX } from "@/lib/layout";
import { DIMENSIONS, PALETTE } from "@/lib/constants";
import type { TimelineEvent } from "@/lib/events";

interface SacredTrunkProps {
  stageHeight: number;
  trunkEvents: TimelineEvent[];
  onSelect: (id: string) => void;
}

const MIN_TITLE_GAP_PX = 200;
// Trunk title rows: -2 = far above, -1 = above, 1 = below, 2 = far below.
type TrunkSlot = -2 | -1 | 1 | 2;
const TRUNK_SLOT_ORDER: TrunkSlot[] = [1, -1, 2, -2];

/**
 * The Via Aurea — gold-ink trade route. Titles use a chain-aware 4-row
 * stagger so chains of close trunk events (e.g. ChatGPT → GPT-4 →
 * Multimodal → Reasoning) never overlap.
 */
export function SacredTrunk({ stageHeight, trunkEvents, onSelect }: SacredTrunkProps) {
  const trunkPath = useMemo(() => buildTrunkPath(stageHeight), [stageHeight]);
  const totalW = totalWidth();
  const trunkYPx = trunkY(stageHeight);

  const placed = useMemo(() => {
    const sorted = [...trunkEvents].sort(
      (a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0),
    );
    const lastX: Record<TrunkSlot, number> = {
      [-2]: -Infinity,
      [-1]: -Infinity,
      1: -Infinity,
      2: -Infinity,
    };
    return sorted.map((ev) => {
      const x = yearToX(ev.year, ev.month);
      let slot: TrunkSlot = TRUNK_SLOT_ORDER[0];
      for (const s of TRUNK_SLOT_ORDER) {
        if (x - lastX[s] >= MIN_TITLE_GAP_PX) {
          slot = s;
          break;
        }
      }
      // Fallback to least-recently-used slot if every slot is crowded.
      if (x - lastX[slot] < MIN_TITLE_GAP_PX) {
        let best: TrunkSlot = TRUNK_SLOT_ORDER[0];
        for (const s of TRUNK_SLOT_ORDER) {
          if (lastX[s] < lastX[best]) best = s;
        }
        slot = best;
      }
      lastX[slot] = x;
      return { ev, x, slot };
    });
  }, [trunkEvents]);

  return (
    <g aria-label="Via Aurea — canonical lineage">
      {/* Halo: a wider, faded gold stroke under the main one. */}
      <path
        d={trunkPath}
        fill="none"
        stroke={PALETTE.goldBright}
        strokeWidth={11}
        strokeLinecap="round"
        strokeOpacity={0.2}
      />
      {/* Ink edge */}
      <path d={trunkPath} fill="none" stroke={PALETTE.ink} strokeWidth={4.4} strokeLinecap="round" />
      {/* Gold core */}
      <path d={trunkPath} fill="none" stroke={PALETTE.gold} strokeWidth={3} strokeLinecap="round" />

      {placed.map(({ ev, x, slot }) => {
        const dir = slot > 0 ? 1 : -1;
        const rowOffset = (Math.abs(slot) - 1) * 26; // extra space for outer rows
        const yearOffset = dir * (16 + rowOffset);
        const titleOffset = dir * ((ev.nexus ? 36 : 30) + rowOffset);
        const showLeader = Math.abs(slot) === 2;
        return (
          <g
            key={ev.id}
            transform={`translate(${x} ${trunkYPx})`}
            className="cursor-pointer focus-ring"
            tabIndex={0}
            role="button"
            aria-label={`${ev.title} (${ev.year})${ev.nexus ? " — nexus event" : ""}`}
            onClick={() => onSelect(ev.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(ev.id);
              }
            }}
          >
            {showLeader && (
              <line
                x1={0}
                y1={dir * 12}
                x2={0}
                y2={dir * (Math.abs(yearOffset) - 4)}
                stroke={PALETTE.inkFaint}
                strokeWidth={0.6}
                opacity={0.55}
              />
            )}
            {ev.nexus ? (
              <NexusStar />
            ) : (
              <>
                <circle r={DIMENSIONS.NODE_RADIUS + 2} fill={PALETTE.parchment} stroke={PALETTE.ink} strokeWidth={0.9} />
                <circle r={DIMENSIONS.NODE_RADIUS} fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth={1} />
                <circle r={DIMENSIONS.NODE_RADIUS - 3} fill={PALETTE.goldBright} opacity={0.9} />
              </>
            )}
            <text
              y={yearOffset}
              textAnchor="middle"
              fontFamily="var(--font-script)"
              fontSize={ev.nexus ? 12 : 11}
              fill={ev.nexus ? PALETTE.cinnabar : PALETTE.inkSoft}
              letterSpacing={2.2}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {ev.year}
            </text>
            <text
              y={titleOffset}
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize={ev.nexus ? 17 : 14}
              fontWeight={ev.nexus ? 600 : 500}
              fill={PALETTE.ink}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {truncate(ev.title, ev.nexus ? 28 : 22)}
            </text>
          </g>
        );
      })}

      {/* Right cap — small concentric mark for "present". */}
      <g transform={`translate(${totalW} ${trunkYPx})`} aria-hidden>
        <circle r={6} fill={PALETTE.parchment} stroke={PALETTE.ink} strokeWidth={0.9} />
        <circle r={3.5} fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth={0.6} />
      </g>
    </g>
  );
}

function NexusStar() {
  return (
    <g aria-hidden>
      <circle
        r={DIMENSIONS.NEXUS_RADIUS + 9}
        fill="none"
        stroke={PALETTE.cinnabar}
        strokeOpacity={0.32}
        strokeWidth={0.7}
      />
      <Star size={DIMENSIONS.NEXUS_RADIUS + 1} fill={PALETTE.cinnabar} />
      <Star size={DIMENSIONS.NEXUS_RADIUS - 5} fill={PALETTE.goldBright} rotate={30} />
    </g>
  );
}

function Star({ size, fill, rotate = 0 }: { size: number; fill: string; rotate?: number }) {
  const s = size;
  const t = size * 0.36;
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const b = a + Math.PI / 6;
    pts.push(`${(Math.cos(a) * s).toFixed(2)},${(Math.sin(a) * s).toFixed(2)}`);
    pts.push(`${(Math.cos(b) * t).toFixed(2)},${(Math.sin(b) * t).toFixed(2)}`);
  }
  return (
    <polygon
      points={pts.join(" ")}
      fill={fill}
      stroke={PALETTE.ink}
      strokeWidth={0.7}
      strokeLinejoin="round"
      transform={`rotate(${rotate})`}
    />
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

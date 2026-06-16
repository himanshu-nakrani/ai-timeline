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
    return sorted.map((ev, idx) => {
      const x = yearToX(ev.year, ev.month);
      let slot: TrunkSlot = TRUNK_SLOT_ORDER[0];
      // Pin the first two trunk events to the *above* slot so their labels
      // are not occluded by the sticky left lane rail.
      if (idx === 0) {
        slot = -1;
      } else if (idx === 1) {
        slot = -1;
      } else {
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
      }
      lastX[slot] = x;
      return { ev, x, slot };
    });
  }, [trunkEvents]);

  return (
    <g aria-label="Via Aurea — canonical lineage">
      {/* Halo: a wider, faded cyan stroke under the main one. */}
      <path
        d={trunkPath}
        fill="none"
        stroke={PALETTE.gold}
        strokeWidth={6}
        strokeLinecap="round"
        strokeOpacity={0.15}
      />
      {/* Ink edge */}
      <path d={trunkPath} fill="none" stroke={PALETTE.parchment} strokeWidth={3.5} strokeLinecap="round" />
      {/* Cyan core */}
      <path d={trunkPath} fill="none" stroke={PALETTE.gold} strokeWidth={1.8} strokeLinecap="round" />

      {placed.map(({ ev, x, slot }) => {
        const dir = slot > 0 ? 1 : -1;
        const rowOffset = (Math.abs(slot) - 1) * 26; // extra space for outer rows
        const yearOffset = dir * (16 + rowOffset);
        const titleOffset = dir * ((ev.nexus ? 32 : 28) + rowOffset);
        const showLeader = Math.abs(slot) === 2;
        return (
          <g
            key={ev.id}
            transform={`translate(${x} ${trunkYPx})`}
            className="cursor-pointer focus-ring outline-none"
            tabIndex={0}
            role="button"
            aria-label={`${ev.title} (${ev.year}) — Canonical${ev.nexus ? " · nexus event" : ""}`}
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
                y1={dir * 8}
                x2={0}
                y2={dir * (Math.abs(yearOffset) - 4)}
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth={0.7}
              />
            )}
            {ev.nexus ? (
              <NexusRings />
            ) : (
              <>
                <circle r={5} fill={PALETTE.gold} stroke={PALETTE.parchment} strokeWidth={1.5} />
              </>
            )}
            <text
              y={yearOffset}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fontWeight={600}
              fill={ev.nexus ? PALETTE.goldBright : PALETTE.inkSoft}
              letterSpacing={1.2}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {ev.year}
            </text>
            <text
              y={titleOffset}
              textAnchor="middle"
              fontFamily="var(--font-display)"
              fontSize={ev.nexus ? 13 : 11.5}
              fontWeight={600}
              fill={PALETTE.ink}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {truncate(ev.title, ev.nexus ? 36 : 32)}
            </text>
          </g>
        );
      })}

      {/* Right cap — small concentric mark for "present". */}
      <g transform={`translate(${totalW} ${trunkYPx})`} aria-hidden>
        <circle r={4.5} fill={PALETTE.gold} stroke={PALETTE.parchment} strokeWidth={1.5} />
      </g>
    </g>
  );
}

function NexusRings() {
  return (
    <g aria-hidden>
      {/* Outer pulsing ring — honors prefers-reduced-motion via globals.css */}
      <circle
        r={DIMENSIONS.NEXUS_RADIUS + 7}
        fill="none"
        stroke={PALETTE.goldBright}
        strokeOpacity={0.25}
        strokeWidth={1}
        className="nexus-pulse"
      />
      {/* Middle ring */}
      <circle
        r={DIMENSIONS.NEXUS_RADIUS}
        fill="none"
        stroke={PALETTE.gold}
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />
      {/* Inner dot */}
      <circle r={4.5} fill={PALETTE.goldBright} stroke={PALETTE.parchment} strokeWidth={1.5} />
    </g>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

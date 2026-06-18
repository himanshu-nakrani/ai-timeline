"use client";

import { useMemo } from "react";
import { totalWidth, trunkY, yearToX } from "@/lib/layout";
import { DIMENSIONS, PALETTE } from "@/lib/constants";
import type { TimelineEvent } from "@/lib/events";

interface TrunkPathProps {
  stageHeight: number;
  trunkEvents: TimelineEvent[];
  onSelect: (id: string) => void;
}

const MIN_TITLE_GAP_PX = 200;
type TrunkSlot = -2 | -1 | 1 | 2;
const TRUNK_SLOT_ORDER: TrunkSlot[] = [1, -1, 2, -2];

/**
 * The mainline: a flat cyan rail with event nodes and stagger-placed titles.
 * Slot algorithm avoids label collisions for chains of close trunk events.
 */
export function TrunkPath({ stageHeight, trunkEvents, onSelect }: TrunkPathProps) {
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
      // Pin the first two trunk events above so labels don't sit under the
      // sticky left lane rail.
      if (idx === 0 || idx === 1) {
        slot = -1;
      } else {
        for (const s of TRUNK_SLOT_ORDER) {
          if (x - lastX[s] >= MIN_TITLE_GAP_PX) {
            slot = s;
            break;
          }
        }
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
    <g aria-label="Mainline — canonical lineage">
      <line
        x1={0}
        y1={trunkYPx}
        x2={totalW}
        y2={trunkYPx}
        stroke={PALETTE.gold}
        strokeWidth={6}
        strokeLinecap="round"
        strokeOpacity={0.15}
      />
      <line
        x1={0}
        y1={trunkYPx}
        x2={totalW}
        y2={trunkYPx}
        stroke={PALETTE.parchment}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <line
        x1={0}
        y1={trunkYPx}
        x2={totalW}
        y2={trunkYPx}
        stroke={PALETTE.gold}
        strokeWidth={1.8}
        strokeLinecap="round"
      />

      {placed.map(({ ev, x, slot }) => {
        const dir = slot > 0 ? 1 : -1;
        const rowOffset = (Math.abs(slot) - 1) * 26;
        const yearOffset = dir * (16 + rowOffset);
        const titleOffset = dir * ((ev.nexus ? 32 : 28) + rowOffset);
        const showLeader = Math.abs(slot) === 2;
        return (
          <g
            key={ev.id}
            transform={`translate(${x} ${trunkYPx})`}
            className="event-node focus-ring"
            tabIndex={0}
            role="button"
            aria-label={`${ev.title} (${ev.year}) — Canonical${ev.nexus ? " · turning point" : ""}`}
            onClick={() => onSelect(ev.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(ev.id);
              }
            }}
          >
            <circle r={DIMENSIONS.NEXUS_RADIUS + 4} className="focus-halo" aria-hidden />
            <rect
              x={-44}
              y={Math.min(yearOffset, titleOffset) - 8}
              width={88}
              height={Math.abs(titleOffset - yearOffset) + 16}
              fill="transparent"
              aria-hidden
            />
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
              <circle r={5} fill={PALETTE.gold} stroke={PALETTE.parchment} strokeWidth={1.5} />
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

      <g transform={`translate(${totalW} ${trunkYPx})`} aria-hidden>
        <circle r={4.5} fill={PALETTE.gold} stroke={PALETTE.parchment} strokeWidth={1.5} />
      </g>

      <TodayMarker stageHeight={stageHeight} trunkYPx={trunkYPx} />
    </g>
  );
}

function TodayMarker({ stageHeight, trunkYPx }: { stageHeight: number; trunkYPx: number }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  // Clamp into the chart so the marker is visible if "now" runs past MAX_YEAR.
  const clamped =
    year > 2026 ? { y: 2026, m: 12 } :
    year < 1956 ? { y: 1956, m: 1 } :
    { y: year, m: month };
  const x = yearToX(clamped.y, clamped.m);
  const topY = 76;
  const bottomY = stageHeight - 24;
  return (
    <g aria-hidden>
      {/* Vertical line — soft cyan, slightly stronger near the trunk. */}
      <line
        x1={x}
        y1={topY}
        x2={x}
        y2={bottomY}
        stroke={PALETTE.goldBright}
        strokeOpacity={0.35}
        strokeWidth={1}
        strokeDasharray="3 4"
      />
      {/* Solid stub at the trunk crossing. */}
      <line
        x1={x}
        y1={trunkYPx - 14}
        x2={x}
        y2={trunkYPx + 14}
        stroke={PALETTE.goldBright}
        strokeWidth={1.6}
      />
      {/* Pill label at the top. */}
      <g transform={`translate(${x} ${topY - 6})`}>
        <rect
          x={-26}
          y={-12}
          width={52}
          height={14}
          rx={3}
          fill={PALETTE.parchmentDeep}
          stroke={PALETTE.goldBright}
          strokeWidth={0.8}
          strokeOpacity={0.55}
        />
        <text
          x={0}
          y={-2}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fontWeight={700}
          fill={PALETTE.goldBright}
          letterSpacing={1.4}
        >
          TODAY
        </text>
      </g>
    </g>
  );
}

function NexusRings() {
  return (
    <g aria-hidden>
      <circle
        r={DIMENSIONS.NEXUS_RADIUS + 7}
        fill="none"
        stroke={PALETTE.goldBright}
        strokeOpacity={0.25}
        strokeWidth={1}
        className="nexus-pulse"
      />
      <circle
        r={DIMENSIONS.NEXUS_RADIUS}
        fill="none"
        stroke={PALETTE.gold}
        strokeOpacity={0.5}
        strokeWidth={0.8}
      />
      <circle r={4.5} fill={PALETTE.goldBright} stroke={PALETTE.parchment} strokeWidth={1.5} />
    </g>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

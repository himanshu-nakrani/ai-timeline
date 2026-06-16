// Pure, deterministic layout math. No side effects, no randomness.

import { DIMENSIONS, LANE_BY_ID, LANES, type LaneId } from "./constants";
import type { Category, TimelineEvent } from "./events";

const { PX_PER_YEAR, MIN_YEAR } = DIMENSIONS;

/** Total SVG width in pixels (events only — the sticky lane rail is on top of this). */
export function totalWidth(): number {
  return (DIMENSIONS.MAX_YEAR - DIMENSIONS.MIN_YEAR) * PX_PER_YEAR;
}

/** Map a year to its absolute X position inside the events SVG. */
export function yearToX(year: number, month?: number): number {
  const m = month ? (month - 1) / 12 : 0;
  return (year - MIN_YEAR + m) * PX_PER_YEAR;
}

/** Inverse — convert an X position back to a year (clamped). */
export function xToYear(x: number): number {
  const raw = x / PX_PER_YEAR + MIN_YEAR;
  return Math.max(DIMENSIONS.MIN_YEAR, Math.min(DIMENSIONS.MAX_YEAR, raw));
}

/** Resolve a lane to its absolute Y on the stage. */
export function laneY(id: LaneId, stageHeight: number): number {
  return LANE_BY_ID[id].y * stageHeight;
}

/** Trunk Y, for convenience. */
export function trunkY(stageHeight: number): number {
  return laneY("trunk", stageHeight);
}

/** The Via Aurea: a straight gold rail with a very gentle hand-drawn waver. */
export function buildTrunkPath(stageHeight: number): string {
  const y = trunkY(stageHeight);
  const w = totalWidth();
  // A faint sine so the rail doesn't look CAD-perfect.
  const period = PX_PER_YEAR * 16;
  const amp = 3;
  const step = 32;
  let d = `M 0 ${y.toFixed(2)}`;
  for (let x = step; x <= w; x += step) {
    const yOff = Math.sin((x / period) * Math.PI * 2) * amp;
    d += ` L ${x.toFixed(2)} ${(y + yOff).toFixed(2)}`;
  }
  return d;
}

/** Decade markers clipped to [MIN_YEAR, MAX_YEAR]. */
export function decades(): number[] {
  const out: number[] = [];
  // Round up MIN_YEAR to the nearest decade, round down MAX_YEAR.
  const start = Math.ceil(DIMENSIONS.MIN_YEAR / 10) * 10;
  const end = Math.floor(DIMENSIONS.MAX_YEAR / 10) * 10;
  for (let d = start; d <= end; d += 10) out.push(d);
  return out;
}

// ---------- Lane assignment ----------

/**
 * Map a category + fate to a lane id. Abandoned/pruned events always land
 * in the "abandoned" lane regardless of category, so the eye learns to
 * find the dragon-marks in one place.
 */
export function laneForEvent(ev: TimelineEvent): LaneId {
  if (ev.fate === "trunk") return "trunk";
  if (ev.fate === "pruned" || ev.category === "abandoned") return "abandoned";
  return categoryToLane(ev.category);
}

function categoryToLane(c: Category): LaneId {
  switch (c) {
    case "policy":
      return "policy";
    case "hardware":
      return "hardware";
    case "product":
      return "products";
    case "foundational":
      return "research";
    case "abandoned":
      return "abandoned";
  }
}

// ---------- Branch placement ----------

export interface BranchPlacement {
  event: TimelineEvent;
  lane: LaneId;
  laneYPx: number;
  /**
   * Vertical slot the label occupies, measured from the lane line.
   *   -2 = high above, -1 = above, 1 = below, 2 = far below.
   * Slots alternate to keep labels symmetric around the lane.
   */
  slot: -2 | -1 | 1 | 2;
  /** Position of the event's dot. */
  eventX: number;
  /** Where the lane segment ends (pruneYear / rejoin year / today). */
  toX: number;
}

const MIN_LABEL_GAP_PX = 170;
/**
 * Order of slot preference. The first slot to be far enough from its
 * previously used X wins. Slots are visited as (below, above, far below,
 * far above) so a typical first event sits cleanly below the line.
 */
const SLOT_ORDER: BranchPlacement["slot"][] = [1, -1, 2, -2];

export function assignBranchPlacements(
  events: TimelineEvent[],
  stageHeight: number,
): BranchPlacement[] {
  const branches = events
    .filter((e) => e.fate !== "trunk")
    .sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0));

  // Last X used per lane, per slot.
  type SlotMap = Record<BranchPlacement["slot"], number>;
  const initial = (): SlotMap => ({ [-2]: -Infinity, [-1]: -Infinity, 1: -Infinity, 2: -Infinity });
  const lastX: Record<LaneId, SlotMap> = LANES.reduce(
    (acc, l) => ({ ...acc, [l.id]: initial() }),
    {} as Record<LaneId, SlotMap>,
  );

  const placements: BranchPlacement[] = [];

  for (const ev of branches) {
    const lane = laneForEvent(ev);
    const laneYPx = laneY(lane, stageHeight);
    const eventX = yearToX(ev.year, ev.month);

    // Pick the first slot whose previous X is far enough away.
    let slot: BranchPlacement["slot"] = SLOT_ORDER[0];
    for (const s of SLOT_ORDER) {
      if (eventX - lastX[lane][s] >= MIN_LABEL_GAP_PX) {
        slot = s;
        break;
      }
    }
    // If every slot is too close, fall through to the least-recently-used one.
    if (eventX - lastX[lane][slot] < MIN_LABEL_GAP_PX) {
      let best = SLOT_ORDER[0];
      let bestX = lastX[lane][best];
      for (const s of SLOT_ORDER) {
        if (lastX[lane][s] < bestX) {
          best = s;
          bestX = lastX[lane][s];
        }
      }
      slot = best;
    }
    lastX[lane][slot] = eventX;

    const toX = (() => {
      if (ev.fate === "pruned") return yearToX(ev.pruneYear ?? ev.year + 4);
      if (ev.fate === "active") return totalWidth();
      return yearToX(ev.year + 4);
    })();

    placements.push({ event: ev, lane, laneYPx, slot, eventX, toX });
  }

  return placements;
}

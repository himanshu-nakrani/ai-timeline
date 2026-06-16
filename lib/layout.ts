// Pure, deterministic layout math for AI Lineage.
// Computes absolute coordinates, slot positions, and curved SVG paths.

import { DIMENSIONS, LANE_BY_ID, LANES, type LaneId } from "./constants";
import type { Category, TimelineEvent } from "./events";

const { PX_PER_YEAR, MIN_YEAR } = DIMENSIONS;

/** Total SVG width in pixels. */
export function totalWidth(): number {
  return (DIMENSIONS.MAX_YEAR - DIMENSIONS.MIN_YEAR) * PX_PER_YEAR;
}

/** Map a year to its absolute X position. */
export function yearToX(year: number, month?: number): number {
  const m = month ? (month - 1) / 12 : 0;
  return (year - MIN_YEAR + m) * PX_PER_YEAR;
}

/** Inverse — convert an X position back to a clamped year. */
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

/** Decade markers clipped to [MIN_YEAR, MAX_YEAR]. */
export function decades(): number[] {
  const out: number[] = [];
  const start = Math.ceil(DIMENSIONS.MIN_YEAR / 10) * 10;
  const end = Math.floor(DIMENSIONS.MAX_YEAR / 10) * 10;
  for (let d = start; d <= end; d += 10) out.push(d);
  return out;
}

/** Map a category + fate to a swimlane. */
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

export interface CoordinateMapEntry {
  x: number;
  y: number;
  lane: LaneId;
}

/** Compute absolute coordinates for all events and store in a Map. */
export function computeEventCoordinates(
  events: TimelineEvent[],
  stageHeight: number,
): Map<string, CoordinateMapEntry> {
  const coords = new Map<string, CoordinateMapEntry>();
  for (const ev of events) {
    const x = yearToX(ev.year, ev.month);
    const lane = laneForEvent(ev);
    const y = laneY(lane, stageHeight);
    coords.set(ev.id, { x, y, lane });
  }
  return coords;
}

export interface BranchPlacement {
  event: TimelineEvent;
  lane: LaneId;
  laneYPx: number;
  slot: -2 | -1 | 1 | 2;
  eventX: number;
  toX: number;
  pathD: string;
}

const MIN_LABEL_GAP_PX = 170;
const SLOT_ORDER: BranchPlacement["slot"][] = [1, -1, 2, -2];

/**
 * Assigns slots for labels and computes connected Bezier curves for branch segments.
 */
export function assignBranchPlacements(
  events: TimelineEvent[],
  stageHeight: number,
): BranchPlacement[] {
  const coords = computeEventCoordinates(events, stageHeight);
  const totalW = totalWidth();
  const trY = trunkY(stageHeight);

  const branches = events
    .filter((e) => e.fate !== "trunk")
    .sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0));

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

    // Pick the first slot whose previous label is far enough away horizontally.
    let slot: BranchPlacement["slot"] = SLOT_ORDER[0];
    for (const s of SLOT_ORDER) {
      if (eventX - lastX[lane][s] >= MIN_LABEL_GAP_PX) {
        slot = s;
        break;
      }
    }
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

    // Determine the terminal X of the branch
    const toX = (() => {
      if (ev.fate === "pruned") return yearToX(ev.pruneYear ?? ev.year + 4);
      if (ev.fate === "active") return totalW;
      if (ev.fate === "rejoined" && ev.rejoinAt) {
        const target = coords.get(ev.rejoinAt);
        return target ? target.x : eventX + 300;
      }
      return eventX + 300;
    })();

    // Generate connected SVG path
    let pathD = "";
    const parent = ev.branchFrom ? coords.get(ev.branchFrom) : null;
    const parentX = parent ? parent.x : Math.max(0, eventX - 100);
    const parentY = parent ? parent.y : trY;

    // 1. Incoming curve: Bezier from parent node to event node (horizontal alignment)
    const curveStartX = Math.min(parentX, eventX - 40);
    pathD += `M ${curveStartX.toFixed(1)} ${parentY.toFixed(1)}`;
    pathD += ` C ${((curveStartX + eventX) / 2).toFixed(1)} ${parentY.toFixed(1)},`;
    pathD += ` ${((curveStartX + eventX) / 2).toFixed(1)} ${laneYPx.toFixed(1)},`;
    pathD += ` ${eventX.toFixed(1)} ${laneYPx.toFixed(1)}`;

    // 2. Horizontal run and Outgoing paths
    if (ev.fate === "rejoined" && ev.rejoinAt) {
      const target = coords.get(ev.rejoinAt);
      if (target) {
        const rejoinX = target.x;
        const rejoinY = target.y;
        const runEndX = Math.max(eventX, rejoinX - 60);

        // Run straight horizontally
        pathD += ` L ${runEndX.toFixed(1)} ${laneYPx.toFixed(1)}`;
        // Curve back to the target node
        pathD += ` C ${((runEndX + rejoinX) / 2).toFixed(1)} ${laneYPx.toFixed(1)},`;
        pathD += ` ${((runEndX + rejoinX) / 2).toFixed(1)} ${rejoinY.toFixed(1)},`;
        pathD += ` ${rejoinX.toFixed(1)} ${rejoinY.toFixed(1)}`;
      } else {
        pathD += ` L ${toX.toFixed(1)} ${laneYPx.toFixed(1)}`;
      }
    } else {
      // Standard run to the end (active/pruned)
      pathD += ` L ${toX.toFixed(1)} ${laneYPx.toFixed(1)}`;
    }

    placements.push({
      event: ev,
      lane,
      laneYPx,
      slot,
      eventX,
      toX,
      pathD,
    });
  }

  return placements;
}

/** The Via Aurea: a straight gold rail with a very gentle hand-drawn waver. */
export function buildTrunkPath(stageHeight: number): string {
  const y = trunkY(stageHeight);
  const w = totalWidth();
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

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
    case "product":
    case "hardware":
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

export type BranchSlot = -3 | -2 | -1 | 1 | 2 | 3;

export interface BranchPlacement {
  event: TimelineEvent;
  lane: LaneId;
  laneYPx: number;
  slot: BranchSlot;
  eventX: number;
  /** Where the label sits horizontally — usually eventX, but nudged when
   *  multiple events would otherwise stack on top of each other. */
  labelX: number;
  toX: number;
  pathD: string;
}

/** Per-character font metric for var(--font-display) at 11px / weight 600,
 *  used to estimate label half-width. */
const LABEL_PX_PER_CHAR = 6.2;
const LABEL_PADDING_PX = 14;
/** Slots tried in order. Inner rows (±1) preferred; outer rows added only
 *  when the inner ones are crowded. */
const SLOT_ORDER: BranchSlot[] = [1, -1, 2, -2, 3, -3];
/** When all slots in a lane are crowded, nudge the label horizontally so
 *  it doesn't stack directly on top of the previous one. */
const NUDGE_PX = 48;

function labelHalfWidth(title: string): number {
  const t = title.length > 32 ? 32 : title.length;
  return (t * LABEL_PX_PER_CHAR) / 2 + LABEL_PADDING_PX;
}

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

  type SlotMap = Record<BranchSlot, number>;
  const initial = (): SlotMap => ({
    [-3]: -Infinity, [-2]: -Infinity, [-1]: -Infinity,
    1: -Infinity, 2: -Infinity, 3: -Infinity,
  });
  const lastX: Record<LaneId, SlotMap> = LANES.reduce(
    (acc, l) => ({ ...acc, [l.id]: initial() }),
    {} as Record<LaneId, SlotMap>,
  );

  const placements: BranchPlacement[] = [];

  for (const ev of branches) {
    const lane = laneForEvent(ev);
    const laneYPx = laneY(lane, stageHeight);
    const eventX = yearToX(ev.year, ev.month);
    const halfW = labelHalfWidth(ev.title);

    // A slot is "open" when the new label's left edge clears the previous
    // label's right edge in that slot.
    let slot: BranchSlot = SLOT_ORDER[0];
    let foundOpenSlot = false;
    for (const s of SLOT_ORDER) {
      if (eventX - halfW >= lastX[lane][s]) {
        slot = s;
        foundOpenSlot = true;
        break;
      }
    }
    let labelX = eventX;
    if (!foundOpenSlot) {
      // Every slot is crowded — fall back to the LRU slot and nudge the
      // label horizontally so it doesn't stack directly on the previous
      // one in this slot.
      let best = SLOT_ORDER[0];
      let bestX = lastX[lane][best];
      for (const s of SLOT_ORDER) {
        if (lastX[lane][s] < bestX) {
          best = s;
          bestX = lastX[lane][s];
        }
      }
      slot = best;
      // Push the label to the right far enough to clear the previous one.
      labelX = Math.max(eventX, bestX + halfW + 8);
      // If that overshoots reasonable distance from the dot, fall back to
      // a fixed left-nudge so the leader stays short.
      if (labelX - eventX > NUDGE_PX * 2) labelX = eventX + NUDGE_PX;
    }
    lastX[lane][slot] = Math.max(eventX, labelX) + halfW;

    // Determine the terminal X of the branch. Active branches get a short
    // tail (not a run to the chart edge) — otherwise the right side becomes
    // a forest of parallel rails.
    const ACTIVE_TAIL_PX = 80;
    const toX = (() => {
      if (ev.fate === "pruned") return yearToX(ev.pruneYear ?? ev.year + 4);
      if (ev.fate === "active") return Math.min(totalW, eventX + ACTIVE_TAIL_PX);
      if (ev.fate === "rejoined" && ev.rejoinAt) {
        const target = coords.get(ev.rejoinAt);
        return target ? target.x : eventX + 300;
      }
      return eventX + 300;
    })();

    // Generate connected SVG path. The incoming curve forks off the parent
    // lane no more than CONNECTOR_MAX_PX before the event — this keeps
    // long-distance branches from sweeping across the entire chart.
    const CONNECTOR_MAX_PX = 160;
    let pathD = "";
    const parent = ev.branchFrom ? coords.get(ev.branchFrom) : null;
    const parentY = parent ? parent.y : trY;

    const curveStartX = Math.max(
      parent ? Math.max(parent.x, eventX - CONNECTOR_MAX_PX) : eventX - 80,
      eventX - CONNECTOR_MAX_PX,
    );
    pathD += `M ${curveStartX.toFixed(1)} ${parentY.toFixed(1)}`;
    pathD += ` C ${((curveStartX + eventX) / 2).toFixed(1)} ${parentY.toFixed(1)},`;
    pathD += ` ${((curveStartX + eventX) / 2).toFixed(1)} ${laneYPx.toFixed(1)},`;
    pathD += ` ${eventX.toFixed(1)} ${laneYPx.toFixed(1)}`;

    // Outgoing segment.
    if (ev.fate === "rejoined" && ev.rejoinAt) {
      const target = coords.get(ev.rejoinAt);
      if (target) {
        const rejoinX = target.x;
        const rejoinY = target.y;
        const runEndX = Math.max(eventX, rejoinX - 60);

        pathD += ` L ${runEndX.toFixed(1)} ${laneYPx.toFixed(1)}`;
        pathD += ` C ${((runEndX + rejoinX) / 2).toFixed(1)} ${laneYPx.toFixed(1)},`;
        pathD += ` ${((runEndX + rejoinX) / 2).toFixed(1)} ${rejoinY.toFixed(1)},`;
        pathD += ` ${rejoinX.toFixed(1)} ${rejoinY.toFixed(1)}`;
      } else {
        pathD += ` L ${toX.toFixed(1)} ${laneYPx.toFixed(1)}`;
      }
    } else {
      pathD += ` L ${toX.toFixed(1)} ${laneYPx.toFixed(1)}`;
    }

    placements.push({
      event: ev,
      lane,
      laneYPx,
      slot,
      eventX,
      labelX,
      toX,
      pathD,
    });
  }

  return placements;
}


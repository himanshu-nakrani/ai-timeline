// AI Lineage - Modern Minimalist Config.
// All magic numbers and styling tokens in one place.

export const PALETTE = {
  parchment: "#090a0f", // Deep slate background
  parchmentDeep: "#12141f", // Dark gray lane bands

  ink: "#f3f4f6", // Crisp off-white text
  inkSoft: "#9ca3af", // Muted gray text
  inkFaint: "#6b7280", // Border and rule gray

  gold: "#06b6d4", // Electric cyan for trunk core
  goldBright: "#22d3ee", // Bright cyan for hover/highlights

  // Pruned/abandoned branches.
  vermilion: "#f43f5e", // Rose

  // Active branches.
  blue: "#10b981", // Emerald
  blueBright: "#34d399",

  // Rejoined branches.
  wax: "#6366f1", // Indigo

  // Constraint branches (policy/regulation that narrows the trunk).
  amber: "#f59e0b",
  amberBright: "#fbbf24",
} as const;

export const DIMENSIONS = {
  PX_PER_YEAR: 200,
  MIN_YEAR: 1956,
  MAX_YEAR: 2026,
  STAGE_MIN_HEIGHT: 820,
  SCRUBBER_HEIGHT: 96,
  HEADER_HEIGHT: 64,
  NODE_RADIUS: 6,
  NEXUS_RADIUS: 12,
  /** Width of the sticky left rail that holds lane labels (in px). */
  LANE_RAIL_WIDTH: 168,
} as const;

/**
 * Swimlanes. Each lane is a horizontal track at an absolute Y, computed as
 * a fraction of stageHeight. The trunk sits in the middle.
 */
export type LaneId = "products" | "trunk" | "research" | "abandoned";

export interface LaneDef {
  id: LaneId;
  /** Y fraction of stageHeight. */
  y: number;
  /** Section heading drawn at the far left. */
  label: string;
  /** Smaller subtitle under the label. */
  sublabel: string;
}

/** Lanes in vertical order, top → bottom. */
export const LANES: LaneDef[] = [
  { id: "products",  y: 0.22, label: "Products",   sublabel: "DEPLOYED" },
  { id: "trunk",     y: 0.50, label: "Canonical",  sublabel: "MAINLINE" },
  { id: "research",  y: 0.70, label: "Research",   sublabel: "FOUNDATION" },
  { id: "abandoned", y: 0.88, label: "Abandoned",  sublabel: "PRUNED" },
];

/** Look up a lane by id. */
export const LANE_BY_ID: Record<LaneId, LaneDef> = LANES.reduce(
  (acc, l) => ({ ...acc, [l.id]: l }),
  {} as Record<LaneId, LaneDef>,
);

export const TIMING = {
  AUTOSCROLL_PX_PER_SEC: 90,
  CASE_FILE_OPEN_MS: 220,
  HINT_OVERLAY_KEY: "lineage-hint-dismissed-v1",
  /** sessionStorage key for remembering Lineage scroll position. */
  SCROLL_KEY: "lineage-scroll-x-v1",
} as const;

/** When Lineage mounts for the first time in a session, scroll so this
 *  year sits ~25% from the left edge — lands the user near the deep-
 *  learning inflection rather than in 1956 emptiness. */
export const INITIAL_FOCUS_YEAR = 2015;

export interface EraDef {
  id: string;
  from: number;
  /** Inclusive upper bound. */
  to: number;
  label: string;
  subtitle: string;
  /** Tint applied across the era's vertical band. Subtle by design. */
  tint: string;
}

/** Eras in chronological order. `to` is inclusive. */
export const ERAS: EraDef[] = [
  { id: "symbolic",   from: 1956, to: 1973, label: "Era 1", subtitle: "Symbolic Age",         tint: "rgba(99, 102, 241, 0.05)" },
  { id: "winter",     from: 1974, to: 1989, label: "Era 2", subtitle: "AI Winters",           tint: "rgba(244, 63, 94, 0.04)"  },
  { id: "statistical",from: 1990, to: 2005, label: "Era 3", subtitle: "Statistical Methods",  tint: "rgba(245, 158, 11, 0.04)" },
  { id: "deep",       from: 2006, to: 2016, label: "Era 4", subtitle: "Deep Learning",        tint: "rgba(16, 185, 129, 0.05)" },
  { id: "transformer",from: 2017, to: 2021, label: "Era 5", subtitle: "Transformer Era",      tint: "rgba(6, 182, 212, 0.05)"  },
  { id: "generative", from: 2022, to: 2026, label: "Era 6", subtitle: "Generative & Agentic", tint: "rgba(34, 211, 238, 0.07)" },
];

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

  // Vermilion: reserved for abandoned/pruned.
  vermilion: "#f43f5e", // Crimson/rose
  // Cinnabar: nexus accents and editorial eyebrow lines.
  cinnabar: "#fb7185",

  // Lapis — active expedition colors.
  blue: "#10b981", // Emerald green for active branches
  blueBright: "#34d399",

  // Wax-seal / rejoined markers.
  wax: "#6366f1", // Indigo
} as const;

export const DIMENSIONS = {
  PX_PER_YEAR: 140,
  MIN_YEAR: 1956,
  MAX_YEAR: 2026,
  STAGE_MIN_HEIGHT: 820,
  SCRUBBER_HEIGHT: 64,
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
export type LaneId =
  | "policy"
  | "hardware"
  | "products"
  | "trunk"
  | "research"
  | "abandoned";

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
  { id: "policy",    y: 0.16, label: "Policy",     sublabel: "REGULATION" },
  { id: "hardware",  y: 0.28, label: "Hardware",   sublabel: "COMPUTE" },
  { id: "products",  y: 0.40, label: "Products",   sublabel: "DEPLOYED" },
  { id: "trunk",     y: 0.54, label: "Canonical",  sublabel: "TRUNK" },
  { id: "research",  y: 0.68, label: "Research",   sublabel: "FOUNDATION" },
  { id: "abandoned", y: 0.84, label: "Abandoned",  sublabel: "PRUNED" },
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
} as const;

export const FLAGS = {
  // The astrolabe corner mascot. Off by default; opt in at build time with
  // NEXT_PUBLIC_SHOW_MASCOT=1 (e.g. for marketing screenshots).
  SHOW_MASCOT: process.env.NEXT_PUBLIC_SHOW_MASCOT === "1",
} as const;

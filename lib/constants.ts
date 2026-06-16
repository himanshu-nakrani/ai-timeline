// Mappa AI Mundi — illuminated cartography palette.
// All magic numbers in one place.

export const PALETTE = {
  parchment: "#EBDFBF",
  parchmentDeep: "#D9C89B",

  ink: "#2A1A0C",
  inkSoft: "#4A331E",
  // Darkened so small text on parchment clears WCAG AA (≥4.5:1).
  inkFaint: "#5E4A2A",

  gold: "#A67E14",
  goldBright: "#D9AF3A",

  // Vermilion: reserved for abandoned/pruned.
  vermilion: "#B33124",
  // Cinnabar: nexus accents and editorial eyebrow lines.
  cinnabar: "#D55A1B",

  // Lapis — navigator's ink for active expeditions.
  blue: "#264F73",
  blueBright: "#3D7AAE",

  // Wax-seal red — case file seal only.
  wax: "#7E1F1F",
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
 * a fraction of stageHeight. The trunk sits in the middle. Research is
 * directly above the trunk (the "core" lane); products / hardware / policy
 * fan further out. Abandoned routes use a dedicated lane below everything
 * else so the eye knows where to find them.
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
  /** Latin section heading drawn at the far left. */
  label: string;
  /** Smaller English subtitle under the Latin label. */
  sublabel: string;
}

/** Lanes in vertical order, top → bottom. */
export const LANES: LaneDef[] = [
  { id: "policy",    y: 0.16, label: "Lex",        sublabel: "Policy" },
  { id: "hardware",  y: 0.28, label: "Instrumenta", sublabel: "Hardware" },
  { id: "products",  y: 0.40, label: "Opera",       sublabel: "Products" },
  { id: "trunk",     y: 0.54, label: "Via Aurea",   sublabel: "Canonical" },
  { id: "research",  y: 0.68, label: "Doctrina",    sublabel: "Research" },
  { id: "abandoned", y: 0.84, label: "Dracones",    sublabel: "Abandoned" },
];

/** Look up a lane by id. */
export const LANE_BY_ID: Record<LaneId, LaneDef> = LANES.reduce(
  (acc, l) => ({ ...acc, [l.id]: l }),
  {} as Record<LaneId, LaneDef>,
);

export const TIMING = {
  AUTOSCROLL_PX_PER_SEC: 90,
  CASE_FILE_OPEN_MS: 220,
  HINT_OVERLAY_KEY: "mappa-hint-dismissed-v1",
} as const;

export const FLAGS = {
  SHOW_MASCOT: process.env.NEXT_PUBLIC_SHOW_MASCOT === "1",
} as const;

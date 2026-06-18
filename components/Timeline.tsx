"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EVENTS, type TimelineEvent } from "@/lib/events";
import { RECENT } from "@/lib/recent";
import { DIMENSIONS, PALETTE } from "@/lib/constants";
import { totalWidth, yearToX, assignBranchPlacements } from "@/lib/layout";
import { GridBackdrop } from "./GridBackdrop";
import { TrunkPath } from "./TrunkPath";
import { Branch } from "./Branch";
import { CaseFile } from "./CaseFile";
import { Scrubber } from "./Scrubber";
import { Pulse } from "./Pulse";
import { TimelineGrid } from "./TimelineGrid";
import { LaneRail } from "./LaneRail";
import { FirstRunHint } from "./FirstRunHint";
import { Legend } from "./Legend";
import { useStageHeight } from "@/lib/hooks/useStageHeight";
import { useHorizontalScroll } from "@/lib/hooks/useHorizontalScroll";
import { useDragPan } from "@/lib/hooks/useDragPan";
import { useKeyboardNav } from "@/lib/hooks/useKeyboardNav";
import { useAutoplay } from "@/lib/hooks/useAutoplay";
import { useEventDeepLink } from "@/lib/hooks/useEventDeepLink";
import { useInitialScroll } from "@/lib/hooks/useInitialScroll";

type View = "pulse" | "lineage";

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<View>("pulse");
  const [autoplay, setAutoplay] = useState(false);
  const stageHeight = useStageHeight();
  const { selectedId, select, clear } = useEventDeepLink();

  useEffect(() => {
    document.body.dataset.view = view;
    return () => {
      delete document.body.dataset.view;
    };
  }, [view]);

  // The Lineage chart includes both the curated historical events and the
  // rolling RECENT launches — Pulse and Lineage stay in sync that way.
  const allEvents = useMemo(() => [...EVENTS, ...RECENT], []);
  const sorted = useMemo(
    () => [...allEvents].sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0)),
    [allEvents],
  );
  const byId = useMemo(() => {
    const m = new Map<string, TimelineEvent>();
    for (const e of allEvents) m.set(e.id, e);
    return m;
  }, [allEvents]);
  // Every event in the merged dataset has a position on the Lineage chart,
  // so every dossier supports the "View on map" action.
  const historicalIds = useMemo(() => new Set(allEvents.map((e) => e.id)), [allEvents]);

  const trunkEvents = useMemo(() => allEvents.filter((e) => e.fate === "trunk"), [allEvents]);
  const placements = useMemo(
    () => assignBranchPlacements(allEvents, stageHeight),
    [allEvents, stageHeight],
  );

  const eventXs = useMemo(
    () => sorted.map((ev) => ({ x: yearToX(ev.year, ev.month), ev })),
    [sorted],
  );
  // Turning-point (nexus) X positions in chronological order — used by
  // the prev/next nexus quick-nav.
  const nexusXs = useMemo(
    () =>
      sorted
        .filter((ev) => ev.nexus)
        .map((ev) => ({ x: yearToX(ev.year, ev.month), id: ev.id, title: ev.title })),
    [sorted],
  );

  useHorizontalScroll(scrollRef);
  const { isDragging, recentlyPanned } = useDragPan(scrollRef);
  useInitialScroll(scrollRef, view === "lineage");
  useKeyboardNav({
    scrollRef,
    eventXs,
    hasSelection: !!selectedId,
    onCloseDossier: clear,
    onToggleAutoplay: () => setAutoplay((a) => !a),
  });
  useAutoplay({
    scrollRef,
    active: autoplay,
    paused: !!selectedId,
    onEnd: () => setAutoplay(false),
  });

  const selected = selectedId ? byId.get(selectedId) ?? null : null;

  const handleSelect = useCallback(
    (id: string) => {
      // Suppress clicks immediately after a drag-pan release.
      if (recentlyPanned()) return;
      select(id);
    },
    [recentlyPanned, select],
  );

  const handleViewOnMap = useCallback(
    (id: string) => {
      clear();
      setView("lineage");
      requestAnimationFrame(() => {
        const el = scrollRef.current;
        const ev = byId.get(id);
        if (!el || !ev) return;
        el.scrollTo({ left: yearToX(ev.year, ev.month) - 80, behavior: "smooth" });
      });
    },
    [byId, clear],
  );

  const jumpToNexus = useCallback(
    (dir: 1 | -1) => {
      const el = scrollRef.current;
      if (!el || nexusXs.length === 0) return;
      // "Current" is whichever nexus is closest to the centre of the viewport.
      const cursor = el.scrollLeft + el.clientWidth / 2;
      let target: { x: number; id: string } | undefined;
      if (dir === 1) {
        target = nexusXs.find((p) => p.x > cursor + 8);
        if (!target) target = nexusXs[nexusXs.length - 1];
      } else {
        for (let i = nexusXs.length - 1; i >= 0; i--) {
          if (nexusXs[i].x < cursor - 8) {
            target = nexusXs[i];
            break;
          }
        }
        if (!target) target = nexusXs[0];
      }
      el.scrollTo({ left: Math.max(0, target.x - el.clientWidth / 2), behavior: "smooth" });
    },
    [nexusXs],
  );

  if (view === "pulse") {
    return (
      <div className="relative z-10 min-h-screen pt-20">
        <GridBackdrop scrollRef={null} />
        <Header view={view} onView={setView} autoplay={autoplay} onAutoplay={() => setAutoplay((a) => !a)} />
        <main className="relative z-10">
          <Pulse onSelect={handleSelect} />
        </main>
        <CaseFile
          event={selected}
          onClose={clear}
          onViewOnMap={handleViewOnMap}
          canViewOnMap={!!selected && historicalIds.has(selected.id)}
        />
      </div>
    );
  }

  const width = totalWidth();

  return (
    <div className="relative z-10 h-screen w-screen overflow-hidden">
      <GridBackdrop scrollRef={scrollRef} />
      <Header
        view={view}
        onView={setView}
        autoplay={autoplay}
        onAutoplay={() => setAutoplay((a) => !a)}
        onJumpNexus={jumpToNexus}
        nexusCount={nexusXs.length}
      />

      <div
        ref={scrollRef}
        className={`hide-scrollbar absolute overflow-x-auto overflow-y-hidden ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          top: DIMENSIONS.HEADER_HEIGHT,
          bottom: DIMENSIONS.SCRUBBER_HEIGHT,
          left: 0,
          right: 0,
          paddingLeft: DIMENSIONS.LANE_RAIL_WIDTH,
        }}
        role="region"
        aria-label="Chronology of artificial intelligence, 1956 to 2026"
        tabIndex={0}
      >
        <div style={{ width, height: stageHeight, position: "relative" }}>
          <svg
            width={width}
            height={stageHeight}
            viewBox={`0 0 ${width} ${stageHeight}`}
            style={{ display: "block" }}
            aria-hidden
          >
            <TimelineGrid stageHeight={stageHeight} />
            {/* Branches first (rendered under the trunk), then the trunk on
                top. Within each group, events are already year-sorted, so
                keyboard tab order walks 1956→2026 through branches, then
                1956→2026 through trunk events. */}
            {placements.map((p) => (
              <Branch
                key={p.event.id}
                placement={p}
                onSelect={handleSelect}
              />
            ))}
            <TrunkPath stageHeight={stageHeight} trunkEvents={trunkEvents} onSelect={handleSelect} />
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none absolute"
        style={{
          top: DIMENSIONS.HEADER_HEIGHT,
          bottom: DIMENSIONS.SCRUBBER_HEIGHT,
          left: 0,
          width: DIMENSIONS.LANE_RAIL_WIDTH,
          zIndex: 20,
        }}
      >
        <LaneRail stageHeight={stageHeight} />
      </div>

      <FirstRunHint />
      <Legend />
      <Scrubber scrollRef={scrollRef} />
      <CaseFile event={selected} onClose={clear} />
    </div>
  );
}

function Header({
  view,
  onView,
  autoplay,
  onAutoplay,
  onJumpNexus,
  nexusCount = 0,
}: {
  view: View;
  onView: (v: View) => void;
  autoplay: boolean;
  onAutoplay: () => void;
  /** Step backward/forward through turning-point events. Only used in
   *  Lineage view. */
  onJumpNexus?: (dir: 1 | -1) => void;
  nexusCount?: number;
}) {
  const isLineage = view === "lineage";
  return (
    <header
      className="fixed inset-x-0 top-0 z-30"
      style={{
        height: DIMENSIONS.HEADER_HEIGHT,
        background: PALETTE.parchment,
        borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
        boxShadow: `0 4px 20px -5px rgba(0, 0, 0, 0.3)`,
      }}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <LineageMark />
          <div>
            <h1
              className="text-lg leading-none"
              style={{
                fontFamily: "var(--font-display)",
                color: PALETTE.ink,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              AI Lineage
            </h1>
            <p
              className="mt-1 text-[10px]"
              style={{
                fontFamily: "var(--font-mono)",
                color: PALETTE.inkSoft,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              What just shipped · how we got here
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLineage && onJumpNexus && nexusCount > 1 && (
            <div
              className="hidden items-center overflow-hidden rounded sm:inline-flex"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
              }}
              role="group"
              aria-label="Jump between turning points"
            >
              <NexusNavButton
                onClick={() => onJumpNexus(-1)}
                ariaLabel="Previous turning point"
                glyph="◀"
              />
              <span
                className="px-2 text-[9px] tracking-widest"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: PALETTE.inkSoft,
                  borderLeft: "1px solid rgba(255,255,255,0.12)",
                  borderRight: "1px solid rgba(255,255,255,0.12)",
                  padding: "6px 8px",
                  letterSpacing: "0.12em",
                }}
              >
                NEXUS
              </span>
              <NexusNavButton
                onClick={() => onJumpNexus(1)}
                ariaLabel="Next turning point"
                glyph="▶"
              />
            </div>
          )}
          {isLineage && (
            <ChromeButton
              onClick={onAutoplay}
              aria-label={autoplay ? "Pause guided tour" : "Begin guided tour"}
              aria-pressed={autoplay}
              glyph={autoplay ? "❚❚" : "▶"}
            >
              {autoplay ? "PAUSE" : "TOUR"}
            </ChromeButton>
          )}
          <ViewToggle view={view} onView={(v) => {
            if (isLineage && autoplay) onAutoplay();
            onView(v);
          }} />
        </div>
      </div>
    </header>
  );
}

function ViewToggle({ view, onView }: { view: View; onView: (v: View) => void }) {
  return (
    <div
      className="inline-flex overflow-hidden rounded"
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        fontFamily: "var(--font-mono)",
      }}
      role="tablist"
      aria-label="View"
    >
      <ToggleSegment
        active={view === "pulse"}
        onClick={() => onView("pulse")}
        label="PULSE"
        ariaLabel="Show recent launches"
      />
      <ToggleSegment
        active={view === "lineage"}
        onClick={() => onView("lineage")}
        label="LINEAGE"
        ariaLabel="Show the historical timeline"
      />
    </div>
  );
}

function NexusNavButton({
  onClick,
  ariaLabel,
  glyph,
}: {
  onClick: () => void;
  ariaLabel: string;
  glyph: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="focus-ring transition-colors hover:bg-[rgba(255,255,255,0.05)]"
      style={{
        fontFamily: "var(--font-mono)",
        color: PALETTE.ink,
        background: "transparent",
        border: "none",
        padding: "6px 10px",
        fontSize: 10,
        lineHeight: 1,
      }}
    >
      <span aria-hidden>{glyph}</span>
    </button>
  );
}

function ToggleSegment({
  active,
  onClick,
  label,
  ariaLabel,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="tab"
      aria-selected={active}
      aria-label={ariaLabel}
      className="focus-ring px-2.5 py-1.5 text-[10px] tracking-wider transition-colors"
      style={{
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? "#ffffff" : PALETTE.inkSoft,
        border: "none",
      }}
    >
      {label}
    </button>
  );
}

function ChromeButton({
  children,
  glyph,
  onClick,
  ...aria
}: {
  children: React.ReactNode;
  glyph: string;
  onClick: () => void;
} & React.AriaAttributes) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] tracking-wider rounded transition-colors hover:bg-[rgba(255,255,255,0.04)]"
      style={{
        border: `1px solid rgba(255, 255, 255, 0.12)`,
        color: PALETTE.ink,
        fontFamily: "var(--font-mono)",
        background: "transparent",
      }}
      {...aria}
    >
      <span aria-hidden className="text-[8px]">{glyph}</span>
      {children}
    </button>
  );
}

function LineageMark() {
  // Simple branching glyph: a cyan node with two child branches.
  return (
    <svg width="22" height="22" viewBox="-11 -11 22 22" aria-hidden>
      <circle r="10" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <line x1="-7" y1="0" x2="7" y2="0" stroke={PALETTE.gold} strokeWidth="1.4" />
      <line x1="-2" y1="0" x2="4" y2="-5" stroke={PALETTE.goldBright} strokeWidth="1.2" />
      <line x1="-2" y1="0" x2="4" y2="5" stroke={PALETTE.goldBright} strokeWidth="1.2" />
      <circle cx="-7" cy="0" r="2" fill={PALETTE.gold} />
      <circle cx="7" cy="0" r="2" fill={PALETTE.goldBright} />
    </svg>
  );
}

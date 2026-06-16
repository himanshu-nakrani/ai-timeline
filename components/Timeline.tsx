"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EVENTS, type TimelineEvent } from "@/lib/events";
import { DIMENSIONS, TIMING, PALETTE, FLAGS } from "@/lib/constants";
import { totalWidth, yearToX, assignBranchPlacements } from "@/lib/layout";
import { GridBackdrop } from "./GridBackdrop";
import { SacredTrunk } from "./SacredTrunk";
import { Branch } from "./Branch";
import { CaseFile } from "./CaseFile";
import { TempPadScrubber } from "./TempPadScrubber";
import { Astrolabe } from "./Astrolabe";
import { EventsList } from "./EventsList";
import { CartographyOrnaments } from "./CartographyOrnaments";
import { LaneRail } from "./LaneRail";
import { FirstRunHint } from "./FirstRunHint";

const DRAG_THRESHOLD_PX = 4;

/** Live stage height = viewport - header - scrubber, clamped to a minimum. */
function computeStageHeight(): number {
  if (typeof window === "undefined") return DIMENSIONS.STAGE_MIN_HEIGHT;
  const free = window.innerHeight - DIMENSIONS.HEADER_HEIGHT - DIMENSIONS.SCRUBBER_HEIGHT;
  return Math.max(DIMENSIONS.STAGE_MIN_HEIGHT, free);
}

export function Timeline() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const lastPanEndAt = useRef(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"graph" | "list">("graph");
  const [autoplay, setAutoplay] = useState(false);
  const [stageHeight, setStageHeight] = useState<number>(DIMENSIONS.STAGE_MIN_HEIGHT);

  useEffect(() => {
    document.body.dataset.view = view;
  }, [view]);

  // Live stage height: recompute on resize.
  useEffect(() => {
    const update = () => setStageHeight(computeStageHeight());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const sorted = useMemo(
    () => [...EVENTS].sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0)),
    [],
  );
  const byId = useMemo(() => {
    const m = new Map<string, TimelineEvent>();
    for (const e of EVENTS) m.set(e.id, e);
    return m;
  }, []);

  const trunkEvents = useMemo(() => EVENTS.filter((e) => e.fate === "trunk"), []);
  const placements = useMemo(
    () => assignBranchPlacements(EVENTS, stageHeight),
    [stageHeight],
  );

  // Wheel → horizontal scroll.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Drag-to-pan with a 4px threshold so brief clicks still register as clicks.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[role='button'], button, a")) return;
      dragRef.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    };
    const onMove = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.x;
      if (!d.moved && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
      d.moved = true;
      el.scrollLeft = d.left - dx;
    };
    const onUp = () => {
      if (dragRef.current?.moved) lastPanEndAt.current = performance.now();
      dragRef.current = null;
    };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const eventXs = useMemo(
    () => sorted.map((ev) => ({ x: yearToX(ev.year, ev.month), ev })),
    [sorted],
  );

  // Keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      const el = scrollRef.current;
      if (!el) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const cursor = el.scrollLeft + 80;
        let next: { x: number } | undefined;
        if (e.key === "ArrowRight") {
          next = eventXs.find((p) => p.x > cursor + 1);
        } else {
          for (let i = eventXs.length - 1; i >= 0; i--) {
            if (eventXs[i].x < cursor - 1) {
              next = eventXs[i];
              break;
            }
          }
        }
        if (next) el.scrollTo({ left: Math.max(0, next.x - 80), behavior: "smooth" });
      } else if (e.key === "Home") {
        e.preventDefault();
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        e.preventDefault();
        el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
      } else if (e.key === " ") {
        const t = target;
        const isInteractive =
          !!t &&
          (t.tagName === "BUTTON" || t.tagName === "A" || t.getAttribute("role") === "button");
        if (isInteractive) return;
        e.preventDefault();
        setAutoplay((a) => !a);
      } else if (e.key === "Escape" && selectedId) {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, eventXs]);

  // Autoplay: rAF scroll. Pauses when a dossier is open.
  useEffect(() => {
    if (!autoplay || selectedId) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      el.scrollLeft += (TIMING.AUTOSCROLL_PX_PER_SEC * dt) / 1000;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        setAutoplay(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, selectedId]);

  const selected = selectedId ? byId.get(selectedId) ?? null : null;
  const handleSelect = useCallback((id: string) => {
    // Suppress clicks that come immediately after a drag-pan release.
    if (performance.now() - lastPanEndAt.current < 200) return;
    setSelectedId(id);
  }, []);
  const handleClose = useCallback(() => setSelectedId(null), []);

  if (view === "list") {
    return (
      <div className="relative z-10 min-h-screen pb-24 pt-20">
        <GridBackdrop scrollRef={null} />
        <Header view={view} onView={setView} autoplay={autoplay} onAutoplay={() => setAutoplay((a) => !a)} />
        <main className="relative z-10">
          <EventsList events={sorted} onSelect={handleSelect} />
        </main>
        <CaseFile event={selected} onClose={handleClose} />
      </div>
    );
  }

  const width = totalWidth();

  return (
    <div className="relative z-10 h-screen w-screen overflow-hidden">
      <GridBackdrop scrollRef={scrollRef} />
      <Astrolabe visible={FLAGS.SHOW_MASCOT} />

      <Header view={view} onView={setView} autoplay={autoplay} onAutoplay={() => setAutoplay((a) => !a)} />

      {/* Visually hidden h1 for screen readers / SEO. */}
      <h1 className="sr-only">Mappa AI Mundi — A Cartography of Artificial Intelligence, 1956 to 2026</h1>

      <div
        ref={scrollRef}
        className="absolute overflow-x-auto overflow-y-hidden"
        style={{
          top: DIMENSIONS.HEADER_HEIGHT,
          bottom: DIMENSIONS.SCRUBBER_HEIGHT,
          left: 0,
          right: 0,
          cursor: "grab",
          paddingLeft: DIMENSIONS.LANE_RAIL_WIDTH,
        }}
        role="region"
        aria-label="Map of artificial intelligence, 1956 to 2026"
        tabIndex={0}
      >
        <div style={{ width, height: stageHeight, position: "relative" }}>
          <svg
            width={width}
            height={stageHeight}
            viewBox={`0 0 ${width} ${stageHeight}`}
            style={{ display: "block" }}
            role="img"
            aria-label="Map of AI advancements from 1956 to 2026"
          >
            <CartographyOrnaments stageHeight={stageHeight} />
            <SacredTrunk stageHeight={stageHeight} trunkEvents={trunkEvents} onSelect={handleSelect} />
            {placements.map((p) => (
              <Branch
                key={p.event.id}
                placement={p}
                scrollRef={scrollRef}
                onSelect={handleSelect}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Sticky lane label rail — pinned in the same vertical band as the scroller. */}
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
      <TempPadScrubber scrollRef={scrollRef} />
      <CaseFile event={selected} onClose={handleClose} />
    </div>
  );
}

function Header({
  view,
  onView,
  autoplay,
  onAutoplay,
}: {
  view: "graph" | "list";
  onView: (v: "graph" | "list") => void;
  autoplay: boolean;
  onAutoplay: () => void;
}) {
  return (
    <header
      className="fixed inset-x-0 top-0 z-30"
      style={{
        height: DIMENSIONS.HEADER_HEIGHT,
        background: PALETTE.parchment,
        borderBottom: `1px solid ${PALETTE.inkFaint}`,
        boxShadow: `0 1px 0 rgba(94, 74, 42, 0.18)`,
      }}
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <CompassRoseGlyph />
          <div>
            <div
              className="text-lg leading-none"
              style={{
                fontFamily: "var(--font-display)",
                color: PALETTE.ink,
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Mappa AI Mundi
            </div>
            <div
              className="mt-0.5 text-[10px]"
              style={{
                fontFamily: "var(--font-script)",
                color: PALETTE.inkSoft,
                letterSpacing: "0.18em",
              }}
            >
              MCMLVI — MMXXVI · A Cartography of Artificial Intelligence
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {view === "graph" && (
            <ChromeButton
              onClick={onAutoplay}
              aria-label={autoplay ? "Pause guided tour" : "Begin guided tour"}
              aria-pressed={autoplay}
              glyph={autoplay ? "❚❚" : "▶"}
            >
              {autoplay ? "PAUSE" : "TOUR"}
            </ChromeButton>
          )}
          <ChromeButton
            onClick={() => onView(view === "graph" ? "list" : "graph")}
            aria-label={view === "list" ? "Return to the map" : "Open the index"}
            aria-pressed={view === "list"}
            glyph={view === "list" ? "✦" : "≡"}
          >
            {view === "list" ? "MAP" : "INDEX"}
          </ChromeButton>
        </div>
      </div>
    </header>
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
      className="focus-ring flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] tracking-widest"
      style={{
        border: `1px solid ${PALETTE.inkSoft}`,
        color: PALETTE.ink,
        fontFamily: "var(--font-mono)",
        background: "transparent",
      }}
      {...aria}
    >
      <span aria-hidden>{glyph}</span>
      {children}
    </button>
  );
}

function CompassRoseGlyph() {
  return (
    <svg width="22" height="22" viewBox="-12 -12 24 24" aria-hidden>
      <circle r={10.5} fill="none" stroke={PALETTE.ink} strokeWidth={0.6} />
      <polygon
        points="0,-10 1.8,-1.8 10,0 1.8,1.8 0,10 -1.8,1.8 -10,0 -1.8,-1.8"
        fill={PALETTE.gold}
        stroke={PALETTE.ink}
        strokeWidth={0.6}
      />
      <circle r={1.6} fill={PALETTE.cinnabar} />
    </svg>
  );
}

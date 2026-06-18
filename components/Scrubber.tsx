"use client";

import { useEffect, useRef, useState } from "react";
import { decades, yearToX } from "@/lib/layout";
import { DIMENSIONS, PALETTE } from "@/lib/constants";

interface ScrubberProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Scrubber pinned to the bottom of the map. The playhead is draggable and
 * shows the current year while dragging. Decade chips provide quick jumps;
 * on mobile they fall to a compact wrap row.
 */
export function Scrubber({ scrollRef }: ScrubberProps) {
  const playheadRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  // Mirror hoverYear into a ref so the keyboard handler can read the latest
  // value without re-binding its listener on every mouse move.
  const hoverYearRef = useRef<number | null>(null);
  const [hoverYear, setHoverYear] = useState<number | null>(null);
  // All setHoverYear calls go through this wrapper so the ref stays in sync.
  const updateHoverYear = (y: number | null) => {
    hoverYearRef.current = y;
    setHoverYear(y);
  };

  // Sync playhead to scroll position.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let scrollMax = Math.max(1, el.scrollWidth - el.clientWidth);
    let trackWidth = trackRef.current ? trackRef.current.clientWidth - 2 : 0;
    const measure = () => {
      scrollMax = Math.max(1, el.scrollWidth - el.clientWidth);
      trackWidth = trackRef.current ? trackRef.current.clientWidth - 2 : 0;
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!playheadRef.current) return;
        const pct = el.scrollLeft / scrollMax;
        playheadRef.current.style.transform = `translate3d(${pct * trackWidth}px, 0, 0)`;
      });
    };

    const ro = new ResizeObserver(() => {
      measure();
      onScroll();
    });
    ro.observe(el);
    if (trackRef.current) ro.observe(trackRef.current);

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [scrollRef]);

  // Pointer-and-keyboard handlers for the track. Pointer for mouse/touch
  // drag-to-seek; keyboard for Arrow / Home / End accessibility.
  useEffect(() => {
    const track = trackRef.current;
    const el = scrollRef.current;
    if (!track || !el) return;

    const pctFromEvent = (clientX: number) => {
      const r = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(r.width, clientX - r.left));
      return x / Math.max(1, r.width);
    };

    const yearFromPct = (pct: number) => {
      return DIMENSIONS.MIN_YEAR + pct * (DIMENSIONS.MAX_YEAR - DIMENSIONS.MIN_YEAR);
    };

    const seekToPct = (pct: number) => {
      const scrollMax = Math.max(1, el.scrollWidth - el.clientWidth);
      el.scrollLeft = pct * scrollMax;
    };

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true;
      track.setPointerCapture(e.pointerId);
      const pct = pctFromEvent(e.clientX);
      seekToPct(pct);
      updateHoverYear(yearFromPct(pct));
    };
    const onPointerMove = (e: PointerEvent) => {
      const pct = pctFromEvent(e.clientX);
      if (draggingRef.current) {
        seekToPct(pct);
        updateHoverYear(yearFromPct(pct));
      } else {
        // Hover preview (mouse only).
        if (e.pointerType === "mouse") updateHoverYear(yearFromPct(pct));
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      draggingRef.current = false;
      track.releasePointerCapture?.(e.pointerId);
    };
    const onPointerLeave = () => {
      if (!draggingRef.current) updateHoverYear(null);
    };

    // Keyboard handler: Arrow keys nudge by one year, Shift+Arrow by 10,
    // Home/End jump to the start/end of the timeline.
    const onKey = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 1;
      const seekToYear = (year: number) => {
        const clamped = Math.max(DIMENSIONS.MIN_YEAR, Math.min(DIMENSIONS.MAX_YEAR, year));
        const scrollMax = Math.max(1, el.scrollWidth - el.clientWidth);
        const pct = (clamped - DIMENSIONS.MIN_YEAR) / (DIMENSIONS.MAX_YEAR - DIMENSIONS.MIN_YEAR);
        el.scrollLeft = pct * scrollMax;
        updateHoverYear(clamped);
      };
      const current = hoverYearRef.current ?? DIMENSIONS.MIN_YEAR;
      if (e.key === "ArrowRight") { e.preventDefault(); seekToYear(current + step); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); seekToYear(current - step); }
      else if (e.key === "Home") { e.preventDefault(); seekToYear(DIMENSIONS.MIN_YEAR); }
      else if (e.key === "End") { e.preventDefault(); seekToYear(DIMENSIONS.MAX_YEAR); }
    };
    track.addEventListener("keydown", onKey);

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", onPointerUp);
    track.addEventListener("pointercancel", onPointerUp);
    track.addEventListener("pointerleave", onPointerLeave);
    return () => {
      track.removeEventListener("keydown", onKey);
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [scrollRef]);

  const jump = (year: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = yearToX(year);
    el.scrollTo({ left: Math.max(0, target - 80), behavior: "smooth" });
  };

  const reset = () => jump(DIMENSIONS.MIN_YEAR);
  const decs = decades();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30"
      style={{
        height: DIMENSIONS.SCRUBBER_HEIGHT,
        background: PALETTE.parchment,
        borderTop: `1px solid rgba(255, 255, 255, 0.06)`,
      }}
      role="region"
      aria-label="Map scrubber"
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          onClick={reset}
          className="focus-ring flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-[10px] tracking-widest rounded transition-colors hover:bg-[rgba(255,255,255,0.05)]"
          style={{
            border: `1px solid rgba(255, 255, 255, 0.12)`,
            color: PALETTE.ink,
            fontFamily: "var(--font-mono)",
            background: "transparent",
          }}
          aria-label="Return to the start of the map"
        >
          <span aria-hidden>⟸</span>
          START
        </button>

        <div className="relative flex-1">
          {/* Year-tooltip while hovering/dragging */}
          {hoverYear != null && (
            <div
              className="pointer-events-none absolute -top-8 left-0 text-[10px] rounded"
              style={{
                transform: `translateX(${
                  // Convert year back to track-pct then to px
                  ((hoverYear - DIMENSIONS.MIN_YEAR) /
                    (DIMENSIONS.MAX_YEAR - DIMENSIONS.MIN_YEAR)) *
                  100
                }%)`,
                marginLeft: -18,
                fontFamily: "var(--font-mono)",
                color: "#ffffff",
                background: "rgba(18, 20, 31, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "3px 6px",
                letterSpacing: 1.2,
                fontWeight: 600,
              }}
              aria-hidden
            >
              {Math.round(hoverYear)}
            </div>
          )}
          <div
            ref={trackRef}
            className="relative h-7 w-full cursor-pointer touch-none"
            style={{
              background: "rgba(255, 255, 255, 0.01)",
              borderTop: `1px solid rgba(255, 255, 255, 0.06)`,
              borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
            }}
            role="slider"
            aria-label="Seek through the map by year"
            aria-valuemin={DIMENSIONS.MIN_YEAR}
            aria-valuemax={DIMENSIONS.MAX_YEAR}
            aria-valuenow={hoverYear ?? DIMENSIONS.MIN_YEAR}
            tabIndex={0}
          >
            {decs.map((d) => {
              const pct =
                ((d - DIMENSIONS.MIN_YEAR) / (DIMENSIONS.MAX_YEAR - DIMENSIONS.MIN_YEAR)) * 100;
              return (
                <div key={d} aria-hidden>
                  <div
                    className="absolute top-0 h-full w-px"
                    style={{ left: `${pct}%`, background: "rgba(255, 255, 255, 0.08)" }}
                  />
                  <div
                    className="absolute -bottom-3.5 text-[8.5px]"
                    style={{
                      left: `${pct}%`,
                      transform: "translateX(-50%)",
                      fontFamily: "var(--font-mono)",
                      color: PALETTE.inkSoft,
                      letterSpacing: 1.0,
                      fontWeight: 500,
                    }}
                  >
                    {d}
                  </div>
                </div>
              );
            })}
            <div
              ref={playheadRef}
              className="pointer-events-none absolute top-[-3px] h-[34px] w-[2px]"
              style={{
                background: PALETTE.gold,
                boxShadow: `0 0 8px ${PALETTE.goldBright}`,
                willChange: "transform",
              }}
              aria-hidden
            />
          </div>
        </div>

        <div className="hidden shrink-0 gap-1 md:flex">
          {decs.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => jump(d)}
              className="focus-ring px-2 py-1 text-[10px] tracking-wider rounded transition-colors hover:bg-[rgba(255,255,255,0.04)]"
              style={{
                fontFamily: "var(--font-mono)",
                color: PALETTE.inkSoft,
                border: `1px solid transparent`,
              }}
              aria-label={`Jump to the ${d}s`}
            >
              {String(d).slice(2)}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

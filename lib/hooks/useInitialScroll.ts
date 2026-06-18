"use client";

import { useEffect, useRef, type RefObject } from "react";
import { INITIAL_FOCUS_YEAR, TIMING } from "@/lib/constants";
import { yearToX } from "@/lib/layout";

/**
 * When the Lineage scroller first becomes available (or whenever `active`
 * flips true), restore the user's prior scroll position from
 * sessionStorage, or — on a fresh session — land near the deep-learning
 * inflection so frontier work is in-frame instead of 1956 emptiness.
 *
 * On scroll, persists the latest position back to sessionStorage so the
 * next view-toggle returns to the same place.
 */
export function useInitialScroll(
  scrollRef: RefObject<HTMLDivElement | null>,
  active: boolean,
) {
  const restoredRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    const el = scrollRef.current;
    if (!el) return;
    if (restoredRef.current) return;
    restoredRef.current = true;

    const stored = typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem(TIMING.SCROLL_KEY)
      : null;

    let targetLeft: number;
    if (stored != null) {
      targetLeft = Number(stored);
      if (!Number.isFinite(targetLeft)) targetLeft = 0;
    } else {
      // Land so INITIAL_FOCUS_YEAR sits ~25% from the left edge.
      const focusX = yearToX(INITIAL_FOCUS_YEAR);
      targetLeft = Math.max(0, focusX - el.clientWidth * 0.25);
    }
    el.scrollLeft = targetLeft;
  }, [scrollRef, active]);

  useEffect(() => {
    if (!active) return;
    const el = scrollRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (typeof sessionStorage !== "undefined") {
          sessionStorage.setItem(TIMING.SCROLL_KEY, String(el.scrollLeft));
        }
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollRef, active]);

  // Re-allow restoration the next time `active` toggles off → on.
  useEffect(() => {
    if (!active) restoredRef.current = false;
  }, [active]);
}

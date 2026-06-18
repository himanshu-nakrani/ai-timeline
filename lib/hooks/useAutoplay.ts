"use client";

import { useEffect, type RefObject } from "react";
import { TIMING } from "@/lib/constants";

interface Args {
  scrollRef: RefObject<HTMLDivElement | null>;
  active: boolean;
  paused: boolean;
  onEnd: () => void;
}

/**
 * Drives a constant-rate horizontal scroll while `active` is true. Pauses
 * for reduced-motion users (and turns itself off via onEnd). Stops at the
 * right edge.
 */
export function useAutoplay({ scrollRef, active, paused, onEnd }: Args) {
  useEffect(() => {
    if (!active || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      onEnd();
      return;
    }
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      el.scrollLeft += (TIMING.AUTOSCROLL_PX_PER_SEC * dt) / 1000;
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
        onEnd();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollRef, active, paused, onEnd]);
}

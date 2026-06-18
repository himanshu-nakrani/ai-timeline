"use client";

import { useEffect, type RefObject } from "react";

/**
 * Translate vertical wheel deltas into horizontal scroll on the given
 * element. Only kicks in when the user is clearly intending vertical motion
 * (|dy| > |dx| * 2) AND the wheel event didn't originate inside another
 * y-scrollable region (e.g. an open dossier).
 */
export function useHorizontalScroll(scrollRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) * 2) return;
      if (e.deltaY === 0) return;
      // Walk up from the target; if any ancestor (inside this element) has
      // y-overflow and is scrollable, let it consume the wheel.
      let node = e.target as HTMLElement | null;
      while (node && node !== el) {
        const s = window.getComputedStyle(node);
        const overflowY = s.overflowY;
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          node.scrollHeight > node.clientHeight
        ) {
          return;
        }
        node = node.parentElement;
      }
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollRef]);
}

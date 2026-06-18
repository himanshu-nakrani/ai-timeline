"use client";

import { useEffect, type RefObject } from "react";

interface Args {
  scrollRef: RefObject<HTMLDivElement | null>;
  eventXs: { x: number }[];
  hasSelection: boolean;
  onCloseDossier: () => void;
  onToggleAutoplay: () => void;
}

/**
 * Keyboard navigation for the map:
 *   ←/→ step between events
 *   Home/End jump to start/finish
 *   Space toggles autoplay (unless focus is on an interactive control)
 *   Esc closes an open dossier
 */
export function useKeyboardNav({
  scrollRef,
  eventXs,
  hasSelection,
  onCloseDossier,
  onToggleAutoplay,
}: Args) {
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
        onToggleAutoplay();
      } else if (e.key === "Escape" && hasSelection) {
        onCloseDossier();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollRef, eventXs, hasSelection, onCloseDossier, onToggleAutoplay]);
}

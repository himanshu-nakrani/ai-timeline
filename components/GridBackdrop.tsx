"use client";

import { useEffect, useRef } from "react";

interface GridBackdropProps {
  scrollRef: React.RefObject<HTMLDivElement | null> | null;
}

/**
 * Parchment grain backdrop. Parallaxes slightly with the map's horizontal
 * scroll when a scrollRef is provided; otherwise renders static (list view).
 */
export function GridBackdrop({ scrollRef }: GridBackdropProps) {
  const grainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scrollRef) return;
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (!grainRef.current) return;
      const x = el.scrollLeft;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (grainRef.current) {
          grainRef.current.style.transform = `translate3d(${x * 0.12}px, 0, 0)`;
        }
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [scrollRef]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={grainRef}
        className="mappa-parchment-bg absolute -left-[400px] -top-[200px] h-[calc(100%+400px)] w-[calc(100%+2400px)]"
        style={{ willChange: "transform" }}
        aria-hidden
      />
    </div>
  );
}

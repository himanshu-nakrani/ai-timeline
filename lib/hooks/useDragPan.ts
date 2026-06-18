"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const DRAG_THRESHOLD_PX = 4;
/** Window after a drag-release during which click events are suppressed,
 *  so a small involuntary drag at the end of a pan does not also open a
 *  dossier. */
export const POST_PAN_CLICK_SUPPRESS_MS = 200;

export interface DragPanState {
  isDragging: boolean;
  /** Returns true if the most recent pan released within the suppression
   *  window. Use to gate click handlers. */
  recentlyPanned: () => boolean;
}

export function useDragPan(scrollRef: RefObject<HTMLDivElement | null>): DragPanState {
  const dragRef = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const lastPanEndAt = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

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
      setIsDragging(true);
      el.scrollLeft = d.left - dx;
    };
    const onUp = () => {
      if (dragRef.current?.moved) lastPanEndAt.current = performance.now();
      dragRef.current = null;
      setIsDragging(false);
    };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [scrollRef]);

  return {
    isDragging,
    recentlyPanned: () => performance.now() - lastPanEndAt.current < POST_PAN_CLICK_SUPPRESS_MS,
  };
}

"use client";

import { useEffect, useState } from "react";
import { PALETTE, TIMING } from "@/lib/constants";

/**
 * A small parchment cartouche pinned bottom-left that explains the three
 * core interactions on first visit. Dismissed permanently via localStorage.
 */
export function FirstRunHint() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(TIMING.HINT_OVERLAY_KEY)) {
        // Defer a tick so the map paints first.
        const t = setTimeout(() => setVisible(true), 350);
        return () => clearTimeout(t);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  // Listen for Escape to dismiss, in addition to the button.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // dismiss is stable (defined below) and doesn't capture additional deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const dismiss = () => {
    try {
      localStorage.setItem(TIMING.HINT_OVERLAY_KEY, "1");
    } catch {
      // no-op
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="pointer-events-auto fixed bottom-20 right-4 z-30 max-w-xs rounded shadow-lg"
      style={{
        background: "rgba(18, 20, 31, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "14px 16px",
      }}
      role="dialog"
      aria-label="How to navigate the map"
    >
      <div
        className="text-[9px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: PALETTE.gold,
          letterSpacing: "0.12em",
          fontWeight: 700,
        }}
      >
        NAVIGATION GUIDE
      </div>
      <div
        className="mt-2 text-xs leading-relaxed"
        style={{ fontFamily: "var(--font-sans)", color: PALETTE.inkSoft }}
      >
        Scroll or drag to travel through the years. Click any event for details. Arrows step between events · Home/End jump to start/finish · Space plays the timeline.
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="focus-ring mt-3 text-[9px] tracking-wider rounded transition-colors hover:bg-[rgba(255,255,255,0.05)]"
        style={{
          fontFamily: "var(--font-mono)",
          color: PALETTE.ink,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "4px 10px",
        }}
      >
        DISMISS
      </button>
    </div>
  );
}

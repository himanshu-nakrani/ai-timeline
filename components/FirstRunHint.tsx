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
      className="pointer-events-auto fixed bottom-20 right-4 z-30 max-w-xs"
      style={{
        background: PALETTE.parchment,
        border: `1px solid ${PALETTE.ink}`,
        padding: "12px 14px",
      }}
      role="dialog"
      aria-label="How to navigate the map"
    >
      <div
        className="text-[10px]"
        style={{
          fontFamily: "var(--font-script)",
          color: PALETTE.cinnabar,
          letterSpacing: "0.22em",
          fontWeight: 600,
        }}
      >
        NOTA BENE
      </div>
      <div
        className="mt-1 text-sm leading-snug"
        style={{ fontFamily: "var(--font-display)", color: PALETTE.ink }}
      >
        Scroll horizontally to travel through the years.
        Click any landmark to read its dossier.
        Arrow keys step between events.
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="focus-ring mt-3 text-[10px] tracking-widest"
        style={{
          fontFamily: "var(--font-mono)",
          color: PALETTE.ink,
          borderBottom: `1px solid ${PALETTE.ink}`,
          paddingBottom: 1,
        }}
      >
        UNDERSTOOD
      </button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { DIMENSIONS, PALETTE } from "@/lib/constants";

interface LegendProps {
  /** Storage key prefix for collapsed state. */
  storageKey?: string;
}

interface LegendEntry {
  label: string;
  /** SVG snippet representing this state (rendered into a 28x12 viewBox). */
  swatch: React.ReactNode;
  /** One-line explanation. */
  meaning: string;
}

const ENTRIES: LegendEntry[] = [
  {
    label: "Mainline",
    meaning: "Canonical lineage — the through-line of modern AI.",
    swatch: (
      <>
        <line x1={0} y1={6} x2={28} y2={6} stroke={PALETTE.gold} strokeWidth={2.4} strokeLinecap="round" opacity={0.25} />
        <line x1={0} y1={6} x2={28} y2={6} stroke={PALETTE.gold} strokeWidth={1.6} strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Active",
    meaning: "Branch still being developed — ends in →.",
    swatch: (
      <>
        <line x1={0} y1={6} x2={20} y2={6} stroke={PALETTE.blue} strokeWidth={1.6} strokeLinecap="round" />
        <polyline points="18,3 22,6 18,9" fill="none" stroke={PALETTE.blueBright} strokeWidth={1.2} strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "Rejoined",
    meaning: "Approach absorbed into the mainline.",
    swatch: (
      <line x1={0} y1={6} x2={28} y2={6} stroke={PALETTE.wax} strokeWidth={1.6} strokeLinecap="round" />
    ),
  },
  {
    label: "Abandoned",
    meaning: "Approach dropped — ends in ×.",
    swatch: (
      <>
        <line x1={0} y1={6} x2={20} y2={6} stroke={PALETTE.vermilion} strokeWidth={1.4} strokeDasharray="3 3" />
        <line x1={18} y1={3} x2={24} y2={9} stroke={PALETTE.vermilion} strokeWidth={1.4} />
        <line x1={18} y1={9} x2={24} y2={3} stroke={PALETTE.vermilion} strokeWidth={1.4} />
      </>
    ),
  },
  {
    label: "Constraint",
    meaning: "Policy or regulation that shapes the mainline.",
    swatch: (
      <line x1={0} y1={6} x2={28} y2={6} stroke={PALETTE.amber} strokeWidth={1.6} strokeDasharray="5 3" />
    ),
  },
  {
    label: "Turning point",
    meaning: "Nexus event — pulsing ring on the mainline.",
    swatch: (
      <>
        <circle cx={14} cy={6} r={5} fill="none" stroke={PALETTE.goldBright} strokeWidth={0.8} opacity={0.5} />
        <circle cx={14} cy={6} r={2.5} fill={PALETTE.goldBright} />
      </>
    ),
  },
];

export function Legend({ storageKey = "lineage-legend-collapsed-v1" }: LegendProps) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(storageKey) === "1";
    } catch {
      return false;
    }
  });

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(storageKey, next ? "1" : "0");
      } catch {
        // no-op
      }
      return next;
    });
  };

  return (
    <div
      className="pointer-events-auto fixed right-4 z-20"
      style={{
        bottom: DIMENSIONS.SCRUBBER_HEIGHT + 12,
        background: "rgba(15, 17, 26, 0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 6,
        maxWidth: 230,
      }}
      aria-label="Legend"
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={!collapsed}
        className="focus-ring flex w-full items-center justify-between gap-2 px-3 py-2 text-left"
        style={{
          fontFamily: "var(--font-mono)",
          color: PALETTE.gold,
          fontSize: 9,
          letterSpacing: "0.14em",
          fontWeight: 700,
          background: "transparent",
          border: "none",
          borderRadius: 6,
        }}
      >
        <span>LEGEND</span>
        <span
          aria-hidden
          style={{
            color: PALETTE.inkSoft,
            fontSize: 10,
            transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 160ms ease",
          }}
        >
          ▾
        </span>
      </button>
      {!collapsed && (
        <ul className="px-3 pb-3 pt-1">
          {ENTRIES.map((e) => (
            <li key={e.label} className="flex items-start gap-2.5 py-1">
              <svg
                width={28}
                height={12}
                viewBox="0 0 28 12"
                aria-hidden
                style={{ flex: "0 0 28px", marginTop: 5 }}
              >
                {e.swatch}
              </svg>
              <div className="min-w-0">
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    color: PALETTE.ink,
                    fontSize: 11.5,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {e.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: PALETTE.inkSoft,
                    fontSize: 10.5,
                    lineHeight: 1.3,
                  }}
                >
                  {e.meaning}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

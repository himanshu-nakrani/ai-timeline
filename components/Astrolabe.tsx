"use client";

import { PALETTE } from "@/lib/constants";

/**
 * Optional cartographer's mascot: a small astrolabe in the corner.
 * Behind NEXT_PUBLIC_SHOW_MASCOT=1. Static SVG, no animation.
 */
export function Astrolabe({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      className="fixed right-5 top-20 z-20 hidden h-20 w-20 sm:block"
      aria-hidden
      style={{ pointerEvents: "none" }}
    >
      <svg viewBox="-50 -50 100 100" className="h-full w-full">
        {/* Outer brass ring */}
        <circle r="46" fill={PALETTE.parchmentDeep} stroke={PALETTE.ink} strokeWidth={1.2} />
        <circle r="46" fill="none" stroke={PALETTE.gold} strokeWidth={0.8} />
        {/* Tick marks every 30° */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = Math.cos(a) * 38;
          const y1 = Math.sin(a) * 38;
          const x2 = Math.cos(a) * 46;
          const y2 = Math.sin(a) * 46;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={PALETTE.ink}
              strokeWidth={0.8}
            />
          );
        })}
        {/* Cross hairs */}
        <line x1="-40" y1="0" x2="40" y2="0" stroke={PALETTE.inkSoft} strokeWidth={0.6} />
        <line x1="0" y1="-40" x2="0" y2="40" stroke={PALETTE.inkSoft} strokeWidth={0.6} />
        {/* Alidade (the rotating arm of an astrolabe) */}
        <line
          x1="-30"
          y1="-18"
          x2="30"
          y2="18"
          stroke={PALETTE.ink}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
        {/* Inner gilded disc */}
        <circle r="14" fill={PALETTE.gold} stroke={PALETTE.ink} strokeWidth={0.8} />
        <circle r="3" fill={PALETTE.vermilion} stroke={PALETTE.ink} strokeWidth={0.6} />
        {/* Suspension ring at top */}
        <circle cx="0" cy="-52" r="4" fill="none" stroke={PALETTE.ink} strokeWidth={1.2} />
      </svg>
    </div>
  );
}

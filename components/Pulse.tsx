"use client";

import { useMemo, useState } from "react";
import { RECENT } from "@/lib/recent";
import type { Family, TimelineEvent } from "@/lib/events";
import { PALETTE } from "@/lib/constants";

interface PulseProps {
  onSelect: (id: string) => void;
  /** Reference date for "X days ago" math. Defaults to today; injectable
   *  for testing. */
  now?: Date;
}

const WINDOWS: { id: WindowId; label: string; days: number | null }[] = [
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
  { id: "all", label: "All", days: null },
];
type WindowId = "7d" | "30d" | "90d" | "all";

const FAMILY_LABEL: Record<Family, string> = {
  llm: "LLM",
  "image-video": "Image / Video",
  agent: "Agents",
  coding: "Coding",
  robotics: "Robotics",
  infra: "Infra",
  hardware: "Hardware",
  policy: "Policy",
  research: "Research",
};

const FAMILY_COLOR: Record<Family, string> = {
  llm: PALETTE.gold,
  "image-video": PALETTE.amber,
  agent: PALETTE.blueBright,
  coding: PALETTE.blue,
  robotics: PALETTE.amberBright,
  infra: PALETTE.wax,
  hardware: PALETTE.amberBright,
  policy: PALETTE.vermilion,
  research: PALETTE.inkSoft,
};

function eventDate(ev: TimelineEvent): Date {
  return new Date(ev.year, (ev.month ?? 1) - 1, ev.day ?? 1);
}

function daysAgo(d: Date, now: Date): number {
  return Math.max(0, Math.floor((now.getTime() - d.getTime()) / 86_400_000));
}

function relativeLabel(d: Date, now: Date): string {
  const days = daysAgo(d, now);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 60) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function Pulse({ onSelect, now = new Date() }: PulseProps) {
  const [windowId, setWindowId] = useState<WindowId>("30d");
  const [families, setFamilies] = useState<Set<Family>>(new Set());
  const [labs, setLabs] = useState<Set<string>>(new Set());

  const win = WINDOWS.find((w) => w.id === windowId)!;

  const inWindow = useMemo(() => {
    if (win.days === null) return RECENT;
    const cutoff = new Date(now.getTime() - win.days * 86_400_000);
    return RECENT.filter((ev) => eventDate(ev) >= cutoff);
  }, [win, now]);

  const availableFamilies = useMemo(() => {
    const s = new Set<Family>();
    for (const ev of inWindow) if (ev.family) s.add(ev.family);
    return Array.from(s).sort();
  }, [inWindow]);

  const availableLabs = useMemo(() => {
    const s = new Set<string>();
    for (const ev of inWindow) if (ev.lab) s.add(ev.lab);
    return Array.from(s).sort();
  }, [inWindow]);

  const filtered = useMemo(() => {
    return inWindow
      .filter((ev) => (families.size === 0 || (ev.family && families.has(ev.family))))
      .filter((ev) => (labs.size === 0 || (ev.lab && labs.has(ev.lab))))
      .sort((a, b) => {
        // Primary: date desc (newer first). Secondary: buzz desc.
        const da = eventDate(a).getTime();
        const db = eventDate(b).getTime();
        if (db !== da) return db - da;
        return (b.buzz ?? 0) - (a.buzz ?? 0);
      });
  }, [inWindow, families, labs]);

  const toggleFamily = (f: Family) => {
    setFamilies((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f);
      else next.add(f);
      return next;
    });
  };
  const toggleLab = (l: string) => {
    setLabs((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <header className="mb-8">
        <div
          style={{
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.15em",
            color: PALETTE.gold,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          PULSE · WHAT JUST SHIPPED
        </div>
        <h1
          className="mt-2"
          style={{
            fontFamily: "var(--font-display)",
            color: PALETTE.ink,
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          {filtered.length} launches
          <span style={{ color: PALETTE.inkSoft, fontWeight: 500 }}>
            {" "}in the last {win.days === null ? "all-time" : `${win.days} days`}
          </span>
        </h1>
        <p
          className="mt-2 max-w-2xl"
          style={{
            fontFamily: "var(--font-sans)",
            color: PALETTE.inkSoft,
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          The AI industry ships something noteworthy almost every week. This view collects what's
          out, grouped by family and lab, sorted by recency. Open any card for the full dossier.
          Switch to <strong style={{ color: PALETTE.ink }}>Lineage</strong> to see how today
          connects to seventy years of history.
        </p>
      </header>

      {/* Window pills */}
      <div
        className="mb-4 flex flex-wrap items-center gap-1.5 border-y py-3"
        style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
      >
        <span
          className="mr-2 text-[10px]"
          style={{
            fontFamily: "var(--font-mono)",
            color: PALETTE.inkSoft,
            letterSpacing: "0.12em",
          }}
        >
          WINDOW
        </span>
        {WINDOWS.map((w) => (
          <Chip
            key={w.id}
            active={windowId === w.id}
            onClick={() => setWindowId(w.id)}
            label={w.label}
          />
        ))}
      </div>

      {/* Family filter */}
      {availableFamilies.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span
            className="mr-2 text-[10px]"
            style={{
              fontFamily: "var(--font-mono)",
              color: PALETTE.inkSoft,
              letterSpacing: "0.12em",
            }}
          >
            FAMILY
          </span>
          {availableFamilies.map((f) => (
            <Chip
              key={f}
              active={families.has(f)}
              onClick={() => toggleFamily(f)}
              label={FAMILY_LABEL[f]}
              dotColor={FAMILY_COLOR[f]}
            />
          ))}
        </div>
      )}

      {/* Lab filter */}
      {availableLabs.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-1.5">
          <span
            className="mr-2 text-[10px]"
            style={{
              fontFamily: "var(--font-mono)",
              color: PALETTE.inkSoft,
              letterSpacing: "0.12em",
            }}
          >
            LAB
          </span>
          {availableLabs.map((l) => (
            <Chip
              key={l}
              active={labs.has(l)}
              onClick={() => toggleLab(l)}
              label={l}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div
          className="py-20 text-center"
          style={{ fontFamily: "var(--font-mono)", color: PALETTE.inkSoft, fontSize: 13 }}
        >
          Nothing matches those filters. Try widening the window.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ev) => (
            <li key={ev.id}>
              <PulseCard ev={ev} now={now} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PulseCard({
  ev,
  now,
  onSelect,
}: {
  ev: TimelineEvent;
  now: Date;
  onSelect: (id: string) => void;
}) {
  const d = eventDate(ev);
  const familyColor = ev.family ? FAMILY_COLOR[ev.family] : PALETTE.inkSoft;
  const familyLabel = ev.family ? FAMILY_LABEL[ev.family] : null;
  const buzz = ev.buzz ?? 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(ev.id)}
      className="focus-ring group flex h-full w-full flex-col items-start gap-3 rounded p-4 text-left transition-all"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
      }}
      aria-label={`${ev.title} — ${ev.lab ?? "Unknown"} — ${relativeLabel(d, now)}`}
    >
      {/* Top row: family chip + date */}
      <div className="flex w-full items-center justify-between">
        {familyLabel ? (
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: familyColor }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                color: PALETTE.inkSoft,
                letterSpacing: "0.1em",
                fontSize: 9,
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {familyLabel}
            </span>
          </span>
        ) : (
          <span />
        )}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            color: PALETTE.inkFaint,
            fontSize: 10,
            letterSpacing: "0.05em",
          }}
        >
          {relativeLabel(d, now)}
        </span>
      </div>

      <div className="w-full">
        <div
          style={{
            fontFamily: "var(--font-display)",
            color: PALETTE.ink,
            fontSize: 17,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {ev.title}
        </div>
        {ev.lab && (
          <div
            className="mt-1"
            style={{
              fontFamily: "var(--font-mono)",
              color: PALETTE.inkSoft,
              fontSize: 10.5,
              letterSpacing: "0.06em",
            }}
          >
            {ev.lab}
          </div>
        )}
      </div>

      <p
        className="line-clamp-3"
        style={{
          fontFamily: "var(--font-sans)",
          color: PALETTE.inkSoft,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {ev.shortDescription}
      </p>

      {/* Buzz bar */}
      <div className="mt-auto w-full pt-2">
        <div
          className="relative h-1 w-full overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
          aria-hidden
        >
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${Math.max(4, buzz)}%`,
              background: familyColor,
              opacity: 0.75,
            }}
          />
        </div>
        <div
          className="mt-1.5 flex items-center justify-between"
          style={{
            fontFamily: "var(--font-mono)",
            color: PALETTE.inkFaint,
            fontSize: 9,
            letterSpacing: "0.08em",
          }}
        >
          <span>BUZZ</span>
          <span>{buzz}</span>
        </div>
      </div>
    </button>
  );
}

function Chip({
  active,
  onClick,
  label,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="focus-ring inline-flex items-center gap-1.5 rounded px-2.5 py-1 transition-all"
      style={{
        fontFamily: "var(--font-mono)",
        color: active ? "#ffffff" : PALETTE.inkSoft,
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        border: active
          ? "1px solid rgba(255,255,255,0.25)"
          : "1px solid rgba(255,255,255,0.10)",
        fontSize: 10,
        letterSpacing: "0.06em",
      }}
    >
      {dotColor && (
        <span
          aria-hidden
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: dotColor }}
        />
      )}
      {label}
    </button>
  );
}

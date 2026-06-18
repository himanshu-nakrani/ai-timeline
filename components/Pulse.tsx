"use client";

import { useMemo, useState } from "react";
import { RECENT } from "@/lib/recent";
import type { Family, TimelineEvent } from "@/lib/events";
import { PALETTE } from "@/lib/constants";

interface PulseProps {
  onSelect: (id: string) => void;
  /** Reference date for "X days ago" math. Defaults to today. */
  now?: Date;
}

type WindowId = "7d" | "30d" | "90d" | "all";

const WINDOWS: { id: WindowId; label: string; days: number | null }[] = [
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
  { id: "all", label: "All", days: null },
];

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
        const da = eventDate(a).getTime();
        const db = eventDate(b).getTime();
        if (db !== da) return db - da;
        return (b.buzz ?? 0) - (a.buzz ?? 0);
      });
  }, [inWindow, families, labs]);

  // Hero strip = the top 3 buzz items in the window (no filters applied
  // so the strip stays stable as users toggle chips).
  const hero = useMemo(() => {
    return [...inWindow]
      .sort((a, b) => (b.buzz ?? 0) - (a.buzz ?? 0))
      .slice(0, 3);
  }, [inWindow]);

  // Stats summary
  const stats = useMemo(() => {
    const labsCount = new Set(filtered.map((e) => e.lab).filter(Boolean)).size;
    const famsCount = new Set(filtered.map((e) => e.family).filter(Boolean)).size;
    const last7 = filtered.filter((e) => daysAgo(eventDate(e), now) < 7).length;
    return { total: filtered.length, labs: labsCount, families: famsCount, last7 };
  }, [filtered, now]);

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

  const anyFilters = families.size > 0 || labs.size > 0;
  const clearFilters = () => {
    setFamilies(new Set());
    setLabs(new Set());
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8 sm:py-14">
      <Hero stats={stats} win={win} hero={hero} now={now} onSelect={onSelect} />

      {/* Filter bar */}
      <div className="sticky top-16 z-10 -mx-4 mt-12 mb-8 backdrop-blur-md px-4 py-4 sm:-mx-8 sm:px-8"
        style={{
          background: "rgba(9, 10, 15, 0.78)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <FilterRow label="WINDOW">
            {WINDOWS.map((w) => (
              <Chip
                key={w.id}
                active={windowId === w.id}
                onClick={() => setWindowId(w.id)}
                label={w.label}
              />
            ))}
          </FilterRow>

          {availableFamilies.length > 0 && (
            <FilterRow label="FAMILY">
              {availableFamilies.map((f) => (
                <Chip
                  key={f}
                  active={families.has(f)}
                  onClick={() => toggleFamily(f)}
                  label={FAMILY_LABEL[f]}
                  dotColor={FAMILY_COLOR[f]}
                />
              ))}
            </FilterRow>
          )}

          {availableLabs.length > 0 && (
            <FilterRow label="LAB">
              {availableLabs.map((l) => (
                <Chip
                  key={l}
                  active={labs.has(l)}
                  onClick={() => toggleLab(l)}
                  label={l}
                />
              ))}
            </FilterRow>
          )}

          {anyFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="focus-ring ml-auto text-[10px]"
              style={{
                fontFamily: "var(--font-mono)",
                color: PALETTE.inkSoft,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.10)",
                padding: "4px 10px",
                borderRadius: 4,
                letterSpacing: "0.1em",
              }}
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="py-20 text-center"
          style={{ fontFamily: "var(--font-mono)", color: PALETTE.inkSoft, fontSize: 13 }}
        >
          Nothing matches those filters. Try widening the window.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ev, i) => (
            <li
              key={ev.id}
              style={{
                animation: `pulse-card-in 360ms cubic-bezier(0.2, 0.8, 0.2, 1) ${Math.min(i * 24, 280)}ms both`,
              }}
            >
              <PulseCard ev={ev} now={now} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Hero({
  stats,
  win,
  hero,
  now,
  onSelect,
}: {
  stats: { total: number; labs: number; families: number; last7: number };
  win: (typeof WINDOWS)[number];
  hero: TimelineEvent[];
  now: Date;
  onSelect: (id: string) => void;
}) {
  return (
    <header className="relative">
      <div
        style={{
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.18em",
          color: PALETTE.gold,
          fontSize: 11,
          fontWeight: 700,
        }}
      >
        ● LIVE · PULSE
      </div>
      <h1
        className="mt-3"
        style={{
          fontFamily: "var(--font-display)",
          color: PALETTE.ink,
          fontSize: "clamp(36px, 6vw, 64px)",
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
        }}
      >
        What just shipped in AI
      </h1>
      <p
        className="mt-4 max-w-2xl"
        style={{
          fontFamily: "var(--font-sans)",
          color: PALETTE.inkSoft,
          fontSize: 16,
          lineHeight: 1.55,
        }}
      >
        The industry releases something noteworthy almost every week. This is the curated firehose,
        grouped by family and lab, sorted by recency. Switch to{" "}
        <strong style={{ color: PALETTE.ink }}>Lineage</strong> for the seventy-year arc that got us
        here.
      </p>

      {/* Stat row */}
      <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
        <Stat label="LAUNCHES" value={String(stats.total)} sub={`in ${win.days === null ? "all" : win.days + "d"}`} />
        <Stat label="LABS" value={String(stats.labs)} sub="shipping" />
        <Stat label="FAMILIES" value={String(stats.families)} sub="covered" />
        <Stat label="THIS WEEK" value={String(stats.last7)} sub="new" emphasize />
      </div>

      {/* Hero strip */}
      {hero.length > 0 && (
        <div className="mt-10">
          <div
            className="mb-3 flex items-center gap-2 text-[10px]"
            style={{
              fontFamily: "var(--font-mono)",
              color: PALETTE.inkSoft,
              letterSpacing: "0.14em",
              fontWeight: 700,
            }}
          >
            <span
              aria-hidden
              style={{
                background: PALETTE.gold,
                width: 24,
                height: 1,
                display: "inline-block",
              }}
            />
            TOP OF MIND
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {hero.map((ev) => (
              <HeroCard key={ev.id} ev={ev} now={now} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Stat({
  label,
  value,
  sub,
  emphasize,
}: {
  label: string;
  value: string;
  sub: string;
  emphasize?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <div
        style={{
          fontFamily: "var(--font-display)",
          color: emphasize ? PALETTE.goldBright : PALETTE.ink,
          fontSize: 30,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        className="mt-1 flex items-baseline gap-1.5"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.14em",
          fontWeight: 700,
        }}
      >
        <span style={{ color: PALETTE.inkSoft }}>{label}</span>
        <span style={{ color: PALETTE.inkFaint, fontWeight: 500 }}>{sub}</span>
      </div>
    </div>
  );
}

function HeroCard({
  ev,
  now,
  onSelect,
}: {
  ev: TimelineEvent;
  now: Date;
  onSelect: (id: string) => void;
}) {
  const family = ev.family ?? "llm";
  const color = FAMILY_COLOR[family];
  const isNew = daysAgo(eventDate(ev), now) < 7;
  return (
    <button
      type="button"
      onClick={() => onSelect(ev.id)}
      className="focus-ring group relative flex h-full w-full flex-col overflow-hidden rounded text-left transition-all"
      style={{
        background: `linear-gradient(135deg, ${color}1a 0%, rgba(255,255,255,0.02) 65%)`,
        border: `1px solid ${color}33`,
        padding: "16px 18px",
        minHeight: 152,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}88`;
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}33`;
        e.currentTarget.style.transform = "translateY(0)";
      }}
      aria-label={`${ev.title} — ${ev.lab ?? ""} — ${relativeLabel(eventDate(ev), now)}`}
    >
      <div className="flex items-center justify-between">
        <span
          className="flex items-center gap-1.5"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            letterSpacing: "0.14em",
            color,
            fontWeight: 700,
          }}
        >
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
          {(ev.lab ?? "").toUpperCase()}
        </span>
        {isNew && <NewPill color={color} />}
      </div>
      <div
        className="mt-3"
        style={{
          fontFamily: "var(--font-display)",
          color: PALETTE.ink,
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: "-0.01em",
        }}
      >
        {ev.title}
      </div>
      <p
        className="mt-2 line-clamp-2"
        style={{
          fontFamily: "var(--font-sans)",
          color: PALETTE.inkSoft,
          fontSize: 13,
          lineHeight: 1.45,
        }}
      >
        {ev.shortDescription}
      </p>
      <div
        className="mt-auto flex items-center justify-between pt-3"
        style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: PALETTE.inkFaint }}
      >
        <span style={{ letterSpacing: "0.05em" }}>{relativeLabel(eventDate(ev), now)}</span>
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden
            className="inline-block"
            style={{
              width: 26,
              height: 3,
              background: `linear-gradient(to right, ${color} ${ev.buzz ?? 0}%, rgba(255,255,255,0.08) ${ev.buzz ?? 0}%)`,
              borderRadius: 2,
            }}
          />
          <span style={{ color: PALETTE.inkSoft, letterSpacing: "0.08em" }}>BUZZ {ev.buzz ?? 0}</span>
        </span>
      </div>
    </button>
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
  const family = ev.family ?? "llm";
  const color = FAMILY_COLOR[family];
  const familyLabel = ev.family ? FAMILY_LABEL[ev.family] : null;
  const buzz = ev.buzz ?? 0;
  const isNew = daysAgo(eventDate(ev), now) < 7;
  const isHot = buzz >= 85;
  return (
    <button
      type="button"
      onClick={() => onSelect(ev.id)}
      className="focus-ring group relative flex h-full w-full flex-col items-start overflow-hidden rounded text-left transition-all"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: isHot ? `0 0 0 1px ${color}22, 0 0 24px -8px ${color}66` : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}88`;
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
      aria-label={`${ev.title} — ${ev.lab ?? ""} — ${relativeLabel(eventDate(ev), now)}`}
    >
      {/* Top accent stripe — family color, full-width */}
      <span
        aria-hidden
        className="absolute left-0 right-0 top-0"
        style={{ height: 2, background: color, opacity: 0.75 }}
      />

      <div className="flex w-full items-center justify-between px-4 pt-4">
        {familyLabel ? (
          <span
            className="flex items-center gap-1.5"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.14em",
              color,
              fontWeight: 700,
            }}
          >
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
            {familyLabel.toUpperCase()}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1.5">
          {isNew && <NewPill color={color} />}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              color: PALETTE.inkFaint,
              fontSize: 10,
              letterSpacing: "0.05em",
            }}
          >
            {relativeLabel(eventDate(ev), now)}
          </span>
        </div>
      </div>

      <div className="px-4 pt-3">
        {ev.lab && (
          <div
            style={{
              fontFamily: "var(--font-mono)",
              color: PALETTE.inkSoft,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {ev.lab}
          </div>
        )}
        <div
          className="mt-1"
          style={{
            fontFamily: "var(--font-display)",
            color: PALETTE.ink,
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.005em",
          }}
        >
          {ev.title}
        </div>
      </div>

      <p
        className="line-clamp-3 px-4 pt-2"
        style={{
          fontFamily: "var(--font-sans)",
          color: PALETTE.inkSoft,
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        {ev.shortDescription}
      </p>

      <div className="mt-auto w-full px-4 pb-4 pt-4">
        <div
          className="relative h-1 w-full overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
          aria-hidden
        >
          <div
            className="absolute inset-y-0 left-0"
            style={{
              width: `${Math.max(4, buzz)}%`,
              background: color,
              opacity: 0.85,
              boxShadow: isHot ? `0 0 8px ${color}` : "none",
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
          <span style={{ color: isHot ? color : PALETTE.inkFaint, fontWeight: 700 }}>
            {buzz}
            {isHot && <span aria-hidden> ·  HOT</span>}
          </span>
        </div>
      </div>
    </button>
  );
}

function NewPill({ color }: { color: string }) {
  return (
    <span
      aria-label="New this week"
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 8.5,
        letterSpacing: "0.18em",
        color: "#0a0b10",
        background: color,
        padding: "2px 6px",
        borderRadius: 3,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      NEW
    </span>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className="mr-1 text-[10px]"
        style={{
          fontFamily: "var(--font-mono)",
          color: PALETTE.inkSoft,
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </span>
      {children}
    </div>
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
      className="focus-ring inline-flex items-center gap-1.5 rounded transition-all"
      style={{
        fontFamily: "var(--font-mono)",
        color: active ? "#ffffff" : PALETTE.inkSoft,
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        border: active
          ? "1px solid rgba(255,255,255,0.25)"
          : "1px solid rgba(255,255,255,0.10)",
        fontSize: 10,
        letterSpacing: "0.06em",
        padding: "4px 10px",
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

"use client";

import { useMemo, useState } from "react";
import type { BranchFate, TimelineEvent } from "@/lib/events";
import { PALETTE } from "@/lib/constants";

type FateFilter = BranchFate | "all";

const FATE_COLOR: Record<TimelineEvent["fate"], string> = {
  trunk: PALETTE.gold,
  active: PALETTE.blue,
  rejoined: PALETTE.inkSoft,
  pruned: PALETTE.vermilion,
  constrains: PALETTE.wax,
};

const FATE_LABEL: Record<TimelineEvent["fate"], string> = {
  trunk: "Canonical",
  active: "Active",
  rejoined: "Returned",
  pruned: "Abandoned",
  constrains: "Constraint",
};

// "Pars" headers per era. Picked editorially — these are the chapters of
// AI history that experienced readers tend to recognise.
const ERAS: { from: number; to: number; label: string; subtitle: string }[] = [
  { from: 1956, to: 1969, label: "Pars I", subtitle: "The Symbolic Age" },
  { from: 1970, to: 1989, label: "Pars II", subtitle: "Winters and Expert Systems" },
  { from: 1990, to: 2005, label: "Pars III", subtitle: "Statistical Foundations" },
  { from: 2006, to: 2016, label: "Pars IV", subtitle: "Deep Learning Arrives" },
  { from: 2017, to: 2021, label: "Pars V", subtitle: "The Transformer Era" },
  { from: 2022, to: 2026, label: "Pars VI", subtitle: "Generative & Agentic AI" },
];

function eraOf(year: number) {
  return ERAS.find((e) => year >= e.from && year <= e.to) ?? ERAS[ERAS.length - 1];
}

export function EventsList({
  events,
  onSelect,
}: {
  events: TimelineEvent[];
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<FateFilter>("all");

  const filtered = useMemo(
    () => (filter === "all" ? events : events.filter((e) => e.fate === filter)),
    [events, filter],
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, { era: (typeof ERAS)[number]; items: TimelineEvent[] }>();
    for (const ev of filtered) {
      const era = eraOf(ev.year);
      const key = `${era.from}`;
      if (!groups.has(key)) groups.set(key, { era, items: [] });
      groups.get(key)!.items.push(ev);
    }
    return Array.from(groups.values());
  }, [filtered]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
      <header className="mb-10 text-center">
        <div
          style={{
            fontFamily: "var(--font-script)",
            letterSpacing: "0.22em",
            color: PALETTE.cinnabar,
            fontSize: 12,
          }}
        >
          INDEX REGIONUM
        </div>
        <h1
          className="mt-2"
          style={{
            fontFamily: "var(--font-display)",
            color: PALETTE.ink,
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.05,
          }}
        >
          The Cartographer&rsquo;s Index
        </h1>
        <div
          className="mt-1 italic"
          style={{ fontFamily: "var(--font-script)", color: PALETTE.inkFaint }}
        >
          Every landmark on the map, grouped by era.
        </div>
        <div aria-hidden className="mx-auto mt-5 h-px w-32" style={{ background: PALETTE.inkSoft }} />
      </header>

      {/* Legend + filter row */}
      <div
        className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y py-3"
        style={{ borderColor: PALETTE.inkSoft }}
      >
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          {(Object.keys(FATE_LABEL) as (keyof typeof FATE_LABEL)[]).map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-3 w-3"
                style={{
                  background: FATE_COLOR[k],
                  border: `1px solid ${PALETTE.ink}`,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  color: PALETTE.ink,
                  letterSpacing: "0.08em",
                }}
              >
                {FATE_LABEL[k]}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["all", "trunk", "active", "rejoined", "pruned", "constrains"] as FateFilter[]).map(
            (k) => {
              const active = filter === k;
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  className="focus-ring px-2 py-1 text-[10px] tracking-widest"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: active ? PALETTE.parchment : PALETTE.ink,
                    background: active ? PALETTE.ink : "transparent",
                    border: `1px solid ${PALETTE.ink}`,
                  }}
                  aria-pressed={active}
                >
                  {k === "all" ? "ALL" : FATE_LABEL[k as BranchFate].toUpperCase()}
                </button>
              );
            },
          )}
        </div>
      </div>

      {grouped.length === 0 && (
        <div
          className="py-16 text-center"
          style={{ fontFamily: "var(--font-script)", color: PALETTE.inkFaint }}
        >
          No landmarks of this kind.
        </div>
      )}

      {grouped.map(({ era, items }) => (
        <section key={era.from} className="mb-12">
          <div className="mb-4 flex items-baseline gap-4 border-b pb-1.5" style={{ borderColor: PALETTE.inkSoft }}>
            <div
              style={{
                fontFamily: "var(--font-script)",
                letterSpacing: "0.22em",
                color: PALETTE.cinnabar,
                fontSize: 12,
              }}
            >
              {era.label.toUpperCase()}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                color: PALETTE.ink,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {era.subtitle}
            </h2>
            <div
              className="ml-auto text-[10px]"
              style={{ fontFamily: "var(--font-mono)", color: PALETTE.inkFaint, letterSpacing: 1.2 }}
            >
              {era.from}–{era.to} · {items.length} {items.length === 1 ? "entry" : "entries"}
            </div>
          </div>

          <ol className="space-y-2">
            {items.map((ev) => (
              <li key={ev.id}>
                <button
                  type="button"
                  onClick={() => onSelect(ev.id)}
                  aria-label={`Open dossier: ${ev.title} (${ev.year})`}
                  className="focus-ring group flex w-full items-start gap-4 px-3 py-3 text-left"
                  style={{
                    border: `1px solid ${PALETTE.inkFaint}`,
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = PALETTE.ink)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = PALETTE.inkFaint)}
                >
                  <div className="flex w-16 shrink-0 flex-col items-start">
                    <span
                      style={{
                        fontFamily: "var(--font-script)",
                        color: PALETTE.inkSoft,
                        letterSpacing: 2,
                        fontSize: 14,
                      }}
                    >
                      {ev.year}
                    </span>
                    <span
                      aria-hidden
                      className="mt-1.5 inline-block h-2.5 w-2.5"
                      style={{
                        background: FATE_COLOR[ev.fate],
                        border: `1px solid ${PALETTE.ink}`,
                      }}
                      title={FATE_LABEL[ev.fate]}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        color: PALETTE.ink,
                        fontSize: 18,
                        fontWeight: 600,
                        lineHeight: 1.2,
                      }}
                    >
                      {ev.title}
                    </div>
                    <div
                      className="mt-1"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: PALETTE.inkSoft,
                        fontSize: 14.5,
                        lineHeight: 1.4,
                      }}
                    >
                      {ev.shortDescription}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}

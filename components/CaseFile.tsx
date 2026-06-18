"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { BranchFate, TimelineEvent } from "@/lib/events";
import { EVENTS } from "@/lib/events";
import { PALETTE } from "@/lib/constants";

interface CaseFileProps {
  event: TimelineEvent | null;
  onClose: () => void;
  /** Called from the "View on map" action — close the dossier and navigate
   *  to the event in the graph view. Only wired in list context. */
  onViewOnMap?: (id: string) => void;
  /** True when the host is currently in list view, so the "View on map"
   *  action is shown. */
  canViewOnMap?: boolean;
}

const FATE_LABEL: Record<BranchFate, string> = {
  trunk: "Canonical · on the mainline",
  active: "Active · still developing",
  rejoined: "Rejoined · absorbed into the mainline",
  pruned: "Abandoned · approach was dropped",
  constrains: "Constraint · shapes the trajectory",
};

const CATEGORY_LABEL: Record<TimelineEvent["category"], string> = {
  foundational: "Foundational breakthrough",
  product: "Product or deployed model",
  abandoned: "Abandoned approach",
  policy: "Policy or regulation",
  hardware: "Hardware leap",
};

const FATE_TAG: Record<BranchFate, string> = {
  trunk: "MAINLINE",
  active: "ACTIVE",
  rejoined: "REJOINED",
  pruned: "ABANDONED",
  constrains: "CONSTRAINT",
};

const MONTH = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CaseFile({ event, onClose, onViewOnMap, canViewOnMap }: CaseFileProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  // Defer unmount so the CSS exit animation can play.
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (event) {
      setMounted(true);
      setClosing(false);
    } else if (mounted) {
      setClosing(true);
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [event, mounted]);

  useEffect(() => {
    if (!mounted || !event) return;
    prevFocusRef.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevFocusRef.current?.focus?.();
    };
  }, [mounted, event, onClose]);

  useLayoutEffect(() => {
    if (!event) return;
    titleRef.current?.focus();
  }, [event]);

  const lookupTitle = (id?: string) => {
    if (!id) return undefined;
    return EVENTS.find((e) => e.id === id)?.title;
  };

  if (!mounted || !event) return null;

  const animClass = closing ? "case-anim-out" : "case-anim-in";

  return (
    <>
      <div
        className={`case-backdrop ${animClass}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-file-title"
        className={`case-paper case-panel ${animClass}`}
      >
        <div className="mx-auto max-w-4xl px-6 py-8 sm:px-12 sm:py-10">
          <div className="flex items-start justify-between gap-8">
            <div className="flex-1">
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.15em",
                  color: PALETTE.gold,
                  fontSize: 10,
                  fontWeight: 600,
                }}
              >
                AI CHRONOLOGY · {event.variantDesignation}
              </div>
              <h2
                id="case-file-title"
                ref={titleRef}
                tabIndex={-1}
                className="mt-2 outline-none"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--paper-ink)",
                  fontSize: 32,
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {event.title}
              </h2>
              <div
                className="mt-1.5 opacity-80"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--paper-meta)",
                  fontSize: 12,
                }}
              >
                {event.month ? `${MONTH[event.month]} ${event.year}` : `${event.year}`}
              </div>
              {canViewOnMap && onViewOnMap && (
                <button
                  type="button"
                  onClick={() => onViewOnMap(event.id)}
                  className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[10px] tracking-widest"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: PALETTE.gold,
                    border: `1px solid ${PALETTE.gold}`,
                    background: "transparent",
                  }}
                >
                  <span aria-hidden>↗</span>
                  VIEW ON MAP
                </button>
              )}
            </div>

            <div className="flex flex-col items-end gap-3">
              <StatusBadge label={FATE_TAG[event.fate]} />
              <button
                type="button"
                onClick={onClose}
                className="focus-ring -mt-1 -mr-2 p-2 opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: "var(--paper-ink)" }}
                aria-label="Close dossier"
              >
                <span aria-hidden style={{ fontSize: 18, lineHeight: 1, fontFamily: "var(--font-mono)" }}>
                  ✕
                </span>
              </button>
            </div>
          </div>

          <div
            className="mt-6 grid gap-x-10 gap-y-3 border-y py-4 sm:grid-cols-2"
            style={{
              borderColor: "var(--paper-rule)",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.05em",
            }}
          >
            <LedgerRow label="DESIGNATION" value={event.variantDesignation} />
            <LedgerRow label="STATUS" value={FATE_LABEL[event.fate]} />
            <LedgerRow label="CLASSIFICATION" value={CATEGORY_LABEL[event.category]} />
            {event.nexus && (
              <LedgerRow label="TURNING POINT" value="Yes" />
            )}
            {event.pruneYear && (
              <LedgerRow label="ABANDONED" value={String(event.pruneYear)} />
            )}
            {event.branchFrom && lookupTitle(event.branchFrom) && (
              <LedgerRow label="BRANCHES FROM" value={lookupTitle(event.branchFrom)!} />
            )}
            {event.rejoinAt && lookupTitle(event.rejoinAt) && (
              <LedgerRow label="REJOINS AT" value={lookupTitle(event.rejoinAt)!} />
            )}
          </div>

          <p
            className="mt-6 leading-relaxed"
            style={{
              fontFamily: "var(--font-sans)",
              color: "var(--paper-ink-soft)",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            {event.longDescription}
          </p>

          <div className="mt-8">
            <div
              style={{
                fontFamily: "var(--font-mono)",
                color: PALETTE.gold,
                letterSpacing: "0.15em",
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              SOURCES & REFERENCES
            </div>
            <ul className="mt-2 space-y-1.5">
              {event.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 text-sm underline underline-offset-2 hover:text-white transition-colors"
                    style={{
                      fontFamily: "var(--font-sans)",
                      color: "var(--paper-ink)",
                      textDecorationColor: "var(--paper-rule)",
                    }}
                  >
                    {s.label}
                    <span aria-hidden className="text-[10px]">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function LedgerRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: "var(--paper-meta-soft)", fontSize: 10 }}>{label}</div>
      <div
        className="mt-1"
        style={{
          color: "var(--paper-ink)",
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: 0,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <div
      className="case-tag flex px-2.5 py-1 items-center justify-center rounded"
      style={{ textAlign: "center", lineHeight: 1 }}
      aria-hidden
    >
      <span style={{ fontSize: 9, letterSpacing: "0.08em", fontWeight: 700 }}>{label}</span>
    </div>
  );
}

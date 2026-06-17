"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { BranchFate, TimelineEvent } from "@/lib/events";
import { EVENTS } from "@/lib/events";
import { PALETTE } from "@/lib/constants";

interface CaseFileProps {
  event: TimelineEvent | null;
  onClose: () => void;
  /** Optional: called from the "View on map" action — close the dossier and
   *  navigate to the event in the graph view. Only wired in graph context. */
  onViewOnMap?: (id: string) => void;
  /** True when the host is currently in list view, so the "View on map" action
   *  is shown as useful. */
  canViewOnMap?: boolean;
}

const FATE_LABEL: Record<BranchFate, string> = {
  trunk: "Canonical · part of the Via Aurea",
  active: "Active expedition · still sailing",
  rejoined: "Returned · absorbed into the main route",
  pruned: "Abandoned · hic sunt dracones",
  constrains: "Constraint · shapes the route",
};

const CATEGORY_LABEL: Record<TimelineEvent["category"], string> = {
  foundational: "Foundational breakthrough",
  product: "Product or deployed model",
  abandoned: "Abandoned approach",
  policy: "Policy or regulation",
  hardware: "Hardware leap",
};

const FATE_SEAL: Record<BranchFate, string> = {
  trunk: "VIA AUREA",
  active: "EXPEDITIO",
  rejoined: "RECEPTUS",
  pruned: "DRACO",
  constrains: "LEX",
};

const MONTH = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CaseFile({ event, onClose, onViewOnMap, canViewOnMap }: CaseFileProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!event) return;
    // Capture focus-restore target BEFORE we move focus into the modal.
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
      // Restore focus only when the modal actually unmounts, not on every
      // re-render. prevFocusRef is captured once per mount.
      prevFocusRef.current?.focus?.();
    };
  }, [event, onClose]);

  // Focus the title synchronously after the panel mounts — useLayoutEffect
  // runs before paint, so the focus call wins the race against any
  // click-induced focus on the trigger element.
  useLayoutEffect(() => {
    if (!event) return;
    titleRef.current?.focus();
  }, [event]);

  // Resolve branchFrom + rejoinAt IDs into readable titles.
  const lookupTitle = (id?: string) => {
    if (!id) return undefined;
    return EVENTS.find((e) => e.id === id)?.title;
  };

  // Honor prefers-reduced-motion: crossfade the panel in place instead of
  // sliding it up (avoids a known vestibular trigger).
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return (
    <AnimatePresence>
      {event && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            style={{ background: "rgba(42, 26, 12, 0.55)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="panel"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-file-title"
            className="case-paper fixed inset-x-0 bottom-0 z-50 max-h-[82vh] overflow-y-auto"
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: reduced ? 0 : 0.22, ease: [0.2, 0.8, 0.2, 1] }}
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
                    AI CHRONOLOGY // LEDGER {event.variantDesignation}
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
                  <StatusBadge label={FATE_SEAL[event.fate]} />
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
                  <LedgerRow label="NEXUS" value="Yes — a turning point" />
                )}
                {event.pruneYear && (
                  <LedgerRow label="ABANDONED" value={String(event.pruneYear)} />
                )}
                {event.branchFrom && lookupTitle(event.branchFrom) && (
                  <LedgerRow label="DEPARTS FROM" value={lookupTitle(event.branchFrom)!} />
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
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
      className="wax-seal flex px-2.5 py-1 items-center justify-center rounded"
      style={{
        textAlign: "center",
        lineHeight: 1,
      }}
      aria-hidden
    >
      <span style={{ fontSize: 9, letterSpacing: "0.08em", fontWeight: 700 }}>{label}</span>
    </div>
  );
}

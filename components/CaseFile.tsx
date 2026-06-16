"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { TimelineEvent } from "@/lib/events";
import { EVENTS } from "@/lib/events";
import { PALETTE } from "@/lib/constants";

interface CaseFileProps {
  event: TimelineEvent | null;
  onClose: () => void;
}

const FATE_LABEL: Record<string, string> = {
  trunk: "Canonical · part of the Via Aurea",
  active: "Active expedition · still sailing",
  rejoined: "Returned · absorbed into the main route",
  pruned: "Abandoned · hic sunt dracones",
  constrains: "Constraint · shapes the route",
};

const CATEGORY_LABEL: Record<string, string> = {
  foundational: "Foundational breakthrough",
  product: "Product or deployed model",
  abandoned: "Abandoned approach",
  policy: "Policy or regulation",
  hardware: "Hardware leap",
};

const FATE_SEAL: Record<string, string> = {
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

export function CaseFile({ event, onClose }: CaseFileProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!event) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

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
      prev?.focus?.();
    };
  }, [event, onClose]);

  // Resolve branchFrom + rejoinAt IDs into readable titles.
  const lookupTitle = (id?: string) => {
    if (!id) return undefined;
    return EVENTS.find((e) => e.id === id)?.title;
  };

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
            transition={{ duration: 0.18 }}
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
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="mx-auto max-w-4xl px-6 py-8 sm:px-12 sm:py-10">
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1">
                  <div
                    style={{
                      fontFamily: "var(--font-script)",
                      letterSpacing: "0.22em",
                      color: PALETTE.cinnabar,
                      fontSize: 11,
                    }}
                  >
                    EX MAPPA AI MUNDI · TABULA {event.variantDesignation}
                  </div>
                  <h2
                    id="case-file-title"
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--paper-ink)",
                      fontSize: 40,
                      fontWeight: 600,
                      lineHeight: 1.05,
                    }}
                  >
                    {event.title}
                  </h2>
                  <div
                    className="mt-1.5 italic"
                    style={{
                      fontFamily: "var(--font-script)",
                      color: "var(--paper-meta)",
                      fontSize: 14,
                    }}
                  >
                    {event.month ? `${MONTH[event.month]} ${event.year}` : `${event.year}`}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <WaxSeal label={FATE_SEAL[event.fate] ?? "MARK"} />
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    className="focus-ring -mt-1 -mr-2 p-2"
                    style={{ color: "var(--paper-ink)" }}
                    aria-label="Close dossier"
                  >
                    <span aria-hidden style={{ fontSize: 20, lineHeight: 1, fontFamily: "var(--font-display)" }}>
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
                  letterSpacing: "0.08em",
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
                  fontFamily: "var(--font-display)",
                  color: "var(--paper-ink-soft)",
                  fontSize: 18,
                }}
              >
                {event.longDescription}
              </p>

              <div className="mt-8">
                <div
                  style={{
                    fontFamily: "var(--font-script)",
                    color: PALETTE.cinnabar,
                    letterSpacing: "0.22em",
                    fontSize: 11,
                  }}
                >
                  TESTIMONIA · SOURCES
                </div>
                <ul className="mt-2 space-y-1.5">
                  {event.sources.map((s, i) => (
                    <li key={i}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring inline-flex items-center gap-1.5 text-sm underline underline-offset-2"
                        style={{
                          fontFamily: "var(--font-display)",
                          color: "var(--paper-ink)",
                          textDecorationColor: "var(--paper-rule)",
                        }}
                      >
                        {s.label}
                        <span aria-hidden>↗</span>
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
      <div style={{ color: "var(--paper-meta-soft)" }}>{label}</div>
      <div
        className="mt-1"
        style={{
          color: "var(--paper-ink)",
          fontFamily: "var(--font-display)",
          fontSize: 14,
          letterSpacing: 0,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function WaxSeal({ label }: { label: string }) {
  return (
    <div
      className="wax-seal flex h-16 w-16 items-center justify-center rounded-full"
      style={{
        transform: "rotate(-6deg)",
        textAlign: "center",
        lineHeight: 1,
      }}
      aria-hidden
    >
      <span style={{ fontSize: 9, letterSpacing: "0.12em", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

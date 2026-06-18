"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Two-way sync between ?event=<id> in the URL and selected dossier state.
 * - On mount: reads the URL and selects whatever event is there.
 * - On `select(id)` or `clear()`: updates the URL with history.replaceState
 *   so the page doesn't pollute the back stack.
 * - Listens for popstate so the back button closes the dossier.
 */
export function useEventDeepLink() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("event");
    if (id) setSelectedId(id);

    const onPop = () => {
      const p = new URLSearchParams(window.location.search);
      setSelectedId(p.get("event"));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const updateUrl = useCallback((id: string | null) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("event", id);
    else url.searchParams.delete("event");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const select = useCallback(
    (id: string) => {
      setSelectedId(id);
      updateUrl(id);
    },
    [updateUrl],
  );

  const clear = useCallback(() => {
    setSelectedId(null);
    updateUrl(null);
  }, [updateUrl]);

  return { selectedId, select, clear };
}

"use client";

import { useEffect, useState } from "react";
import { DIMENSIONS } from "@/lib/constants";

function compute(): number {
  if (typeof window === "undefined") return DIMENSIONS.STAGE_MIN_HEIGHT;
  const free = window.innerHeight - DIMENSIONS.HEADER_HEIGHT - DIMENSIONS.SCRUBBER_HEIGHT;
  return Math.max(DIMENSIONS.STAGE_MIN_HEIGHT, free);
}

/** Live stage height = viewport - header - scrubber, clamped to a minimum. */
export function useStageHeight(): number {
  const [h, setH] = useState<number>(DIMENSIONS.STAGE_MIN_HEIGHT);
  useEffect(() => {
    const update = () => setH(compute());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return h;
}

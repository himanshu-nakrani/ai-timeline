# AI Lineage · What just shipped, and how we got here

Two views of the AI industry. **Pulse** is the default: a buzz-sorted card
grid of the last 90 days of model launches, agent releases, hardware
announcements, and policy moves — filtered by family and lab so you can
cut through the firehose. **Lineage** is the long arc: a horizontal
chronology from **1956 → 2026**, drawn as a glowing mainline with branches
that prune, rejoin, or constrain it.

Made for the chronically online: the goal is *anti-overwhelm*. Pulse
answers "what mattered this week"; Lineage answers "how did we get here".

> Hand-curated. No third-party IP — every entry has at least one primary
> source. Each item has a stable `?event=<id>` deep link.

## Tech stack

- **Next.js 16** (App Router, React 19, RSC where it makes sense)
- **Tailwind CSS v4** with CSS variables for the palette
- **@vercel/analytics** + **@vercel/speed-insights**
- **TypeScript** strict mode

The case-file panel uses plain CSS keyframes (no animation library).
No database, no auth, no i18n. Historical data lives in `lib/events.ts`;
the rolling recent-launches list lives in `lib/recent.ts`.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy to Vercel

The repo includes a `vercel.ts` declaring the framework. Just push to
`main` and import the project on Vercel, or run `vercel deploy` from the
CLI. Vercel auto-detects Next.js; Fluid Compute defaults are fine; no
edge runtime is needed.

## Update Pulse (weekly)

`lib/recent.ts` is the working file. Append a new `TimelineEvent` to the
`RECENT` array. Keep the list to roughly the last 120 days — older
entries should either be removed or promoted into `lib/events.ts` if
they turn out to matter for the long arc.

```ts
{
  id: "claude-opus-4-7-2026-06",
  year: 2026, month: 6, day: 12,
  title: "Claude Opus 4.7 (1M context)",
  shortDescription: "One sentence summary, plain language.",
  longDescription: "Three to six sentences for the dossier.",
  category: "product",
  fate: "active",
  family: "llm",          // llm | image-video | agent | coding | robotics
                          // | infra | hardware | policy | research
  lab: "Anthropic",
  buzz: 92,               // 0-100; ~80+ means "the whole feed is talking"
  variantDesignation: "ACTIVE-2026-OPUS47-R01",
  sources: [
    { label: "Anthropic announcement", url: "https://..." },
  ],
}
```

## Add a historical event

Open `lib/events.ts` and append to `EVENTS`. Conventions:

- `fate: "trunk"` — on the canonical mainline.
- `fate: "active"` — a branch that's still going. Renders a short tail
  with an arrow marker.
- `fate: "pruned"` — abandoned approach. Dashed rose stroke ending in a
  cross. Requires `pruneYear`.
- `fate: "rejoined"` — absorbed back into the mainline. Requires
  `rejoinAt: <id-of-trunk-event>`.
- `fate: "constrains"` — dashed amber line for policy/regulation that
  visibly shapes the trajectory.
- `nexus: true` — turning point. Triggers the pulsing ring.

Every event must include at least one `sources` entry.

## Project layout

```
app/
  layout.tsx                  // global font + analytics
  page.tsx                    // server component, renders <Timeline />
  globals.css                 // Tailwind v4 + palette + keyframes
components/
  Timeline.tsx                // client; view-switching + header
  Pulse.tsx                   // Pulse view: filters + buzz-sorted cards
  TrunkPath.tsx               // SVG line for the mainline + trunk nodes
  Branch.tsx                  // one branch + prune / rejoin / active markers
  CaseFile.tsx                // dossier panel (modal, focus-trapped)
  Scrubber.tsx                // sticky decade scrubber + playhead
  GridBackdrop.tsx            // parallax dot grid backdrop
  TimelineGrid.tsx            // lane bands, year ruler, decade anchors
  LaneRail.tsx                // sticky left rail with lane labels
  FirstRunHint.tsx            // first-visit navigation card
lib/
  events.ts                   // hand-authored historical events
  recent.ts                   // rolling recent launches (Pulse view)
  layout.ts                   // pure layout fns
  constants.ts                // palette, dimensions, timing, lanes
  hooks/
    useStageHeight.ts
    useHorizontalScroll.ts
    useDragPan.ts
    useKeyboardNav.ts
    useAutoplay.ts
    useEventDeepLink.ts
vercel.ts                     // framework: "nextjs"
```

Lineage uses 4 swimlanes: **Products**, **Canonical** (the mainline),
**Research**, and **Abandoned**. Hardware and policy events live in
**Products** with a small `HW` / `REG` badge next to the dot.

## Interaction model (Lineage)

- **Mouse wheel** scrolls the timeline horizontally.
- **Trackpad horizontal scroll** passes through natively.
- **Click-and-drag** on empty space pans the view.
- **Keyboard:** `←`/`→` step between events · `Home`/`End` jump to
  start/finish · `Space` toggles autoplay · `Esc` closes the dossier.
- **Hover** for a glow; **click** to open the dossier.
- **Scrubber** at the bottom: click a decade chip, or drag the playhead.

## Accessibility

- All events reachable in tab order in chronological sequence.
- Dossier is a `role="dialog" aria-modal="true"` with focus trap and
  focus restoration.
- `prefers-reduced-motion` disables looping animations and the slide-up
  panel animation.
- Pulse cards are buttons with full keyboard support.

## License

MIT.

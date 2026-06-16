# Sacred Timeline · AI Edition (TVA-inspired)

An editorial, screenshot-worthy interactive timeline that visualizes the major advancements in AI from **1956 → 2026** as a *Loki* TVA-style **Sacred Timeline**: a glowing horizontal trunk with branching variants that either prune away or rejoin the mainline.

> Inspired by the aesthetic of the Temporal Variance Authority. No Marvel marks, fonts, or artwork are used.

## Tech stack

- **Next.js 15** (App Router, React 19, RSC where it makes sense)
- **Tailwind CSS v4** with CSS variables for the TVA palette
- **Framer Motion** for the case-file panel and overlay
- **lucide-react** for icons
- **@vercel/analytics** + **@vercel/speed-insights**
- **TypeScript** strict mode

No database, no auth, no AI features, no i18n. The data lives in `lib/events.ts`.

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

The repo includes a `vercel.ts` declaring the framework. Just push to `main` and import the project on Vercel, or run `vercel deploy` from the CLI.

```bash
git push origin main
# import the repo at vercel.com/new
```

Vercel auto-detects Next.js. Fluid Compute defaults are fine; no edge runtime is needed.

## Add a new event

Open `lib/events.ts` and append a new `TimelineEvent` to the `EVENTS` array.

```ts
{
  id: "stable-diffusion-3-2024",
  year: 2024,
  month: 6,
  title: "Stable Diffusion 3",
  shortDescription: "One sentence summary, plain language.",
  longDescription: "Three to six sentences for the case-file panel.",
  category: "product",          // foundational | product | abandoned | policy | hardware
  fate: "active",                // trunk | active | pruned | rejoined | constrains
  variantDesignation: "BRANCH-2024-SD3-035",
  branchFrom: "diffusion-2020",  // id of trunk event it branches from
  sources: [
    { label: "Stability AI blog post", url: "https://..." },
  ],
}
```

Conventions:
- `fate: "trunk"` puts the event on the sacred timeline spine.
- `fate: "active"` renders a glowing branch that runs to the present.
- `fate: "pruned"` triggers the red-flicker + ash-burst animation when first revealed.
- `fate: "rejoined"` requires `rejoinAt: <id-of-trunk-event>`.
- `fate: "constrains"` renders a dashed gray loop that visually narrows the trunk downstream.
- `nexus: true` triggers the pulsing-ring animation. The five required nexus events are already included.

Every event must include at least one `sources` entry.

## Project layout

```
app/
  layout.tsx                  // global font + analytics
  page.tsx                    // server component, renders <Timeline />
  globals.css                 // Tailwind v4 + TVA palette + keyframes
components/
  Timeline.tsx                // client; orchestrates scroll, drag, keyboard, autoplay
  SacredTrunk.tsx             // SVG path for the main trunk + trunk event nodes
  Branch.tsx                  // SVG path for one branch + prune / rejoin animations
  CaseFile.tsx                // TVA dossier panel (modal, focus-trapped)
  TempPadScrubber.tsx         // sticky decade scrubber + playhead
  GridBackdrop.tsx            // parallax grid + scanline overlay
  MissMinutes.tsx             // optional clock mascot (NEXT_PUBLIC_SHOW_MASCOT=1)
  EventsList.tsx              // accessible vertical fallback
lib/
  events.ts                   // 37 hand-authored events
  layout.ts                   // pure layout functions (yearToX, buildBranchPath, buildTrunkPath)
  constants.ts                // palette, dimensions, timing, feature flags
vercel.ts                     // framework: "nextjs"
```

## Interaction model

- **Mouse wheel** scrolls the timeline horizontally (vertical wheel deltas are translated).
- **Trackpad horizontal scroll** passes through natively.
- **Click-and-drag** on empty space pans the view.
- **Keyboard:**
  - `←` / `→` — step between events
  - `Home` / `End` — jump to start / end
  - `Space` — toggle autoplay (~80 px/s)
  - `Esc` — close the case file
- **Hover** an event for the bright glow; **click** to open its case file.
- **TempPad scrubber** at the bottom: click any decade chip, or watch the amber playhead track your scroll.

## Accessibility

- All events reachable in tab order, in chronological sequence.
- Case file is a proper `role="dialog" aria-modal="true"` with focus trap and focus restoration.
- `prefers-reduced-motion` disables all looping animations.
- A **LIST** toggle in the header renders the same data as a vertical `<ol>` for screen readers and as a no-scroll fallback.

## License

MIT. Inspired-by; no Marvel IP included.

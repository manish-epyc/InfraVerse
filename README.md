# InfraVerse — 3D Cloud Infrastructure Command Center

A hand-coded showcase that renders a company's cloud architecture as an
interactive **3D map**. Hover, click, search, filter, switch view modes, and
**simulate failures** to watch impact ripple through dependencies in real
time. Built with **Next.js 16 + React 19 + TypeScript + Three.js / R3F**, no
backend — all data is in-memory mock or user-uploaded JSON.

```
┌─ Landing ─────────────────────────────────────────────────────────────┐
│  Live 3D hero · feature grid · tech-stack chips · CTA → Command Cent. │
└───────────────────────────────────────────────────────────────────────┘
┌─ Command Center ──────────────────────────────────────────────────────┐
│  [Metrics strip]                                            [Reset]   │
│  ┌──────────┐                                                         │
│  │ Search   │                                                         │
│  │ Filters  │           24-node fintech architecture in 3D            │
│  │ View Mode│              (click, drag, scroll, hover)               │
│  │ Simulate │                                                         │
│  └──────────┘                                                         │
│  [Event timeline ─ streaming events along the bottom]                 │
│                                            (Detail drawer slides in →)│
└───────────────────────────────────────────────────────────────────────┘
```

---

## Quick start

```bash
npm install
npm run dev          # → http://localhost:3000
```

## Build · test · lint

```bash
npm run build        # production build
npm test             # vitest — simulation-engine unit tests
npm run lint         # eslint
```

---

## ~3-minute demo script

1. Open the **landing page** (`/`).
2. Click **Launch Command Center**.
3. Drag to orbit, scroll to zoom around the 3D map.
4. Click **API Gateway** — the camera flies in; the right drawer shows its
   details, dependencies/dependents, and recent logs.
5. Click a **dependency name** in the drawer to walk the graph.
6. **Search** for `payment` in the sidebar; click a result to focus it.
7. **Filter** by `warning` status — non-matching nodes dim.
8. Switch the **view mode** to **Latency** — node colours remap to a heat
   gradient with a legend.
9. From **Simulate Incident**, trigger **Payment Service down**.
10. Watch the cascade ripple outward hop by hop, the metrics cards update,
    and event logs stream into the timeline.
11. Switch the view mode to **Incident** to isolate the blast radius.
12. Click **Resolve incident** — recovery events stream and the baseline
    returns.
13. Click **Table view** for the accessible non-3D fallback.
14. From the landing page, click **Upload Architecture**, download the
    **sample JSON**, then drop it back. Auto-layout places its nodes and the
    command center renders the new graph.

---

## Features

- **3D infrastructure map** — per-type primitive geometry (cube, sphere,
  hex prism, cylinder, ring, octahedron…) with status colour, glow, and
  pulse animations.
- **5 view modes** — Health, Latency, Cost, Traffic, Incident, with
  per-metric gradient legends. Colours lerp smoothly between modes.
- **Failure-simulation engine** — pure backward-BFS blast-radius computation
  (PRD §10.6, unit-tested) with staged-ripple cascade. 6 named scenarios
  plus generic "fail any node".
- **Search & filter** — search by name/type/owner/region; status + type
  filter chips that dim non-matching nodes (never hide).
- **Selection-aware camera** — click any node and the camera tweens to
  frame it; dependencies stay lit while everything else dims.
- **Live metrics + event timeline** — aggregates re-derived from
  effective-status; logs stream during simulations.
- **Service detail drawer** — full info for the selected service; click
  any dependency to navigate.
- **JSON architecture upload** — schema validation with path-precise error
  reporting, auto-layout for position-less nodes, in-memory session loading.
- **Animated dashed edges + instanced traffic particles**.
- **Accessible non-3D fallback table** — opens via toggle, also the
  mobile/no-WebGL fallback path.
- **Themed dark scrollbars**, keyboard-navigable controls, ARIA labels.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Language | **React 19** + **TypeScript** (strict) |
| 3D | **Three.js** + **React Three Fiber** + **drei** + **postprocessing** |
| State | **Zustand** (single sliced store) |
| Styling | **Tailwind CSS v4** + **shadcn/ui** (base-ui) |
| Animation | **framer-motion** (panel transitions) |
| Tests | **Vitest** |

No backend, no database, no env vars. Everything is client-side on mock or
uploaded data.

---

## Project structure

```
src/
  app/
    page.tsx                # landing
    command-center/page.tsx # the 3D infra map
    upload/page.tsx         # JSON architecture upload
    globals.css             # theme + themed scrollbars
  components/
    layout/                 # shell, desktop gate, mobile fallback, reset-view
    three/                  # scene canvas, nodes, edges, camera rig, particles, hero
    panels/                 # search, filter, view mode, details, simulator, table
    metrics/                # metrics cards
    timeline/               # event timeline
  features/
    infrastructure/
      types.ts              # domain types (ServiceNode/Edge/Incident/EventLog/…)
      mock-data.ts          # default 24-node fintech architecture
      simulation-presets.ts # the 6 named scenarios
      components/           # architecture uploader
  lib/
    graph-utils.ts          # adjacency, dependents/dependencies, metrics
    simulation-engine.ts    # pure backward-BFS blast radius
    validation.ts           # uploaded-JSON schema validator
    auto-layout.ts          # type-column auto-layout
    view-mode.ts            # appearance + heat gradients + legend
    node-filter.ts          # filter matching
    utils.ts                # cn helper
  store/
    infrastructure-store.ts # the single Zustand store
public/
  sample-architecture.json  # downloadable upload example
```

---

## Deploy to Vercel

Zero configuration — InfraVerse is a fully static Next.js app on mock data,
no env vars, no backend.

**Option A — CLI:**

```bash
npm i -g vercel
vercel              # follow the prompts
```

**Option B — GitHub:** push to a repo, then import at
[vercel.com/new](https://vercel.com/new). Build command (`next build`) and
output directory are detected automatically.

A production build has been verified locally — `npm run build` finishes
clean with four static routes: `/`, `/command-center`, `/upload`,
`/_not-found`.

---

## Updating the data

Static data lives in **`src/features/infrastructure/`**:

| File | What's in it |
|------|--------------|
| `mock-data.ts` | The 24-node default graph + 14 seed event logs |
| `simulation-presets.ts` | The 6 named failure scenarios |
| `types.ts` | Type definitions for every domain entity |

Edit, save — the dev server hot-reloads.

For end-users, the supported flow is **upload** at `/upload`: a JSON file
shaped like `{ nodes: ServiceNodeInput[], edges: ServiceEdge[] }` (positions
optional — auto-layout fills them).

---

## Documentation

- **`PRD.md`** — product requirements, module map, phase plan, **17 design
  decisions (D1–D17)** including the full simulation-engine design (§10.6).
- **`ISSUES.md`** — granular issue tracker across the four phases.
- **`docs/context.md`** — the original spec the project was grilled from.

---

## License

MIT (or update to your preference).

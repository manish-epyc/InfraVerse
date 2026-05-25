# InfraVerse — Issues / Work Backlog

> Single source of truth for day-to-day work. Each issue is a small, self-contained
> task (~30 min – 2 hrs). We work **top-down, one issue at a time**: pick the first
> unchecked issue, complete it, check it off.
>
> Plan reference: `PRD.md` (modules M1–M14, decisions D1–D17).
> Mark done with `[x]`. Status: ✅ done · ⬜ todo.

---

## Phase 1 — Core Demo

### M1 — Foundation
- [x] **IV-1** — Scaffold Next.js (App Router) + TS strict + Tailwind v4 + ESLint
- [x] **IV-2** — Install deps: three, @react-three/fiber, drei, postprocessing, zustand, recharts, framer-motion, vitest
- [x] **IV-3** — Init shadcn/ui + create §10.2 folder structure
- [x] **IV-4** — Dark command-center theme (globals.css palette + `status-healthy/warning/critical`)
- [x] **IV-5** — Root layout: metadata, forced dark mode, fonts
- [x] **IV-6** — Placeholder landing page: hero + tagline + CTA → `/command-center`
- [x] **IV-7** — Placeholder `/command-center` and `/upload` route pages
- [x] **IV-8** — Verify `npm run build` passes clean

### M2 — Data layer & types
- [x] **IV-9** — `types.ts`: enums + `ServiceNode`, `ServiceEdge`, `Incident`, `EventLog`, `ArchitectureGraph`
- [x] **IV-10** — `mock-data.ts` nodes: 24 nodes, layered fintech topology, hand-authored positions
- [x] **IV-11** — `mock-data.ts` edges: 37 dependency edges; one baseline `warning` node
- [x] **IV-12** — `mock-data.ts` seed event logs (14 entries)
- [x] **IV-13** — `graph-utils.ts`: adjacency maps, dependents/dependencies lookups, aggregate metrics

### M9 — State management (built early — underpins M4–M8)
- [x] **IV-14** — Zustand store skeleton + graph slice (active nodes/edges/logs)
- [x] **IV-15** — Selection slice: `selectedId`, `hoveredId`
- [x] **IV-16** — Filters slice: status + type filters
- [x] **IV-17** — View-mode slice (Health for Phase 1)
- [x] **IV-18** — Simulation slice: overlay map + active incident (logic wired in M10)

### M4 — 3D scene core
- [x] **IV-19** — `InfrastructureScene`: `<Canvas>` + client-only lazy loader
- [x] **IV-20** — Camera + lighting rig
- [x] **IV-21** — Grid floor + environment (drei `<Grid>` + fog)
- [x] **IV-22** — `OrbitControls` with damping + constrained polar angle

### M5 — Nodes & edges rendering
- [x] **IV-23** — `ServiceNodeMesh`: per-type primitive geometry
- [x] **IV-24** — Node materials + status color/glow
- [x] **IV-25** — Status animations: healthy glow / warning pulse / critical fast pulse
- [x] **IV-26** — Billboarded node labels
- [x] **IV-27** — `ConnectionLine`: directional edges
- [x] **IV-28** — Animated edge flow (dashed traffic direction)

### M6 — Node interaction
- [x] **IV-29** — Hover state + tooltip (name / type / status / latency)
- [x] **IV-30** — Click-to-select + selection ring
- [x] **IV-31** — Tweened camera focus on selection
- [x] **IV-32** — Dependency highlight on selection
- [x] **IV-33** — Reset-view control

### M7 — Command center shell
- [x] **IV-34** — `CommandCenterShell`: floating top bar + left control sidebar
- [x] **IV-35** — `SearchPanel`: search by name/type/owner/region → focus node
- [x] **IV-36** — `FilterPanel`: status + type filters (dim non-matching nodes — D9)
- [x] **IV-37** — `ViewModeSwitcher` (Health mode for Phase 1)
- [x] **IV-38** — Table-view toggle: accessible fallback data table (D15)

### M8 — Service details panel
- [x] **IV-39** — `ServiceDetailsPanel` drawer shell (slides in on selection)
- [x] **IV-40** — Detail fields: status, owner, region, latency, rps, error rate, cost, uptime
- [x] **IV-41** — Dependencies list + recent logs + active incidents sections

### M10 — Simulation engine
- [x] **IV-42** — `simulation-engine.ts`: `computeBlastRadius` (backward BFS — §10.6)
- [x] **IV-43** — Six scenario presets (context.md §6.4)
- [x] **IV-44** — Wire engine → store overlay + staged-ripple application
- [x] **IV-45** — `IncidentSimulator` panel: preset buttons + generic "fail node"
- [x] **IV-46** — Reset / resolve incident
- [x] **IV-47** — Vitest unit tests for the engine (4 passing)

### M11 — Metrics & timeline
- [x] **IV-48** — `MetricsCards`: aggregate stats (effective-status aware)
- [x] **IV-49** — `EventTimeline`: bottom event bar
- [x] **IV-50** — Log generation on simulation events (handled by the M10 store)

### M3 — Landing page (full)
- [x] **IV-51** — Header + hero + feature highlights + tech-stack + CTA + footer
- [x] **IV-52** — Lightweight live 3D hero (auto-rotating node cluster — D12)

---

## Phase 2 — Depth
- [x] **IV-53** — View modes: Latency, Cost, Traffic, Incident + gradient legend
- [x] **IV-54** — Traffic-particle animation along edges (instanced)
- [x] **IV-55** — Animation polish — smooth colour & opacity lerps on view-mode change

## Phase 3 — Upload
- [ ] **IV-56** — `validation.ts`: JSON architecture schema validation
- [ ] **IV-57** — Auto-layout for position-less uploaded nodes (D1)
- [ ] **IV-58** — `/upload` page: drop zone, error list, sample download
- [ ] **IV-59** — Load uploaded graph into store → route to command center

## Phase 4 — Ship
- [ ] **IV-60** — Accessibility pass: keyboard nav, ARIA, contrast
- [ ] **IV-61** — Mobile width-gate fallback screen
- [ ] **IV-62** — Loading states + empty states polish
- [ ] **IV-63** — README + demo script
- [ ] **IV-64** — Deploy to Vercel

---

## Progress

- **Phase 1:** 52 / 52 — 🎉 complete
- **Phase 2:** 3 / 3 — 🎉 complete
- **Total:** 55 / 64

# InfraVerse — Product Requirements Document

> **Status:** v1.0 — all design decisions resolved (§11). Ready for Phase 1
> implementation.
> **Last updated:** 2026-05-22

---

## 1. Summary

**InfraVerse** is a web-based **3D cloud-infrastructure command center**. It renders a
company's backend services, databases, caches, queues, and external dependencies as an
interactive 3D map, and lets the user inspect services, simulate failures, and watch the
resulting impact cascade through the dependency graph.

It is a **portfolio / showcase project**, not a production monitoring tool. All data is
mock data. There is no live cloud integration in the MVP.

**One-line pitch:** *A 3D cloud-infrastructure command center that visualizes services,
dependencies, health, traffic, and incident impact.*

---

## 2. Goals & Non-Goals

### 2.1 Goals

The project succeeds if it demonstrates:

- 3D web development (Three.js / React Three Fiber)
- Modern Next.js + TypeScript frontend architecture
- Real-time-feeling, interactive UI
- System-design and cloud-infrastructure thinking
- Clean, hand-coded, maintainable implementation

### 2.2 Non-Goals (MVP)

- Real AWS / cloud scanning or live metrics
- Real billing integration
- Production authentication / RBAC
- Multi-tenant architecture
- Kubernetes auto-discovery
- A real incident-management workflow
- Mobile-first responsive design (desktop-first; mobile gets a fallback screen)

---

## 3. Audience

| Tier | Who |
|------|-----|
| **Primary** | Software / DevOps / Cloud / SRE engineers, engineering managers |
| **Secondary** | Product managers, technical leadership, interviewers, internal stakeholders |
| **Demo audience** | Interviewers / recruiters viewing the project cold (drives the "polished in 3 minutes" bar) |

---

## 4. Feasibility Verdict

**Feasible.** It is a client-side application on mock data — no backend dependency, no
unproven technology. Next.js, React Three Fiber, Three.js, Drei, and Zustand are all
mature.

The risks are scope and polish, not technical possibility:

1. **Scope vs. time** — the full feature set is ~2-3 weeks of focused work. *Mitigation:*
   phased delivery (§9).
2. **"Polished" is the hard 50%** — a rough 3D scene reads worse than a clean 2D
   dashboard. Polish is budgeted as real work, not a final 10%.
3. **Hidden design decisions** — node layout and simulation-engine design (see §11).

---

## 5. Core Concept

The website displays a company's architecture in a 3D environment. Each infrastructure
component is a **node**; each dependency is an animated **edge**.

**Node types:** frontend, api, service, database, cache, queue, storage, external.

**The centerpiece interaction — failure simulation:** the user triggers a failure (e.g.
"Payment Service Down"); the affected node turns critical, dependent services degrade,
connection lines change, an incident is created, logs stream into the timeline, and the
metrics cards update. The user *sees* the blast radius.

---

## 6. Screens

| Screen | Purpose | Phase |
|--------|---------|-------|
| **Landing page** | First impression; hero, tagline, CTA to command center | 1 |
| **Command center** | Main 3D infrastructure view + side panels + timeline | 1 |
| **Service details panel** | Right-side drawer with technical detail for selected service | 1 |
| **Incident simulation panel** | Trigger simulated production issues | 1 |
| **Architecture upload page** | Upload a JSON architecture file and visualize it | 3 |

### 6.1 Command Center Layout

```
---------------------------------------------------------
| Left Sidebar |        3D Infrastructure Map           |
| - Filters    |                                        |
| - Search     |                                        |
| - View Modes |                                        |
|-------------------------------------------------------|
| Bottom Event Timeline                                 |
---------------------------------------------------------
| Right Service Detail Drawer (overlay)                 |
---------------------------------------------------------
```

---

## 7. Module Map

Each module has an explicit "finished when" bar. Modules are the unit of work tracking.

| # | Module | Finished when |
|---|--------|---------------|
| **M1** | Foundation | Next.js (App Router) + TS strict + Tailwind + shadcn/ui; folder structure; root layout + dark theme. *Blank app builds & deploys.* |
| **M2** | Data layer & types | `types.ts` (Node/Edge/Incident/EventLog + enums); `mock-data.ts` (20–30 node architecture); node positions. *Typed mock graph importable.* |
| **M3** | Landing page | Hero, tagline, CTA → command-center, feature highlights, tech-stack section. *Polished; CTA routes.* |
| **M4** | 3D scene core | `<Canvas>`, camera, lights, grid floor, OrbitControls, resize/perf settings. *Navigable empty 3D space.* |
| **M5** | Nodes & edges | `ServiceNodeMesh` (per-type geometry), `ConnectionLine` (directional), floating labels, status visuals. *Full mock graph renders in 3D.* |
| **M6** | Node interaction | Hover tooltip, click → select, camera focus tween, dependency highlight, reset view. *Clicking any node focuses + highlights.* |
| **M7** | Command center shell | `CommandCenterLayout` (left sidebar / bottom timeline / right drawer), `SearchPanel`, `FilterPanel`, `ViewModeSwitcher`. *Chrome around canvas works.* |
| **M8** | Service details panel | Right drawer: all display fields, logs, incidents, dependency list. *Selecting a node populates drawer.* |
| **M9** | State management | Zustand store: `selectedId`, filters, viewMode, simulation state; derived selectors. *UI + 3D read/write store consistently.* |
| **M10** | Simulation engine | `simulation-engine.ts`: incident scenarios, status propagation, log/incident generation. *Triggering a scenario cascades visibly.* |
| **M11** | Metrics & timeline | `MetricsCards` (aggregates), `EventTimeline` (bottom bar). *Both reflect live store state.* |
| **M12** | View modes | Recolor logic per mode + legend. *Switching mode recolors the scene.* |
| **M13** | Architecture upload | File input + size limit, `validation.ts` schema checks, error display, auto-layout for position-less nodes. *Valid JSON renders; invalid shows errors.* |
| **M14** | Polish & deploy | Traffic particles, transitions, loading states, accessibility/fallback table, mobile width-gate, README, Vercel deploy. *Shippable.* |

---

## 8. Functional Requirements

### 8.1 3D Graph Rendering
Render infrastructure components as 3D nodes. Each node supports: name label, type
shape, health-status indicator, hover interaction, click interaction, camera focus on
selection.

### 8.2 Service Connections
Render directional connections between services. Each edge supports: source, target,
direction, traffic animation, latency indicator, error-rate indicator.

### 8.3 Node Interaction
Hover, click, view details, focus camera on selection, highlight dependencies, reset
camera view.

### 8.4 Search
Search services by name, type, owner, region. On result selection: camera moves to the
node, node is highlighted, detail panel opens.

### 8.5 Filters
Filter nodes by status (healthy / warning / critical) and by type (frontend / api /
service / database / cache / queue / external).

### 8.6 View Modes
Health, Latency, Cost, Traffic, Incident. (Phase 1 ships **Health** only; rest in
Phase 2.)

### 8.7 Failure Simulation
Trigger simulated incidents. Each incident updates service status, generates event logs,
highlights affected dependencies, shows an impact summary, and displays a suggested
remediation.

Simulation scenarios: Payment Service down, Database latency spike, Redis cache
unavailable, Queue backlog, Auth Service degraded, External API timeout.

### 8.8 Event Timeline
Display recent events: service degraded, service recovered, latency spike, deployment
completed, queue backlog, database connection errors.

### 8.9 Metrics Cards
Total services, healthy / warning / critical counts, average latency, total RPS,
estimated hourly cost, active incidents.

### 8.10 JSON Architecture Import (Phase 3)
Import architecture via JSON file. Validate: required node/edge fields, duplicate node
IDs, missing source/target references, invalid status values, invalid service types.

---

## 9. Phase Plan

Delivery is phased so each phase ends at a demoable, deployable state.

### Phase 1 — Core Demo
**Modules:** M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11 (+ Health view only)
**Outcome:** Landing page → 3D infra map → click/hover/search/filter → trigger a failure
and watch it cascade → timeline + metrics update. This is the full "wow" demo.

### Phase 2 — Depth
**Modules:** M12 (Latency / Cost / Traffic / Incident view modes), traffic-particle
animation, animation/transition polish.
**Outcome:** The map can be re-read through multiple analytical lenses; motion polish.

### Phase 3 — Upload
**Modules:** M13 (JSON upload, schema validation, auto-layout).
**Outcome:** Users can visualize their own architecture.

### Phase 4 — Ship
**Modules:** M14 (accessibility, non-3D fallback table, mobile width-gate, loading
states, README, Vercel deploy).
**Outcome:** Publicly shippable, accessible, documented.

---

## 10. Technical Design

### 10.1 Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) + React + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| 3D | Three.js + React Three Fiber + Drei |
| State | Zustand |
| Animation | Framer Motion (UI), R3F/Drei (3D) |
| Charts | Recharts (metrics) |
| Data | Static mock JSON/TS — **no backend, no API routes, no React Query** for MVP |
| Hosting | Vercel |

> The original stack notes listed Next.js API Routes + React Query + an optional
> Postgres/Prisma backend. These are **dropped from the MVP** — the app is fully
> client-side on mock data. See decision D3 (§11).

### 10.2 Folder Structure

```
src/
  app/
    page.tsx                  # landing
    command-center/page.tsx
    upload/page.tsx           # Phase 3
  components/
    layout/  ui/  three/  panels/  metrics/  timeline/
  features/
    infrastructure/
      components/  hooks/  services/  types.ts  mock-data.ts
  store/
    infrastructure-store.ts
  lib/
    graph-utils.ts  simulation-engine.ts  validation.ts
```

### 10.3 Data Model

```ts
export type ServiceStatus = "healthy" | "warning" | "critical";

export type ServiceType =
  | "frontend" | "api" | "service" | "database"
  | "cache" | "queue" | "storage" | "external";

export type ServiceNode = {
  id: string;
  name: string;
  type: ServiceType;
  status: ServiceStatus;
  owner: string;
  region: string;
  latencyMs: number;
  uptimePercentage: number;
  requestsPerSecond: number;
  errorRatePercentage: number;
  costPerHour: number;
  position: { x: number; y: number; z: number };
};

export type ServiceEdge = {
  id: string;
  source: string;
  target: string;
  trafficRps: number;
  latencyMs: number;
  errorRatePercentage: number;
};

export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type Incident = {
  id: string;
  title: string;
  affectedServiceIds: string[];
  severity: IncidentSeverity;
  startedAt: string;
  status: "active" | "resolved";
  description: string;
  suggestedAction: string;
};

export type EventLog = {
  id: string;
  timestamp: string;
  serviceId: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
};
```

### 10.4 3D Scene

**Scene elements:** camera, lights, grid floor, service nodes, connection lines,
floating labels, traffic particles (Phase 2), status animations, environment effects.

**Node visuals by type:** frontend = cube, api = hexagon, service = sphere,
database = cylinder, cache = small cylinder, queue = stacked blocks/ring,
storage = box, external = portal-style node. All geometry is **code-generated**
(Three.js/R3F primitives) — no imported 3D model files (decision D6). Polish comes from
materials, lighting, bloom/glow, and animation.

**Status visuals:** healthy = stable glow, warning = slow pulse, critical = fast
pulse/shake, selected = highlight ring, impacted = dependency glow.

### 10.5 Core Components

`CommandCenterLayout`, `InfrastructureScene`, `ServiceNodeMesh`, `ConnectionLine`,
`TrafficParticles`, `ServiceDetailsPanel`, `SearchPanel`, `FilterPanel`,
`MetricsCards`, `EventTimeline`, `IncidentSimulator`, `ViewModeSwitcher`,
`ArchitectureUploader`.

### 10.6 Simulation Engine Design

**Module:** M10 — `lib/simulation-engine.ts`. Resolved by decisions D2 / D2a–D2f.

**Approach (D2):** rule-based graph propagation, *not* scripted scenarios.

**Edge semantics:** `source → target` means *source depends on / calls target*.

**Propagation (D2a):** failure propagates **backward** along edges — from a failed node
to the services that call it. Implemented as a backward BFS from the root node.

**Severity (D2b):**
- Root node status is set by failure type (see below).
- Every upstream dependent reached by the BFS flips `healthy → warning`; nodes already
  `warning`/`critical` keep their worse status.
- Depth is unbounded but self-limiting — backward BFS narrows toward the frontend; only
  genuinely shared services (auth, a shared DB) fan out wide, which is a *correct* wide
  blast radius.
- A visual-only **impacted** highlight (glow/ring) marks the entire radius regardless of
  whether a node's status changed.

**Failure types (D2c):** the engine has two behaviors —
- *hard* (down / unavailable / timeout) → root becomes `critical`
- *soft* (latency spike / degraded / backlog) → root becomes `warning`

Each scenario also carries a free-text `kindLabel` used only for log/incident wording.

**Triggers (D2c):**
- Six named scenario **presets** (data objects).
- Generic **"Simulate Failure"** on any selected node (defaults to hard-down) — this also
  makes uploaded architectures (Phase 3) simulatable.

```ts
type SimulationPreset = {
  id: string;
  label: string;            // "Payment Service Down"
  rootNodeId: string;
  severity: "hard" | "soft";
  kindLabel: string;        // "outage", "latency spike", ...
  incidentTitle: string;
  description: string;
  suggestedAction: string;
};
```

**Recovery (D2d):** one active simulation at a time. A "Reset" control restores baseline,
marks the incident `resolved`, and emits "service recovered" events. Triggering a new
scenario auto-clears the previous one.

**Cascade timing (D2e):** staged ripple — each affected node delays its status flip by
`hopDistance × stepMs` (~300–500 ms per hop), so the blast radius visibly propagates
outward and demonstrates the engine traversing the graph.

**State model (D2f):** immutable base + overlay. `mock-data.ts` is never mutated. Zustand
holds a simulation overlay (`Map<nodeId, ServiceStatus>`, the active incident, generated
logs). A node's *effective* status = base merged with overlay. Reset = clear the overlay.

**Engine signature** — pure and unit-testable; no time, no store access:

```ts
function computeBlastRadius(
  graph: { nodes: ServiceNode[]; edges: ServiceEdge[] },
  rootNodeId: string,
  severity: "hard" | "soft",
): { nodeId: string; status: ServiceStatus; hopDistance: number }[];
```

Staged application and overlay writes happen in the store layer, not the engine.

> **Correction to `context.md` §15.** That section listed *PostgreSQL DB* and
> *Notification Service* as impacted by "Payment Service Down." Under the correct
> backward-propagation model (D2a), Postgres DB is **downstream** of Payment and is
> **not** impacted (it merely receives less traffic). The corrected impact set for
> "Payment Service Down" is: **Payment Service** → `critical`; **API Gateway** and
> **Web App** (its transitive callers) → `warning`. All examples in this PRD follow the
> corrected model.

### 10.7 Mock Architecture (M2 / D7)

The Phase 1 mock graph models a fictional **fintech / e-commerce company** (chosen to fit
the payment-centric failure scenarios).

- **Topology:** layered — frontend tier → API gateway → ~8–10 services → datastores
  (Postgres, Redis, message queue, object storage) → external APIs. 4–5 hops of depth.
  Shared services (auth, primary DB) are called by many nodes, so some failures produce
  a wide blast radius and others stay narrow — which makes the staged-ripple cascade
  visibly different per scenario.
- **Scale:** ~24 nodes, ~30 edges, spanning 2–3 regions.
- **Baseline health:** mostly `healthy` with **one pre-existing `warning` node**
  (`payment-service`, per the `context.md` sample), so Health mode and the metrics cards
  are meaningful on first load.
- **Positions:** hand-authored (D1) for a clean, deliberate layout.

---

## 11. Decisions

All design decisions below are resolved and locked into this PRD. D1–D6 were resolved
via grilling; D7–D17 were resolved as the recommended option in one batch.

| ID | Decision | Resolution | Status |
|----|----------|------------|--------|
| **D3** | Backend | Mock-only — no API routes / React Query / Prisma in the MVP; fully client-side. | ✅ Resolved |
| **D4** | View modes in Phase 1 | Health view only; the other four ship in Phase 2. | ✅ Resolved |
| **D6** | 3D model approach | Code-generated primitive geometry (Three.js/R3F shapes). No imported `.glb`/`.gltf` asset files. | ✅ Resolved |
| **D1** | Node layout — how 3D positions are assigned | Hybrid — hand-author the Phase 1 mock graph for a clean demo; build the auto-layout function only in M13/Phase 3 when upload needs it. | ✅ Resolved |
| **D2** | Simulation engine design — how failure impact is computed | Rule-based backward-BFS propagation engine. Full design in §10.6 (sub-decisions D2a–D2f: backward propagation, type-driven severity, preset + generic triggers, single-incident reset, staged ripple, immutable-base overlay). | ✅ Resolved |
| **D5** | Upload UX | Dedicated `/upload` page. Valid upload loads the graph into the store and routes to `/command-center`; invalid shows an error list on the page. Uploaded graph replaces the active graph in-memory for the session (no persistence). | ✅ Resolved |
| **D7** | Mock architecture (M2) | Layered fintech/e-commerce topology, ~24 nodes / ~30 edges, 2–3 regions, one baseline `warning` node. Detail in §10.7. | ✅ Resolved |
| **D8** | Project name | **InfraVerse**. | ✅ Resolved |
| **D9** | Filter behavior | Non-matching nodes **dim/fade** (kept in the scene, edges intact) — never removed. Preserves graph legibility. | ✅ Resolved |
| **D10** | Node labels | Always-on compact billboarded name labels; hovering a node shows a richer tooltip (name, type, status, latency). | ✅ Resolved |
| **D11** | View-mode rendering (M12) | Each mode remaps node color. Status pulse animations run only in Health & Incident modes; Latency / Cost / Traffic render a heat-gradient + legend. | ✅ Resolved |
| **D12** | Landing-page 3D | Lightweight live R3F hero — a small (~6–8 node) auto-rotating scene reusing the node components, lazy-loaded. Not the full graph; not a second heavy canvas. | ✅ Resolved |
| **D13** | Edge rendering (Phase 1) | Straight lines with an animated directional dashed/gradient flow showing direction + traffic. Full traffic particles deferred to Phase 2. | ✅ Resolved |
| **D14** | Camera & controls | Drei `OrbitControls` with damping and a constrained polar angle (no clipping under the floor). Click-to-select tweens the camera to frame the node; "Reset view" returns to default framing. | ✅ Resolved |
| **D15** | Non-3D fallback | An accessible HTML data table of all services — a "Table view" toggle in the command center, reused as the mobile fallback, and shown automatically if WebGL is unavailable. | ✅ Resolved |
| **D16** | State store (M9) | A single Zustand store organized into logical slices: selection, filters, viewMode, simulation. | ✅ Resolved |
| **D17** | Testing | Vitest unit tests for the pure logic modules (`simulation-engine.ts`, `validation.ts`, `graph-utils.ts`). No component/3D test harness in the MVP. | ✅ Resolved |

---

## 12. Non-Functional Requirements

### 12.1 Performance
- 30–60 FPS for 20–50 nodes.
- Initial load < 3 s on a decent connection.
- Smooth camera transitions; avoid unnecessary re-renders; memoize where needed.

### 12.2 Responsiveness
- Desktop-first; large tablet supported.
- Mobile: simplified fallback screen below a width threshold.

### 12.3 Accessibility
- Keyboard-accessible controls, sufficient contrast, readable text, ARIA labels.
- Non-3D fallback data table for key information.

### 12.4 Maintainability
- TypeScript-first, component-based, reusable UI, clean folder structure.
- Mock data separated from UI logic; DRY; SOLID-inspired separation.

### 12.5 Security
- Validate uploaded JSON; never execute uploaded content; sanitize input; restrict
  upload file size.

---

## 13. Success Criteria

- Landing page looks polished.
- 3D infrastructure map is interactive.
- Users can click and inspect services.
- Traffic animation is visible.
- Failure simulation creates a clear visual impact.
- The UI feels like a real engineering command center.
- The project can be demoed in under 3 minutes.
- The codebase is clean and understandable.

---

## 14. Demo Script

1. Open landing page.
2. Click "Launch Command Center."
3. Show the 3D infrastructure map.
4. Click API Gateway → show service details.
5. Search for Payment Service.
6. Trigger "Payment Service Down" simulation.
7. Show affected services and event timeline.
8. Explain dependency impact.
9. Switch to Latency or Cost mode. *(Phase 2+)*
10. Upload a sample architecture JSON. *(Phase 3+)*

---

## 15. Future Enhancements (post-MVP)

Real AWS import, Kubernetes manifest import, OpenTelemetry / Prometheus / Datadog
integration, authentication, RBAC, multi-project support, saved layouts, team comments,
AI-generated incident summaries, AI-generated architecture explanations, export as
image/PDF.

---

## 16. Changelog

- **v0.1 (2026-05-22)** — Initial PRD drafted from `context.md`. Restructured into
  module map (§7) and phase plan (§9). Open decisions catalogued (§11). MVP confirmed
  client-side mock-only (D3).
- **v0.2 (2026-05-22)** — D6 resolved: 3D nodes are code-generated primitive geometry,
  no imported model assets. §10.4 updated.
- **v0.3 (2026-05-22)** — D1 resolved: hybrid node layout (hand-authored Phase 1 graph,
  auto-layout deferred to M13).
- **v0.4 (2026-05-22)** — D2 resolved: full simulation-engine design added as §10.6
  (D2a–D2f). Corrected the `context.md` §15 blast-radius error.
- **v0.5 (2026-05-22)** — D5 resolved: dedicated `/upload` page, in-memory session
  graph replacement. All catalogued decisions D1–D6 now resolved.
- **v1.0 (2026-05-22)** — D7–D17 resolved (mock architecture §10.7, project name,
  filter/label/view-mode/edge/camera behavior, non-3D fallback, store structure,
  testing). All design decisions locked; PRD promoted to v1.0, ready for Phase 1.
```
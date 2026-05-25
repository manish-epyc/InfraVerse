/**
 * The single Zustand store (D16) — source of truth shared by the 3D scene and
 * the 2D command-center UI. Slices: graph, selection, filters, view mode,
 * simulation.
 *
 * Simulation follows the immutable-base + overlay model (D2f): `mockGraph` is
 * never mutated; `simulationOverlay` holds simulated statuses, and a node's
 * effective status is `overlay[id] ?? node.status`.
 */

import { create } from "zustand";
import type {
  ArchitectureGraph,
  EventLog,
  EventLogType,
  Incident,
  ServiceEdge,
  ServiceNode,
  ServiceStatus,
  ServiceType,
  SimulationPreset,
  ViewMode,
} from "@/features/infrastructure/types";
import { mockEventLogs, mockGraph } from "@/features/infrastructure/mock-data";
import { computeBlastRadius } from "@/lib/simulation-engine";

/** Staged-ripple delay per hop (D2e). */
const STEP_MS = 420;

/** Pending ripple timers — cleared on reset or when a new scenario starts. */
let pendingTimers: ReturnType<typeof setTimeout>[] = [];
let logSeq = 0;

function makeLog(
  serviceId: string,
  type: EventLogType,
  message: string,
): EventLog {
  logSeq += 1;
  return {
    id: `sim-${Date.now()}-${logSeq}`,
    timestamp: new Date().toISOString(),
    serviceId,
    type,
    message,
  };
}

type InfrastructureState = {
  // --- graph slice ---
  nodes: ServiceNode[];
  edges: ServiceEdge[];
  logs: EventLog[];

  // --- selection slice ---
  selectedId: string | null;
  hoveredId: string | null;

  // --- filter slice (empty arrays = everything visible) ---
  searchQuery: string;
  statusFilter: ServiceStatus[];
  typeFilter: ServiceType[];

  // --- view-mode slice ---
  viewMode: ViewMode;

  // --- simulation slice ---
  activeIncident: Incident | null;
  /** nodeId → simulated status; overlays the base graph (D2f). */
  simulationOverlay: Record<string, ServiceStatus>;

  // --- actions ---
  select: (id: string | null) => void;
  setHovered: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleStatusFilter: (status: ServiceStatus) => void;
  toggleTypeFilter: (type: ServiceType) => void;
  clearFilters: () => void;
  setViewMode: (mode: ViewMode) => void;
  runScenario: (preset: SimulationPreset) => void;
  failNode: (nodeId: string) => void;
  resetSimulation: () => void;
  loadGraph: (graph: ArchitectureGraph) => void;
};

export const useInfrastructureStore = create<InfrastructureState>()(
  (set, get) => ({
    nodes: mockGraph.nodes,
    edges: mockGraph.edges,
    logs: mockEventLogs,

    selectedId: null,
    hoveredId: null,

    searchQuery: "",
    statusFilter: [],
    typeFilter: [],

    viewMode: "health",

    activeIncident: null,
    simulationOverlay: {},

    select: (id) => set({ selectedId: id }),
    setHovered: (id) => set({ hoveredId: id }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    toggleStatusFilter: (status) =>
      set((s) => ({
        statusFilter: s.statusFilter.includes(status)
          ? s.statusFilter.filter((x) => x !== status)
          : [...s.statusFilter, status],
      })),
    toggleTypeFilter: (type) =>
      set((s) => ({
        typeFilter: s.typeFilter.includes(type)
          ? s.typeFilter.filter((x) => x !== type)
          : [...s.typeFilter, type],
      })),
    clearFilters: () =>
      set({ statusFilter: [], typeFilter: [], searchQuery: "" }),
    setViewMode: (mode) => set({ viewMode: mode }),

    /** Runs a failure scenario: compute the blast radius, then apply it as a
     *  staged ripple while streaming event logs (D2e). */
    runScenario: (preset) => {
      pendingTimers.forEach(clearTimeout);
      pendingTimers = [];

      const { nodes, edges } = get();
      const nameOf = (id: string) =>
        nodes.find((n) => n.id === id)?.name ?? id;
      const radius = computeBlastRadius(
        { nodes, edges },
        preset.rootNodeId,
        preset.severity,
      );
      const rootName = nameOf(preset.rootNodeId);

      const incident: Incident = {
        id: `incident-${Date.now()}`,
        title: preset.incidentTitle,
        affectedServiceIds: radius.map((r) => r.nodeId),
        severity: preset.severity === "hard" ? "critical" : "medium",
        startedAt: new Date().toISOString(),
        status: "active",
        description: preset.description,
        suggestedAction: preset.suggestedAction,
      };

      set((s) => ({
        activeIncident: incident,
        simulationOverlay: {},
        logs: [
          ...s.logs,
          makeLog(
            preset.rootNodeId,
            preset.severity === "hard" ? "error" : "warning",
            `${rootName} — ${preset.kindLabel} detected; incident opened`,
          ),
        ],
      }));

      for (const entry of radius) {
        const timer = setTimeout(() => {
          set((s) => {
            const overlay = {
              ...s.simulationOverlay,
              [entry.nodeId]: entry.status,
            };
            if (entry.hopDistance === 0) {
              return { simulationOverlay: overlay, logs: s.logs };
            }
            return {
              simulationOverlay: overlay,
              logs: [
                ...s.logs,
                makeLog(
                  entry.nodeId,
                  "warning",
                  `${nameOf(entry.nodeId)} degraded — impacted by ${rootName}`,
                ),
              ],
            };
          });
        }, entry.hopDistance * STEP_MS);
        pendingTimers.push(timer);
      }
    },

    /** Generic "fail this node" — a hard outage on any selected service (D2c). */
    failNode: (nodeId) => {
      const node = get().nodes.find((n) => n.id === nodeId);
      if (!node) return;
      get().runScenario({
        id: `generic-${nodeId}`,
        label: `${node.name} failure`,
        rootNodeId: nodeId,
        severity: "hard",
        kindLabel: "outage",
        incidentTitle: `${node.name} is down`,
        description: `${node.name} has gone offline. Services that depend on it are degraded.`,
        suggestedAction: `Investigate ${node.name} and restore the service.`,
      });
    },

    /** Replaces the active graph with an uploaded architecture (M13 / D5).
     *  Clears all transient state — selection, filters, sim, logs. */
    loadGraph: (graph) => {
      pendingTimers.forEach(clearTimeout);
      pendingTimers = [];
      set({
        nodes: graph.nodes,
        edges: graph.edges,
        logs: [],
        selectedId: null,
        hoveredId: null,
        searchQuery: "",
        statusFilter: [],
        typeFilter: [],
        viewMode: "health",
        activeIncident: null,
        simulationOverlay: {},
      });
    },

    /** Resolves the active incident and restores the baseline (D2d). */
    resetSimulation: () => {
      pendingTimers.forEach(clearTimeout);
      pendingTimers = [];
      const { activeIncident, nodes } = get();
      if (!activeIncident) return;
      const nameOf = (id: string) =>
        nodes.find((n) => n.id === id)?.name ?? id;
      const recoveredLogs = activeIncident.affectedServiceIds.map((id) =>
        makeLog(id, "success", `${nameOf(id)} recovered`),
      );
      set((s) => ({
        simulationOverlay: {},
        activeIncident: null,
        logs: [...s.logs, ...recoveredLogs],
      }));
    },
  }),
);

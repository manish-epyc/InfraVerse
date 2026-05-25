/**
 * Core domain types for the InfraVerse infrastructure graph.
 * Mirrors PRD §10.3. These are the shapes shared by the mock data,
 * the Zustand store, the 3D scene, and the simulation engine.
 */

/** Health status of a service node. */
export type ServiceStatus = "healthy" | "warning" | "critical";

/** Kind of infrastructure component a node represents (drives its 3D shape). */
export type ServiceType =
  | "frontend"
  | "api"
  | "service"
  | "database"
  | "cache"
  | "queue"
  | "storage"
  | "external";

/** A single infrastructure component in the architecture graph. */
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
  /** Hand-authored 3D position (D1). Uploaded graphs are auto-laid-out. */
  position: { x: number; y: number; z: number };
};

/**
 * A directed dependency between two services.
 * `source` depends on / calls `target` — failure propagates backward (D2a).
 */
export type ServiceEdge = {
  id: string;
  source: string;
  target: string;
  trafficRps: number;
  latencyMs: number;
  errorRatePercentage: number;
};

/** Severity of an incident raised by the simulation engine. */
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

/** An incident — created when a failure scenario is simulated (M10). */
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

/** Severity/category of an event-timeline entry. */
export type EventLogType = "info" | "warning" | "error" | "success";

/** A single entry in the event timeline. */
export type EventLog = {
  id: string;
  timestamp: string;
  serviceId: string;
  type: EventLogType;
  message: string;
};

/**
 * The importable architecture shape — nodes + edges only.
 * Matches the JSON upload format (context.md §12); validated in M13.
 */
export type ArchitectureGraph = {
  nodes: ServiceNode[];
  edges: ServiceEdge[];
};

/**
 * Architecture as received from an uploaded JSON file — `position` is optional
 * here and auto-layout fills any node that omits it (D1). Once auto-laid-out,
 * the result widens into a regular `ArchitectureGraph` for the store.
 */
export type ServiceNodeInput = Omit<ServiceNode, "position"> & {
  position?: { x: number; y: number; z: number };
};

export type ArchitectureGraphInput = {
  nodes: ServiceNodeInput[];
  edges: ServiceEdge[];
};

/** Visualization lens applied to the 3D map (PRD §7.6). Phase 1 ships "health". */
export type ViewMode = "health" | "latency" | "cost" | "traffic" | "incident";

/** Failure-severity class — drives the failed node's status (D2c). */
export type FailureSeverity = "hard" | "soft";

/** A named failure scenario the user can trigger (PRD §10.6). */
export type SimulationPreset = {
  id: string;
  label: string;
  rootNodeId: string;
  severity: FailureSeverity;
  kindLabel: string;
  incidentTitle: string;
  description: string;
  suggestedAction: string;
};

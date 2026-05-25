/**
 * Pure helpers for working with the architecture graph: adjacency maps,
 * dependency/dependent lookups, and aggregate metrics. No React, no store.
 */

import type { ServiceEdge, ServiceNode } from "@/features/infrastructure/types";

/**
 * Adjacency view of the dependency graph. Edges are `source → target`,
 * meaning *source calls (depends on) target*.
 */
export type Adjacency = {
  /** nodeId → ids it directly calls (its dependencies / out-edges). */
  dependencies: Map<string, string[]>;
  /** nodeId → ids that directly call it (its dependents / in-edges). */
  dependents: Map<string, string[]>;
};

function push(map: Map<string, string[]>, key: string, value: string): void {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

/** Builds dependency/dependent adjacency maps from an edge list. */
export function buildAdjacency(edges: ServiceEdge[]): Adjacency {
  const dependencies = new Map<string, string[]>();
  const dependents = new Map<string, string[]>();
  for (const edge of edges) {
    push(dependencies, edge.source, edge.target);
    push(dependents, edge.target, edge.source);
  }
  return { dependencies, dependents };
}

/** Indexes nodes by id for O(1) lookup. */
export function getNodeMap(nodes: ServiceNode[]): Map<string, ServiceNode> {
  return new Map(nodes.map((node) => [node.id, node]));
}

/** Direct dependencies — services this node calls. */
export function getDependencies(adjacency: Adjacency, nodeId: string): string[] {
  return adjacency.dependencies.get(nodeId) ?? [];
}

/** Direct dependents — services that call this node. */
export function getDependents(adjacency: Adjacency, nodeId: string): string[] {
  return adjacency.dependents.get(nodeId) ?? [];
}

/** Direct neighbours in either direction — used for dependency highlighting (M6). */
export function getNeighbours(adjacency: Adjacency, nodeId: string): string[] {
  return [
    ...getDependencies(adjacency, nodeId),
    ...getDependents(adjacency, nodeId),
  ];
}

/** Aggregate metrics derived from the node set (PRD §7.9). */
export type GraphMetrics = {
  totalServices: number;
  healthy: number;
  warning: number;
  critical: number;
  averageLatencyMs: number;
  totalRequestsPerSecond: number;
  estimatedHourlyCost: number;
};

/** Computes the headline metrics for the metrics cards. */
export function computeMetrics(nodes: ServiceNode[]): GraphMetrics {
  const metrics: GraphMetrics = {
    totalServices: nodes.length,
    healthy: 0,
    warning: 0,
    critical: 0,
    averageLatencyMs: 0,
    totalRequestsPerSecond: 0,
    estimatedHourlyCost: 0,
  };
  if (nodes.length === 0) return metrics;

  let latencySum = 0;
  for (const node of nodes) {
    metrics[node.status] += 1;
    latencySum += node.latencyMs;
    metrics.totalRequestsPerSecond += node.requestsPerSecond;
    metrics.estimatedHourlyCost += node.costPerHour;
  }
  metrics.averageLatencyMs = Math.round(latencySum / nodes.length);
  metrics.estimatedHourlyCost =
    Math.round(metrics.estimatedHourlyCost * 100) / 100;
  return metrics;
}

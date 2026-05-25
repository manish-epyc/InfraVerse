/**
 * Failure-simulation engine — pure, rule-based blast-radius propagation
 * (PRD §10.6). A backward BFS over the dependency graph (D2a): a failure flows
 * from the failed node to every service that depends on (calls) it.
 *
 * Pure by design — no time, no store, no React — so it is trivially testable.
 */

import { buildAdjacency, getDependents } from "@/lib/graph-utils";
import type {
  FailureSeverity,
  ServiceEdge,
  ServiceNode,
  ServiceStatus,
} from "@/features/infrastructure/types";

export type BlastRadiusEntry = {
  nodeId: string;
  status: ServiceStatus;
  /** Hops from the failed node (0 = the root). Drives the staged ripple (D2e). */
  hopDistance: number;
};

/**
 * Computes the blast radius of a failure: the failed node plus every upstream
 * dependent, each with a resulting status and a hop distance.
 *
 * - The root becomes `critical` for a hard failure, `warning` for a soft one (D2b).
 * - Every dependent reached by the backward BFS becomes `warning`.
 */
export function computeBlastRadius(
  graph: { nodes: ServiceNode[]; edges: ServiceEdge[] },
  rootNodeId: string,
  severity: FailureSeverity,
): BlastRadiusEntry[] {
  const adjacency = buildAdjacency(graph.edges);
  const visited = new Set<string>([rootNodeId]);
  const radius: BlastRadiusEntry[] = [
    {
      nodeId: rootNodeId,
      status: severity === "hard" ? "critical" : "warning",
      hopDistance: 0,
    },
  ];

  let frontier = [rootNodeId];
  let hop = 1;
  while (frontier.length > 0) {
    const next: string[] = [];
    for (const id of frontier) {
      for (const caller of getDependents(adjacency, id)) {
        if (visited.has(caller)) continue;
        visited.add(caller);
        radius.push({ nodeId: caller, status: "warning", hopDistance: hop });
        next.push(caller);
      }
    }
    frontier = next;
    hop += 1;
  }
  return radius;
}

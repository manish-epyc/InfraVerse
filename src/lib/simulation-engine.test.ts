import { describe, expect, it } from "vitest";
import { computeBlastRadius } from "@/lib/simulation-engine";
import type { ServiceEdge, ServiceNode } from "@/features/infrastructure/types";

/** Minimal synthetic graph: A → B → C  (A calls B, B calls C). */
function node(id: string): ServiceNode {
  return {
    id,
    name: id,
    type: "service",
    status: "healthy",
    owner: "team",
    region: "r1",
    latencyMs: 1,
    uptimePercentage: 100,
    requestsPerSecond: 1,
    errorRatePercentage: 0,
    costPerHour: 0,
    position: { x: 0, y: 0, z: 0 },
  };
}

function edge(source: string, target: string): ServiceEdge {
  return {
    id: `${source}-${target}`,
    source,
    target,
    trafficRps: 1,
    latencyMs: 1,
    errorRatePercentage: 0,
  };
}

const graph = {
  nodes: [node("A"), node("B"), node("C")],
  edges: [edge("A", "B"), edge("B", "C")],
};

describe("computeBlastRadius", () => {
  it("propagates a hard failure backward to every caller, by hop distance", () => {
    const radius = computeBlastRadius(graph, "C", "hard");
    const byId = new Map(radius.map((r) => [r.nodeId, r]));

    expect(radius).toHaveLength(3);
    expect(byId.get("C")).toEqual({
      nodeId: "C",
      status: "critical",
      hopDistance: 0,
    });
    expect(byId.get("B")).toEqual({
      nodeId: "B",
      status: "warning",
      hopDistance: 1,
    });
    expect(byId.get("A")).toEqual({
      nodeId: "A",
      status: "warning",
      hopDistance: 2,
    });
  });

  it("takes the root to warning (not critical) for a soft failure", () => {
    const radius = computeBlastRadius(graph, "C", "soft");
    expect(radius.find((r) => r.nodeId === "C")?.status).toBe("warning");
  });

  it("returns only the root when nothing depends on it", () => {
    const radius = computeBlastRadius(graph, "A", "hard");
    expect(radius).toHaveLength(1);
    expect(radius[0]).toEqual({
      nodeId: "A",
      status: "critical",
      hopDistance: 0,
    });
  });

  it("never propagates downstream to callees", () => {
    // Failing B must reach A (its caller) but never C (its callee).
    const ids = computeBlastRadius(graph, "B", "hard").map((r) => r.nodeId);
    expect(ids).toContain("A");
    expect(ids).not.toContain("C");
  });
});

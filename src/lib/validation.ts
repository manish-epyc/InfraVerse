/**
 * Schema validator for the JSON architecture-upload format (PRD §8.10 / D5).
 * Pure — takes `unknown`, returns a discriminated `ValidationResult`. No throws.
 *
 * Validates: required fields, primitive types, enum membership, duplicate node
 * ids, and edge references pointing at known nodes. `position` is optional —
 * auto-layout fills any missing positions downstream (D1).
 */

import type {
  ArchitectureGraphInput,
  ServiceEdge,
  ServiceNodeInput,
  ServiceStatus,
  ServiceType,
} from "@/features/infrastructure/types";

const VALID_STATUSES: ServiceStatus[] = ["healthy", "warning", "critical"];
const VALID_TYPES: ServiceType[] = [
  "frontend",
  "api",
  "service",
  "database",
  "cache",
  "queue",
  "storage",
  "external",
];

export type ValidationError = { path: string; message: string };

export type ValidationResult =
  | { valid: true; graph: ArchitectureGraphInput }
  | { valid: false; errors: ValidationError[] };

export function validateArchitectureGraph(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof data !== "object" || data === null) {
    return {
      valid: false,
      errors: [{ path: "root", message: "Expected a JSON object" }],
    };
  }
  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.nodes)) {
    errors.push({ path: "nodes", message: "Expected an array" });
  }
  if (!Array.isArray(obj.edges)) {
    errors.push({ path: "edges", message: "Expected an array" });
  }
  if (errors.length > 0) return { valid: false, errors };

  const rawNodes = obj.nodes as unknown[];
  const rawEdges = obj.edges as unknown[];

  const nodes: ServiceNodeInput[] = [];
  const nodeIds = new Set<string>();

  rawNodes.forEach((raw, i) => {
    const result = validateNode(raw, `nodes[${i}]`);
    if (result.errors.length > 0) {
      errors.push(...result.errors);
      return;
    }
    const node = result.node!;
    if (nodeIds.has(node.id)) {
      errors.push({
        path: `nodes[${i}].id`,
        message: `Duplicate node id: ${node.id}`,
      });
      return;
    }
    nodeIds.add(node.id);
    nodes.push(node);
  });

  const edges: ServiceEdge[] = [];
  rawEdges.forEach((raw, i) => {
    const result = validateEdge(raw, `edges[${i}]`, nodeIds);
    if (result.errors.length > 0) {
      errors.push(...result.errors);
      return;
    }
    edges.push(result.edge!);
  });

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, graph: { nodes, edges } };
}

function validateNode(
  data: unknown,
  path: string,
): { node?: ServiceNodeInput; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  if (typeof data !== "object" || data === null) {
    return { errors: [{ path, message: "Expected an object" }] };
  }
  const obj = data as Record<string, unknown>;

  const id = requireString(obj.id, `${path}.id`, errors);
  const name = requireString(obj.name, `${path}.name`, errors);
  const owner = requireString(obj.owner, `${path}.owner`, errors);
  const region = requireString(obj.region, `${path}.region`, errors);
  const type = requireEnum(obj.type, `${path}.type`, VALID_TYPES, errors);
  const status = requireEnum(
    obj.status,
    `${path}.status`,
    VALID_STATUSES,
    errors,
  );
  const latencyMs = requireNumber(obj.latencyMs, `${path}.latencyMs`, errors);
  const uptimePercentage = requireNumber(
    obj.uptimePercentage,
    `${path}.uptimePercentage`,
    errors,
  );
  const requestsPerSecond = requireNumber(
    obj.requestsPerSecond,
    `${path}.requestsPerSecond`,
    errors,
  );
  const errorRatePercentage = requireNumber(
    obj.errorRatePercentage,
    `${path}.errorRatePercentage`,
    errors,
  );
  const costPerHour = requireNumber(
    obj.costPerHour,
    `${path}.costPerHour`,
    errors,
  );

  /** Position is optional — auto-layout fills any node that omits it (D1). */
  let position: { x: number; y: number; z: number } | undefined;
  if (obj.position !== undefined) {
    if (typeof obj.position !== "object" || obj.position === null) {
      errors.push({
        path: `${path}.position`,
        message: "Expected { x, y, z } or omit the field",
      });
    } else {
      const p = obj.position as Record<string, unknown>;
      const posErrors: ValidationError[] = [];
      const x = requireNumber(p.x, `${path}.position.x`, posErrors);
      const y = requireNumber(p.y, `${path}.position.y`, posErrors);
      const z = requireNumber(p.z, `${path}.position.z`, posErrors);
      if (posErrors.length === 0) position = { x: x!, y: y!, z: z! };
      else errors.push(...posErrors);
    }
  }

  if (errors.length > 0) return { errors };

  const node: ServiceNodeInput = {
    id: id!,
    name: name!,
    type: type!,
    status: status!,
    owner: owner!,
    region: region!,
    latencyMs: latencyMs!,
    uptimePercentage: uptimePercentage!,
    requestsPerSecond: requestsPerSecond!,
    errorRatePercentage: errorRatePercentage!,
    costPerHour: costPerHour!,
    ...(position ? { position } : {}),
  };
  return { node, errors: [] };
}

function validateEdge(
  data: unknown,
  path: string,
  nodeIds: Set<string>,
): { edge?: ServiceEdge; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  if (typeof data !== "object" || data === null) {
    return { errors: [{ path, message: "Expected an object" }] };
  }
  const obj = data as Record<string, unknown>;

  const id = requireString(obj.id, `${path}.id`, errors);
  const source = requireString(obj.source, `${path}.source`, errors);
  const target = requireString(obj.target, `${path}.target`, errors);
  const trafficRps = requireNumber(
    obj.trafficRps,
    `${path}.trafficRps`,
    errors,
  );
  const latencyMs = requireNumber(obj.latencyMs, `${path}.latencyMs`, errors);
  const errorRatePercentage = requireNumber(
    obj.errorRatePercentage,
    `${path}.errorRatePercentage`,
    errors,
  );

  if (source && !nodeIds.has(source)) {
    errors.push({
      path: `${path}.source`,
      message: `Unknown source node id: ${source}`,
    });
  }
  if (target && !nodeIds.has(target)) {
    errors.push({
      path: `${path}.target`,
      message: `Unknown target node id: ${target}`,
    });
  }

  if (errors.length > 0) return { errors };
  return {
    edge: {
      id: id!,
      source: source!,
      target: target!,
      trafficRps: trafficRps!,
      latencyMs: latencyMs!,
      errorRatePercentage: errorRatePercentage!,
    },
    errors: [],
  };
}

function requireString(
  v: unknown,
  path: string,
  errors: ValidationError[],
): string | undefined {
  if (typeof v !== "string" || v.length === 0) {
    errors.push({ path, message: "Expected a non-empty string" });
    return undefined;
  }
  return v;
}
function requireNumber(
  v: unknown,
  path: string,
  errors: ValidationError[],
): number | undefined {
  if (typeof v !== "number" || !Number.isFinite(v)) {
    errors.push({ path, message: "Expected a finite number" });
    return undefined;
  }
  return v;
}
function requireEnum<T extends string>(
  v: unknown,
  path: string,
  valid: T[],
  errors: ValidationError[],
): T | undefined {
  if (typeof v !== "string" || !valid.includes(v as T)) {
    errors.push({ path, message: `Expected one of: ${valid.join(", ")}` });
    return undefined;
  }
  return v as T;
}

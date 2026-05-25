/**
 * Auto-layout for uploaded architectures (D1). Assigns deterministic 3D
 * positions to any node that lacks one, preserving positions on nodes that
 * already supplied one. Nodes are laid out in type-columns (frontend on the
 * left, external on the right) and gridded in the Y/Z plane within each
 * column.
 *
 * Input is `ServiceNodeInput` (position optional); output is `ServiceNode`
 * (position required) so the store can treat its dataset uniformly.
 */

import type {
  ServiceNode,
  ServiceNodeInput,
  ServiceType,
} from "@/features/infrastructure/types";

const TYPE_X: Record<ServiceType, number> = {
  frontend: -11,
  api: -7,
  service: -1.5,
  database: 5,
  cache: 7.5,
  queue: 10,
  storage: 12,
  external: 14.5,
};

const Y_TOP = 6.5;
const Y_STEP = 1.9;
const Z_STEP = 1.9;

function needsLayout(node: ServiceNodeInput): boolean {
  const p = node.position;
  return (
    !p ||
    typeof p.x !== "number" ||
    typeof p.y !== "number" ||
    typeof p.z !== "number"
  );
}

/** Fills positions for any node lacking one. Nodes with positions pass through. */
export function autoLayout(nodes: ServiceNodeInput[]): ServiceNode[] {
  const toLayout = nodes.filter(needsLayout);

  const positions = new Map<string, { x: number; y: number; z: number }>();
  if (toLayout.length > 0) {
    const byType = new Map<ServiceType, ServiceNodeInput[]>();
    for (const n of toLayout) {
      const list = byType.get(n.type);
      if (list) list.push(n);
      else byType.set(n.type, [n]);
    }
    for (const [type, group] of byType) {
      const x = TYPE_X[type];
      // Deterministic ordering by id keeps results stable across uploads.
      group.sort((a, b) => a.id.localeCompare(b.id));
      const cols = Math.max(1, Math.ceil(Math.sqrt(group.length)));
      const zStart = -((cols - 1) * Z_STEP) / 2;
      group.forEach((node, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const y = Math.max(1, Y_TOP - row * Y_STEP);
        const z = zStart + col * Z_STEP;
        positions.set(node.id, { x, y, z });
      });
    }
  }

  return nodes.map((n): ServiceNode => {
    const pos = n.position ?? positions.get(n.id) ?? { x: 0, y: 0, z: 0 };
    return { ...n, position: pos };
  });
}

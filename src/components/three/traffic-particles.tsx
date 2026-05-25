"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { type InstancedMesh, Object3D } from "three";
import type { ServiceEdge, ServiceNode } from "@/features/infrastructure/types";

/** Speed in fraction-of-edge per second. */
const SPEED = 0.18;

type Props = {
  edges: ServiceEdge[];
  nodeMap: Map<string, ServiceNode>;
  particlesPerEdge?: number;
};

/** Tiny cyan dots that flow along every edge source → target (IV-54).
 *  All particles share one instanced mesh — one draw call, one useFrame. */
export function TrafficParticles({
  edges,
  nodeMap,
  particlesPerEdge = 2,
}: Props) {
  const segments = useMemo(() => {
    const out: { sx: number; sy: number; sz: number; dx: number; dy: number; dz: number }[] = [];
    for (const e of edges) {
      const s = nodeMap.get(e.source);
      const t = nodeMap.get(e.target);
      if (!s || !t) continue;
      out.push({
        sx: s.position.x,
        sy: s.position.y,
        sz: s.position.z,
        dx: t.position.x - s.position.x,
        dy: t.position.y - s.position.y,
        dz: t.position.z - s.position.z,
      });
    }
    return out;
  }, [edges, nodeMap]);

  const count = segments.length * particlesPerEdge;
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const time = state.clock.elapsedTime;
    let i = 0;
    for (const seg of segments) {
      for (let p = 0; p < particlesPerEdge; p++) {
        const t = (time * SPEED + p / particlesPerEdge) % 1;
        dummy.position.set(
          seg.sx + seg.dx * t,
          seg.sy + seg.dy * t,
          seg.sz + seg.dz * t,
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        i++;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshBasicMaterial color="#7be4ff" transparent opacity={0.78} />
    </instancedMesh>
  );
}

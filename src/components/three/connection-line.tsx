"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Line2, LineMaterial } from "three-stdlib";
import type { ServiceNode } from "@/features/infrastructure/types";

/** Render state of an edge, driven by the current selection. */
export type EdgeRenderState = "normal" | "active" | "dimmed";

const STYLES: Record<
  EdgeRenderState,
  { color: string; opacity: number; width: number; flowSpeed: number }
> = {
  normal: { color: "#46607a", opacity: 0.45, width: 1.2, flowSpeed: 0.35 },
  active: { color: "#3fb6d4", opacity: 0.95, width: 1.9, flowSpeed: 1.1 },
  dimmed: { color: "#3a4a58", opacity: 0.12, width: 1, flowSpeed: 0.15 },
};

type Props = {
  sourceNode: ServiceNode;
  targetNode: ServiceNode;
  state: EdgeRenderState;
};

/**
 * A directed dependency edge. Dashes animate along the line to suggest
 * traffic direction from source → target (IV-28).
 */
export function ConnectionLine({ sourceNode, targetNode, state }: Props) {
  const ref = useRef<Line2>(null);
  const style = STYLES[state];

  const points: [number, number, number][] = [
    [sourceNode.position.x, sourceNode.position.y, sourceNode.position.z],
    [targetNode.position.x, targetNode.position.y, targetNode.position.z],
  ];

  useFrame((_, delta) => {
    const line = ref.current;
    if (!line) return;
    const material = line.material as LineMaterial;
    // Decreasing offset shifts dashes forward along the line — source → target.
    material.dashOffset -= delta * style.flowSpeed;
  });

  return (
    <Line
      ref={ref}
      points={points}
      color={style.color}
      lineWidth={style.width}
      transparent
      opacity={style.opacity}
      dashed
      dashSize={0.45}
      gapSize={0.25}
    />
  );
}

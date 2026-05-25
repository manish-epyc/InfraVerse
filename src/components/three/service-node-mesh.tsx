"use client";

import { useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Billboard, Html } from "@react-three/drei";
import {
  Color,
  type Group,
  type Mesh,
  type MeshStandardMaterial,
} from "three";

/** Reusable Color scratch — avoids per-frame allocations during the lerp. */
const SCRATCH_COLOR = new Color();
import { useInfrastructureStore } from "@/store/infrastructure-store";
import type { ServiceNode, ServiceType } from "@/features/infrastructure/types";

/** Per-type primitive geometry (D6, §14.2) — no imported model files. */
function NodeGeometry({ type }: { type: ServiceType }) {
  switch (type) {
    case "frontend":
      return <boxGeometry args={[0.95, 0.95, 0.95]} />;
    case "api":
      return <cylinderGeometry args={[0.62, 0.62, 0.72, 6]} />;
    case "service":
      return <sphereGeometry args={[0.6, 32, 32]} />;
    case "database":
      return <cylinderGeometry args={[0.55, 0.55, 1.05, 32]} />;
    case "cache":
      return <cylinderGeometry args={[0.62, 0.62, 0.42, 32]} />;
    case "queue":
      return <torusGeometry args={[0.5, 0.2, 16, 32]} />;
    case "storage":
      return <boxGeometry args={[1, 0.5, 1]} />;
    case "external":
      return <octahedronGeometry args={[0.72]} />;
    default:
      return <sphereGeometry args={[0.6, 32, 32]} />;
  }
}

type Props = {
  node: ServiceNode;
  /** Target colour (driven by the active view mode). */
  color: string;
  /** Emissive pulse speed; 0 = steady glow. */
  pulseSpeed: number;
  selected: boolean;
  dimmed: boolean;
};

/** A single infrastructure node — mesh, glow, label, and interaction.
 *  Colour and opacity smoothly lerp toward the target each frame (IV-55). */
export function ServiceNodeMesh({
  node,
  color,
  pulseSpeed,
  selected,
  dimmed,
}: Props) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const hovered = useInfrastructureStore((s) => s.hoveredId === node.id);
  const select = useInfrastructureStore((s) => s.select);
  const setHovered = useInfrastructureStore((s) => s.setHovered);

  /** Stable Color instance that lerps toward the prop each frame (D11 / IV-55).
   *  Lazy-initialised via useState so we never mutate a ref during render. */
  const [currentColor] = useState(() => new Color(color));

  /** Current opacity — mutated only inside useFrame. */
  const currentOpacity = useRef(1);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (mesh) {
      const material = mesh.material as MeshStandardMaterial;

      SCRATCH_COLOR.set(color);
      currentColor.lerp(SCRATCH_COLOR, Math.min(1, delta * 4.5));
      material.color.copy(currentColor);
      material.emissive.copy(currentColor);

      const targetOpacity = dimmed ? 0.16 : 1;
      currentOpacity.current +=
        (targetOpacity - currentOpacity.current) * Math.min(1, delta * 6);
      material.opacity = currentOpacity.current;

      if (pulseSpeed > 0) {
        const pulse =
          0.5 + 0.5 * Math.sin(state.clock.elapsedTime * pulseSpeed);
        material.emissiveIntensity = 0.3 + pulse * 0.55;
      } else {
        material.emissiveIntensity = 0.42;
      }
    }

    const group = groupRef.current;
    if (group) {
      const target = hovered || selected ? 1.16 : 1;
      const current = group.scale.x;
      group.scale.setScalar(
        current + (target - current) * Math.min(1, delta * 12),
      );
    }
  });

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(node.id);
    document.body.style.cursor = "pointer";
  };
  const handleOut = () => {
    setHovered(null);
    document.body.style.cursor = "auto";
  };
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    select(node.id);
  };

  return (
    <group
      ref={groupRef}
      position={[node.position.x, node.position.y, node.position.z]}
    >
      <mesh
        ref={meshRef}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <NodeGeometry type={node.type} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.42}
          roughness={0.3}
          metalness={0.2}
          transparent
          opacity={dimmed ? 0.16 : 1}
        />
      </mesh>

      {selected && (
        <Billboard>
          <mesh>
            <ringGeometry args={[1.18, 1.34, 56]} />
            <meshBasicMaterial color="#4fd1e6" transparent opacity={0.9} />
          </mesh>
        </Billboard>
      )}

      <Html position={[0, 1.25, 0]} center distanceFactor={15}>
        <div
          className="pointer-events-none select-none whitespace-nowrap rounded border border-border/70 bg-background/85 px-1.5 py-0.5 text-[11px] font-medium text-foreground/90 transition-opacity duration-300"
          style={{ opacity: dimmed ? 0.25 : 1 }}
        >
          {node.name}
        </div>
      </Html>

      {hovered && (
        <Html position={[0, 1.95, 0]} center distanceFactor={15}>
          <div className="pointer-events-none w-44 select-none rounded-md border border-border bg-popover px-2.5 py-2 text-xs shadow-lg">
            <div className="font-semibold text-popover-foreground">
              {node.name}
            </div>
            <div className="mt-0.5 capitalize text-muted-foreground">
              {node.type} · {node.status}
            </div>
            <div className="mt-1 flex justify-between text-muted-foreground">
              <span>Latency</span>
              <span className="text-foreground">{node.latencyMs} ms</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

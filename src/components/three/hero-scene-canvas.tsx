"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Group } from "three";

/** A lightweight decorative node cluster for the landing hero (D12). */

const COLORS = {
  cyan: "#3fb6d4",
  emerald: "#3fcf8e",
  amber: "#e3b341",
  violet: "#9d7bea",
};

type Shape = "box" | "sphere" | "cylinder" | "octahedron" | "torus";

type HeroNode = {
  position: [number, number, number];
  shape: Shape;
  color: string;
  scale: number;
};

const NODES: HeroNode[] = [
  { position: [0, 0, 0], shape: "octahedron", color: COLORS.cyan, scale: 1.15 },
  { position: [-2.7, 1.5, 0.6], shape: "box", color: COLORS.emerald, scale: 1 },
  { position: [2.6, 1.2, -0.7], shape: "sphere", color: COLORS.cyan, scale: 1 },
  { position: [-2.3, -1.6, -0.9], shape: "cylinder", color: COLORS.emerald, scale: 1 },
  { position: [2.5, -1.4, 0.9], shape: "box", color: COLORS.amber, scale: 1 },
  { position: [0.3, 2.7, -1.2], shape: "sphere", color: COLORS.cyan, scale: 0.9 },
  { position: [0.1, -2.8, 0.5], shape: "torus", color: COLORS.violet, scale: 1 },
  { position: [-3.5, 0.1, 1.5], shape: "octahedron", color: COLORS.cyan, scale: 0.9 },
];

const LINKS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
  [1, 5], [2, 4], [3, 7],
];

function NodeGeometry({ shape }: { shape: Shape }) {
  switch (shape) {
    case "box":
      return <boxGeometry args={[0.9, 0.9, 0.9]} />;
    case "sphere":
      return <sphereGeometry args={[0.62, 32, 32]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
    case "torus":
      return <torusGeometry args={[0.5, 0.2, 16, 48]} />;
    case "octahedron":
      return <octahedronGeometry args={[0.72]} />;
    default:
      return null;
  }
}

function Cluster() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.18;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
  });

  return (
    <group ref={group}>
      {LINKS.map(([a, b], i) => (
        <Line
          key={`link-${i}`}
          points={[NODES[a].position, NODES[b].position]}
          color="#5b7790"
          lineWidth={1}
          transparent
          opacity={0.45}
        />
      ))}
      {NODES.map((node, i) => (
        <mesh key={`node-${i}`} position={node.position} scale={node.scale}>
          <NodeGeometry shape={node.shape} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.55}
            roughness={0.32}
            metalness={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroSceneCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={1} />
      <pointLight position={[6, 6, 8]} intensity={220} />
      <pointLight position={[-7, -4, 3]} intensity={140} color={COLORS.cyan} />
      <Cluster />
    </Canvas>
  );
}

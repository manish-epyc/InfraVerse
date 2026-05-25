"use client";

import { useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useInfrastructureStore } from "@/store/infrastructure-store";
import { buildAdjacency, getNeighbours, getNodeMap } from "@/lib/graph-utils";
import { isFilterActive, matchesFilter } from "@/lib/node-filter";
import { CameraRig } from "./camera-rig";
import { ConnectionLine, type EdgeRenderState } from "./connection-line";
import { ServiceNodeMesh } from "./service-node-mesh";

const GRAPH_CENTER: [number, number, number] = [0, 4, 0];
const DEFAULT_CAMERA: [number, number, number] = [0, 13, 27];
const BG_COLOR = "#0f141b";

/** Renders the graph from the store, with selection- and filter-driven emphasis. */
function SceneContents() {
  const nodes = useInfrastructureStore((s) => s.nodes);
  const edges = useInfrastructureStore((s) => s.edges);
  const selectedId = useInfrastructureStore((s) => s.selectedId);
  const simulationOverlay = useInfrastructureStore((s) => s.simulationOverlay);
  const searchQuery = useInfrastructureStore((s) => s.searchQuery);
  const statusFilter = useInfrastructureStore((s) => s.statusFilter);
  const typeFilter = useInfrastructureStore((s) => s.typeFilter);

  const nodeMap = useMemo(() => getNodeMap(nodes), [nodes]);
  const adjacency = useMemo(() => buildAdjacency(edges), [edges]);

  /** Selected node + its direct neighbours — everything else dims (IV-32). */
  const highlightSet = useMemo(() => {
    if (!selectedId) return null;
    return new Set<string>([
      selectedId,
      ...getNeighbours(adjacency, selectedId),
    ]);
  }, [selectedId, adjacency]);

  /** Ids matching the active filters, or null when no filter is set (D9). */
  const matchSet = useMemo(() => {
    const filter = { searchQuery, statusFilter, typeFilter };
    if (!isFilterActive(filter)) return null;
    return new Set(
      nodes.filter((n) => matchesFilter(n, filter)).map((n) => n.id),
    );
  }, [nodes, searchQuery, statusFilter, typeFilter]);

  return (
    <>
      {edges.map((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return null;

        let state: EdgeRenderState = "normal";
        if (selectedId) {
          state =
            edge.source === selectedId || edge.target === selectedId
              ? "active"
              : "dimmed";
        } else if (matchSet) {
          state =
            matchSet.has(edge.source) && matchSet.has(edge.target)
              ? "normal"
              : "dimmed";
        }

        return (
          <ConnectionLine
            key={edge.id}
            sourceNode={source}
            targetNode={target}
            state={state}
          />
        );
      })}
      {nodes.map((node) => {
        const filteredOut = matchSet !== null && !matchSet.has(node.id);
        const selectionDimmed =
          highlightSet !== null && !highlightSet.has(node.id);
        return (
          <ServiceNodeMesh
            key={node.id}
            node={node}
            status={simulationOverlay[node.id] ?? node.status}
            selected={selectedId === node.id}
            dimmed={filteredOut || selectionDimmed}
          />
        );
      })}
    </>
  );
}

/** The full command-center 3D scene: camera, lights, grid, controls. */
export default function InfrastructureSceneCanvas() {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const select = useInfrastructureStore((s) => s.select);

  return (
    <Canvas
      camera={{ position: DEFAULT_CAMERA, fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={[BG_COLOR]} />
      <fog attach="fog" args={[BG_COLOR, 30, 70]} />

      <ambientLight intensity={0.85} />
      <directionalLight position={[12, 20, 14]} intensity={1.7} />
      <pointLight position={[-14, 8, -10]} intensity={220} color="#3fb6d4" />

      <Grid
        position={[0, 0, 0]}
        args={[80, 80]}
        infiniteGrid
        cellSize={1.6}
        cellThickness={0.6}
        sectionSize={8}
        sectionThickness={1.1}
        cellColor="#26333f"
        sectionColor="#3c5260"
        fadeDistance={75}
        fadeStrength={1.5}
      />

      <SceneContents />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        minDistance={9}
        maxDistance={58}
        maxPolarAngle={Math.PI * 0.49}
      />
      <CameraRig
        controlsRef={controlsRef}
        defaultTarget={GRAPH_CENTER}
        defaultCamera={DEFAULT_CAMERA}
      />
    </Canvas>
  );
}

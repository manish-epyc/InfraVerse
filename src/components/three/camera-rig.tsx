"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useInfrastructureStore } from "@/store/infrastructure-store";

type Props = {
  controlsRef: RefObject<OrbitControlsImpl | null>;
  defaultTarget: [number, number, number];
  defaultCamera: [number, number, number];
};

/**
 * Smoothly flies the camera to frame the selected node and back to the default
 * framing on deselect (IV-31 / IV-33). Controls input is paused during the
 * transition so the tween and the user don't fight.
 */
export function CameraRig({ controlsRef, defaultTarget, defaultCamera }: Props) {
  const camera = useThree((s) => s.camera);
  const selectedId = useInfrastructureStore((s) => s.selectedId);
  const nodes = useInfrastructureStore((s) => s.nodes);

  const tween = useRef({
    active: false,
    camTo: new Vector3(),
    targetTo: new Vector3(),
  });

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const node = selectedId
      ? nodes.find((n) => n.id === selectedId)
      : null;
    if (node) {
      tween.current.targetTo.set(
        node.position.x,
        node.position.y,
        node.position.z,
      );
      tween.current.camTo.set(
        node.position.x + 6,
        node.position.y + 5,
        node.position.z + 11,
      );
    } else {
      tween.current.targetTo.set(...defaultTarget);
      tween.current.camTo.set(...defaultCamera);
    }
    tween.current.active = true;
    controls.enabled = false;
  }, [selectedId, nodes, controlsRef, defaultTarget, defaultCamera]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls || !tween.current.active) return;
    camera.position.lerp(tween.current.camTo, 0.1);
    controls.target.lerp(tween.current.targetTo, 0.1);
    controls.update();
    if (
      camera.position.distanceTo(tween.current.camTo) < 0.2 &&
      controls.target.distanceTo(tween.current.targetTo) < 0.2
    ) {
      tween.current.active = false;
      controls.enabled = true;
    }
  });

  return null;
}

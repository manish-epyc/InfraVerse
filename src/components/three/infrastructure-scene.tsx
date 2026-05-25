"use client";

import dynamic from "next/dynamic";

/**
 * Client-only, lazily-loaded command-center 3D scene. Three.js never runs on
 * the server (D6 / SSR-safe).
 */
export const InfrastructureScene = dynamic(
  () => import("./infrastructure-scene-canvas"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Loading 3D scene…
      </div>
    ),
  },
);

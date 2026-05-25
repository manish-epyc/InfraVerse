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
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:200ms]" />
            <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:400ms]" />
          </div>
          <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
            Loading command center
          </p>
        </div>
      </div>
    ),
  },
);

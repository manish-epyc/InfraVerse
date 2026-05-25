"use client";

import dynamic from "next/dynamic";

/**
 * Client-only, lazily-loaded 3D hero (D12). The Three.js canvas never runs on
 * the server, so it can't break SSR or block the initial paint.
 */
export const HeroScene = dynamic(() => import("./hero-scene-canvas"), {
  ssr: false,
  loading: () => null,
});

"use client";

import { useSyncExternalStore } from "react";
import { InfrastructureScene } from "@/components/three/infrastructure-scene";
import { CommandCenterShell } from "./command-center-shell";
import { MobileFallback } from "./mobile-fallback";

const DESKTOP_MIN_WIDTH = 768;
const MOBILE_QUERY = `(max-width: ${DESKTOP_MIN_WIDTH - 1}px)`;

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getIsMobile(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

/** SSR-safe default — assume desktop; mobile devices switch on hydration. */
function getServerIsMobile(): boolean {
  return false;
}

/**
 * Desktop-gate wrapper for the command center. Below 768px the heavy 3D
 * scene never renders — the user sees a "best on desktop" fallback instead
 * (D15 / IV-61). Uses `useSyncExternalStore` so the matchMedia subscription
 * is concurrent-safe and needs no effect.
 */
export function CommandCenterContent() {
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getIsMobile,
    getServerIsMobile,
  );

  if (isMobile) {
    return <MobileFallback />;
  }
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0f141b]">
      <InfrastructureScene />
      <CommandCenterShell />
    </div>
  );
}

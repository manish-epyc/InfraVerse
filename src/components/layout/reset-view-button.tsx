"use client";

import { useInfrastructureStore } from "@/store/infrastructure-store";

/** Clears the selection, which flies the camera back to the default framing. */
export function ResetViewButton() {
  const selectedId = useInfrastructureStore((s) => s.selectedId);
  const select = useInfrastructureStore((s) => s.select);

  if (!selectedId) return null;

  return (
    <button
      type="button"
      onClick={() => select(null)}
      className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
    >
      Reset view
    </button>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { useInfrastructureStore } from "@/store/infrastructure-store";
import type { ViewMode } from "@/features/infrastructure/types";

const MODES: { id: ViewMode; label: string; enabled: boolean }[] = [
  { id: "health", label: "Health", enabled: true },
  { id: "latency", label: "Latency", enabled: false },
  { id: "cost", label: "Cost", enabled: false },
  { id: "traffic", label: "Traffic", enabled: false },
  { id: "incident", label: "Incident", enabled: false },
];

/** View-mode selector. Phase 1 ships Health; the rest land in Phase 2 (D4). */
export function ViewModeSwitcher() {
  const viewMode = useInfrastructureStore((s) => s.viewMode);
  const setViewMode = useInfrastructureStore((s) => s.setViewMode);

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        View Mode
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            disabled={!mode.enabled}
            onClick={() => mode.enabled && setViewMode(mode.id)}
            title={mode.enabled ? undefined : "Coming in Phase 2"}
            className={cn(
              "rounded-md border px-2 py-1.5 text-[11px] transition-colors",
              viewMode === mode.id
                ? "border-primary/60 bg-primary/15 text-foreground"
                : mode.enabled
                  ? "border-border text-muted-foreground hover:text-foreground"
                  : "cursor-not-allowed border-border/40 text-muted-foreground/40",
            )}
          >
            {mode.label}
            {!mode.enabled && (
              <span className="ml-1 text-[9px] uppercase">soon</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

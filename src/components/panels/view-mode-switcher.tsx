"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useInfrastructureStore } from "@/store/infrastructure-store";
import { computeRanges, getViewModeLegend } from "@/lib/view-mode";
import type { ViewMode } from "@/features/infrastructure/types";

const MODES: { id: ViewMode; label: string }[] = [
  { id: "health", label: "Health" },
  { id: "latency", label: "Latency" },
  { id: "cost", label: "Cost" },
  { id: "traffic", label: "Traffic" },
  { id: "incident", label: "Incident" },
];

/** View-mode selector + gradient legend for the analytical lenses (D11). */
export function ViewModeSwitcher() {
  const viewMode = useInfrastructureStore((s) => s.viewMode);
  const setViewMode = useInfrastructureStore((s) => s.setViewMode);
  const nodes = useInfrastructureStore((s) => s.nodes);

  const ranges = useMemo(() => computeRanges(nodes), [nodes]);
  const legend = getViewModeLegend(viewMode, ranges);

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
            onClick={() => setViewMode(mode.id)}
            aria-pressed={viewMode === mode.id}
            className={cn(
              "rounded-md border px-2 py-1.5 text-[11px] transition-colors",
              viewMode === mode.id
                ? "border-primary/60 bg-primary/15 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {legend && (
        <div className="mt-3 rounded-md border border-border bg-background/40 p-2">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {legend.label}
          </p>
          <div
            className="mt-1 h-2 rounded-full"
            style={{
              background: `linear-gradient(to right, ${legend.stops[0]}, ${legend.stops[1]}, ${legend.stops[2]})`,
            }}
          />
          <div className="mt-1 flex justify-between text-[10px] tabular-nums text-muted-foreground">
            <span>{legend.format(legend.range.min)}</span>
            <span>{legend.format(legend.range.max)}</span>
          </div>
        </div>
      )}

      {viewMode === "incident" && (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          Highlights services in the active blast radius. Other nodes stay
          muted until a scenario is triggered.
        </p>
      )}
    </div>
  );
}

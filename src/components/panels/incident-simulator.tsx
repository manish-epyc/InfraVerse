"use client";

import { cn } from "@/lib/utils";
import { useInfrastructureStore } from "@/store/infrastructure-store";
import { simulationPresets } from "@/features/infrastructure/simulation-presets";

/** Triggers failure scenarios and shows the active incident's impact (M10). */
export function IncidentSimulator() {
  const runScenario = useInfrastructureStore((s) => s.runScenario);
  const failNode = useInfrastructureStore((s) => s.failNode);
  const resetSimulation = useInfrastructureStore((s) => s.resetSimulation);
  const activeIncident = useInfrastructureStore((s) => s.activeIncident);
  const selectedId = useInfrastructureStore((s) => s.selectedId);
  const nodes = useInfrastructureStore((s) => s.nodes);

  const selectedNode = selectedId
    ? (nodes.find((n) => n.id === selectedId) ?? null)
    : null;

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Simulate Incident
      </p>

      {activeIncident ? (
        <div className="rounded-md border border-status-critical/30 bg-status-critical/10 p-3">
          <p className="text-xs font-semibold text-status-critical">
            {activeIncident.title}
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            {activeIncident.affectedServiceIds.length} services impacted
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Suggested:</span>{" "}
            {activeIncident.suggestedAction}
          </p>
          <button
            type="button"
            onClick={resetSimulation}
            className="mt-2.5 w-full rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Resolve incident
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            {simulationPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => runScenario(preset)}
                className="w-full rounded-md border border-border bg-background/40 px-2.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-status-critical/40 hover:text-foreground"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!selectedNode}
            onClick={() => selectedNode && failNode(selectedNode.id)}
            className={cn(
              "mt-2 w-full rounded-md border px-2.5 py-1.5 text-xs transition-colors",
              selectedNode
                ? "border-border text-muted-foreground hover:text-foreground"
                : "cursor-not-allowed border-border/40 text-muted-foreground/40",
            )}
          >
            {selectedNode
              ? `Fail ${selectedNode.name}`
              : "Select a node to fail it"}
          </button>
        </>
      )}
    </div>
  );
}

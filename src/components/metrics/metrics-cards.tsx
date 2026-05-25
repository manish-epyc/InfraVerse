"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { computeMetrics } from "@/lib/graph-utils";
import { useInfrastructureStore } from "@/store/infrastructure-store";

type Tone = "healthy" | "warning" | "critical";

const TONE_CLASS: Record<Tone, string> = {
  healthy: "text-status-healthy",
  warning: "text-status-warning",
  critical: "text-status-critical",
};

/** Headline metrics strip — computed from effective (overlay-applied) status. */
export function MetricsCards() {
  const nodes = useInfrastructureStore((s) => s.nodes);
  const overlay = useInfrastructureStore((s) => s.simulationOverlay);
  const activeIncident = useInfrastructureStore((s) => s.activeIncident);

  const metrics = useMemo(() => {
    const effective = nodes.map((n) => ({
      ...n,
      status: overlay[n.id] ?? n.status,
    }));
    return computeMetrics(effective);
  }, [nodes, overlay]);

  const cards: { label: string; value: string | number; tone?: Tone }[] = [
    { label: "Services", value: metrics.totalServices },
    { label: "Healthy", value: metrics.healthy, tone: "healthy" },
    { label: "Warning", value: metrics.warning, tone: "warning" },
    { label: "Critical", value: metrics.critical, tone: "critical" },
    { label: "Avg latency", value: `${metrics.averageLatencyMs} ms` },
    {
      label: "Total RPS",
      value: metrics.totalRequestsPerSecond.toLocaleString(),
    },
    { label: "Cost / hr", value: `$${metrics.estimatedHourlyCost}` },
    {
      label: "Incidents",
      value: activeIncident ? 1 : 0,
      tone: activeIncident ? "critical" : undefined,
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {cards.map((card) => (
        <div
          key={card.label}
          className="min-w-[78px] rounded-lg border border-border bg-card/85 px-3 py-1.5 text-center backdrop-blur"
        >
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            {card.label}
          </p>
          <p
            className={cn(
              "text-sm font-semibold tabular-nums",
              card.tone && TONE_CLASS[card.tone],
            )}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

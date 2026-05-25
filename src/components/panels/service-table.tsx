"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInfrastructureStore } from "@/store/infrastructure-store";
import type { ServiceStatus } from "@/features/infrastructure/types";

const STATUS_TEXT: Record<ServiceStatus, string> = {
  healthy: "text-status-healthy",
  warning: "text-status-warning",
  critical: "text-status-critical",
};

type Props = {
  onClose: () => void;
};

/** Accessible, non-3D fallback view of the architecture (D15). */
export function ServiceTable({ onClose }: Props) {
  const nodes = useInfrastructureStore((s) => s.nodes);
  const select = useInfrastructureStore((s) => s.select);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Service table"
      className="fixed inset-0 z-50 flex flex-col bg-background/97 backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="text-base font-semibold">All Services</h2>
          <p className="text-xs text-muted-foreground">
            Accessible non-3D view of the architecture.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close table view"
          className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-6 py-4">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            All infrastructure services and their current metrics
          </caption>
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="py-2 pr-4">Service</th>
              <th scope="col" className="py-2 pr-4">Type</th>
              <th scope="col" className="py-2 pr-4">Status</th>
              <th scope="col" className="py-2 pr-4">Owner</th>
              <th scope="col" className="py-2 pr-4">Region</th>
              <th scope="col" className="py-2 pr-4 text-right">Latency</th>
              <th scope="col" className="py-2 pr-4 text-right">RPS</th>
              <th scope="col" className="py-2 pr-4 text-right">Error %</th>
              <th scope="col" className="py-2 text-right">Cost/hr</th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node) => (
              <tr
                key={node.id}
                onClick={() => {
                  select(node.id);
                  onClose();
                }}
                className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/40"
              >
                <td className="py-2 pr-4 font-medium">{node.name}</td>
                <td className="py-2 pr-4 capitalize text-muted-foreground">
                  {node.type}
                </td>
                <td
                  className={cn(
                    "py-2 pr-4 font-medium capitalize",
                    STATUS_TEXT[node.status],
                  )}
                >
                  {node.status}
                </td>
                <td className="py-2 pr-4 text-muted-foreground">
                  {node.owner}
                </td>
                <td className="py-2 pr-4 text-muted-foreground">
                  {node.region}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums">
                  {node.latencyMs} ms
                </td>
                <td className="py-2 pr-4 text-right tabular-nums">
                  {node.requestsPerSecond}
                </td>
                <td className="py-2 pr-4 text-right tabular-nums">
                  {node.errorRatePercentage}%
                </td>
                <td className="py-2 text-right tabular-nums">
                  ${node.costPerHour}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

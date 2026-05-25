"use client";

import { cn } from "@/lib/utils";
import { useInfrastructureStore } from "@/store/infrastructure-store";
import type { ServiceStatus, ServiceType } from "@/features/infrastructure/types";

const STATUSES: ServiceStatus[] = ["healthy", "warning", "critical"];
const TYPES: ServiceType[] = [
  "frontend",
  "api",
  "service",
  "database",
  "cache",
  "queue",
  "storage",
  "external",
];

const STATUS_DOT: Record<ServiceStatus, string> = {
  healthy: "bg-status-healthy",
  warning: "bg-status-warning",
  critical: "bg-status-critical",
};

const chipClass = (active: boolean) =>
  cn(
    "rounded-md border px-2 py-1 text-[11px] capitalize transition-colors",
    active
      ? "border-primary/60 bg-primary/15 text-foreground"
      : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
  );

/** Status + type filter chips. Non-matching nodes dim in the scene (D9). */
export function FilterPanel() {
  const statusFilter = useInfrastructureStore((s) => s.statusFilter);
  const typeFilter = useInfrastructureStore((s) => s.typeFilter);
  const toggleStatus = useInfrastructureStore((s) => s.toggleStatusFilter);
  const toggleType = useInfrastructureStore((s) => s.toggleTypeFilter);
  const clearFilters = useInfrastructureStore((s) => s.clearFilters);

  const anyActive = statusFilter.length > 0 || typeFilter.length > 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Filters
        </p>
        {anyActive && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-[11px] text-primary hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => toggleStatus(status)}
            className={cn(
              chipClass(statusFilter.includes(status)),
              "flex items-center gap-1.5",
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", STATUS_DOT[status])}
            />
            {status}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => toggleType(type)}
            className={chipClass(typeFilter.includes(type))}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

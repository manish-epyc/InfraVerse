"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInfrastructureStore } from "@/store/infrastructure-store";
import {
  buildAdjacency,
  getDependencies,
  getDependents,
  getNodeMap,
} from "@/lib/graph-utils";
import type {
  EventLog,
  ServiceNode,
  ServiceStatus,
} from "@/features/infrastructure/types";

const STATUS_BADGE: Record<ServiceStatus, string> = {
  healthy: "border-status-healthy/30 bg-status-healthy/15 text-status-healthy",
  warning: "border-status-warning/30 bg-status-warning/15 text-status-warning",
  critical: "border-status-critical/30 bg-status-critical/15 text-status-critical",
};

const LOG_COLOR: Record<EventLog["type"], string> = {
  info: "bg-muted-foreground",
  success: "bg-status-healthy",
  warning: "bg-status-warning",
  error: "bg-status-critical",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Right-side drawer with full detail for the selected service (M8). */
export function ServiceDetailsPanel() {
  const selectedId = useInfrastructureStore((s) => s.selectedId);
  const nodes = useInfrastructureStore((s) => s.nodes);
  const edges = useInfrastructureStore((s) => s.edges);
  const logs = useInfrastructureStore((s) => s.logs);
  const activeIncident = useInfrastructureStore((s) => s.activeIncident);
  const simulationOverlay = useInfrastructureStore((s) => s.simulationOverlay);
  const select = useInfrastructureStore((s) => s.select);

  const nodeMap = useMemo(() => getNodeMap(nodes), [nodes]);
  const adjacency = useMemo(() => buildAdjacency(edges), [edges]);

  const node = selectedId ? (nodeMap.get(selectedId) ?? null) : null;
  const status: ServiceStatus = node
    ? (simulationOverlay[node.id] ?? node.status)
    : "healthy";

  const dependencies = node ? getDependencies(adjacency, node.id) : [];
  const dependents = node ? getDependents(adjacency, node.id) : [];
  const serviceLogs = node
    ? logs.filter((l) => l.serviceId === node.id).reverse().slice(0, 6)
    : [];
  const incident =
    node && activeIncident?.affectedServiceIds.includes(node.id)
      ? activeIncident
      : null;

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key="service-details-panel"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.24, ease: "easeOut" }}
          className="pointer-events-auto absolute right-0 top-0 z-30 flex h-full w-80 flex-col border-l border-border bg-card/95 backdrop-blur"
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4">
            <div className="min-w-0">
              <h2 className="truncate font-semibold leading-tight">
                {node.name}
              </h2>
              <p className="mt-0.5 text-xs capitalize text-muted-foreground">
                {node.type}
              </p>
            </div>
            <button
              type="button"
              onClick={() => select(null)}
              aria-label="Close details"
              className="rounded-md border border-border p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3 border-b border-border p-4">
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
                  STATUS_BADGE[status],
                )}
              >
                {status}
              </span>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <MetaRow label="Owner" value={node.owner} />
                <MetaRow label="Region" value={node.region} />
              </div>
            </div>

            <Section title="Metrics">
              <div className="grid grid-cols-2 gap-2">
                <Stat label="Latency" value={`${node.latencyMs} ms`} />
                <Stat label="Uptime" value={`${node.uptimePercentage}%`} />
                <Stat
                  label="Req / sec"
                  value={node.requestsPerSecond.toLocaleString()}
                />
                <Stat
                  label="Error rate"
                  value={`${node.errorRatePercentage}%`}
                />
                <Stat label="Cost / hr" value={`$${node.costPerHour}`} />
              </div>
            </Section>

            <Section title="Dependencies">
              <DepGroup
                title="Depends on"
                ids={dependencies}
                nodeMap={nodeMap}
                onSelect={select}
              />
              <DepGroup
                title="Depended on by"
                ids={dependents}
                nodeMap={nodeMap}
                onSelect={select}
              />
            </Section>

            <Section title="Recent Activity">
              {serviceLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground/70">
                  No recent events
                </p>
              ) : (
                <ul className="space-y-2">
                  {serviceLogs.map((log) => (
                    <li key={log.id} className="flex gap-2 text-xs">
                      <span
                        className={cn(
                          "mt-1 size-1.5 shrink-0 rounded-full",
                          LOG_COLOR[log.type],
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-foreground/90">{log.message}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatTime(log.timestamp)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>

            <Section title="Active Incidents" last>
              {incident ? (
                <div className="rounded-md border border-status-critical/30 bg-status-critical/10 p-2.5">
                  <p className="text-xs font-medium text-status-critical">
                    {incident.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {incident.description}
                  </p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Suggested action:
                    </span>{" "}
                    {incident.suggestedAction}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/70">
                  No active incidents
                </p>
              )}
            </Section>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right text-foreground">{value}</span>
    </>
  );
}

function Section({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("p-4", !last && "border-b border-border")}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/40 px-2.5 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

function DepGroup({
  title,
  ids,
  nodeMap,
  onSelect,
}: {
  title: string;
  ids: string[];
  nodeMap: Map<string, ServiceNode>;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mt-2 first:mt-0">
      <p className="text-[11px] text-muted-foreground">{title}</p>
      {ids.length === 0 ? (
        <p className="mt-1 text-xs text-muted-foreground/70">None</p>
      ) : (
        <div className="mt-1 flex flex-wrap gap-1">
          {ids.map((id) => {
            const dep = nodeMap.get(id);
            if (!dep) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                className="rounded border border-border bg-background/40 px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {dep.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

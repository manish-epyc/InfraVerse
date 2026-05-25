"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useInfrastructureStore } from "@/store/infrastructure-store";
import type { EventLog } from "@/features/infrastructure/types";

const DOT: Record<EventLog["type"], string> = {
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

/** Bottom event bar — most recent events first (M11). */
export function EventTimeline() {
  const logs = useInfrastructureStore((s) => s.logs);

  const recent = useMemo(
    () =>
      [...logs]
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
        .slice(-20)
        .reverse(),
    [logs],
  );

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-20 border-t border-border bg-card/85 backdrop-blur">
      <div className="flex items-center gap-3 px-4 py-2">
        <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Event Timeline
        </span>
        <div className="flex flex-1 gap-2 overflow-x-auto">
          {recent.length === 0 ? (
            <span className="text-xs text-muted-foreground">No events yet</span>
          ) : (
            recent.map((log) => (
              <div
                key={log.id}
                className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-background/50 px-2 py-1"
              >
                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    DOT[log.type],
                  )}
                />
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {formatTime(log.timestamp)}
                </span>
                <span className="max-w-[240px] truncate text-xs text-foreground/85">
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

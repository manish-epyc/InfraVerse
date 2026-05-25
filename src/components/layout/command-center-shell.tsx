"use client";

import { useState } from "react";
import Link from "next/link";
import { Table } from "lucide-react";
import { FilterPanel } from "@/components/panels/filter-panel";
import { IncidentSimulator } from "@/components/panels/incident-simulator";
import { SearchPanel } from "@/components/panels/search-panel";
import { ServiceDetailsPanel } from "@/components/panels/service-details-panel";
import { ServiceTable } from "@/components/panels/service-table";
import { ViewModeSwitcher } from "@/components/panels/view-mode-switcher";
import { MetricsCards } from "@/components/metrics/metrics-cards";
import { EventTimeline } from "@/components/timeline/event-timeline";
import { ResetViewButton } from "./reset-view-button";

/**
 * Floating command-center chrome over the full-bleed 3D scene: top bar, metrics
 * strip, left control sidebar, right detail drawer, bottom event timeline.
 */
export function CommandCenterShell() {
  const [tableOpen, setTableOpen] = useState(false);

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-3">
        <Link
          href="/"
          className="pointer-events-auto text-sm font-semibold tracking-tight"
        >
          Infra<span className="text-primary">Verse</span>
        </Link>
        <div className="pointer-events-auto flex items-center gap-2">
          <ResetViewButton />
          <button
            type="button"
            onClick={() => setTableOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <Table className="size-3.5" />
            Table view
          </button>
          <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            Command Center
          </span>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-14 z-10 flex justify-center px-4">
        <MetricsCards />
      </div>

      <aside className="pointer-events-auto absolute bottom-16 left-4 top-16 z-20 flex w-72 flex-col gap-5 overflow-y-auto rounded-xl border border-border bg-card/85 p-4 backdrop-blur">
        <SearchPanel />
        <FilterPanel />
        <ViewModeSwitcher />
        <IncidentSimulator />
      </aside>

      <ServiceDetailsPanel />
      <EventTimeline />

      {tableOpen && <ServiceTable onClose={() => setTableOpen(false)} />}
    </>
  );
}

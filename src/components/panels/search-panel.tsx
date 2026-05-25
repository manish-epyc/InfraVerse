"use client";

import { Search } from "lucide-react";
import { useInfrastructureStore } from "@/store/infrastructure-store";

/** Search services by name/type/owner/region; a result click focuses the node. */
export function SearchPanel() {
  const searchQuery = useInfrastructureStore((s) => s.searchQuery);
  const setSearchQuery = useInfrastructureStore((s) => s.setSearchQuery);
  const nodes = useInfrastructureStore((s) => s.nodes);
  const select = useInfrastructureStore((s) => s.select);

  const query = searchQuery.trim().toLowerCase();
  const results = query
    ? nodes.filter((n) =>
        `${n.name} ${n.type} ${n.owner} ${n.region}`
          .toLowerCase()
          .includes(query),
      )
    : [];

  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Search
      </p>
      <div className="relative">
        <Search className="absolute left-2 top-2 size-3.5 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Name, type, owner, region…"
          aria-label="Search services"
          className="w-full rounded-md border border-border bg-background/60 py-1.5 pl-7 pr-2 text-xs outline-none placeholder:text-muted-foreground focus:border-primary/60"
        />
      </div>

      {query && (
        <ul className="mt-2 max-h-44 space-y-1 overflow-y-auto">
          {results.length === 0 && (
            <li className="px-1 py-1 text-xs text-muted-foreground">
              No matching services
            </li>
          )}
          {results.slice(0, 8).map((node) => (
            <li key={node.id}>
              <button
                type="button"
                onClick={() => select(node.id)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted"
              >
                <span className="truncate font-medium">{node.name}</span>
                <span className="ml-2 shrink-0 capitalize text-muted-foreground">
                  {node.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Filter logic for the command-center sidebar (M7). Filters never remove a
 * node — non-matching nodes are dimmed in the 3D scene (D9).
 */

import type {
  ServiceNode,
  ServiceStatus,
  ServiceType,
} from "@/features/infrastructure/types";

export type NodeFilter = {
  searchQuery: string;
  statusFilter: ServiceStatus[];
  typeFilter: ServiceType[];
};

/** True when any filter is set (so the scene should start dimming). */
export function isFilterActive(filter: NodeFilter): boolean {
  return (
    filter.searchQuery.trim().length > 0 ||
    filter.statusFilter.length > 0 ||
    filter.typeFilter.length > 0
  );
}

/** True when a node satisfies every active filter (empty filter = matches). */
export function matchesFilter(node: ServiceNode, filter: NodeFilter): boolean {
  const { searchQuery, statusFilter, typeFilter } = filter;

  if (statusFilter.length > 0 && !statusFilter.includes(node.status)) {
    return false;
  }
  if (typeFilter.length > 0 && !typeFilter.includes(node.type)) {
    return false;
  }
  const query = searchQuery.trim().toLowerCase();
  if (query) {
    const haystack =
      `${node.name} ${node.type} ${node.owner} ${node.region}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

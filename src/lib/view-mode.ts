/**
 * Per-view-mode node appearance. Decides the colour and pulse-speed of every
 * service node based on the active view mode (D11):
 *
 * - **health**   — by effective status (base ∪ overlay); pulse on warning/critical.
 * - **incident** — only nodes touched by the active simulation are coloured;
 *                  everything else falls back to a muted grey. Pulse retained.
 * - **latency / cost / traffic** — heat-gradient by metric across the dataset.
 *                  No pulse — view modes are read-only analytical lenses.
 */

import type {
  ServiceNode,
  ServiceStatus,
  ViewMode,
} from "@/features/infrastructure/types";

const STATUS_COLOR: Record<ServiceStatus, string> = {
  healthy: "#3ecf8e",
  warning: "#e6b53d",
  critical: "#e5484d",
};
const PULSE_SPEED: Record<ServiceStatus, number> = {
  healthy: 0,
  warning: 2.2,
  critical: 5,
};

const MUTED_GREY = "#3c4753";
const HEAT_STOPS: [string, string, string] = ["#3ecf8e", "#e6b53d", "#e5484d"];
const TRAFFIC_STOPS: [string, string, string] = [
  "#234a5c",
  "#3fb6d4",
  "#7be4ff",
];

export type Appearance = { color: string; pulseSpeed: number };

export type MetricRanges = {
  latency: { min: number; max: number };
  cost: { min: number; max: number };
  traffic: { min: number; max: number };
};

/** Min/max per metric — feeds the heat-gradient view modes and the legend. */
export function computeRanges(nodes: ServiceNode[]): MetricRanges {
  if (nodes.length === 0) {
    return {
      latency: { min: 0, max: 1 },
      cost: { min: 0, max: 1 },
      traffic: { min: 0, max: 1 },
    };
  }
  let latMin = Infinity,
    latMax = -Infinity;
  let costMin = Infinity,
    costMax = -Infinity;
  let trMin = Infinity,
    trMax = -Infinity;
  for (const n of nodes) {
    if (n.latencyMs < latMin) latMin = n.latencyMs;
    if (n.latencyMs > latMax) latMax = n.latencyMs;
    if (n.costPerHour < costMin) costMin = n.costPerHour;
    if (n.costPerHour > costMax) costMax = n.costPerHour;
    if (n.requestsPerSecond < trMin) trMin = n.requestsPerSecond;
    if (n.requestsPerSecond > trMax) trMax = n.requestsPerSecond;
  }
  return {
    latency: { min: latMin, max: latMax },
    cost: { min: costMin, max: costMax },
    traffic: { min: trMin, max: trMax },
  };
}

export function getNodeAppearance(
  node: ServiceNode,
  viewMode: ViewMode,
  overlay: Record<string, ServiceStatus>,
  ranges: MetricRanges,
): Appearance {
  switch (viewMode) {
    case "health": {
      const status = overlay[node.id] ?? node.status;
      return { color: STATUS_COLOR[status], pulseSpeed: PULSE_SPEED[status] };
    }
    case "incident": {
      const status = overlay[node.id];
      if (status)
        return { color: STATUS_COLOR[status], pulseSpeed: PULSE_SPEED[status] };
      return { color: MUTED_GREY, pulseSpeed: 0 };
    }
    case "latency":
      return {
        color: heatColor(node.latencyMs, ranges.latency, HEAT_STOPS),
        pulseSpeed: 0,
      };
    case "cost":
      return {
        color: heatColor(node.costPerHour, ranges.cost, HEAT_STOPS),
        pulseSpeed: 0,
      };
    case "traffic":
      return {
        color: heatColor(
          node.requestsPerSecond,
          ranges.traffic,
          TRAFFIC_STOPS,
        ),
        pulseSpeed: 0,
      };
  }
}

function heatColor(
  value: number,
  range: { min: number; max: number },
  stops: [string, string, string],
): string {
  const t =
    range.max === range.min
      ? 0.5
      : Math.max(
          0,
          Math.min(1, (value - range.min) / (range.max - range.min)),
        );
  if (t <= 0.5) return lerpHex(stops[0], stops[1], t * 2);
  return lerpHex(stops[1], stops[2], (t - 0.5) * 2);
}

function lerpHex(a: string, b: string, t: number): string {
  const pa = parseHex(a);
  const pb = parseHex(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}
function parseHex(h: string) {
  return {
    r: parseInt(h.slice(1, 3), 16),
    g: parseInt(h.slice(3, 5), 16),
    b: parseInt(h.slice(5, 7), 16),
  };
}
function toHex(n: number) {
  return n.toString(16).padStart(2, "0");
}

export type ViewModeLegend = {
  label: string;
  format: (value: number) => string;
  stops: [string, string, string];
  range: { min: number; max: number };
};

export function getViewModeLegend(
  viewMode: ViewMode,
  ranges: MetricRanges,
): ViewModeLegend | null {
  switch (viewMode) {
    case "latency":
      return {
        label: "Latency",
        format: (v) => `${Math.round(v)} ms`,
        stops: HEAT_STOPS,
        range: ranges.latency,
      };
    case "cost":
      return {
        label: "Cost / hr",
        format: (v) => `$${v.toFixed(1)}`,
        stops: HEAT_STOPS,
        range: ranges.cost,
      };
    case "traffic":
      return {
        label: "Req / sec",
        format: (v) => v.toLocaleString(),
        stops: TRAFFIC_STOPS,
        range: ranges.traffic,
      };
    default:
      return null;
  }
}

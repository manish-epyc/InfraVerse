import type { SimulationPreset } from "./types";

/**
 * The six named failure scenarios (context.md §6.4 / PRD §10.6). Each is just
 * data fed to the rule-based engine — `hard` failures take the root critical,
 * `soft` failures take it to warning.
 */
export const simulationPresets: SimulationPreset[] = [
  {
    id: "payment-down",
    label: "Payment Service down",
    rootNodeId: "payment-service",
    severity: "hard",
    kindLabel: "outage",
    incidentTitle: "Payment Service is down",
    description:
      "Payment Service has gone offline. Checkout and order flows that depend on it are degraded.",
    suggestedAction:
      "Roll back the latest payment deployment and verify the database connection pool.",
  },
  {
    id: "db-latency",
    label: "Database latency spike",
    rootNodeId: "postgres-primary",
    severity: "soft",
    kindLabel: "latency spike",
    incidentTitle: "PostgreSQL Primary latency spike",
    description:
      "The primary database is responding slowly. Services querying it are seeing elevated latency.",
    suggestedAction:
      "Investigate slow queries and pool saturation; consider shifting read traffic to the replica.",
  },
  {
    id: "redis-unavailable",
    label: "Redis cache unavailable",
    rootNodeId: "redis-cache",
    severity: "hard",
    kindLabel: "unavailable",
    incidentTitle: "Redis Cache is unavailable",
    description:
      "The Redis cache is unreachable. Dependent services are falling back to slower data paths.",
    suggestedAction:
      "Restart the Redis node and verify cache-cluster health and memory pressure.",
  },
  {
    id: "queue-backlog",
    label: "Queue backlog",
    rootNodeId: "order-queue",
    severity: "soft",
    kindLabel: "backlog",
    incidentTitle: "Order Queue backlog building",
    description:
      "The order queue is backing up. Order processing is delayed for downstream consumers.",
    suggestedAction:
      "Scale out queue consumers and investigate the slow processing stage.",
  },
  {
    id: "auth-degraded",
    label: "Auth Service degraded",
    rootNodeId: "auth-service",
    severity: "soft",
    kindLabel: "degraded",
    incidentTitle: "Auth Service degraded",
    description:
      "Auth Service is degraded. Sign-in and token validation are slower across the platform.",
    suggestedAction:
      "Warm the token cache and check the identity provider's upstream latency.",
  },
  {
    id: "external-timeout",
    label: "External API timeout",
    rootNodeId: "stripe-api",
    severity: "hard",
    kindLabel: "timeout",
    incidentTitle: "Stripe Payments API timing out",
    description:
      "The external Stripe API is timing out. Payment capture is failing for dependent services.",
    suggestedAction:
      "Enable the payment retry queue and check Stripe's status page.",
  },
];

# InfraVerse — 3D Cloud Infrastructure Command Center

## 1. Project Overview

**InfraVerse** is a web-based 3D cloud infrastructure visualization platform.

It allows users to view services, APIs, databases, queues, caches, and external dependencies as an interactive 3D architecture map.

The application is intended as a polished showcase project built with **Next.js, TypeScript, and Three.js / React Three Fiber**.

---

## 2. Goal

Build a visually impressive website that demonstrates:

- 3D web development
- Modern frontend architecture
- Real-time-style UI
- System design thinking
- Cloud infrastructure understanding
- Interactive data visualization
- Clean hand-coded implementation

---

## 3. Target Users

### Primary Users

- Software engineers
- DevOps engineers
- Cloud engineers
- Engineering managers
- SRE teams

### Secondary Users

- Product managers
- Technical leadership
- Interviewers
- Internal company stakeholders

---

## 4. Core Concept

The website displays a company's cloud/application architecture in a 3D environment.

Each infrastructure component is represented as a node:

- Frontend App
- API Gateway
- Auth Service
- Payment Service
- Notification Service
- PostgreSQL Database
- Redis Cache
- Message Queue
- Object Storage
- External APIs

Connections between services are represented as animated lines showing request flow, latency, traffic, and dependency direction.

---

## 5. MVP Scope

The MVP should focus on a polished demo experience using mock infrastructure data.

### MVP Must-Have Features

- Landing page
- 3D infrastructure graph
- Interactive service nodes
- Animated traffic connections
- Service health status
- Service detail side panel
- Search service functionality
- Filter by status
- Failure simulation
- Dependency impact highlighting
- Logs/event timeline
- Metrics cards
- Responsive layout for desktop

---

## 6. Pages and Screens

## 6.1 Landing Page

### Purpose

Introduce the product and create a strong first impression.

### Sections

- Hero section
- 3D preview animation
- Product tagline
- Feature highlights
- Tech stack section
- CTA button to open command center

### Example CTA

```txt
Launch Command Center
```

---

## 6.2 Command Center Page

### Purpose

Main interactive 3D infrastructure view.

### Layout

```txt
---------------------------------------------------------
| Left Sidebar |        3D Infrastructure Map           |
|              |                                       |
| Filters      |                                       |
| Search       |                                       |
| View Modes   |                                       |
|              |                                       |
|-------------------------------------------------------|
| Bottom Event Timeline                                |
---------------------------------------------------------
| Right Service Detail Drawer                          |
---------------------------------------------------------
```

### Features

- Render 3D service nodes
- Render animated dependency lines
- Click node to open service details
- Hover node to show quick tooltip
- Search and focus on a service
- Filter services by health status
- Switch view modes:
  - Health
  - Latency
  - Cost
  - Traffic
  - Incidents

---

## 6.3 Service Details Panel

### Purpose

Show technical details for the selected service.

### Display Fields

- Service name
- Service type
- Current status
- Owner/team
- Region
- Uptime
- Latency
- Requests per second
- Error rate
- Cost per hour
- Dependencies
- Recent logs
- Active incidents

---

## 6.4 Incident Simulation Panel

### Purpose

Allow the user to simulate production issues.

### Simulation Options

- Payment Service down
- Database latency spike
- Redis cache unavailable
- Queue backlog
- Auth Service degraded
- External API timeout

### Expected Behavior

When a simulation is triggered:

- Affected node status changes
- Connected services are highlighted
- Animated traffic changes
- Logs are generated
- Impact summary is displayed
- Suggested action is shown

---

## 6.5 Architecture Upload Page

### Purpose

Allow users to upload a JSON architecture file and visualize it.

### MVP Behavior

- Upload `.json` file
- Validate schema
- Render nodes and edges
- Show validation errors if data is invalid

---

## 7. Functional Requirements

## 7.1 3D Graph Rendering

The system shall render infrastructure components as 3D nodes.

Each node shall support:

- Name label
- Type icon or shape
- Health status indicator
- Hover interaction
- Click interaction
- Camera focus on selection

---

## 7.2 Service Connections

The system shall render connections between services.

Each connection shall support:

- Source service
- Target service
- Direction
- Traffic animation
- Latency indicator
- Error rate indicator

---

## 7.3 Node Interaction

The user shall be able to:

- Hover over a node
- Click a node
- View node details
- Focus camera on selected node
- Highlight dependencies
- Reset camera view

---

## 7.4 Search

The user shall be able to search services by:

- Name
- Type
- Owner
- Region

When a result is selected:

- The camera moves to that node
- The node is highlighted
- The detail panel opens

---

## 7.5 Filters

The user shall be able to filter nodes by:

- Healthy
- Warning
- Critical
- Frontend
- API
- Service
- Database
- Cache
- Queue
- External API

---

## 7.6 View Modes

The system shall support multiple visualization modes.

### Health Mode

Shows service health status.

### Latency Mode

Highlights high-latency services and connections.

### Cost Mode

Highlights expensive services.

### Traffic Mode

Shows request volume intensity.

### Incident Mode

Highlights affected services during a failure.

---

## 7.7 Failure Simulation

The system shall allow users to trigger simulated incidents.

Each incident shall:

- Update service status
- Generate event logs
- Highlight affected dependencies
- Show impact summary
- Display suggested remediation

---

## 7.8 Event Timeline

The system shall display recent events such as:

- Service degraded
- Service recovered
- Latency spike detected
- Deployment completed
- Queue backlog detected
- Database connection errors

---

## 7.9 Metrics Cards

The system shall display high-level metrics:

- Total services
- Healthy services
- Warning services
- Critical services
- Average latency
- Total requests per second
- Estimated hourly cost
- Active incidents

---

## 7.10 JSON Architecture Import

The user shall be able to import architecture data using a JSON file.

The system shall validate:

- Required node fields
- Required edge fields
- Duplicate node IDs
- Missing source or target references
- Invalid status values
- Invalid service types

---

## 8. Non-Functional Requirements

## 8.1 Performance

- Initial page load should be optimized.
- 3D scene should run smoothly on modern laptops.
- Avoid unnecessary re-renders.
- Use memoization where required.
- Keep node count manageable for MVP.

### MVP Performance Target

- 30 to 60 FPS for 20-50 nodes
- Initial load under 3 seconds on a decent connection
- Smooth camera transitions

---

## 8.2 Responsiveness

The main command center should target desktop first.

Minimum supported layouts:

- Desktop
- Large tablet

Mobile support can show a simplified fallback screen.

---

## 8.3 Accessibility

The application should include:

- Keyboard-accessible UI controls
- Proper contrast
- Readable text
- ARIA labels for buttons
- Non-3D fallback data table for important information

---

## 8.4 Maintainability

The codebase should follow:

- TypeScript-first development
- Component-based architecture
- Reusable UI components
- Clean folder structure
- DRY principles
- SOLID-inspired separation of concerns
- Mock data separated from UI logic

---

## 8.5 Security

For MVP:

- Validate uploaded JSON files
- Avoid executing uploaded content
- Sanitize user input
- Restrict file size for uploads

For future production:

- Authentication
- Role-based access
- API authorization
- Audit logs
- Secure cloud provider credentials

---

## 9. Suggested Tech Stack

## 9.1 Frontend

```txt
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui
Framer Motion
```

## 9.2 3D Rendering

```txt
Three.js
React Three Fiber
Drei
```

## 9.3 State Management

```txt
Zustand
```

## 9.4 Charts and Metrics

```txt
Recharts
```

## 9.5 Data Handling

```txt
Mock JSON
Next.js API Routes
React Query
```

## 9.6 Optional Backend

```txt
PostgreSQL
Prisma
NextAuth/Auth.js
```

---

## 10. Recommended MVP Architecture

```txt
src/
  app/
    page.tsx
    command-center/
      page.tsx
    upload/
      page.tsx

  components/
    layout/
    ui/
    three/
    panels/
    metrics/
    timeline/

  features/
    infrastructure/
      components/
      hooks/
      services/
      types.ts
      mock-data.ts

  store/
    infrastructure-store.ts

  lib/
    graph-utils.ts
    simulation-engine.ts
    validation.ts
```

---

## 11. Data Model

## 11.1 Service Node

```ts
export type ServiceStatus = "healthy" | "warning" | "critical";

export type ServiceType =
  | "frontend"
  | "api"
  | "service"
  | "database"
  | "cache"
  | "queue"
  | "storage"
  | "external";

export type ServiceNode = {
  id: string;
  name: string;
  type: ServiceType;
  status: ServiceStatus;
  owner: string;
  region: string;
  latencyMs: number;
  uptimePercentage: number;
  requestsPerSecond: number;
  errorRatePercentage: number;
  costPerHour: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
};
```

---

## 11.2 Service Edge

```ts
export type ServiceEdge = {
  id: string;
  source: string;
  target: string;
  trafficRps: number;
  latencyMs: number;
  errorRatePercentage: number;
};
```

---

## 11.3 Incident

```ts
export type IncidentSeverity = "low" | "medium" | "high" | "critical";

export type Incident = {
  id: string;
  title: string;
  affectedServiceIds: string[];
  severity: IncidentSeverity;
  startedAt: string;
  status: "active" | "resolved";
  description: string;
  suggestedAction: string;
};
```

---

## 11.4 Event Log

```ts
export type EventLog = {
  id: string;
  timestamp: string;
  serviceId: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
};
```

---

## 12. Sample Mock Architecture

```json
{
  "nodes": [
    {
      "id": "web-app",
      "name": "Web App",
      "type": "frontend",
      "status": "healthy",
      "owner": "Frontend Team",
      "region": "ap-south-1",
      "latencyMs": 45,
      "uptimePercentage": 99.98,
      "requestsPerSecond": 1200,
      "errorRatePercentage": 0.02,
      "costPerHour": 4.5,
      "position": { "x": -4, "y": 1, "z": 0 }
    },
    {
      "id": "api-gateway",
      "name": "API Gateway",
      "type": "api",
      "status": "healthy",
      "owner": "Platform Team",
      "region": "ap-south-1",
      "latencyMs": 30,
      "uptimePercentage": 99.99,
      "requestsPerSecond": 1100,
      "errorRatePercentage": 0.01,
      "costPerHour": 6.2,
      "position": { "x": -2, "y": 1, "z": 0 }
    },
    {
      "id": "payment-service",
      "name": "Payment Service",
      "type": "service",
      "status": "warning",
      "owner": "Payments Team",
      "region": "ap-south-1",
      "latencyMs": 210,
      "uptimePercentage": 99.7,
      "requestsPerSecond": 380,
      "errorRatePercentage": 1.4,
      "costPerHour": 8.8,
      "position": { "x": 1, "y": 1, "z": 1 }
    },
    {
      "id": "postgres-db",
      "name": "PostgreSQL DB",
      "type": "database",
      "status": "healthy",
      "owner": "Database Team",
      "region": "ap-south-1",
      "latencyMs": 18,
      "uptimePercentage": 99.99,
      "requestsPerSecond": 900,
      "errorRatePercentage": 0.01,
      "costPerHour": 12.4,
      "position": { "x": 4, "y": 0, "z": 0 }
    }
  ],
  "edges": [
    {
      "id": "web-to-gateway",
      "source": "web-app",
      "target": "api-gateway",
      "trafficRps": 1100,
      "latencyMs": 30,
      "errorRatePercentage": 0.01
    },
    {
      "id": "gateway-to-payment",
      "source": "api-gateway",
      "target": "payment-service",
      "trafficRps": 380,
      "latencyMs": 210,
      "errorRatePercentage": 1.4
    },
    {
      "id": "payment-to-db",
      "source": "payment-service",
      "target": "postgres-db",
      "trafficRps": 320,
      "latencyMs": 18,
      "errorRatePercentage": 0.01
    }
  ]
}
```

---

## 13. UI Components

## 13.1 Core Components

- `CommandCenterLayout`
- `InfrastructureScene`
- `ServiceNodeMesh`
- `ConnectionLine`
- `TrafficParticles`
- `ServiceDetailsPanel`
- `SearchPanel`
- `FilterPanel`
- `MetricsCards`
- `EventTimeline`
- `IncidentSimulator`
- `ViewModeSwitcher`
- `ArchitectureUploader`

---

## 14. 3D Scene Requirements

## 14.1 Scene Elements

- Camera
- Lights
- Grid floor
- Service nodes
- Connection lines
- Floating labels
- Traffic particles
- Status animations
- Environment effects

## 14.2 Node Visuals

Suggested visual mapping:

| Service Type | Visual |
|---|---|
| Frontend | Cube or screen |
| API | Hexagon |
| Service | Sphere |
| Database | Cylinder |
| Cache | Small cylinder |
| Queue | Ring or stacked blocks |
| Storage | Box |
| External API | Portal-style node |

## 14.3 Status Visuals

| Status | Behavior |
|---|---|
| Healthy | Stable glow |
| Warning | Slow pulse |
| Critical | Fast pulse / shake |
| Selected | Highlight ring |
| Impacted | Dependency glow |

---

## 15. Incident Simulation Logic

## 15.1 Example: Payment Service Down

When triggered:

- `payment-service` status becomes `critical`
- Connected services become `warning`
- New incident is created
- New logs are added
- Error rate increases
- Traffic line animation changes
- Impacted services are highlighted

### Impacted Services

- Web App
- API Gateway
- Payment Service
- PostgreSQL DB
- Notification Service

### Suggested Action

```txt
Rollback latest payment deployment and verify database connection pool usage.
```

---

## 16. Success Criteria

The project is successful if:

- The landing page looks polished
- The 3D infrastructure map is interactive
- Users can click and inspect services
- Traffic animation is visible
- Failure simulation creates a clear visual impact
- The UI feels like a real engineering command center
- The project can be demoed in under 3 minutes
- The codebase is clean and understandable

---

## 17. Demo Script

```txt
1. Open landing page.
2. Click "Launch Command Center".
3. Show the 3D infrastructure map.
4. Click API Gateway and show service details.
5. Search for Payment Service.
6. Trigger "Payment Service Down" simulation.
7. Show affected services and event timeline.
8. Explain dependency impact.
9. Switch to Latency or Cost mode.
10. Upload a sample architecture JSON.
```

---

## 18. Development Phases

## Phase 1: Foundation

- Create Next.js project
- Set up TypeScript
- Set up Tailwind CSS
- Install shadcn/ui
- Create base layout
- Add landing page

## Phase 2: 3D Scene

- Install Three.js, React Three Fiber, Drei
- Create 3D canvas
- Add camera and lighting
- Render mock nodes
- Render connection lines
- Add labels

## Phase 3: Interactions

- Add hover behavior
- Add click selection
- Add service details panel
- Add camera focus
- Add search

## Phase 4: Simulation

- Add Zustand store
- Add incident simulation engine
- Add status updates
- Add dependency highlighting
- Add event logs

## Phase 5: Polish

- Add animations
- Add loading states
- Add responsive UI
- Add better visuals
- Add demo data
- Add README
- Deploy to Vercel

---

## 19. Future Enhancements

- Real AWS import
- Kubernetes manifest import
- OpenTelemetry integration
- Prometheus metrics integration
- Datadog integration
- Authentication
- Role-based access
- Multi-project support
- Saved layouts
- Team comments
- AI-generated incident summary
- AI-generated architecture explanation
- Export as image/PDF

---

## 20. Out of Scope for MVP

The following should not be included in the first version:

- Real-time AWS scanning
- Real billing integration
- Production authentication
- Full DevOps alerting
- Multi-tenant architecture
- Complex access control
- Real incident management workflow
- Kubernetes cluster auto-discovery

---

## 21. Recommended Project Name Options

- InfraVerse
- CloudLens 3D
- StackVision
- InfraGraph
- CloudPulse
- SystemScope
- DevOps Command Center

---

## 22. Final Recommendation

Build the MVP as a polished frontend-heavy website using mock data.

The strongest version for a company showcase is:

```txt
InfraVerse — A 3D cloud infrastructure command center that visualizes services, dependencies, health, traffic, and incident impact.
```

This project is feasible, visually impressive, and technically strong enough to showcase frontend, 3D graphics, architecture thinking, and product design.
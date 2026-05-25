import Link from "next/link";
import { Activity, Box, Layers, Network, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroScene } from "@/components/three/hero-scene";

const features = [
  {
    icon: Network,
    title: "3D Infrastructure Map",
    desc: "Every service, database, cache, and queue rendered as an interactive node in a navigable 3D space.",
  },
  {
    icon: Zap,
    title: "Failure Simulation",
    desc: "Trigger an outage and watch the impact cascade through the dependency graph in real time.",
  },
  {
    icon: Activity,
    title: "Live Metrics & Timeline",
    desc: "Headline health metrics and a streaming event timeline that update as the system changes.",
  },
  {
    icon: Layers,
    title: "Analytical View Modes",
    desc: "Re-read the same map through health, latency, cost, and traffic lenses.",
  },
  {
    icon: Search,
    title: "Search & Filter",
    desc: "Find any service by name, type, owner, or region — and focus the camera on it instantly.",
  },
  {
    icon: Box,
    title: "Bring Your Own Architecture",
    desc: "Upload a JSON description of your own system and visualize it the same way.",
  },
];

const techStack = [
  "Next.js",
  "TypeScript",
  "Three.js / R3F",
  "Tailwind CSS",
  "shadcn/ui",
  "Zustand",
];

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Infra<span className="text-primary">Verse</span>
        </Link>
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href="/command-center" />}
        >
          Launch Command Center
        </Button>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6">
      {/* blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(1 0 0 / 0.035) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* live 3D node cluster */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <HeroScene />
      </div>
      {/* vignette — keeps the hero copy readable over the scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 42% at 50% 50%, oklch(0.17 0.015 248 / 0.82), transparent 72%)",
        }}
      />
      {/* cyan top glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 0%, oklch(0.78 0.13 200 / 0.16), transparent 70%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="mb-6 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground">
          3D Cloud Infrastructure Command Center
        </span>
        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
          See your infrastructure
          <br />
          the way it actually <span className="text-primary">connects</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-balance text-muted-foreground">
          InfraVerse visualizes cloud services, dependencies, health, traffic,
          and incident impact as an interactive 3D architecture map.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href="/command-center" />}
          >
            Launch Command Center
          </Button>
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/upload" />}
          >
            Upload Architecture
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="border-t border-border/60 px-6 py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight">
            An engineering command center
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to explore an architecture, inspect its
            services, and understand how a failure spreads.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40 hover:bg-card"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-medium">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className="border-t border-border/60 px-6 py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Built with a modern frontend stack
        </h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          A hand-coded showcase of 3D web development and clean application
          architecture.
        </p>
        <ul className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CtaFooter() {
  return (
    <section className="border-t border-border/60 px-6 py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-balance">
          Ready to explore the map?
        </h2>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Open the command center and walk through a live cloud architecture.
        </p>
        <Button
          size="lg"
          className="mt-8"
          nativeButton={false}
          render={<Link href="/command-center" />}
        >
          Launch Command Center
        </Button>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
        <span>
          Infra<span className="text-primary">Verse</span> — 3D Cloud
          Infrastructure Command Center
        </span>
        {/* <span>Built with Next.js · Three.js · React Three Fiber</span> */}
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <SiteHeader />
      <HeroSection />
      <FeatureSection />
      <TechStackSection />
      <CtaFooter />
      <SiteFooter />
    </div>
  );
}

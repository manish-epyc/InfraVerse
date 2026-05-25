import Link from "next/link";
import { ArchitectureUploader } from "@/features/infrastructure/components/architecture-uploader";

export default function UploadPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Infra<span className="text-primary">Verse</span>
          </Link>
          <Link
            href="/command-center"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View default architecture →
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Upload an architecture
            </h1>
            <p className="mt-3 text-muted-foreground">
              Drop a JSON file describing your services and dependencies.
              Missing positions are auto-laid-out and the graph opens in the
              command center.
            </p>
          </div>
          <ArchitectureUploader />
        </div>
      </main>
    </div>
  );
}

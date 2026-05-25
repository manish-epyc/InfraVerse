import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        Upload Architecture
      </h1>
      <p className="max-w-md text-muted-foreground">
        Upload a JSON architecture file to visualize it. This page is built in
        Phase 3 (M13).
      </p>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href="/" />}
      >
        Back to landing
      </Button>
    </main>
  );
}

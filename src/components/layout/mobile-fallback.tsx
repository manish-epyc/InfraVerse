"use client";

import Link from "next/link";

/** Mobile fallback for the command center (D15 / IV-61). The full 3D scene
 *  needs ≥ 768px of width to lay out the sidebar + canvas + drawer + timeline. */
export function MobileFallback() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0f141b] px-6 text-center">
      <div className="max-w-sm">
        <span className="rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Desktop only
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">
          Best on a wider screen
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          InfraVerse uses a full-bleed 3D scene and side panels that need more
          room than this screen offers. Open it on a laptop or tablet (≥ 768px)
          to explore the command center.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm text-primary hover:underline"
        >
          ← Back to the landing page
        </Link>
      </div>
    </main>
  );
}

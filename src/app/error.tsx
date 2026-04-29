"use client";

import { useEffect } from "react";

export default function RouteErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sentry will be wired in Phase 9 — for now, surface to dev console.
    // We deliberately do NOT log error.message because it may contain PII.
    console.error("[error-boundary]", { digest: error.digest });
  }, [error.digest]);

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-balance">
          Something went sideways.
        </h1>
        <p className="text-pretty text-muted-foreground">
          A glitch on our end. Try again — if it keeps happening, give us a call.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="tel:9056780048"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border px-6 text-base font-medium transition hover:bg-muted"
          >
            Call 905-678-0048
          </a>
        </div>
        {error.digest ? (
          <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>
        ) : null}
      </div>
    </main>
  );
}

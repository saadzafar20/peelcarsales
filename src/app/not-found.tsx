import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary px-6 text-secondary-foreground">
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">404</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          That page is no longer on the lot.
        </h1>
        <p className="text-pretty text-secondary-foreground/75">
          The page you&apos;re looking for may have been sold, moved, or never existed. Browse the
          inventory or call us — we&apos;ll find what you need.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Back to home
          </Link>
          <a
            href="tel:9056780048"
            className="inline-flex h-11 items-center justify-center rounded-md border border-secondary-foreground/30 px-6 text-base font-medium transition hover:bg-secondary-foreground/5"
          >
            Call 905-678-0048
          </a>
        </div>
      </div>
    </main>
  );
}

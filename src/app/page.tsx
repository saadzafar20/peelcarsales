import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-secondary text-secondary-foreground">
      <section className="container flex min-h-screen flex-col items-center justify-center gap-10 py-16 text-center">
        <Image
          src="/logo.png"
          alt="Peel Car Sales"
          width={420}
          height={118}
          priority
          className="h-auto w-[280px] sm:w-[420px]"
        />
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            We&apos;re building something better.
          </h1>
          <p className="mx-auto max-w-xl text-pretty text-base text-secondary-foreground/80 sm:text-lg">
            Peel Car Sales 2.0 — a faster, smarter, PIPEDA-compliant used-car experience for the
            Greater Toronto Area. Mississauga and Oakville. OMVIC + UCDA licensed. AutoTrader Best
            Priced Dealer 2024 &amp; 2025.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="tel:9056780048"
            className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Call 905-678-0048
          </a>
          <a
            href="https://peelcarsales.com"
            className="inline-flex h-12 items-center justify-center rounded-md border border-secondary-foreground/30 bg-transparent px-6 text-base font-medium text-secondary-foreground transition hover:bg-secondary-foreground/5"
          >
            Visit current site
          </a>
        </div>
        <p className="pt-8 text-xs text-secondary-foreground/50">
          2701 Derry Rd East, Mississauga, ON L4T 1A2 · 333 Wyecroft Rd Unit 11, Oakville, ON L6K
          2H2
        </p>
      </section>
    </main>
  );
}

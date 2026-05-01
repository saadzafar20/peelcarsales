import Link from "next/link";
import { AutoVerifyWidget } from "@/components/embeds/autoverify-widget";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary text-secondary-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-secondary to-secondary" />
      <div className="container relative grid gap-10 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col justify-center gap-7">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            AutoTrader Best Priced Dealer 2024 + 2025
          </p>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            The right car. <br className="hidden sm:inline" />
            <span className="text-primary">The right price.</span> No surprises.
          </h1>

          <p className="max-w-lg text-pretty text-base text-secondary-foreground/80 sm:text-lg">
            150 vehicles across Mississauga &amp; Oakville. Free Carfax on every car, 150-point
            inspection, 7-day exchange, 30-day/1500&nbsp;km warranty, and financing for every credit
            situation — including newcomers, work permit, student, bad credit, or no credit.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="xl">
              <Link href="/inventory">Browse 150 vehicles</Link>
            </Button>
            <Button asChild variant="onDark" size="xl">
              <Link href="/financing">Get pre-qualified in 60s</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 border-t border-secondary-foreground/15 pt-7 text-sm">
            <Stat label="Avg days to delivery" value="3" />
            <Stat label="Lender network" value="20+" />
            <Stat label="5-star reviews" value="450+" />
          </div>
        </div>

        <PreQualCard />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-3xl font-bold leading-none">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wider text-secondary-foreground/60">
        {label}
      </div>
    </div>
  );
}

/**
 * Hero-side pre-qualification card. Hosts the live AutoVerify SDK widget.
 * Falls back to a styled outline when the widget ID isn't yet set in env.
 */
function PreQualCard() {
  return (
    <div className="relative isolate flex flex-col justify-center">
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-2xl" />
      <div className="rounded-2xl border border-secondary-foreground/15 bg-secondary/60 p-7 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            Soft credit check · Won&apos;t affect your score
          </p>
          <span className="rounded-full bg-secondary-foreground/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-secondary-foreground/70">
            60-second
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
          Find out what you can afford
        </h2>
        <p className="mt-2 text-sm text-secondary-foreground/75">
          Tell us your income, employment, and where you live. Our 20+ Canadian lenders return your
          pre-qualified affordability range and rate in under a minute.
        </p>
        <AutoVerifyWidget placement="home" className="mt-5 min-h-[180px] w-full" />
        <ul className="mt-5 space-y-2 text-sm text-secondary-foreground/85">
          <li className="flex items-center gap-2">
            <Check /> Good credit, bad credit, no credit
          </li>
          <li className="flex items-center gap-2">
            <Check /> Newcomers, work permit, student permit
          </li>
          <li className="flex items-center gap-2">
            <Check /> Bankruptcy &amp; consumer proposal accepted
          </li>
        </ul>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/financing/apply">Start full application</Link>
        </Button>
        <p className="mt-3 text-center text-[11px] text-secondary-foreground/55">
          OMVIC + UCDA licensed · PIPEDA-compliant intake
        </p>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="size-4 shrink-0 text-accent" fill="currentColor">
      <title>Included</title>
      <path d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.41 0l-3.5-3.5a1 1 0 111.41-1.42L8.5 12.09l6.79-6.8a1 1 0 011.414 0z" />
    </svg>
  );
}

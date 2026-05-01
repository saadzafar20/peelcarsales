import Link from "next/link";
import { CarfaxTrueTrade } from "@/components/embeds/carfax-truetrade";
import { Button } from "@/components/ui/button";

/**
 * Trade-in CTA. Phase 3 will replace this body with the embedded Carfax
 * TrueTrade widget on /sell-trade and on every VDP. For now it advertises
 * the value of the upcoming tool.
 */
export function TradeInBand() {
  return (
    <section className="border-y border-border bg-muted/40 py-20">
      <div className="container grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Trade in or sell outright
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Real Carfax-backed valuation in 60 seconds.
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
            Powered by Carfax TrueTrade — the same tool dealers across Canada use for trade-in
            appraisals. Get a real offer range based on actual Canadian market data, not a guess.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Dot /> Type your VIN, plate, or upload a plate photo
            </li>
            <li className="flex items-start gap-2">
              <Dot /> See condition-adjusted offer range instantly
            </li>
            <li className="flex items-start gap-2">
              <Dot /> No obligation — sell to us or trade in
            </li>
          </ul>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/sell-trade">Get my Carfax valuation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="tel:9056780048">Or call 905-678-0048</a>
            </Button>
          </div>
        </div>

        <div className="relative isolate">
          <div className="absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br from-accent/30 via-primary/10 to-transparent blur-2xl" />
          <div className="rounded-2xl border border-border bg-card p-7 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Carfax TrueTrade
              </span>
              <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                Powered by Carfax
              </span>
            </div>
            <CarfaxTrueTrade variant="banner" className="min-h-[260px]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden />;
}

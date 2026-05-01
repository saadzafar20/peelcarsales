import type { Metadata } from "next";
import Link from "next/link";
import { CarfaxTrueTrade } from "@/components/embeds/carfax-truetrade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sell or trade your car — instant Carfax-backed valuation",
  description:
    "Get a real Canadian-market valuation in 60 seconds powered by Carfax TrueTrade. Sell to us outright or apply your trade-in to a new vehicle. No obligation.",
};

const STEPS = [
  {
    n: 1,
    title: "Tell us about your car",
    body: "VIN, plate, or upload a photo of your licence plate — we decode the VIN automatically.",
  },
  {
    n: 2,
    title: "Carfax-backed estimate",
    body: "Real Canadian market valuation pulled from Carfax TrueTrade. See wholesale, trade target, and retail.",
  },
  {
    n: 3,
    title: "Bring it in",
    body: "Quick in-person inspection at our Mississauga or Oakville lot. Final offer in under 30 minutes.",
  },
  {
    n: 4,
    title: "Trade or sell",
    body: "Apply your trade as a down payment, or take the cheque. Same-day payment.",
  },
];

const REASONS = [
  "Real Canadian-market data — not US KBB",
  "No obligation, no pressure",
  "Same-day payment if you sell to us",
  "Apply trade equity as your down payment",
  "We handle plate transfer + paperwork",
  "Free pickup within the GTA on agreed offers",
];

export default function SellTradePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary py-16 text-secondary-foreground sm:py-20">
        <div className="container max-w-5xl">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Sell or trade · powered by Carfax TrueTrade
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Real value for your car. <br className="hidden sm:inline" />
                <span className="text-primary">In under 60 seconds.</span>
              </h1>
              <p className="text-secondary-foreground/80">
                The same Carfax-backed valuation tool dealers across Canada use. Get a real offer
                range based on actual market data, not a guess. Sell to us outright or apply the
                trade to a new vehicle.
              </p>
            </div>

            <Card className="bg-card text-card-foreground shadow-xl">
              <CardContent className="space-y-5 p-7">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Get my valuation
                  </p>
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                    Powered by Carfax
                  </span>
                </div>

                <CarfaxTrueTrade variant="iframe" className="min-h-[600px]" />

                <Button asChild size="lg" className="w-full">
                  <a href="tel:9056780048">Or call 905-678-0048</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-muted/40 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mt-3 text-muted-foreground">
              Four steps. About 30 minutes from start to a cheque in your hand.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n} className="space-y-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
                  {step.n}
                </div>
                <h3 className="font-display text-base font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">Why sell to us?</h2>
            <p className="mt-3 text-muted-foreground">
              We&apos;re a 150-vehicle dealership across Mississauga and Oakville. We need
              inventory. That makes us aggressive on offers.
            </p>
            <ul className="mt-7 grid gap-2 sm:grid-cols-2">
              {REASONS.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm">
                  <span aria-hidden className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="space-y-4 p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                Sample valuation
              </p>
              <p className="text-sm text-secondary-foreground/70">2019 Honda CR-V EX-L AWD</p>
              <p className="font-display text-4xl font-bold tracking-tight">$24,800 – $26,300</p>
              <p className="text-xs text-secondary-foreground/65">
                78,500 km · Greater Toronto Area · condition: Good
              </p>
              <div className="grid grid-cols-3 gap-3 border-t border-secondary-foreground/15 pt-4 text-xs">
                <div>
                  <div className="uppercase tracking-wider text-secondary-foreground/65">
                    Wholesale
                  </div>
                  <div className="mt-1 font-display font-bold">$22,400</div>
                </div>
                <div>
                  <div className="uppercase tracking-wider text-secondary-foreground/65">
                    Trade target
                  </div>
                  <div className="mt-1 font-display font-bold">$25,500</div>
                </div>
                <div>
                  <div className="uppercase tracking-wider text-secondary-foreground/65">
                    Retail
                  </div>
                  <div className="mt-1 font-display font-bold">$28,900</div>
                </div>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/inventory">Browse our inventory →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

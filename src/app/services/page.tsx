import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Why Peel — buyer protection, inspection, warranty",
  description:
    "150-point inspection, free Carfax, 7-day exchange policy, 30-day warranty, $1,000 reconditioning program. The standard every used-car dealership should hold itself to.",
};

const PROTECTION = [
  {
    title: "150-point mechanical inspection",
    body: "Every vehicle goes through a full inspection by our certified technicians before it hits the lot. Brakes, suspension, steering, electrical, drivetrain, fluids, undercarriage — 150 specific checks, signed off in writing.",
  },
  {
    title: "Free Carfax Canada history report",
    body: "We pull and share the full Carfax for every vehicle before you ask. No accidents hidden. No kilometres rolled back. If the Carfax shows something, we tell you up front.",
  },
  {
    title: "$1,000 reconditioning standard",
    body: "Every car gets up to $1,000 in reconditioning — detail, paint touch-ups, minor mechanical, cosmetic interior — to bring it to a standard we'd put a family member in.",
  },
  {
    title: "7-day exchange policy",
    body: "Drove home, lived with it for a few days, decided it's not the one? Bring it back within 7 days for any other vehicle on the lot. No questions, no fees.",
  },
  {
    title: "30-day / 1500 km powertrain warranty",
    body: "Included free with every purchase. Covers engine, transmission, transfer case, and differential failures. Extendable up to 4 years through our lender warranty network.",
  },
  {
    title: "OMVIC + UCDA licensed",
    body: "Ontario Motor Vehicle Industry Council registered. Used Car Dealers Association of Ontario member. Both regulators give you formal recourse if something goes wrong — not many small dealers can say that.",
  },
];

const INSPECTION_CATEGORIES = [
  "Engine + cooling system",
  "Transmission + drivetrain",
  "Brakes + ABS",
  "Suspension + steering",
  "Electrical + battery",
  "Heating + AC",
  "Tires + wheels",
  "Body + frame",
  "Interior + trim",
  "Exterior lighting",
  "Glass + wipers",
  "Safety systems",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Why buy from Peel"
        title="Buyer protection, in writing."
        subtitle="The inspection, warranty, and exchange terms most dealers won't put on paper. We do — because we want you back when you buy your next car too."
        variant="dark"
      />

      {/* 6 protection cards */}
      <section className="container py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROTECTION.map((p) => (
            <Card key={p.title}>
              <CardContent className="space-y-2 p-6">
                <h3 className="font-display text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Inspection breakdown */}
      <section className="border-y border-border bg-muted/40 py-16">
        <div className="container max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                What we check
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                A 150-point inspection isn&apos;t a marketing line.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every category below contains 8–15 specific check items. Our certified technicians
                sign off on each item, and you get the full report before you buy. If something
                fails, we either fix it or disclose it — no surprises after delivery.
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-2 self-center">
              {INSPECTION_CATEGORIES.map((c) => (
                <li
                  key={c}
                  className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Warranty extension */}
      <section className="container py-16">
        <Card className="bg-secondary text-secondary-foreground">
          <CardContent className="grid items-center gap-8 p-10 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Optional warranty extension
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                Extended warranty up to 4 years.
              </h2>
              <p className="mt-3 text-secondary-foreground/75">
                Through our lender-network warranty partners. Covers powertrain, electrical, ABS,
                AC, fuel system. Roadside assistance included. Quote on request — usually adds
                $14–$28 per bi-weekly payment.
              </p>
            </div>
            <Button asChild size="lg" className="lg:justify-self-end">
              <Link href="/contact">Talk to our finance team</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

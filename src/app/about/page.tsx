import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Peel Car Sales — family-run, OMVIC + UCDA licensed",
  description:
    "OMVIC + UCDA licensed. AutoTrader Best Priced Dealer 2024 + 2025. CarGurus Top Rated. Family-run dealership with 450+ five-star reviews across Mississauga and Oakville.",
};

const VALUES = [
  {
    title: "Honesty over the close",
    body: "If a car has a story — a repaired panel, a former rental, anything — we tell you before you ask. We'd rather lose a sale than your trust.",
  },
  {
    title: "Make it easy",
    body: "We pre-qualify in 60 seconds, hold cars with a refundable deposit, and finish paperwork in under an hour. We respect your time.",
  },
  {
    title: "Stick around",
    body: "We answer the phone after you drive off. Plate stickers, recall lookups, service questions, future financing — call us, you're a customer for life.",
  },
];

const AWARDS = [
  { label: "AutoTrader Best Priced Dealer", years: "2024 + 2025" },
  { label: "CarGurus Top Rated", years: "2023 – 2025" },
  { label: "OMVIC Registered Dealer", years: "Since founding" },
  { label: "UCDA Member in Good Standing", years: "Since founding" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Peel Car Sales"
        title="Family-run dealership. Built around honesty."
        subtitle="Two locations across the GTA. 150 vehicles in inventory. 450+ five-star reviews. OMVIC + UCDA licensed. Inder, Mehran, Gurpreet, and Sami care about getting it right."
        variant="dark"
      />

      <section className="container py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-relaxed text-foreground/90">
          <p>
            Peel Car Sales started with one lot on Derry Road and a simple promise: every car we
            sell, we&apos;d put a member of our own family in. Years later, with a second location
            on Wyecroft in Oakville and 150 vehicles across the two lots, we still write that
            promise into the inspection sheet.
          </p>
          <p>
            We&apos;re proud to serve the Greater Toronto Area&apos;s South Asian, Punjabi, and
            new-Canadian communities. We speak the languages, we know the lender programs for
            newcomers and work-permit holders, and our reviews from Inder, Mehran, Gurri, and
            Sami&apos;s customers are the proof.
          </p>
          <p>
            We&apos;re OMVIC and UCDA licensed — the two regulators that give Ontario buyers formal
            recourse if a dealer doesn&apos;t hold up their end. We&apos;ve been AutoTrader&apos;s
            Best Priced Dealer two years running and CarGurus Top Rated three years running.
            That&apos;s data, not branding.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-muted/40 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">What we stand for</h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {VALUES.map((v) => (
              <Card key={v.title}>
                <CardContent className="space-y-2 p-6">
                  <h3 className="font-display text-base font-semibold tracking-tight">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold tracking-tight">Awards & licensing</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {AWARDS.map((a) => (
              <li
                key={a.label}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
              >
                <span className="font-medium">{a.label}</span>
                <span className="text-sm text-muted-foreground">{a.years}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/staff">Meet the team</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/inventory">Browse inventory</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

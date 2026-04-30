import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { VehicleCard } from "@/components/site/vehicle-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CITIES, getCity } from "@/lib/cities";
import { SAMPLE_VEHICLES } from "@/lib/sample-inventory";

type Params = Promise<{ city: string }>;

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return {
    title: `Used cars in ${c.name} — 150 inspected vehicles, free Carfax`,
    description: `Used cars for sale in ${c.name}, ${c.region}. 150-vehicle inventory across our Mississauga and Oakville lots. ${c.distance}. AutoTrader Best Priced 2024+2025.`,
    alternates: { canonical: `/${c.slug}/used-cars` },
  };
}

export default async function CityInventoryPage({ params }: { params: Params }) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  // Surface the nearest-lot inventory first — buyers driving to the lot will
  // mostly see vehicles physically at that location.
  const nearestFirst = [...SAMPLE_VEHICLES].sort((a, b) =>
    a.location === c.nearestLot && b.location !== c.nearestLot
      ? -1
      : b.location === c.nearestLot && a.location !== c.nearestLot
        ? 1
        : 0,
  );
  const featured = nearestFirst.slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow={`Used cars in ${c.region}`}
        title={`Used cars in ${c.name}`}
        subtitle={c.hook}
        variant="dark"
      />

      <section className="container py-16">
        <div className="mx-auto max-w-3xl space-y-5 text-base leading-relaxed text-foreground/90">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            Why Peel Car Sales for {c.name} buyers
          </h2>
          <p>
            Whether you live in {c.name} or commute through {c.region}, our 150-vehicle inventory
            across Mississauga and Oakville means you have the largest selection of inspected,
            Carfax-clean used cars within easy driving distance. <strong>{c.distance}.</strong>
          </p>
          <p>
            We&apos;re OMVIC and UCDA licensed, AutoTrader Best Priced Dealer for 2024 and 2025, and
            CarGurus Top Rated. Every vehicle on the lot includes a 150-point inspection, free
            Carfax history report, 7-day exchange policy, and 30-day powertrain warranty. Financing
            is available for every credit situation — bad credit, no credit, work permit, student
            permit, newcomer, bankruptcy, and consumer proposal.
          </p>
          <p>
            Our team speaks English, Punjabi, Hindi, and Urdu. {c.name} customers consistently rate
            us 5 stars on Google for the in-store experience and the post-purchase support. Plate
            sticker renewals, recall lookups, future financing — we answer the phone after you drive
            off.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 py-16">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Inventory near {c.name}
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">
                Featured vehicles · {c.nearestLot} lot first
              </h2>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link href="/inventory">View all 150 vehicles →</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v, i) => (
              <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <Card className="bg-secondary text-secondary-foreground">
          <CardContent className="grid items-center gap-8 p-10 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                Driving from {c.name}
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">{c.distance}.</h2>
              <p className="mt-3 text-secondary-foreground/75">
                Open 7 days. Free Carfax printout when you walk in. Test drives don&apos;t require a
                deposit. Pre-qualify on your phone before you even get here, and we can have
                paperwork ready when you arrive.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild size="lg">
                <Link href="/directions">Get directions</Link>
              </Button>
              <Button asChild variant="onDark" size="lg">
                <a href="tel:9056780048">Call 905-678-0048</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="border-t border-border bg-muted/40 py-12">
        <div className="container">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Nearby cities we serve
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CITIES.filter((other) => other.slug !== c.slug).map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/${other.slug}/used-cars`}
                  className="inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium transition hover:border-primary hover:text-primary"
                >
                  Used cars in {other.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

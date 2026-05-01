import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AutoVerifyWidget } from "@/components/embeds/autoverify-widget";
import { CarfaxTrueTrade } from "@/components/embeds/carfax-truetrade";
import { VehicleCard } from "@/components/site/vehicle-card";
import { VehicleGallery } from "@/components/site/vehicle-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  badgeLabel,
  bodyTypeLabel,
  drivetrainLabel,
  estimateBiweeklyPaymentCents,
  fuelLabel,
  transmissionLabel,
  vehicleTitle,
} from "@/lib/inventory";
import {
  getSampleVehicleBySlug,
  getSimilarSampleVehicles,
  SAMPLE_VEHICLES,
} from "@/lib/sample-inventory";
import { formatMileage, formatPriceCAD } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return SAMPLE_VEHICLES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getSampleVehicleBySlug(slug);
  if (!vehicle) return {};
  return {
    title: `${vehicleTitle(vehicle)} · ${formatPriceCAD(vehicle.priceCents)}`,
    description: vehicle.description,
  };
}

export default async function VehicleDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const vehicle = getSampleVehicleBySlug(slug);
  if (!vehicle) notFound();

  const biweekly = estimateBiweeklyPaymentCents({ priceCents: vehicle.priceCents });
  const monthly = (estimateBiweeklyPaymentCents({ priceCents: vehicle.priceCents }) * 26) / 12;
  const isDiscounted =
    vehicle.wasPriceCents !== undefined && vehicle.wasPriceCents > vehicle.priceCents;
  const similar = getSimilarSampleVehicles(vehicle, 4);

  return (
    <article>
      {/* Top breadcrumb */}
      <div className="border-b border-border bg-muted/30 py-3">
        <div className="container text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>{" "}
          <span aria-hidden>/</span>{" "}
          <Link href="/inventory" className="hover:text-foreground">
            Inventory
          </Link>{" "}
          <span aria-hidden>/</span>{" "}
          <span className="text-foreground">{vehicleTitle(vehicle)}</span>
        </div>
      </div>

      <div className="container py-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* Left: gallery + content */}
          <div className="space-y-10">
            <header className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {vehicle.badges.map((b) => (
                  <Badge
                    key={b}
                    variant={
                      b === "best-priced" ? "accent" : b === "price-drop" ? "default" : "secondary"
                    }
                  >
                    {badgeLabel(b)}
                  </Badge>
                ))}
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {vehicleTitle(vehicle)}
              </h1>
              <p className="text-muted-foreground">
                {formatMileage(vehicle.mileageKm)} · {bodyTypeLabel(vehicle.bodyType)} ·{" "}
                {drivetrainLabel(vehicle.drivetrain)} · {vehicle.exteriorColor} on{" "}
                {vehicle.interiorColor} · Stock #{vehicle.id.toUpperCase()} · {vehicle.location}
              </p>
            </header>

            <VehicleGallery baseSeed={vehicle.photoSeed} alt={vehicleTitle(vehicle)} />

            {/* Mobile price strip — visible above specs on small screens */}
            <div className="rounded-xl border border-border bg-card p-5 lg:hidden">
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-display text-3xl font-bold tracking-tight">
                    {formatPriceCAD(vehicle.priceCents)}
                  </div>
                  {isDiscounted && vehicle.wasPriceCents ? (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPriceCAD(vehicle.wasPriceCents)}
                    </div>
                  ) : null}
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">From</div>
                  <div className="font-semibold text-primary">
                    {formatPriceCAD(biweekly)} bi-weekly
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button asChild size="lg">
                  <a href="tel:9056780048">Call now</a>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="/financing">Pre-qualify</Link>
                </Button>
              </div>
            </div>

            <Section title="Vehicle highlights">
              <p className="text-base leading-relaxed text-foreground/90">{vehicle.description}</p>
            </Section>

            <Section title="Specs">
              <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                <Spec label="Year">{vehicle.year}</Spec>
                <Spec label="Make">{vehicle.make}</Spec>
                <Spec label="Model">{vehicle.model}</Spec>
                <Spec label="Trim">{vehicle.trim}</Spec>
                <Spec label="Body">{bodyTypeLabel(vehicle.bodyType)}</Spec>
                <Spec label="Drivetrain">{drivetrainLabel(vehicle.drivetrain)}</Spec>
                <Spec label="Transmission">{transmissionLabel(vehicle.transmission)}</Spec>
                <Spec label="Fuel">{fuelLabel(vehicle.fuel)}</Spec>
                <Spec label="Mileage">{formatMileage(vehicle.mileageKm)}</Spec>
                <Spec label="Exterior">{vehicle.exteriorColor}</Spec>
                <Spec label="Interior">{vehicle.interiorColor}</Spec>
                <Spec label="Stock #">{vehicle.id.toUpperCase()}</Spec>
                <Spec label="VIN">{vehicle.vin}</Spec>
                <Spec label="Location">{vehicle.location}</Spec>
              </dl>
            </Section>

            <Section title="Features & options">
              <ul className="grid gap-2 sm:grid-cols-2">
                {vehicle.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckMark /> {f}
                  </li>
                ))}
              </ul>
            </Section>

            {/* TrueTrade banner — apply trade against this exact car */}
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="space-y-4 p-6">
                <div>
                  <h3 className="font-display text-lg font-semibold">Trade your current car?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get an instant Carfax-backed valuation and apply it as your down payment on this{" "}
                    {vehicle.year} {vehicle.make} {vehicle.model}.
                  </p>
                </div>
                <CarfaxTrueTrade variant="banner" className="min-h-[200px]" />
              </CardContent>
            </Card>
          </div>

          {/* Right: sticky price + CTAs (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <Card>
                <CardContent className="space-y-5 p-6">
                  <div>
                    <div className="font-display text-4xl font-bold tracking-tight">
                      {formatPriceCAD(vehicle.priceCents)}
                    </div>
                    {isDiscounted && vehicle.wasPriceCents ? (
                      <div className="mt-1 text-sm text-muted-foreground">
                        <span className="line-through">
                          {formatPriceCAD(vehicle.wasPriceCents)}
                        </span>{" "}
                        <span className="font-semibold text-primary">
                          Save {formatPriceCAD(vehicle.wasPriceCents - vehicle.priceCents)}
                        </span>
                      </div>
                    ) : null}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Plus HST &amp; licensing. Price excludes registration.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Estimated payment
                    </div>
                    <div className="mt-1 font-display text-2xl font-bold">
                      {formatPriceCAD(biweekly)}{" "}
                      <span className="text-sm font-normal">bi-weekly</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ≈ {formatPriceCAD(Math.round(monthly))} / month · 84mo @ 7.99% APR · sample
                      rate, real quote on pre-qualification
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button asChild size="lg" className="w-full">
                      <Link href="/financing">Get pre-qualified in 60s</Link>
                    </Button>
                    <Button asChild variant="secondary" size="lg" className="w-full">
                      <a href="tel:9056780048">Call 905-678-0048</a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full" disabled>
                      <span>
                        Hold this car · $500 refundable
                        <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          Phase 1
                        </span>
                      </span>
                    </Button>
                  </div>

                  <Separator />

                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckMark small /> Free Carfax history report
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckMark small /> 150-point inspection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckMark small /> 7-day exchange policy
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckMark small /> 30-day / 1500 km warranty
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-secondary text-secondary-foreground">
                <CardContent className="space-y-3 p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Soft credit check
                  </p>
                  <p className="font-display text-lg font-semibold">
                    Find out what you can afford in 60 seconds
                  </p>
                  <p className="text-sm text-secondary-foreground/75">
                    Bad credit, work permit, student permit, newcomer — we&apos;ve got 20+ lenders
                    ready to work with you.
                  </p>
                  <AutoVerifyWidget placement="vdp" className="min-h-[200px]" />
                  <Button asChild size="lg" className="w-full">
                    <Link href="/financing/apply">Start full application</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {similar.length > 0 ? (
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container">
            <h2 className="font-display text-2xl font-bold tracking-tight">Similar vehicles</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}

function CheckMark({ small }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={small ? "size-3.5 shrink-0 text-primary" : "size-5 shrink-0 text-primary"}
      fill="currentColor"
    >
      <title>Included</title>
      <path d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.41 0l-3.5-3.5a1 1 0 111.41-1.42L8.5 12.09l6.79-6.8a1 1 0 011.414 0z" />
    </svg>
  );
}

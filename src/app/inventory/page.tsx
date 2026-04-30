import type { Metadata } from "next";
import { InventoryFilters } from "@/components/site/inventory-filters";
import { VehicleCard } from "@/components/site/vehicle-card";
import { Badge } from "@/components/ui/badge";
import { type BodyType, SAMPLE_VEHICLES } from "@/lib/sample-inventory";

export const metadata: Metadata = {
  title: "Inventory · 150 used cars in Mississauga & Oakville",
  description:
    "Browse our 150-vehicle inventory of used cars across Mississauga and Oakville. Carfax-clean, 150-point inspected, AutoTrader Best Priced. Financing for every credit situation.",
};

const VALID_BODY_TYPES: BodyType[] = [
  "sedan",
  "suv",
  "hatchback",
  "coupe",
  "truck",
  "van",
  "wagon",
];

type SearchParams = Promise<{ body?: string; sort?: string }>;

export default async function InventoryPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const selectedBody =
    params.body && VALID_BODY_TYPES.includes(params.body as BodyType)
      ? (params.body as BodyType)
      : undefined;
  const sort = params.sort ?? "featured";

  let vehicles = selectedBody
    ? SAMPLE_VEHICLES.filter((v) => v.bodyType === selectedBody)
    : SAMPLE_VEHICLES;

  vehicles = [...vehicles].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.priceCents - b.priceCents;
      case "price-desc":
        return b.priceCents - a.priceCents;
      case "km-asc":
        return a.mileageKm - b.mileageKm;
      case "newest":
        return b.year - a.year;
      default:
        return a.daysOnLot - b.daysOnLot;
    }
  });

  return (
    <>
      {/* Page header */}
      <section className="border-b border-border bg-muted/40 py-12">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Used vehicles · Mississauga + Oakville
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {selectedBody
                  ? `${selectedBody[0]?.toUpperCase()}${selectedBody.slice(1)} inventory`
                  : "All inventory"}
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"} matched. Free
                Carfax, 150-point inspection, 7-day exchange, and 30-day warranty included on every
                car.
              </p>
            </div>
            <Badge variant="muted" className="px-3 py-1.5">
              Sample data — Phase 1 wires real inventory
            </Badge>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container py-12">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <InventoryFilters selectedBody={selectedBody} />

          <div className="space-y-6">
            {/* Sort bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{vehicles.length}</span>{" "}
                {vehicles.length === 1 ? "result" : "results"}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <SortLink sort="featured" current={sort} body={selectedBody}>
                  Featured
                </SortLink>
                <SortLink sort="newest" current={sort} body={selectedBody}>
                  Newest
                </SortLink>
                <SortLink sort="price-asc" current={sort} body={selectedBody}>
                  Price ↑
                </SortLink>
                <SortLink sort="price-desc" current={sort} body={selectedBody}>
                  Price ↓
                </SortLink>
                <SortLink sort="km-asc" current={sort} body={selectedBody}>
                  Mileage ↑
                </SortLink>
              </div>
            </div>

            {vehicles.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {vehicles.map((v, i) => (
                  <VehicleCard key={v.id} vehicle={v} priority={i < 3} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function SortLink({
  sort,
  current,
  body,
  children,
}: {
  sort: string;
  current: string;
  body?: BodyType;
  children: React.ReactNode;
}) {
  const params = new URLSearchParams();
  if (body) params.set("body", body);
  if (sort !== "featured") params.set("sort", sort);
  const href = params.toString() ? `/inventory?${params}` : "/inventory";
  const active = sort === current || (sort === "featured" && !current);
  return (
    <a
      href={href}
      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border hover:bg-muted"
      }`}
    >
      {children}
    </a>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
      <h2 className="font-display text-xl font-semibold">Nothing matches that filter yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Try resetting filters or call us at{" "}
        <a href="tel:9056780048" className="font-semibold text-primary">
          905-678-0048
        </a>{" "}
        — we may have an arriving unit that matches.
      </p>
    </div>
  );
}

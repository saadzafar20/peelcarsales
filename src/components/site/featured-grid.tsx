import Link from "next/link";
import { VehicleCard } from "@/components/site/vehicle-card";
import { Button } from "@/components/ui/button";
import { getFeaturedSampleVehicles } from "@/lib/sample-inventory";

export function FeaturedGrid() {
  const vehicles = getFeaturedSampleVehicles(8);

  return (
    <section className="py-20">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Just on the lot
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Featured vehicles
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Hand-picked from our 150-vehicle inventory across Mississauga and Oakville. Photos,
              Carfax, and pricing on every listing.
            </p>
          </div>
          <Button asChild variant="outline" size="lg">
            <Link href="/inventory">View all 150 vehicles →</Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} priority={i < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}

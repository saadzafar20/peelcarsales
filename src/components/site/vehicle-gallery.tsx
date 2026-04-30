import { VehiclePhoto } from "@/components/site/vehicle-photo";

type Props = {
  baseSeed: string;
  alt: string;
};

/**
 * VDP photo gallery — hero + 3 thumbs. All deterministic from the base
 * seed so the same VIN always renders the same set. Phase 2 will swap to
 * real photo URLs delivered by the fal.ai pipeline.
 */
export function VehicleGallery({ baseSeed, alt }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted sm:col-span-3 sm:row-span-2">
        <VehiclePhoto seed={`${baseSeed}-hero`} alt={alt} priority />
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted sm:aspect-auto"
        >
          <VehiclePhoto seed={`${baseSeed}-angle-${i}`} alt={`${alt} angle ${i}`} />
        </div>
      ))}
    </div>
  );
}

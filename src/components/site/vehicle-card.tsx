import Link from "next/link";
import { VehiclePhoto } from "@/components/site/vehicle-photo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  badgeLabel,
  bodyTypeLabel,
  drivetrainLabel,
  estimateBiweeklyPaymentCents,
  vehicleShortTitle,
} from "@/lib/inventory";
import type { SampleVehicleSummary } from "@/lib/sample-inventory";
import { formatMileage, formatPriceCAD } from "@/lib/utils";

type Props = {
  vehicle: SampleVehicleSummary;
  priority?: boolean;
};

export function VehicleCard({ vehicle, priority }: Props) {
  const biweekly = estimateBiweeklyPaymentCents({ priceCents: vehicle.priceCents });
  const wasPriceCents = vehicle.wasPriceCents;
  const isDiscounted = wasPriceCents !== undefined && wasPriceCents > vehicle.priceCents;

  return (
    <Card className="group overflow-hidden border-border/70 transition-shadow hover:shadow-lg">
      <Link href={`/inventory/${vehicle.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <VehiclePhoto
            seed={vehicle.photoSeed}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            priority={priority}
          />
          {vehicle.badges.length > 0 ? (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {vehicle.badges.slice(0, 2).map((b) => (
                <Badge
                  key={b}
                  variant={
                    b === "best-priced" ? "accent" : b === "price-drop" ? "default" : "secondary"
                  }
                  className="shadow-sm"
                >
                  {badgeLabel(b)}
                </Badge>
              ))}
            </div>
          ) : null}
          {isDiscounted && wasPriceCents !== undefined ? (
            <div className="absolute right-3 top-3 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground shadow">
              {formatPriceCAD(wasPriceCents - vehicle.priceCents)} off
            </div>
          ) : null}
        </div>

        <CardContent className="space-y-3 p-5">
          <div>
            <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">
              {vehicleShortTitle(vehicle)}
            </h3>
            <p className="text-sm text-muted-foreground">{vehicle.trim}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{formatMileage(vehicle.mileageKm)}</span>
            <span aria-hidden>·</span>
            <span>{bodyTypeLabel(vehicle.bodyType)}</span>
            <span aria-hidden>·</span>
            <span>{drivetrainLabel(vehicle.drivetrain)}</span>
            <span aria-hidden>·</span>
            <span>{vehicle.location}</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-end justify-between border-t border-border/70 bg-muted/30 p-5">
          <div>
            <div className="font-display text-2xl font-bold tracking-tight">
              {formatPriceCAD(vehicle.priceCents)}
            </div>
            {isDiscounted && wasPriceCents !== undefined ? (
              <div className="text-xs text-muted-foreground line-through">
                {formatPriceCAD(wasPriceCents)}
              </div>
            ) : null}
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">From</div>
            <div className="font-display text-sm font-semibold text-primary">
              {formatPriceCAD(biweekly)} bi-weekly
            </div>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}

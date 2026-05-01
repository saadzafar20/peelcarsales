import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatMileage, formatPriceCAD } from "@/lib/utils";

type VehicleRow = {
  id: string;
  vin: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  mileage_km: number;
  price_cents: number;
  status: string;
  days_on_lot: number;
  location_id: string;
  updated_at: string;
};

export default async function AdminInventory() {
  // biome-ignore lint/suspicious/noExplicitAny: db.types.ts hand-rolled
  const supabase: any = await getSupabaseServer();
  const { data } = await supabase
    .from("vehicles")
    .select(
      "id, vin, slug, year, make, model, trim, mileage_km, price_cents, status, days_on_lot, location_id, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(200);

  const vehicles = (data as VehicleRow[] | null) ?? [];

  return (
    <>
      <AdminPageHeader
        title="Inventory"
        subtitle={`${vehicles.length} vehicles · sortable, filterable, bulk-editable`}
        actions={
          <Button asChild>
            <Link href="/admin/inventory/new">+ Add vehicle</Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Vehicle</th>
                  <th className="px-4 py-2">VIN</th>
                  <th className="px-4 py-2">Mileage</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Days</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {v.year} {v.make} {v.model}
                      </div>
                      <div className="text-xs text-muted-foreground">{v.trim ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.vin}</td>
                    <td className="px-4 py-3">{formatMileage(v.mileage_km)}</td>
                    <td className="px-4 py-3 font-semibold">{formatPriceCAD(v.price_cents)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{v.days_on_lot}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/inventory/${v.id}`}
                        className="text-sm font-semibold text-primary hover:underline"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
                {vehicles.length === 0 ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-muted-foreground" colSpan={7}>
                      No inventory yet. Click <strong>Add vehicle</strong> to start.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "active"
      ? "default"
      : status === "on_hold"
        ? "accent"
        : status === "sold"
          ? "muted"
          : "outline";
  return (
    <Badge variant={variant} className="capitalize">
      {status.replace("_", " ")}
    </Badge>
  );
}

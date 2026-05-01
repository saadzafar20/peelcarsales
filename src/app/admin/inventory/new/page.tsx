import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function AddVehiclePage() {
  return (
    <>
      <AdminPageHeader
        title="Add vehicle"
        subtitle="Paste a VIN — we decode via NHTSA vPIC, then upload photos and publish."
      />

      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step 1</p>
            <h2 className="font-display text-xl font-semibold">VIN decode</h2>
            <p className="text-sm text-muted-foreground">
              Paste a 17-character VIN. We&apos;ll auto-fill year, make, model, trim, body type,
              drivetrain, transmission, and fuel from the NHTSA vPIC database (free public API).
            </p>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="17-character VIN"
                maxLength={17}
                className="w-full rounded-md border border-input px-3 py-2 font-mono uppercase shadow-sm"
              />
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Decode VIN
              </button>
            </form>
            <p className="text-[11px] text-muted-foreground">
              Wires up to /api/inventory/decode-vin (NHTSA vPIC) when this page is hooked up to live
              data — schema and helper functions are in place.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step 2</p>
            <h2 className="font-display text-xl font-semibold">Photos</h2>
            <p className="text-sm text-muted-foreground">
              Drop up to 30 photos. They go to Supabase Storage, then the fal.ai pipeline produces
              showroom backgrounds + plate-blur (Phase 2). Original retained as the
              &ldquo;raw&rdquo; variant.
            </p>
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
              Drag and drop photos here · or click to upload
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step 3</p>
            <h2 className="font-display text-xl font-semibold">Pricing & publish</h2>
            <p className="text-sm text-muted-foreground">
              Set asking price, optional was-price for the strikethrough, choose location, pick
              badges (Best Priced, Low Km, Carfax Clean, Fresh Arrival, Price Drop). Publish flips
              status to <code>active</code> and triggers feed sync.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

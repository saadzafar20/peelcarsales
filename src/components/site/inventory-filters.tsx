/**
 * Inventory filter rail. Phase 1 will wire this to Algolia — for now the
 * checkboxes are visual placeholders that establish the IA, with a single
 * working filter (`body=`) so the URL contract is testable.
 */
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { bodyTypeLabel } from "@/lib/inventory";
import type { BodyType } from "@/lib/sample-inventory";
import { SAMPLE_VEHICLES } from "@/lib/sample-inventory";

type Props = {
  selectedBody?: BodyType;
};

const PRICE_BUCKETS = [
  { label: "Under $15,000", value: "0-15000" },
  { label: "$15,000 – $20,000", value: "15000-20000" },
  { label: "$20,000 – $25,000", value: "20000-25000" },
  { label: "$25,000 – $30,000", value: "25000-30000" },
  { label: "$30,000 – $40,000", value: "30000-40000" },
  { label: "Over $40,000", value: "40000-" },
];

const MILEAGE_BUCKETS = [
  "Under 30,000 km",
  "30,000 – 60,000 km",
  "60,000 – 100,000 km",
  "Over 100,000 km",
];

export function InventoryFilters({ selectedBody }: Props) {
  const bodyTypes: BodyType[] = ["sedan", "suv", "hatchback", "coupe", "truck", "van", "wagon"];
  const makes = Array.from(new Set(SAMPLE_VEHICLES.map((v) => v.make))).sort();

  return (
    <aside className="space-y-6 lg:sticky lg:top-32">
      <div>
        <label htmlFor="filter-search" className="text-xs font-semibold uppercase tracking-wider">
          Search inventory
        </label>
        <Input
          id="filter-search"
          placeholder="Make, model, keyword…"
          className="mt-2"
          disabled
          aria-disabled
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Live search lands in Phase 1 (Algolia)
        </p>
      </div>

      <Separator />

      <FilterGroup label="Body type">
        <div className="flex flex-wrap gap-1.5">
          <BodyChip href="/inventory" active={!selectedBody}>
            All
          </BodyChip>
          {bodyTypes.map((body) => (
            <BodyChip key={body} href={`/inventory?body=${body}`} active={selectedBody === body}>
              {bodyTypeLabel(body)}
            </BodyChip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Price">
        <ul className="space-y-1.5 text-sm">
          {PRICE_BUCKETS.map((b) => (
            <li key={b.value} className="flex items-center gap-2 text-muted-foreground">
              <DisabledCheck /> {b.label}
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup label="Make">
        <ul className="space-y-1.5 text-sm">
          {makes.map((make) => (
            <li key={make} className="flex items-center gap-2 text-muted-foreground">
              <DisabledCheck /> {make}
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup label="Mileage">
        <ul className="space-y-1.5 text-sm">
          {MILEAGE_BUCKETS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-muted-foreground">
              <DisabledCheck /> {b}
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup label="Year">
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="From" disabled aria-disabled />
          <Input placeholder="To" disabled aria-disabled />
        </div>
      </FilterGroup>

      <FilterGroup label="Drivetrain">
        <ul className="space-y-1.5 text-sm">
          {["FWD", "AWD / 4WD", "RWD"].map((d) => (
            <li key={d} className="flex items-center gap-2 text-muted-foreground">
              <DisabledCheck /> {d}
            </li>
          ))}
        </ul>
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider">{label}</h3>
      {children}
    </div>
  );
}

function BodyChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <Badge
        variant={active ? "default" : "outline"}
        className="cursor-pointer transition hover:border-primary"
      >
        {children}
      </Badge>
    </Link>
  );
}

function DisabledCheck() {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-3.5 shrink-0 rounded-sm border border-border bg-muted"
    />
  );
}

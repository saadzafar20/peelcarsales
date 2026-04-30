/**
 * Cities we target for programmatic SEO. Every entry generates a
 * /[citySlug]/used-cars page on build (Phase 7 will expand to
 * /[city]/[make]/used and /[city]/[bodyType] tiers).
 */
export type City = {
  slug: string;
  name: string;
  region: string;
  /** Approximate driving distance to nearest lot, plain English */
  distance: string;
  /** Demographic / SEO hook used in body copy */
  hook: string;
  /** Which lot is closer for delivery / pickup */
  nearestLot: "Mississauga" | "Oakville";
};

export const CITIES: City[] = [
  {
    slug: "mississauga",
    name: "Mississauga",
    region: "Peel Region",
    distance: "On-site lot at 2701 Derry Rd East",
    hook: "Our home turf — 2701 Derry Rd East is the original Peel Car Sales lot. Browse 75+ vehicles in person, all OMVIC-licensed, all Carfax-checked.",
    nearestLot: "Mississauga",
  },
  {
    slug: "oakville",
    name: "Oakville",
    region: "Halton Region",
    distance: "On-site lot at 333 Wyecroft Rd",
    hook: "Halton's friendliest used-car lot at 333 Wyecroft Rd. 75+ inspected vehicles, indoor showroom, and direct-to-lender financing for any credit.",
    nearestLot: "Oakville",
  },
  {
    slug: "brampton",
    name: "Brampton",
    region: "Peel Region",
    distance: "10 minutes from our Mississauga lot via Hwy 410",
    hook: "Brampton buyers get the same OMVIC + UCDA dealership experience just down the 410. We deliver across Brampton on agreed deals.",
    nearestLot: "Mississauga",
  },
  {
    slug: "toronto",
    name: "Toronto",
    region: "GTA",
    distance: "20 minutes from our Mississauga lot via the 401 or QEW",
    hook: "Skip Toronto-area dealer markups. Our Mississauga lot is a quick drive west on the 401 — same Carfax, same warranty, lower prices.",
    nearestLot: "Mississauga",
  },
  {
    slug: "etobicoke",
    name: "Etobicoke",
    region: "Toronto",
    distance: "12 minutes from our Mississauga lot via the 427 or QEW",
    hook: "Etobicoke residents — we're the closest non-franchise used-car dealership with 150 vehicles in stock. Free Carfax on every car.",
    nearestLot: "Mississauga",
  },
  {
    slug: "hamilton",
    name: "Hamilton",
    region: "Hamilton-Niagara",
    distance: "30 minutes from our Oakville lot via the QEW",
    hook: "Hamilton & Stoney Creek buyers — our Oakville location is a straight QEW shot. We routinely deliver to Hamilton on Saturdays.",
    nearestLot: "Oakville",
  },
  {
    slug: "burlington",
    name: "Burlington",
    region: "Halton Region",
    distance: "10 minutes from our Oakville lot via the QEW",
    hook: "Burlington next-door — our Oakville location at 333 Wyecroft Rd is your closest used-car lot with 150 inspected vehicles.",
    nearestLot: "Oakville",
  },
  {
    slug: "milton",
    name: "Milton",
    region: "Halton Region",
    distance: "15 minutes from our Oakville lot via Hwy 25",
    hook: "Milton is one of Canada's fastest-growing communities — and our Oakville lot has the SUVs and family vehicles Milton buyers need.",
    nearestLot: "Oakville",
  },
  {
    slug: "vaughan",
    name: "Vaughan",
    region: "York Region",
    distance: "25 minutes from our Mississauga lot via Hwy 407",
    hook: "Vaughan buyers — skip the 400-series Mercedes/BMW dealer prices. Our Mississauga lot has the same makes and models with thousands off.",
    nearestLot: "Mississauga",
  },
  {
    slug: "markham",
    name: "Markham",
    region: "York Region",
    distance: "35 minutes from our Mississauga lot via Hwy 407",
    hook: "Markham buyers — our Mississauga lot serves the entire GTA. Free home delivery within 50km on agreed deals.",
    nearestLot: "Mississauga",
  },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

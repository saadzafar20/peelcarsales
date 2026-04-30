import type { SampleVehicle } from "@/lib/sample-inventory";

export function vehicleTitle(v: Pick<SampleVehicle, "year" | "make" | "model" | "trim">) {
  return `${v.year} ${v.make} ${v.model} ${v.trim}`;
}

export function vehicleShortTitle(v: Pick<SampleVehicle, "year" | "make" | "model">) {
  return `${v.year} ${v.make} ${v.model}`;
}

export function bodyTypeLabel(b: SampleVehicle["bodyType"]): string {
  return (
    {
      sedan: "Sedan",
      suv: "SUV",
      hatchback: "Hatchback",
      coupe: "Coupe",
      truck: "Truck",
      van: "Van",
      wagon: "Wagon",
    } as const
  )[b];
}

export function fuelLabel(f: SampleVehicle["fuel"]): string {
  return ({ gas: "Gasoline", hybrid: "Hybrid", electric: "Electric", diesel: "Diesel" } as const)[
    f
  ];
}

export function drivetrainLabel(d: SampleVehicle["drivetrain"]): string {
  return ({ fwd: "FWD", rwd: "RWD", awd: "AWD", "4wd": "4WD" } as const)[d];
}

export function transmissionLabel(t: SampleVehicle["transmission"]): string {
  return ({ automatic: "Automatic", manual: "Manual", cvt: "CVT", dct: "Dual-clutch" } as const)[t];
}

export function badgeLabel(b: SampleVehicle["badges"][number]): string {
  return (
    {
      "best-priced": "AutoTrader Best Priced",
      "low-km": "Low Km",
      "carfax-clean": "Carfax Clean",
      "fresh-arrival": "Just Arrived",
      "price-drop": "Price Drop",
    } as const
  )[b];
}

/**
 * Estimated bi-weekly payment for the headline price calculator.
 * Accepts cents and returns cents per bi-weekly payment, rounded up to the
 * nearest dollar. Tied to a default 84-month term at 7.99% APR with $0 down.
 * NOT a quoting tool — the financing wizard does the real math.
 */
export function estimateBiweeklyPaymentCents({
  priceCents,
  termMonths = 84,
  apr = 0.0799,
  downPaymentCents = 0,
  taxRate = 0.13,
}: {
  priceCents: number;
  termMonths?: number;
  apr?: number;
  downPaymentCents?: number;
  taxRate?: number;
}): number {
  const principal = priceCents * (1 + taxRate) - downPaymentCents;
  const periodsPerYear = 26;
  const monthlyRate = apr / 12;
  const totalMonths = termMonths;
  // Standard amortization → monthly, then convert to bi-weekly equivalent
  const monthlyPayment = (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -totalMonths);
  const annualPayment = monthlyPayment * 12;
  const biweeklyPayment = annualPayment / periodsPerYear;
  return Math.ceil(biweeklyPayment / 100) * 100;
}

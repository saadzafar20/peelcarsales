import type { Metadata } from "next";
import Link from "next/link";
import { Calculator } from "@/components/site/calculator";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Payment calculator — bi-weekly and monthly estimates",
  description:
    "Estimate your bi-weekly and monthly payment with HST and configurable APR + term. Sample rate — your real rate comes back from our lender network with pre-qualification.",
};

export default function CalculatorPage() {
  return (
    <>
      <section className="bg-secondary py-16 text-secondary-foreground">
        <div className="container max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Estimate your payment
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Payment calculator
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-secondary-foreground/80">
            Plug in price, down payment, term, and APR. We&apos;ll show you bi-weekly + monthly +
            total interest. Includes 13% HST.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <Calculator />

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
          <h2 className="font-display text-xl font-semibold">
            Want a real rate? Pre-qualify in 60 seconds.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This is an estimate. Soft credit check returns your actual rate from our 20+ lenders.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/financing">Get my real rate</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="tel:9056780048">Call 905-678-0048</a>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaStrip() {
  return (
    <section className="bg-primary py-14 text-primary-foreground">
      <div className="container flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Ready when you are. Two locations across the GTA.
        </h2>
        <p className="max-w-2xl text-pretty text-base text-primary-foreground/85">
          Walk in, browse, take it for a test drive. Or start online — pre-qualify, hold a car with
          a $500 refundable deposit, and finish at the lot in under an hour.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="secondary" size="xl">
            <Link href="/inventory">Browse inventory</Link>
          </Button>
          <Button asChild variant="onDark" size="xl">
            <a href="tel:9056780048">Call 905-678-0048</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

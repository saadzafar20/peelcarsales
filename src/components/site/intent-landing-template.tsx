import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type IntentLandingProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  whoFor: string;
  bullets: string[];
  documents: string[];
  faq: Array<{ q: string; a: string }>;
};

export function IntentLandingTemplate({
  eyebrow,
  title,
  subtitle,
  whoFor,
  bullets,
  documents,
  faq,
}: IntentLandingProps) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} variant="dark" />

      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Who this is for</h2>
              <p className="mt-3 text-base leading-relaxed text-foreground/85">{whoFor}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">What you get</h2>
              <ul className="mt-4 grid gap-2">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm"
                  >
                    <span aria-hidden className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Documents you&apos;ll need
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {documents.map((d) => (
                  <li
                    key={d}
                    className="rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-sm"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            {faq.length > 0 ? (
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">FAQ</h2>
                <div className="mt-4 space-y-3">
                  {faq.map((item) => (
                    <details
                      key={item.q}
                      className="group rounded-lg border border-border bg-card p-5"
                    >
                      <summary className="cursor-pointer text-base font-semibold tracking-tight text-foreground marker:text-primary">
                        {item.q}
                      </summary>
                      <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* Sticky CTA */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <Card className="bg-secondary text-secondary-foreground">
              <CardContent className="space-y-4 p-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Soft credit check
                </p>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  Pre-qualify in 60 seconds
                </h2>
                <p className="text-sm text-secondary-foreground/75">
                  No impact on your credit score. We&apos;ll come back with your affordability range
                  and estimated rate.
                </p>
                <Button asChild size="lg" className="w-full">
                  <Link href="/financing">Start pre-qualification</Link>
                </Button>
                <Button asChild variant="onDark" size="lg" className="w-full">
                  <a href="tel:9056780048">Call 905-678-0048</a>
                </Button>
                <Button asChild variant="onDark" size="lg" className="w-full">
                  <a
                    href="https://wa.me/19056780048?text=Hi%2C%20I%27d%20like%20to%20pre-qualify%20for%20financing."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp us
                  </a>
                </Button>
              </CardContent>
            </Card>

            <div className="mt-4 rounded-lg border border-border bg-card p-5 text-sm">
              <p className="font-semibold">Why Peel for tough applications</p>
              <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                <li>· 20+ Canadian lender network</li>
                <li>· Approvals same-day in most cases</li>
                <li>· Languages: English, Punjabi, Hindi, Urdu</li>
                <li>· OMVIC + UCDA licensed</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

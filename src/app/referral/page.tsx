import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Referral program — earn $250 cash for every friend",
  description:
    "Refer a friend or family member. They get $250 off their purchase, you get $250 cash when they take delivery. No cap, no expiry.",
};

const STEPS = [
  {
    n: 1,
    title: "Sign up",
    body: "Create a free customer account and grab your unique referral link.",
  },
  {
    n: 2,
    title: "Share the link",
    body: "WhatsApp, email, or text. Anyone who clicks gets $250 off their first purchase.",
  },
  {
    n: 3,
    title: "Get paid",
    body: "When they take delivery, you get $250 cash via e-transfer. Within 48 hours.",
  },
];

export default function ReferralPage() {
  return (
    <>
      <PageHero
        eyebrow="Referral program"
        title="$250 for you. $250 for them."
        subtitle="Refer a friend or family member to Peel. They save $250 on their purchase, you get $250 cash when they drive away. No cap. No expiry. Compounds with every referral."
        variant="dark"
      />

      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">How it works</h2>
            <div className="mt-8 space-y-6">
              {STEPS.map((step) => (
                <div key={step.n} className="flex gap-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-semibold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-12 font-display text-2xl font-bold tracking-tight">Fine print</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Existing customers only — must have purchased a vehicle from Peel.</li>
              <li>• Referral must be a first-time Peel customer.</li>
              <li>• Vehicle must be financed or paid in full and delivered.</li>
              <li>• Payouts via e-transfer within 48 hours of delivery.</li>
              <li>• Cannot be combined with employee or fleet discounts.</li>
            </ul>
          </div>

          <Card className="lg:sticky lg:top-32">
            <CardContent className="space-y-4 p-7">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold tracking-tight">Sign up</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Phase 8
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Self-serve referral dashboard ships with the customer portal in Phase 8. For now,
                call us — we&apos;ll set you up manually.
              </p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="r-name"
                    className="text-xs font-semibold uppercase tracking-wider"
                  >
                    Your name
                  </label>
                  <Input id="r-name" disabled />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="r-email"
                    className="text-xs font-semibold uppercase tracking-wider"
                  >
                    Email
                  </label>
                  <Input id="r-email" type="email" disabled />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="r-vehicle"
                    className="text-xs font-semibold uppercase tracking-wider"
                  >
                    What you bought from us
                  </label>
                  <Input id="r-vehicle" placeholder="e.g. 2021 Honda Civic" disabled />
                </div>
                <Button size="lg" className="w-full" disabled>
                  Get my referral link (Phase 8)
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <a href="tel:9056780048">Call 905-678-0048</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

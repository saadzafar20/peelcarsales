import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Financing — every credit situation, 20+ Canadian lenders",
  description:
    "Pre-qualify in 60 seconds with a soft credit check that won't impact your score. Bad credit, no credit, work permit, student permit, newcomer, bankruptcy — we have a lender for you.",
};

const STEPS = [
  {
    n: 1,
    title: "Pre-qualify in 60 seconds",
    body: "A soft credit check tells us your affordability range without affecting your score. No SIN required at this step.",
  },
  {
    n: 2,
    title: "Pick your car",
    body: "Browse our 150-vehicle inventory or let our team match you. We'll show you what fits your pre-qualified payment.",
  },
  {
    n: 3,
    title: "Complete your full application",
    body: "Secure intake — encrypted SIN, identity documents, and PIPEDA-compliant consent. We submit to our lender network on your behalf.",
  },
  {
    n: 4,
    title: "Same-day approval",
    body: "Most applications are approved within 4 hours. Many same-day. Sign electronically, pick up keys, drive home.",
  },
];

const SITUATIONS = [
  {
    href: "/bad-credit-car-loans",
    title: "Bad credit",
    body: "Past credit issues won't stop you.",
  },
  {
    href: "/no-credit-car-loans",
    title: "No credit",
    body: "First-time buyer programs available.",
  },
  { href: "/work-permit-car-loans", title: "Work permit", body: "Approvals on temporary permits." },
  { href: "/student-car-loans", title: "Student permit", body: "Discounted student rates." },
  {
    href: "/newcomer-car-loans",
    title: "Newcomer",
    body: "PR or recent newcomer? We finance you.",
  },
];

export default function FinancingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-secondary py-16 text-secondary-foreground sm:py-20">
        <div className="container max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Financing for every credit situation
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Pre-qualify in 60 seconds. <br className="hidden sm:inline" />
            <span className="text-primary">No impact</span> on your credit score.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-secondary-foreground/80 sm:text-lg">
            Soft credit check returns your affordability range and rate from our 20+ lender network.
            Then you choose your car. PIPEDA-compliant, OMVIC + UCDA licensed.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="xl">
              <Link href="#wizard">Start pre-qualification</Link>
            </Button>
            <Button asChild variant="onDark" size="xl">
              <Link href="/financing/calculator">Payment calculator</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Process strip */}
      <section className="border-y border-border bg-muted/40 py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.n} className="space-y-2">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                  {step.n}
                </div>
                <h3 className="font-display text-base font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard placeholder */}
      <section id="wizard" className="container py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Pre-qualification · Step 1 of 5
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Tell us about you</h2>
          <p className="mt-2 text-muted-foreground">
            The full multi-step form ships in Phase 5 with PIPEDA consent, encrypted SIN handling
            (pgsodium envelope encryption), and Plaid Income/Assets verification. The shape of the
            wizard is shown below.
          </p>

          <div className="mt-8 space-y-3">
            <WizardStep
              n={1}
              title="Personal info"
              subtitle="Name, DOB, contact, residence"
              current
            />
            <WizardStep n={2} title="Employment" subtitle="Employer, role, gross income, tenure" />
            <WizardStep n={3} title="Housing" subtitle="Own, rent, monthly cost, time at address" />
            <WizardStep
              n={4}
              title="Identity & income verification"
              subtitle="Driver's licence + Plaid Income link or paystub upload"
            />
            <WizardStep
              n={5}
              title="Consent & submit"
              subtitle="Versioned PIPEDA consent · soft credit check · lender selection"
            />
          </div>

          <Card className="mt-8 border-primary/30 bg-primary/5">
            <CardContent className="space-y-3 p-6">
              <h3 className="font-display text-lg font-semibold">Want to start now? Call us.</h3>
              <p className="text-sm text-muted-foreground">
                Inder, Mehran, Gurri, or Sami can take your application by phone in under 10 minutes
                — no app, no upload, just a conversation. Full intake when you arrive.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild size="lg">
                  <a href="tel:9056780048">Call 905-678-0048</a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a
                    href="https://wa.me/19056780048?text=Hi%2C%20I%27d%20like%20to%20pre-qualify%20for%20financing."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp us
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Situation lanes */}
      <section className="border-t border-border bg-muted/40 py-16">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Built for every credit situation
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our lender network covers the full spectrum — from prime to deep subprime, plus
              specialty programs for non-residents and students.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SITUATIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary"
              >
                <div className="font-display text-base font-semibold tracking-tight">{s.title}</div>
                <p className="flex-1 text-xs text-muted-foreground">{s.body}</p>
                <div className="text-xs font-semibold text-primary group-hover:underline">
                  Learn more →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold tracking-tight">
            How we protect your data
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/85">
            <TrustItem
              title="PIPEDA-compliant intake"
              body="Every consent is explicit, versioned, and stored with your timestamp, IP, and user agent. You can withdraw at any time."
            />
            <TrustItem
              title="Encrypted SIN handling"
              body="Your SIN is never stored in cleartext. We tokenize via HMAC for matching and encrypt the value with pgsodium envelope encryption."
            />
            <TrustItem
              title="Soft credit check"
              body="Pre-qualification uses a soft pull through our credit bureau partner. Your score is not affected unless you proceed to a hard application."
            />
            <TrustItem
              title="Audit-logged access"
              body="Every read of your sensitive information is logged with the staff member, time, IP, and reason — you can request the audit trail."
            />
          </ul>
        </div>
      </section>
    </>
  );
}

function WizardStep({
  n,
  title,
  subtitle,
  current,
}: {
  n: number;
  title: string;
  subtitle: string;
  current?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-lg border p-4 ${
        current ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-card"
      }`}
    >
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold ${
          current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {n}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      {current ? (
        <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Current
        </span>
      ) : null}
    </div>
  );
}

function TrustItem({ title, body }: { title: string; body: string }) {
  return (
    <li className="flex gap-3 rounded-lg border border-border bg-card p-5">
      <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" aria-hidden />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-1 text-muted-foreground">{body}</div>
      </div>
    </li>
  );
}

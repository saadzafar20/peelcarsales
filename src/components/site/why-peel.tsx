import Link from "next/link";

const PILLARS = [
  {
    title: "150-point inspection",
    body: "Every vehicle goes through our certified mechanic's 150-point check before it hits the lot. No exceptions.",
    icon: WrenchIcon,
  },
  {
    title: "Free Carfax on every car",
    body: "Full Carfax Canada history before you even ask. No accidents hidden, no kilometres rolled back.",
    icon: ShieldIcon,
  },
  {
    title: "7-day exchange policy",
    body: "Drove home and changed your mind? Bring it back within 7 days for any other vehicle on the lot.",
    icon: RefreshIcon,
  },
  {
    title: "30-day / 1500 km warranty",
    body: "Powertrain warranty included with every purchase. Extendable up to 4 years through our lender network.",
    icon: BadgeIcon,
  },
];

export function WhyPeel() {
  return (
    <section className="border-y border-border bg-muted/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Why Peel</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Family-run. OMVIC + UCDA licensed. Honest pricing — every time.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Two locations, one promise: you leave with a car you trust at a price you can afford.
            Read the 450+ five-star reviews from Inder, Mehran, Gurri, and Sami&apos;s customers.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon title={pillar.title} />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{pillar.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary/80"
          >
            Read our buyer protection policy
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

type IconProps = { title: string };

function WrenchIcon({ title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2}>
      <title>{title}</title>
      <path d="M14.7 6.3a4.5 4.5 0 016.4 6.4l-9.9 9.9a3 3 0 01-4.3-4.3l8.6-8.6a1.5 1.5 0 012.1 2.1L8.5 21" />
    </svg>
  );
}
function ShieldIcon({ title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2}>
      <title>{title}</title>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RefreshIcon({ title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2}>
      <title>{title}</title>
      <path d="M3 12a9 9 0 0114.85-6.85L21 8" strokeLinecap="round" />
      <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 01-14.85 6.85L3 16" strokeLinecap="round" />
      <path d="M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BadgeIcon({ title }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2}>
      <title>{title}</title>
      <path d="M12 2l3 5 5 1-3.5 4 1 6-5.5-3-5.5 3 1-6L4 8l5-1 3-5z" strokeLinejoin="round" />
    </svg>
  );
}

import Link from "next/link";

const INTENT_LANES = [
  {
    href: "/bad-credit-car-loans",
    title: "Bad credit",
    body: "Past credit issues won't stop you. We work with subprime specialists across Canada.",
  },
  {
    href: "/no-credit-car-loans",
    title: "No credit",
    body: "First-time buyer? We have lender programs designed for thin credit files.",
  },
  {
    href: "/work-permit-car-loans",
    title: "Work permit",
    body: "Approvals on temporary work permits — bring your permit, paystub, and SIN.",
  },
  {
    href: "/student-car-loans",
    title: "Student permit",
    body: "Discounted rates for full-time students with verifiable income or co-signer.",
  },
  {
    href: "/newcomer-car-loans",
    title: "New to Canada",
    body: "PR or recent newcomer? We finance newcomers with no Canadian credit history.",
  },
] as const;

export function IntentBands() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Financing for every situation
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            We say yes when others say no.
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            20+ lenders. One application. Soft credit check, no impact on your score.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {INTENT_LANES.map((lane) => (
            <Link
              key={lane.href}
              href={lane.href}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            >
              <div className="font-display text-lg font-semibold tracking-tight">{lane.title}</div>
              <p className="flex-1 text-sm text-muted-foreground">{lane.body}</p>
              <div className="text-sm font-semibold text-primary group-hover:underline">
                Get pre-qualified →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

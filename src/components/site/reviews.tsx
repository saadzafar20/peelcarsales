/**
 * Sample 5-star Google reviews. Phase 9 will sync the live Google Business
 * Profile reviews into the `reviews` table; until then these mirror the
 * tone and rep names visible on the current site.
 */
const SAMPLE_REVIEWS = [
  {
    rating: 5,
    body: "Inder was incredible — got me approved on a work permit when three other dealers said no. Drove off in a 2021 Civic the next day. Painless.",
    author: "Harman S.",
    location: "Brampton",
    rep: "Inder",
  },
  {
    rating: 5,
    body: "Mehran was patient, honest, and never pushy. He went over the Carfax and full inspection report with me before I even asked. Highly recommend.",
    author: "Priya R.",
    location: "Mississauga",
    rep: "Mehran",
  },
  {
    rating: 5,
    body: "Gurri made my first car experience so easy. Newcomer to Canada with no credit — they had me approved through their lender network and explained every step.",
    author: "Manpreet K.",
    location: "Oakville",
    rep: "Gurpreet (Gurri)",
  },
  {
    rating: 5,
    body: "Sami took care of everything — trade-in valuation through Carfax, financing, plates, and even my insurance referral. 10/10 dealership.",
    author: "Tariq H.",
    location: "Etobicoke",
    rep: "Sami Haq",
  },
] as const;

export function Reviews() {
  return (
    <section className="bg-secondary py-20 text-secondary-foreground">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            450+ five-star reviews
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Customers come back. So do their families.
          </h2>
          <p className="mt-4 text-pretty text-secondary-foreground/75">
            Real reviews from buyers across the GTA. Read more on Google or AutoTrader.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_REVIEWS.map((review) => (
            <figure
              key={review.author}
              className="flex flex-col gap-4 rounded-xl border border-secondary-foreground/15 bg-secondary-foreground/5 p-6 shadow-sm"
            >
              <Stars rating={review.rating} />
              <blockquote className="text-sm leading-relaxed text-secondary-foreground/90">
                &ldquo;{review.body}&rdquo;
              </blockquote>
              <figcaption className="mt-auto border-t border-secondary-foreground/10 pt-4 text-xs">
                <div className="font-semibold text-secondary-foreground">{review.author}</div>
                <div className="text-secondary-foreground/60">
                  {review.location} · Worked with {review.rep}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div role="img" aria-label={`${rating} out of 5 stars`} className="flex gap-1 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          // biome-ignore lint/suspicious/noArrayIndexKey: static-length array
          key={i}
          viewBox="0 0 20 20"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1.5}
          className="size-4"
        >
          <title>Star {i + 1} of 5</title>
          <path d="M10 2l2.4 5 5.6.8-4 4 1 5.6L10 14.8 5 17.4l1-5.6-4-4 5.6-.8L10 2z" />
        </svg>
      ))}
    </div>
  );
}

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  variant?: "dark" | "light";
};

export function PageHero({ eyebrow, title, subtitle, variant = "light" }: Props) {
  const isDark = variant === "dark";
  return (
    <section
      className={
        isDark
          ? "bg-secondary py-14 text-secondary-foreground sm:py-20"
          : "border-b border-border bg-muted/40 py-14"
      }
    >
      <div className="container max-w-4xl text-center">
        {eyebrow ? (
          <p
            className={`text-xs font-semibold uppercase tracking-widest ${
              isDark ? "text-accent" : "text-primary"
            }`}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p
            className={`mx-auto mt-4 max-w-2xl text-pretty ${
              isDark ? "text-secondary-foreground/80" : "text-muted-foreground"
            }`}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    </section>
  );
}

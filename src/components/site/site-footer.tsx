import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const QUICK_LINKS = [
  { href: "/inventory", label: "Inventory" },
  { href: "/financing", label: "Financing" },
  { href: "/financing/calculator", label: "Payment calculator" },
  { href: "/sell-trade", label: "Sell or trade" },
  { href: "/services", label: "Why Peel" },
  { href: "/staff", label: "Our team" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
] as const;

const FINANCE_LINKS = [
  { href: "/bad-credit-car-loans", label: "Bad credit car loans" },
  { href: "/no-credit-car-loans", label: "No credit car loans" },
  { href: "/work-permit-car-loans", label: "Work permit financing" },
  { href: "/student-car-loans", label: "Student financing" },
  { href: "/newcomer-car-loans", label: "New-to-Canada financing" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Image
              src="/logo.png"
              alt="Peel Car Sales"
              width={220}
              height={60}
              className="h-11 w-auto"
            />
            <p className="mt-4 max-w-sm text-sm text-secondary-foreground/75">
              OMVIC + UCDA licensed used-car dealership serving Mississauga, Oakville, and the
              Greater Toronto Area. Family-run. AutoTrader Best Priced Dealer 2024 &amp; 2025 ·
              CarGurus Top Rated.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded border border-secondary-foreground/20 px-2 py-1 text-xs uppercase tracking-wider text-secondary-foreground/70">
                OMVIC Licensed
              </span>
              <span className="rounded border border-secondary-foreground/20 px-2 py-1 text-xs uppercase tracking-wider text-secondary-foreground/70">
                UCDA Member
              </span>
              <span className="rounded border border-accent/40 bg-accent/10 px-2 py-1 text-xs uppercase tracking-wider text-accent">
                AutoTrader Best Priced 2024 + 2025
              </span>
            </div>
          </div>

          {/* Locations */}
          <div className="lg:col-span-4">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-secondary-foreground/60">
              Locations
            </h3>
            <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div>
                <p className="text-sm font-semibold">Mississauga</p>
                <a
                  href="https://maps.google.com/?q=2701+Derry+Rd+East,+Mississauga,+ON+L4T+1A2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-secondary-foreground/75 transition hover:text-secondary-foreground"
                >
                  2701 Derry Rd East
                  <br />
                  Mississauga, ON L4T 1A2
                </a>
              </div>
              <div>
                <p className="text-sm font-semibold">Oakville</p>
                <a
                  href="https://maps.google.com/?q=333+Wyecroft+Rd+Unit+11,+Oakville,+ON+L6K+2H2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-secondary-foreground/75 transition hover:text-secondary-foreground"
                >
                  333 Wyecroft Rd, Unit 11
                  <br />
                  Oakville, ON L6K 2H2
                </a>
              </div>
            </div>
            <div className="mt-5 text-sm">
              <a
                href="tel:9056780048"
                className="block font-display text-2xl font-bold tracking-tight transition hover:text-accent"
              >
                905-678-0048
              </a>
              <p className="mt-1 text-xs text-secondary-foreground/60">
                Mon–Sat 9 AM – 8 PM · Sun 11 AM – 5 PM
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-secondary-foreground/60">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/75 transition hover:text-secondary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Financing */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-secondary-foreground/60">
              Financing
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {FINANCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/75 transition hover:text-secondary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-secondary-foreground/15" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-secondary-foreground/60 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Peel Car Sales. All rights reserved. OMVIC Registration #
            <span className="opacity-70">[TODO: confirm number]</span>.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/legal/privacy" className="transition hover:text-secondary-foreground">
              Privacy
            </Link>
            <Link href="/legal/terms" className="transition hover:text-secondary-foreground">
              Terms
            </Link>
            <Link
              href="/legal/accessibility"
              className="transition hover:text-secondary-foreground"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

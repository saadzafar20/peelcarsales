import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/inventory", label: "Inventory" },
  { href: "/financing", label: "Financing" },
  { href: "/sell-trade", label: "Sell or Trade" },
  { href: "/services", label: "Why Peel" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-secondary-foreground/15 bg-secondary text-secondary-foreground shadow-sm">
      {/* Utility bar */}
      <div className="hidden border-b border-secondary-foreground/10 bg-secondary/95 lg:block">
        <div className="container flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-secondary-foreground/70">
            <span>Mississauga · Oakville · Greater Toronto Area</span>
            <span aria-hidden className="text-secondary-foreground/30">
              |
            </span>
            <span>Mon–Sat 9 AM – 8 PM · Sun 11 AM – 5 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/19056780048"
              className="text-secondary-foreground/70 transition hover:text-secondary-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
            <span aria-hidden className="text-secondary-foreground/30">
              |
            </span>
            <a
              href="tel:9056780048"
              className="font-semibold text-accent transition hover:text-accent/80"
            >
              905-678-0048
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Peel Car Sales — home">
          <Image
            src="/logo.png"
            alt="Peel Car Sales"
            width={180}
            height={50}
            className="h-9 w-auto"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-secondary-foreground/85 transition hover:text-secondary-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="onDark" size="sm" className="hidden sm:inline-flex">
            <Link href="/inventory">Browse inventory</Link>
          </Button>
          <Button asChild variant="default" size="sm">
            <a href="tel:9056780048" aria-label="Call 905-678-0048">
              Call 905-678-0048
            </a>
          </Button>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="border-t border-secondary-foreground/10 lg:hidden">
        <nav
          className="container flex h-11 items-center gap-5 overflow-x-auto text-sm font-medium"
          aria-label="Mobile primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-secondary-foreground/85 transition hover:text-secondary-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

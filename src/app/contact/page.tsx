import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Contact us — Mississauga + Oakville",
  description:
    "Call, text, WhatsApp, or visit. Two locations across the GTA. Open 7 days a week. Mon–Sat 9 AM – 8 PM, Sun 11 AM – 5 PM.",
};

const LOCATIONS = [
  {
    name: "Mississauga",
    address: "2701 Derry Rd East, Mississauga, ON L4T 1A2",
    phone: "905-678-0048",
    hours: [
      ["Mon – Fri", "9 AM – 8 PM"],
      ["Saturday", "9 AM – 6 PM"],
      ["Sunday", "11 AM – 5 PM"],
    ],
    mapUrl: "https://maps.google.com/?q=2701+Derry+Rd+East,+Mississauga,+ON+L4T+1A2",
  },
  {
    name: "Oakville",
    address: "333 Wyecroft Rd, Unit 11, Oakville, ON L6K 2H2",
    phone: "905-678-0048",
    hours: [
      ["Mon – Fri", "9 AM – 8 PM"],
      ["Saturday", "9 AM – 6 PM"],
      ["Sunday", "11 AM – 5 PM"],
    ],
    mapUrl: "https://maps.google.com/?q=333+Wyecroft+Rd+Unit+11,+Oakville,+ON+L6K+2H2",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title="Easiest way to reach us: call."
        subtitle="Open 7 days. Two locations across the GTA. WhatsApp also fine — most reps reply within minutes during open hours."
      />

      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* Locations */}
          <div className="space-y-6">
            {LOCATIONS.map((loc) => (
              <Card key={loc.name}>
                <CardContent className="grid gap-6 p-7 sm:grid-cols-[1fr_180px]">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      {loc.name}
                    </p>
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base font-medium hover:text-primary"
                    >
                      {loc.address}
                    </a>
                    <a
                      href={`tel:${loc.phone.replace(/-/g, "")}`}
                      className="font-display block text-2xl font-bold tracking-tight hover:text-primary"
                    >
                      {loc.phone}
                    </a>
                    <a
                      href={loc.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                  <dl className="space-y-1 text-xs">
                    {loc.hours.map(([day, hrs]) => (
                      <div
                        key={day}
                        className="flex justify-between gap-3 border-b border-border py-1"
                      >
                        <dt className="text-muted-foreground">{day}</dt>
                        <dd className="font-medium">{hrs}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              </Card>
            ))}

            <Card className="bg-secondary text-secondary-foreground">
              <CardContent className="space-y-3 p-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">
                  Prefer WhatsApp?
                </p>
                <h3 className="font-display text-xl font-semibold">Most reps reply in minutes</h3>
                <p className="text-sm text-secondary-foreground/80">
                  Send a vehicle URL or just say what you&apos;re looking for. We&apos;ll text you
                  back inside business hours.
                </p>
                <Button asChild size="lg" className="w-full">
                  <a href="https://wa.me/19056780048" target="_blank" rel="noopener noreferrer">
                    Open WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact form */}
          <div>
            <Card className="lg:sticky lg:top-32">
              <CardContent className="space-y-4 p-7">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-semibold tracking-tight">
                    Send us a note
                  </h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Phase 3
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Form goes live in Phase 3 with reCAPTCHA Enterprise + AutoRaptor lead bridge. For
                  now, please call or WhatsApp.
                </p>

                <div className="space-y-3">
                  <Field id="name" label="Your name" />
                  <Field id="email" label="Email" type="email" />
                  <Field id="phone" label="Phone" type="tel" />
                  <div className="space-y-1.5">
                    <label
                      htmlFor="message"
                      className="text-xs font-semibold uppercase tracking-wider"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      disabled
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button size="lg" className="w-full" disabled>
                    Send (Phase 3)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ id, label, type }: { id: string; label: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      <Input id={id} type={type} disabled />
    </div>
  );
}

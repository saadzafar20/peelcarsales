import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Directions — Mississauga & Oakville locations",
  description:
    "Driving directions to our Mississauga (2701 Derry Rd East) and Oakville (333 Wyecroft Rd) lots. Both easily accessible from the QEW, 401, and 403.",
};

const LOTS = [
  {
    name: "Mississauga",
    address: "2701 Derry Rd East, Mississauga, ON L4T 1A2",
    landmarks: [
      "10 min from Pearson Airport",
      "Off the 401 — Dixie Rd or Hurontario St exit",
      "Plenty of customer parking on-site",
    ],
    embedSrc:
      "https://www.google.com/maps?q=2701+Derry+Rd+East,+Mississauga,+ON+L4T+1A2&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=2701+Derry+Rd+East,+Mississauga,+ON+L4T+1A2",
  },
  {
    name: "Oakville",
    address: "333 Wyecroft Rd, Unit 11, Oakville, ON L6K 2H2",
    landmarks: [
      "Just off the QEW — Trafalgar or Dorval exit",
      "5 min from Oakville GO station",
      "Indoor showroom + outdoor lot",
    ],
    embedSrc:
      "https://www.google.com/maps?q=333+Wyecroft+Rd+Unit+11,+Oakville,+ON+L6K+2H2&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=333+Wyecroft+Rd+Unit+11,+Oakville,+ON+L6K+2H2",
  },
];

export default function DirectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Find us"
        title="Two locations across the GTA"
        subtitle="Both lots are open 7 days. Visit either — we'll have the same Carfax, the same warranty, and the same prices."
      />

      <section className="container py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {LOTS.map((lot) => (
            <Card key={lot.name} className="overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-muted">
                <iframe
                  title={`Map of ${lot.name} location`}
                  src={lot.embedSrc}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <CardContent className="space-y-4 p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                    {lot.name}
                  </p>
                  <p className="mt-1 font-semibold">{lot.address}</p>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {lot.landmarks.map((l) => (
                    <li key={l} className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className="mt-1 size-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {l}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild size="lg">
                    <a href={lot.directionsUrl} target="_blank" rel="noopener noreferrer">
                      Get directions
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="tel:9056780048">Call 905-678-0048</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Our team — sales, finance, service",
  description:
    "Meet Inder, Mehran, Gurpreet, and Sami. The team behind 450+ five-star reviews across Mississauga and Oakville.",
};

const TEAM = [
  {
    name: "Inder",
    role: "Senior Sales Consultant",
    location: "Mississauga",
    languages: ["English", "Punjabi", "Hindi"],
    bio: "Specialist in financing for newcomers, work-permit holders, and customers with thin credit files.",
    photoSeed: "team-inder",
  },
  {
    name: "Mehran",
    role: "Sales Consultant",
    location: "Oakville",
    languages: ["English", "Urdu", "Hindi"],
    bio: "Patient, detail-oriented. Customers consistently call out his honesty in their reviews.",
    photoSeed: "team-mehran",
  },
  {
    name: "Gurpreet (Gurri)",
    role: "Sales + Finance",
    location: "Mississauga",
    languages: ["English", "Punjabi", "Hindi"],
    bio: "First-time buyers' favourite. Walks you through the lender process step by step.",
    photoSeed: "team-gurri",
  },
  {
    name: "Sami Haq",
    role: "Sales Manager",
    location: "Oakville",
    languages: ["English", "Urdu"],
    bio: "Handles the full deal — trade valuation, financing, signing, plates. End-to-end.",
    photoSeed: "team-sami",
  },
];

export default function StaffPage() {
  return (
    <>
      <PageHero
        eyebrow="Our team"
        title="The people behind 450+ five-star reviews."
        subtitle="Visible by name. Reachable directly. Speaks your language. Pick a rep below or call the front desk and we'll route you."
      />

      <section className="container py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((p) => (
            <Card key={p.name} className="overflow-hidden">
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://picsum.photos/seed/${p.photoSeed}/640/800)`,
                }}
                aria-hidden
              />
              <CardContent className="space-y-2 p-6">
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {p.role} · {p.location}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">Languages: {p.languages.join(", ")}</p>
                <p className="text-sm">{p.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Want to talk to a specific rep? Call us and ask.
          </p>
          <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <a href="tel:9056780048">Call 905-678-0048</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Contact form</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

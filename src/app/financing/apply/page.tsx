import type { Metadata } from "next";
import { FinancingWizard } from "@/components/finance/financing-wizard";

export const metadata: Metadata = {
  title: "Apply for financing — secure 5-step intake",
  description:
    "Complete your financing application securely. PIPEDA-compliant intake with encrypted SIN handling, Plaid Income verification, and document upload to Supabase Storage.",
};

export default function FinancingApplyPage() {
  return (
    <main className="container py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Financing application
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          Tell us about you. We&apos;ll match you to the right lender.
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          5 steps · about 8 minutes · soft credit check at the end. Save and resume from email if
          you need to step away. Your SIN, DOB, and income are encrypted with pgsodium envelope
          encryption — never stored in plaintext.
        </p>
        <div className="mt-10">
          <FinancingWizard />
        </div>
      </div>
    </main>
  );
}

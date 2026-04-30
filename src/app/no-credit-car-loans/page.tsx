import type { Metadata } from "next";
import { IntentLandingTemplate } from "@/components/site/intent-landing-template";

export const metadata: Metadata = {
  title: "No credit car loans for first-time buyers",
  description:
    "First-time buyer with no credit history? Our lender network includes thin-file programs designed for buyers with no credit. Pre-qualify in 60 seconds with no impact on your score.",
};

export default function NoCreditPage() {
  return (
    <IntentLandingTemplate
      eyebrow="No credit car loans"
      title="First car. First credit relationship. We'll help you build it."
      subtitle="Thin file or no credit history at all? Our lenders run programs designed for first-time buyers — and we use the loan to start building your credit history."
      whoFor="If you've never had a credit card, line of credit, or loan in your name — or your file is too thin to score — most banks will say no. Our lender network includes specialty programs for first-time buyers that look at income, employment, and residence stability instead of credit history."
      bullets={[
        "Approvals based on income + employment, not credit history",
        "Co-signer optional — speeds up approval and lowers your rate",
        "Loan reported to Equifax + TransUnion — your score builds as you pay",
        "Bi-weekly payments designed to fit your first paycheque",
        "Refinance into a prime rate after 12 months of clean payments",
      ]}
      documents={[
        "Driver's licence",
        "Recent paystub OR offer letter (if recent hire)",
        "Proof of address (utility bill or lease)",
        "Void cheque or direct deposit form",
        "If co-signing: co-signer's ID + paystub",
      ]}
      faq={[
        {
          q: "I just got my first job. Can I still qualify?",
          a: "Yes — most lenders accept 30+ days of employment, and some accept signed offer letters before your start date. We'll show you what each lender in our network needs.",
        },
        {
          q: "Do I need a co-signer?",
          a: "Not always. If your income is stable and your down payment is reasonable, you can qualify on your own. A co-signer (parent, spouse, or close family) speeds up approval and lowers your rate.",
        },
        {
          q: "Will this loan build my credit?",
          a: "Yes. Every on-time payment is reported to Equifax and TransUnion. After 12 months of clean payments, you typically have enough credit history to qualify for prime-rate financing — including refinancing this loan.",
        },
      ]}
    />
  );
}

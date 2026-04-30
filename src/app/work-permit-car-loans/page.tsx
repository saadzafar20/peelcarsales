import type { Metadata } from "next";
import { IntentLandingTemplate } from "@/components/site/intent-landing-template";

export const metadata: Metadata = {
  title: "Work permit car loans — open work permit, LMIA, post-grad",
  description:
    "Working in Canada on a temporary permit? Our lender network includes specialty programs for open work permits, LMIA holders, and post-graduate work permits. Pre-qualify in 60 seconds.",
};

export default function WorkPermitPage() {
  return (
    <IntentLandingTemplate
      eyebrow="Work permit financing"
      title="Approved on a temporary work permit."
      subtitle="Open work permit, LMIA-based permit, or post-graduate work permit (PGWP) — our lender network has programs that accept temporary status with verifiable Canadian income."
      whoFor="If you're in Canada on an open work permit, an employer-specific (LMIA-supported) permit, or a Post-Graduate Work Permit and have steady Canadian income, you're eligible for our work-permit financing programs. We're particularly experienced with newcomer professionals and skilled-trade workers across the GTA."
      bullets={[
        "Permit must be valid for 6+ months at time of application",
        "Must have at least 90 days of Canadian employment",
        "Newcomer programs available with no Canadian credit history required",
        "Loan term limited to remaining permit duration + 6 month buffer",
        "Bi-lingual (English / Hindi / Punjabi / Urdu) support throughout",
      ]}
      documents={[
        "Valid work permit (showing 6+ months remaining)",
        "Passport with PR or visa stamp",
        "Driver's licence (Canadian or international + Ontario translation)",
        "Last 2 paystubs",
        "Proof of address (utility bill or lease)",
        "SIN (entered through our encrypted intake — never collected by email)",
      ]}
      faq={[
        {
          q: "My permit only has 8 months left. Can I still qualify?",
          a: "Possibly. Lenders need at least 6 months on the permit at application — your loan term will be capped at the permit expiry + a small buffer. Once you renew, we can refinance to a longer term and lower payment.",
        },
        {
          q: "I'm on a closed (LMIA) permit. Does that matter?",
          a: "No — closed and open permits are both accepted. Lenders care about your employment stability and income, not the permit type, as long as the permit is valid.",
        },
        {
          q: "What if my permit isn't renewed?",
          a: "We work with you. Most permit-friendly lenders allow you to keep paying the loan even after permit expiry, as long as payments continue. If you leave Canada, we can buy the vehicle back at fair market value.",
        },
      ]}
    />
  );
}

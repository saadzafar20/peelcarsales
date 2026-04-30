import type { Metadata } from "next";
import { IntentLandingTemplate } from "@/components/site/intent-landing-template";

export const metadata: Metadata = {
  title: "Bad credit car loans in Mississauga & Oakville",
  description:
    "Past credit issues, missed payments, collections, repossession, or low score? Our 20+ Canadian lenders include subprime specialists. Soft credit check, no impact on your score.",
};

export default function BadCreditPage() {
  return (
    <IntentLandingTemplate
      eyebrow="Bad credit car loans"
      title="Past credit issues won't stop you."
      subtitle="Missed payments, collections, repossession, low score — we work with subprime specialists across Canada and approve customers other dealers turn away."
      whoFor="If your credit score is below 650, you have late payments or collections on your file, you've had a vehicle repossessed in the past, or you've come out of a bankruptcy or consumer proposal — this program is built for you. Our team has placed thousands of subprime applications with lenders who understand recovery stories."
      bullets={[
        "Approvals down to 500 score with provable income",
        "Bankruptcy + consumer proposal accepted (discharged or in good standing)",
        "Repossession on file? Still approvable with a co-signer or larger down payment",
        "Bi-weekly rebuilding plan reported to credit bureaus — your score grows as you pay",
        "Most approvals same-day, drive home within 48 hours",
      ]}
      documents={[
        "Driver's licence (front + back)",
        "Recent paystub OR 3-month bank statement",
        "Proof of address (utility bill or lease)",
        "Void cheque or direct deposit form",
        "If discharged from bankruptcy: discharge papers",
      ]}
      faq={[
        {
          q: "Will the soft credit check hurt my score?",
          a: "No. Pre-qualification uses a soft pull. Your score is unaffected. Only the final hard application — once you've picked a vehicle — registers as a hard inquiry, and that's standard across Canadian lenders.",
        },
        {
          q: "I'm in a consumer proposal. Can I still get approved?",
          a: "Yes. Lenders in our network accept active consumer proposals as long as you're current on payments. We may need a co-signer or a larger down payment depending on the lender — we'll lay out your options before you commit.",
        },
        {
          q: "What's the highest interest rate I might pay?",
          a: "Subprime rates in Canada typically range from 9.99% to 29.99% APR depending on your file. We always disclose the rate before you sign — no surprises. Rebuilding your credit through on-time payments lets you refinance into a better rate later.",
        },
        {
          q: "How quickly can I drive away?",
          a: "Most subprime approvals come back same-day. Pick-up is usually 24–48 hours after you sign — we use that time to register, insure, and detail the vehicle.",
        },
      ]}
    />
  );
}

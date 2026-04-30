import type { Metadata } from "next";
import { IntentLandingTemplate } from "@/components/site/intent-landing-template";

export const metadata: Metadata = {
  title: "Student car loans — domestic and international students",
  description:
    "Full-time students at Canadian universities and colleges. Special student programs through our lender network — discounted rates with verifiable income or co-signer. Pre-qualify in 60 seconds.",
};

export default function StudentPage() {
  return (
    <IntentLandingTemplate
      eyebrow="Student car loans"
      title="Built for students. Approved on income or co-signer."
      subtitle="Full-time at a Canadian university, college, or polytechnic? Our lender network has student-specific programs — discounted rates, lower down payments, and flexible terms that work around your tuition cycle."
      whoFor="If you're a full-time domestic student or an international student on a study permit, with verifiable part-time income or a co-signer (typically a parent), our student programs offer discounted rates and reduced down payments."
      bullets={[
        "Full-time enrolment at a designated learning institution required",
        "Co-signer (parent or sponsor) speeds approval and lowers rate",
        "Lower down payment than standard subprime — often 5% or less",
        "Payment dates aligned with co-op or summer paycheque cycles",
        "Loan reported to credit bureaus — graduates leave with established credit",
      ]}
      documents={[
        "Valid study permit (international students)",
        "Recent enrolment letter or transcript",
        "Driver's licence",
        "Proof of part-time income OR co-signer paystub",
        "Co-signer ID and proof of address (if co-signing)",
      ]}
      faq={[
        {
          q: "I'm an international student on a study permit. Can I still qualify?",
          a: "Yes. International students with valid study permits and either verifiable part-time income or a co-signer (Canadian or international) can qualify. We handle a lot of these applications — language is rarely a barrier with our team.",
        },
        {
          q: "Can my parent co-sign from outside Canada?",
          a: "It depends on the lender. Some accept international co-signers with bank statements and tax returns; others require a Canadian co-signer. Tell us your situation — we'll match you to the right lender.",
        },
        {
          q: "What if I graduate before paying off the loan?",
          a: "No problem. The loan stays in your name as long as you stay on payments. Once you start a full-time job, we can refinance to a lower rate based on your improved credit profile.",
        },
      ]}
    />
  );
}

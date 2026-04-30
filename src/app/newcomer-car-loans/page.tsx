import type { Metadata } from "next";
import { IntentLandingTemplate } from "@/components/site/intent-landing-template";

export const metadata: Metadata = {
  title: "Newcomer car loans — PR holders and recent immigrants",
  description:
    "Recent permanent resident with no Canadian credit history? Our newcomer programs accept landing within the last 5 years with employer reference letter or 30 days of paystubs. Soft credit check.",
};

export default function NewcomerPage() {
  return (
    <IntentLandingTemplate
      eyebrow="Newcomer financing"
      title="No Canadian credit history yet? We finance newcomers."
      subtitle="Permanent residents who landed in Canada within the last 5 years are our specialty. Lender network programs accept newcomer status with simple income proof — no Canadian credit history required."
      whoFor="If you're a permanent resident or new Canadian citizen who arrived within the last 5 years, your credit file in Canada may be too new to score. Our newcomer programs evaluate your file based on Canadian employment, income stability, and references — building Canadian credit from your first payment."
      bullets={[
        "PR card valid + landed within last 5 years",
        "Employer reference letter OR 30+ days of Canadian paystubs",
        "Down payment 5–10% — lower than standard subprime",
        "Multilingual support: English, Punjabi, Hindi, Urdu",
        "Loan establishes Canadian credit — refinance to prime in 12 months",
      ]}
      documents={[
        "PR card (front + back)",
        "Passport",
        "Confirmation of Permanent Residence (CoPR) — landing date matters",
        "Employer reference letter OR last 2 paystubs",
        "Driver's licence (Canadian or international with Ontario translation)",
        "Proof of address (utility bill, lease, or settlement letter)",
      ]}
      faq={[
        {
          q: "I just landed last month. Am I eligible?",
          a: "Possibly — depends on the lender. Some accept newcomers with a signed employment contract before payslips arrive. Others want 30 days of paystubs. We'll match you to the right program based on your situation.",
        },
        {
          q: "My credit score is showing as 'no record' or 'thin file'. Will I be approved?",
          a: "Yes. Newcomer programs are specifically designed for thin-file applicants. Lenders look at your job, income, and residence stability instead of credit history. The loan itself starts building your Canadian credit.",
        },
        {
          q: "I have credit history from another country. Does that help?",
          a: "Sometimes — particularly for files from the US, UK, India, or UAE. Some lenders will consider international credit reports through their global partners. Tell us about your past credit and we'll see if it can be leveraged.",
        },
      ]}
    />
  );
}

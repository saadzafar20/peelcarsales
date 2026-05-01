import { z } from "zod";

/**
 * Multi-step financing wizard state. Each step has its own zod schema +
 * subset of the full ApplicationDraft. The wizard validates per-step on
 * Continue and only sends the complete blob to the secure server action
 * at submit time.
 *
 * No SIN data is stored in localStorage — that field lives only in
 * memory and is sent directly to the server submit endpoint over HTTPS.
 */

export const PersonalSchema = z.object({
  first_name: z.string().min(1).max(80),
  last_name: z.string().min(1).max(80),
  email: z.string().email(),
  phone: z.string().min(7).max(40),
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD"),
  marital_status: z.enum(["single", "married", "common_law", "divorced", "widowed"]),
});
export type PersonalStep = z.infer<typeof PersonalSchema>;

export const EmploymentSchema = z.object({
  employer: z.string().min(1).max(120),
  job_title: z.string().min(1).max(120),
  employment_type: z.enum([
    "full_time",
    "part_time",
    "self_employed",
    "contract",
    "retired",
    "student",
    "unemployed",
  ]),
  gross_annual_income: z.number().min(0).max(10_000_000),
  months_employed: z.number().int().min(0).max(720),
  employer_phone: z.string().max(40).optional().or(z.literal("")),
});
export type EmploymentStep = z.infer<typeof EmploymentSchema>;

export const ResidenceSchema = z.object({
  street: z.string().min(1).max(200),
  unit: z.string().max(40).optional().or(z.literal("")),
  city: z.string().min(1).max(80),
  province: z.string().min(2).max(2),
  postal_code: z.string().min(6).max(7),
  housing_type: z.enum(["own", "rent", "live_with_family"]),
  monthly_payment_cents: z.number().min(0),
  months_at_address: z.number().int().min(0).max(720),
});
export type ResidenceStep = z.infer<typeof ResidenceSchema>;

export const IdentitySchema = z.object({
  /* SIN is collected here but NOT persisted to localStorage. Sent to
     the server submit endpoint and immediately HMAC-tokenized + encrypted. */
  sin: z.string().regex(/^\d{3}[ -]?\d{3}[ -]?\d{3}$/, "9-digit SIN"),
  drivers_licence_number: z.string().min(4).max(40),
  plaid_public_token: z.string().optional(),
});
export type IdentityStep = z.infer<typeof IdentitySchema>;

export const ConsentSchema = z.object({
  /* Each consent is per-data-use and versioned. */
  financing: z.literal(true),
  lender_share: z.literal(true),
  marketing: z.boolean(),
  consent_version: z.string(),
});
export type ConsentStep = z.infer<typeof ConsentSchema>;

export type ApplicationDraft = {
  personal?: PersonalStep;
  employment?: EmploymentStep;
  residence?: ResidenceStep;
  identity?: IdentityStep;
  consent?: ConsentStep;
};

export type WizardStepKey = "personal" | "employment" | "residence" | "identity" | "consent";

export const WIZARD_STEPS: ReadonlyArray<{ key: WizardStepKey; title: string; subtitle: string }> =
  [
    { key: "personal", title: "Personal info", subtitle: "Name, contact, DOB" },
    { key: "employment", title: "Employment", subtitle: "Employer, role, gross income" },
    { key: "residence", title: "Housing", subtitle: "Address + monthly cost" },
    { key: "identity", title: "Identity & income", subtitle: "DL, SIN, Plaid Income link" },
    { key: "consent", title: "Consent & submit", subtitle: "PIPEDA · soft credit · lenders" },
  ];

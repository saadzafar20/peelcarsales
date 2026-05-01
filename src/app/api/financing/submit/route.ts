import { NextResponse } from "next/server";
import { z } from "zod";
import { CONSENT_TEXT, CURRENT_CONSENT_VERSION } from "@/lib/financing/consent";
import {
  ConsentSchema,
  EmploymentSchema,
  IdentitySchema,
  PersonalSchema,
  ResidenceSchema,
} from "@/lib/financing/state";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const Body = z.object({
  personal: PersonalSchema,
  employment: EmploymentSchema,
  residence: ResidenceSchema,
  identity: IdentitySchema,
  consent: ConsentSchema,
});

/**
 * Multi-step financing wizard submit endpoint.
 *
 * Pipeline:
 *   1. Zod-validate the full payload
 *   2. Ensure all required consents granted; reject otherwise
 *   3. Create or fetch the lead row (encrypts name/email/phone)
 *   4. Call submit_finance_application RPC which:
 *      - encrypts SIN, DOB, gross_income via pgsodium
 *      - stores HMAC SIN token for dedupe
 *      - persists each consent grant as an immutable row
 *
 * On success: returns { application_id }. The client redirects to the
 * confirmation page. NO PII is echoed back in the response.
 */
export async function POST(request: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (!body.consent.financing || !body.consent.lender_share) {
    return NextResponse.json({ ok: false, error: "consent_required" }, { status: 400 });
  }

  // Defense in depth: ensure consent text matches what the server is publishing
  // right now. If the version drifted while the user was on the page, we want
  // them to re-acknowledge — never bind a customer to outdated consent text.
  if (body.consent.consent_version !== CURRENT_CONSENT_VERSION) {
    return NextResponse.json({ ok: false, error: "consent_version_stale" }, { status: 409 });
  }

  // biome-ignore lint/suspicious/noExplicitAny: db.types.ts is hand-rolled
  let supabase: any;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json({ ok: false, error: "supabase_not_configured" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for") ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  // Create the lead row first — this captures the contact info (encrypted)
  // even if the application step below fails for any reason.
  const { data: leadId } = await supabase.rpc("create_lead", {
    p_source: "web",
    p_name: `${body.personal.first_name} ${body.personal.last_name}`,
    p_email: body.personal.email,
    p_phone: body.personal.phone,
    p_intent: "financing",
    p_payload: {
      step_completed: "consent",
      employment: { type: body.employment.employment_type, employer: body.employment.employer },
    },
    p_message: null,
    p_ip: ip,
    p_user_agent: userAgent,
  });

  const consents = (
    [
      { kind: "financing", granted: body.consent.financing },
      { kind: "lender_share", granted: body.consent.lender_share },
      { kind: "marketing", granted: body.consent.marketing },
    ] as const
  ).map(({ kind, granted }) => ({
    version: CURRENT_CONSENT_VERSION,
    kind,
    text: CONSENT_TEXT[kind],
    granted,
  }));

  const { data: applicationId, error } = await supabase.rpc("submit_finance_application", {
    p_lead_id: leadId,
    p_applicant: {
      first_name: body.personal.first_name,
      last_name: body.personal.last_name,
      email: body.personal.email,
      phone: body.personal.phone,
      marital_status: body.personal.marital_status,
      drivers_licence_number: body.identity.drivers_licence_number,
    },
    p_employment: {
      employer: body.employment.employer,
      job_title: body.employment.job_title,
      employment_type: body.employment.employment_type,
      gross_annual_income: body.employment.gross_annual_income,
      months_employed: body.employment.months_employed,
      employer_phone: body.employment.employer_phone || null,
    },
    p_residence: {
      street: body.residence.street,
      unit: body.residence.unit || null,
      city: body.residence.city,
      province: body.residence.province,
      postal_code: body.residence.postal_code,
      housing_type: body.residence.housing_type,
      monthly_payment_cents: body.residence.monthly_payment_cents,
      months_at_address: body.residence.months_at_address,
    },
    p_sin: body.identity.sin,
    p_dob: body.personal.date_of_birth,
    p_gross_income: String(body.employment.gross_annual_income),
    p_consents: consents,
    p_ip: ip,
    p_user_agent: userAgent,
  });

  if (error) {
    console.error("[financing.submit] rpc error", error);
    return NextResponse.json({ ok: false, error: "submit_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, application_id: applicationId, lead_id: leadId });
}

"use client";

import { useCallback, useState } from "react";
import { DocumentUpload } from "@/components/finance/document-upload";
import { PlaidLinkButton } from "@/components/finance/plaid-link";
import { SinInput } from "@/components/finance/sin-input";
import { WizardProgress } from "@/components/finance/wizard-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CONSENT_TEXT, CURRENT_CONSENT_VERSION } from "@/lib/financing/consent";
import {
  type ApplicationDraft,
  ConsentSchema,
  EmploymentSchema,
  IdentitySchema,
  PersonalSchema,
  ResidenceSchema,
  WIZARD_STEPS,
  type WizardStepKey,
} from "@/lib/financing/state";

const STEP_ORDER: WizardStepKey[] = WIZARD_STEPS.map((s) => s.key);

const DRAFT_STORAGE_KEY = "peel-financing-draft-v1";

export function FinancingWizard() {
  const [step, setStep] = useState<WizardStepKey>("personal");
  const [draft, setDraft] = useState<ApplicationDraft>(() => loadDraft());
  const [completed, setCompleted] = useState<WizardStepKey[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ applicationId: string } | null>(null);

  const advance = useCallback(
    (key: WizardStepKey, patch: Partial<ApplicationDraft>) => {
      const next: ApplicationDraft = { ...draft, ...patch };
      // Persist everything EXCEPT the SIN — that lives only in memory.
      const { identity, ...safe } = next;
      const safeIdentity = identity ? { ...identity, sin: "" } : undefined;
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify(safeIdentity ? { ...safe, identity: safeIdentity } : safe),
        );
      } catch {
        /* storage might be disabled */
      }
      setDraft(next);
      setCompleted((prev) => Array.from(new Set([...prev, key])));
      const idx = STEP_ORDER.indexOf(key);
      const nextStep = STEP_ORDER[idx + 1];
      if (nextStep) setStep(nextStep);
    },
    [draft],
  );

  if (done) {
    return (
      <Card className="border-primary/40 bg-primary/5">
        <CardContent className="space-y-3 p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Submitted ✓
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight">Application received.</h2>
          <p className="text-muted-foreground">
            Reference: <code className="rounded bg-muted px-1.5 py-0.5">{done.applicationId}</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Inder, Mehran, Gurri, or Sami will reach out within 1 business hour with your
            pre-qualification result. Your SIN and income are now encrypted in our database — only
            our finance team can decrypt them, and every read is audit-logged.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <WizardProgress current={step} completed={completed} />
      {step === "personal" ? (
        <PersonalStepForm
          draft={draft.personal}
          onContinue={(data) => advance("personal", { personal: data })}
        />
      ) : null}
      {step === "employment" ? (
        <EmploymentStepForm
          draft={draft.employment}
          onContinue={(data) => advance("employment", { employment: data })}
          onBack={() => setStep("personal")}
        />
      ) : null}
      {step === "residence" ? (
        <ResidenceStepForm
          draft={draft.residence}
          onContinue={(data) => advance("residence", { residence: data })}
          onBack={() => setStep("employment")}
        />
      ) : null}
      {step === "identity" ? (
        <IdentityStepForm
          draft={draft.identity}
          onContinue={(data) => advance("identity", { identity: data })}
          onBack={() => setStep("residence")}
        />
      ) : null}
      {step === "consent" ? (
        <ConsentStepForm
          draft={draft.consent}
          submitting={submitting}
          error={error}
          onBack={() => setStep("identity")}
          onSubmit={async (data) => {
            setSubmitting(true);
            setError(null);
            try {
              const payload = { ...draft, consent: data };
              const res = await fetch("/api/financing/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              const json = await res.json();
              if (!res.ok || !json.ok) throw new Error(json.error ?? "submit_failed");
              try {
                localStorage.removeItem(DRAFT_STORAGE_KEY);
              } catch {
                /* storage might be disabled */
              }
              setDone({ applicationId: json.application_id });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Submission failed");
            } finally {
              setSubmitting(false);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function loadDraft(): ApplicationDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ApplicationDraft) : {};
  } catch {
    return {};
  }
}

// =============================================================================
// Step components
// =============================================================================

function PersonalStepForm({
  draft,
  onContinue,
}: {
  draft?: ApplicationDraft["personal"];
  onContinue: (d: ApplicationDraft["personal"]) => void;
}) {
  const [form, setForm] = useState({
    first_name: draft?.first_name ?? "",
    last_name: draft?.last_name ?? "",
    email: draft?.email ?? "",
    phone: draft?.phone ?? "",
    date_of_birth: draft?.date_of_birth ?? "",
    marital_status: draft?.marital_status ?? "single",
  });
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="space-y-4 p-7">
        <Heading title="Personal info" />
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const result = PersonalSchema.safeParse(form);
            if (!result.success) {
              setError("Please double-check the highlighted fields.");
              return;
            }
            onContinue(result.data);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="first_name"
              label="First name"
              value={form.first_name}
              onChange={(v) => setForm({ ...form, first_name: v })}
            />
            <Field
              id="last_name"
              label="Last name"
              value={form.last_name}
              onChange={(v) => setForm({ ...form, last_name: v })}
            />
            <Field
              id="email"
              type="email"
              label="Email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <Field
              id="phone"
              type="tel"
              label="Phone"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <Field
              id="dob"
              type="date"
              label="Date of birth"
              value={form.date_of_birth}
              onChange={(v) => setForm({ ...form, date_of_birth: v })}
            />
            <SelectField
              id="marital_status"
              label="Marital status"
              value={form.marital_status}
              onChange={(v) =>
                setForm({ ...form, marital_status: v as typeof form.marital_status })
              }
              options={[
                { value: "single", label: "Single" },
                { value: "married", label: "Married" },
                { value: "common_law", label: "Common-law" },
                { value: "divorced", label: "Divorced" },
                { value: "widowed", label: "Widowed" },
              ]}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end">
            <Button size="lg">Continue →</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function EmploymentStepForm({
  draft,
  onContinue,
  onBack,
}: {
  draft?: ApplicationDraft["employment"];
  onContinue: (d: ApplicationDraft["employment"]) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({
    employer: draft?.employer ?? "",
    job_title: draft?.job_title ?? "",
    employment_type: draft?.employment_type ?? "full_time",
    gross_annual_income: draft?.gross_annual_income ?? 0,
    months_employed: draft?.months_employed ?? 0,
    employer_phone: draft?.employer_phone ?? "",
  });
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="space-y-4 p-7">
        <Heading title="Employment" />
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const result = EmploymentSchema.safeParse(form);
            if (!result.success) {
              setError("Please double-check the highlighted fields.");
              return;
            }
            onContinue(result.data);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="employer"
              label="Employer"
              value={form.employer}
              onChange={(v) => setForm({ ...form, employer: v })}
            />
            <Field
              id="job_title"
              label="Job title"
              value={form.job_title}
              onChange={(v) => setForm({ ...form, job_title: v })}
            />
            <SelectField
              id="employment_type"
              label="Employment type"
              value={form.employment_type}
              onChange={(v) =>
                setForm({ ...form, employment_type: v as typeof form.employment_type })
              }
              options={[
                { value: "full_time", label: "Full-time" },
                { value: "part_time", label: "Part-time" },
                { value: "self_employed", label: "Self-employed" },
                { value: "contract", label: "Contract" },
                { value: "retired", label: "Retired" },
                { value: "student", label: "Student" },
                { value: "unemployed", label: "Unemployed" },
              ]}
            />
            <Field
              id="months_employed"
              label="Months at this employer"
              type="number"
              value={String(form.months_employed)}
              onChange={(v) => setForm({ ...form, months_employed: Number(v) })}
            />
            <Field
              id="gross_annual_income"
              label="Gross annual income (CAD)"
              type="number"
              value={String(form.gross_annual_income)}
              onChange={(v) => setForm({ ...form, gross_annual_income: Number(v) })}
            />
            <Field
              id="employer_phone"
              type="tel"
              label="Employer phone (optional)"
              value={form.employer_phone}
              onChange={(v) => setForm({ ...form, employer_phone: v })}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <Button size="lg">Continue →</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ResidenceStepForm({
  draft,
  onContinue,
  onBack,
}: {
  draft?: ApplicationDraft["residence"];
  onContinue: (d: ApplicationDraft["residence"]) => void;
  onBack: () => void;
}) {
  const [form, setForm] = useState({
    street: draft?.street ?? "",
    unit: draft?.unit ?? "",
    city: draft?.city ?? "",
    province: draft?.province ?? "ON",
    postal_code: draft?.postal_code ?? "",
    housing_type: draft?.housing_type ?? "rent",
    monthly_payment_cents: draft?.monthly_payment_cents ?? 0,
    months_at_address: draft?.months_at_address ?? 0,
  });
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="space-y-4 p-7">
        <Heading title="Housing" />
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const result = ResidenceSchema.safeParse(form);
            if (!result.success) {
              setError("Please double-check the highlighted fields.");
              return;
            }
            onContinue(result.data);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="street"
              label="Street address"
              value={form.street}
              onChange={(v) => setForm({ ...form, street: v })}
            />
            <Field
              id="unit"
              label="Unit (optional)"
              value={form.unit}
              onChange={(v) => setForm({ ...form, unit: v })}
            />
            <Field
              id="city"
              label="City"
              value={form.city}
              onChange={(v) => setForm({ ...form, city: v })}
            />
            <Field
              id="province"
              label="Province"
              value={form.province}
              onChange={(v) => setForm({ ...form, province: v.toUpperCase() })}
            />
            <Field
              id="postal_code"
              label="Postal code"
              value={form.postal_code}
              onChange={(v) => setForm({ ...form, postal_code: v.toUpperCase() })}
            />
            <SelectField
              id="housing_type"
              label="Housing type"
              value={form.housing_type}
              onChange={(v) => setForm({ ...form, housing_type: v as typeof form.housing_type })}
              options={[
                { value: "own", label: "Own" },
                { value: "rent", label: "Rent" },
                { value: "live_with_family", label: "Live with family" },
              ]}
            />
            <Field
              id="monthly_payment"
              type="number"
              label="Monthly payment (CAD, ¢)"
              value={String(form.monthly_payment_cents)}
              onChange={(v) => setForm({ ...form, monthly_payment_cents: Number(v) })}
            />
            <Field
              id="months_at_address"
              type="number"
              label="Months at this address"
              value={String(form.months_at_address)}
              onChange={(v) => setForm({ ...form, months_at_address: Number(v) })}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <Button size="lg">Continue →</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function IdentityStepForm({
  draft,
  onContinue,
  onBack,
}: {
  draft?: ApplicationDraft["identity"];
  onContinue: (d: ApplicationDraft["identity"]) => void;
  onBack: () => void;
}) {
  const [sin, setSin] = useState(draft?.sin ?? "");
  const [dl, setDl] = useState(draft?.drivers_licence_number ?? "");
  const [plaidToken, setPlaidToken] = useState<string | undefined>(draft?.plaid_public_token);
  const [error, setError] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="space-y-5 p-7">
        <Heading title="Identity & income" />
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const result = IdentitySchema.safeParse({
              sin,
              drivers_licence_number: dl,
              plaid_public_token: plaidToken,
            });
            if (!result.success) {
              setError("Please double-check the SIN and driver's licence fields.");
              return;
            }
            onContinue(result.data);
          }}
        >
          <SinInput value={sin} onChange={setSin} required />
          <Field id="drivers_licence" label="Driver's licence number" value={dl} onChange={setDl} />

          <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm font-semibold">Verify income via your bank</p>
            <p className="text-xs text-muted-foreground">
              Plaid securely connects to your bank to verify your income. We do not see your banking
              credentials. Your access token is encrypted at rest. Optional but speeds up approval.
            </p>
            <PlaidLinkButton onSuccess={(token) => setPlaidToken(token)} />
            {plaidToken ? (
              <p className="text-xs text-primary">✓ Bank linked — income verification queued.</p>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold">Documents</p>
            <p className="text-xs text-muted-foreground">You can upload now or after submission.</p>
            <div className="mt-3">
              <DocumentUpload />
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <Button size="lg">Continue →</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ConsentStepForm({
  draft,
  submitting,
  error,
  onBack,
  onSubmit,
}: {
  draft?: ApplicationDraft["consent"];
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (d: ApplicationDraft["consent"]) => Promise<void>;
}) {
  const [financing, setFinancing] = useState<boolean>(draft?.financing ?? false);
  const [lenderShare, setLenderShare] = useState<boolean>(draft?.lender_share ?? false);
  const [marketing, setMarketing] = useState<boolean>(draft?.marketing ?? false);
  const [localError, setLocalError] = useState<string | null>(null);

  return (
    <Card>
      <CardContent className="space-y-5 p-7">
        <Heading title="Consent &amp; submit" />
        <form
          className="space-y-5"
          onSubmit={async (event) => {
            event.preventDefault();
            const result = ConsentSchema.safeParse({
              financing,
              lender_share: lenderShare,
              marketing,
              consent_version: CURRENT_CONSENT_VERSION,
            });
            if (!result.success) {
              setLocalError("Please grant the required consents to continue.");
              return;
            }
            setLocalError(null);
            await onSubmit(result.data);
          }}
        >
          <ConsentBox
            id="consent-financing"
            checked={financing}
            onChange={setFinancing}
            required
            title="Soft credit check + application processing (required)"
            body={CONSENT_TEXT.financing}
          />
          <ConsentBox
            id="consent-lender-share"
            checked={lenderShare}
            onChange={setLenderShare}
            required
            title="Share with lender network (required)"
            body={CONSENT_TEXT.lender_share}
          />
          <ConsentBox
            id="consent-marketing"
            checked={marketing}
            onChange={setMarketing}
            title="Marketing & service updates (optional)"
            body={CONSENT_TEXT.marketing}
          />

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">What happens next</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Your data is encrypted with pgsodium envelope encryption.</li>
              <li>We perform a soft credit pull (no impact on your score).</li>
              <li>Our finance team reviews and matches you to the best lender option.</li>
              <li>Result lands in your inbox or by phone within 1 business hour.</li>
            </ol>
            <p className="mt-2">
              Consent version: <code>{CURRENT_CONSENT_VERSION}</code>
            </p>
          </div>

          {localError || error ? (
            <p className="text-sm text-destructive">{localError ?? error}</p>
          ) : null}

          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={onBack} disabled={submitting}>
              ← Back
            </Button>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// Small helpers
// =============================================================================

function Heading({ title }: { title: string }) {
  return (
    <div className="border-b border-border pb-3">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function Field({
  id,
  label,
  type,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ConsentBox({
  id,
  checked,
  onChange,
  required,
  title,
  body,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  required?: boolean;
  title: string;
  body: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-card p-4"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        required={required}
        className="mt-1 size-4 shrink-0 rounded border-input accent-primary"
      />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </label>
  );
}

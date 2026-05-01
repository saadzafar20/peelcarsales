"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getStripeClient, isStripeConfigured } from "@/lib/stripe/client";

type Props = {
  vehicleId: string;
  vehicleLabel: string;
  className?: string;
};

/**
 * "Hold this car · $500 refundable" — manual-capture PaymentIntent flow.
 *
 * Flow:
 *   1. Customer fills name/email/phone, hits Continue
 *   2. We POST /api/stripe/create-hold to mint a PaymentIntent
 *   3. PaymentElement renders Stripe-hosted payment UI
 *   4. confirmPayment() authorizes the $500 (no money moves yet)
 *   5. Stripe webhook fires payment_intent.amount_capturable_updated
 *      → /api/webhooks/stripe sets vehicle status='on_hold' and writes
 *        a row to vehicle_holds. Dealer has 72h to capture or release.
 */
export function HoldCarButton({ vehicleId, vehicleLabel, className }: Props) {
  const [open, setOpen] = useState(false);

  if (!isStripeConfigured()) {
    return (
      <div className={className}>
        <Button disabled size="lg" variant="outline" className="w-full">
          Hold this car · $500 refundable
          <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            Stripe pending
          </span>
        </Button>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Set <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> + <code>STRIPE_SECRET_KEY</code> to
          enable.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Button size="lg" variant="outline" className="w-full" onClick={() => setOpen(true)}>
        Hold this car · $500 refundable
      </Button>
      {open ? (
        <HoldDialog
          vehicleId={vehicleId}
          vehicleLabel={vehicleLabel}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}

function HoldDialog({
  vehicleId,
  vehicleLabel,
  onClose,
}: {
  vehicleId: string;
  vehicleLabel: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"contact" | "payment" | "done">("contact");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const start = useCallback(async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle_id: vehicleId,
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "create_hold_failed");
      setClientSecret(json.client_secret);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }, [form, vehicleId]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hold this car"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <Card className="w-full max-w-md">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Hold this car</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            We&apos;ll authorize a refundable $500 hold on your card for the {vehicleLabel}. The
            money is <strong>not charged</strong> — it&apos;s just earmarked for 72 hours so we can
            take the car off the market while you finalize.
          </p>

          {step === "contact" ? (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                void start();
              }}
            >
              <Field
                id="hold-name"
                label="Full name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <Field
                id="hold-email"
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
              <Field
                id="hold-phone"
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "Continuing…" : "Continue to payment"}
              </Button>
            </form>
          ) : null}

          {step === "payment" && clientSecret ? (
            <Elements
              stripe={getStripeClient()}
              options={{ clientSecret, appearance: { theme: "stripe" } }}
            >
              <PaymentForm onDone={() => setStep("done")} />
            </Elements>
          ) : null}

          {step === "done" ? (
            <div className="space-y-3 text-sm">
              <p className="text-base font-semibold">Hold authorized.</p>
              <p className="text-muted-foreground">
                We&apos;ve received your authorization. Inder, Mehran, Gurri, or Sami will reach out
                within 1 business hour to schedule your test drive and finalize delivery. The $500
                only moves once you take delivery — released to you if you cancel within 72 hours.
              </p>
              <Button onClick={onClose} className="w-full">
                Done
              </Button>
            </div>
          ) : null}

          <p className="text-[11px] text-muted-foreground">
            Refundable for 72 hours. OMVIC + UCDA licensed. PIPEDA-compliant intake.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentForm({ onDone }: { onDone: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setSubmitting(true);
        setError(null);
        const { error: stripeError } = await stripe.confirmPayment({
          elements,
          redirect: "if_required",
        });
        if (stripeError) {
          setError(stripeError.message ?? "Payment authorization failed");
          setSubmitting(false);
          return;
        }
        onDone();
      }}
    >
      <PaymentElement />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={!stripe || submitting}>
        {submitting ? "Authorizing…" : "Authorize $500 hold"}
      </Button>
    </form>
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
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { getStripe, HOLD_AMOUNT_CENTS, HOLD_CURRENCY } from "@/lib/stripe/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Creates a $500 manual-capture PaymentIntent — money is *authorized*
 * but not captured. The dealership has 72 hours to capture (delivery)
 * or release (cancellation) before Stripe expires the auth.
 */
const Body = z.object({
  vehicle_id: z.string().uuid(),
  customer_email: z.string().email(),
  customer_name: z.string().min(1).max(120),
  customer_phone: z.string().min(7).max(40),
});

export async function POST(request: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const stripe = getStripe();

  let leadId: string | null = null;
  let vehicleSlug: string | null = null;

  // Best-effort lead capture + vehicle lookup. If Supabase isn't yet
  // configured, we still create the PaymentIntent and return a 200 so
  // the demo flow doesn't break.
  //
  // The `as never` / `as VehicleRow` casts compensate for hand-rolled
  // db.types.ts — they go away once the live project regenerates types.
  try {
    // biome-ignore lint/suspicious/noExplicitAny: hand-rolled types — replaced when live schema regenerates
    const supabase = getSupabaseAdmin() as any;
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("id, slug, status, year, make, model")
      .eq("id", body.vehicle_id)
      .single();

    const v = vehicle as {
      id: string;
      slug: string;
      status: string;
      year: number;
      make: string;
      model: string;
    } | null;
    if (!v || v.status !== "active") {
      return NextResponse.json({ ok: false, error: "vehicle_not_available" }, { status: 409 });
    }
    vehicleSlug = v.slug;

    const { data: lead } = await supabase.rpc("create_lead", {
      p_source: "web",
      p_name: body.customer_name,
      p_email: body.customer_email,
      p_phone: body.customer_phone,
      p_intent: "hold",
      p_vehicle_id: body.vehicle_id,
      p_payload: {
        action: "stripe_hold_initiated",
        vehicle_label: `${v.year} ${v.make} ${v.model}`,
      },
      p_message: null,
      p_ip: null,
      p_user_agent: null,
    });
    leadId = typeof lead === "string" ? lead : null;
  } catch (error) {
    console.warn("[stripe.create-hold] supabase unavailable, proceeding without DB row", error);
  }

  const intent = await stripe.paymentIntents.create({
    amount: HOLD_AMOUNT_CENTS,
    currency: HOLD_CURRENCY,
    capture_method: "manual",
    automatic_payment_methods: { enabled: true },
    receipt_email: body.customer_email,
    description: `$500 hold — Peel Car Sales — vehicle ${vehicleSlug ?? body.vehicle_id}`,
    metadata: {
      vehicle_id: body.vehicle_id,
      vehicle_slug: vehicleSlug ?? "",
      lead_id: leadId ?? "",
      customer_email: body.customer_email,
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
    },
  });

  return NextResponse.json({
    ok: true,
    client_secret: intent.client_secret,
    payment_intent_id: intent.id,
  });
}

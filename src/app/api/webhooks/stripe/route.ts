import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { env } from "@/lib/env";
import { getStripe } from "@/lib/stripe/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * Stripe webhook receiver. Validates the signature against
 * STRIPE_WEBHOOK_SECRET, then handles the events relevant to the $500
 * vehicle hold flow:
 *
 *   - payment_intent.succeeded         → hold was captured (delivery)
 *   - payment_intent.canceled          → hold was released (cancellation)
 *   - payment_intent.amount_capturable_updated → hold authorized successfully
 *   - charge.refunded                  → captured hold was refunded
 *
 * All side effects go through the Supabase admin client (RLS-bypass),
 * which is appropriate for webhook context — we already verified the
 * sender identity via signature.
 */
export async function POST(request: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: "stripe_not_configured" }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ ok: false, error: "missing_signature" }, { status: 400 });
  }

  const raw = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe.webhook] signature verification failed", err);
    return NextResponse.json({ ok: false, error: "bad_signature" }, { status: 400 });
  }

  // biome-ignore lint/suspicious/noExplicitAny: hand-rolled db.types.ts — regenerates once live
  let supabase: any;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    console.info("[stripe.webhook] supabase unavailable — event acknowledged but not persisted", {
      type: event.type,
      id: event.id,
    });
    return NextResponse.json({ received: true });
  }

  switch (event.type) {
    case "payment_intent.amount_capturable_updated": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const vehicleId = pi.metadata.vehicle_id;
      const leadId = pi.metadata.lead_id || null;
      if (!vehicleId) break;
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
      await supabase.from("vehicle_holds").upsert(
        {
          stripe_payment_intent_id: pi.id,
          vehicle_id: vehicleId,
          lead_id: leadId,
          amount_cents: pi.amount,
          status: "requires_capture",
          expires_at: expiresAt,
        },
        { onConflict: "stripe_payment_intent_id" },
      );
      await supabase.from("vehicles").update({ status: "on_hold" }).eq("id", vehicleId);
      break;
    }

    case "payment_intent.succeeded": {
      const pi = event.data.object as Stripe.PaymentIntent;
      await supabase
        .from("vehicle_holds")
        .update({ status: "captured", captured_at: new Date().toISOString() })
        .eq("stripe_payment_intent_id", pi.id);
      break;
    }

    case "payment_intent.canceled": {
      const pi = event.data.object as Stripe.PaymentIntent;
      const vehicleId = pi.metadata.vehicle_id;
      await supabase
        .from("vehicle_holds")
        .update({ status: "released", released_at: new Date().toISOString() })
        .eq("stripe_payment_intent_id", pi.id);
      if (vehicleId) {
        await supabase.from("vehicles").update({ status: "active" }).eq("id", vehicleId);
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const piId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (!piId) break;
      await supabase
        .from("vehicle_holds")
        .update({ status: "refunded", released_at: new Date().toISOString() })
        .eq("stripe_payment_intent_id", piId);
      break;
    }

    default:
      // Unhandled but acknowledged — Stripe will not retry.
      break;
  }

  return NextResponse.json({ received: true });
}

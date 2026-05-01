import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Admin-only: capture (collect) or release (cancel) a $500 hold.
 * RLS gates this to staff via the cookie-bound supabase client.
 */
const Body = z.object({
  payment_intent_id: z.string(),
  action: z.enum(["capture", "release"]),
});

export async function POST(request: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // RLS check — the user must be authenticated as staff to manage holds.
  const supabase = await getSupabaseServer();
  const { data: isStaff } = await supabase.rpc("is_staff");
  if (!isStaff) {
    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
  }

  const stripe = getStripe();

  if (body.action === "capture") {
    const pi = await stripe.paymentIntents.capture(body.payment_intent_id);
    return NextResponse.json({ ok: true, status: pi.status });
  }
  const pi = await stripe.paymentIntents.cancel(body.payment_intent_id);
  return NextResponse.json({ ok: true, status: pi.status });
}

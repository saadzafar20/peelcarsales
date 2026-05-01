import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

const Body = z.object({ public_token: z.string() });

/**
 * Exchanges Plaid public_token for an access_token. Stores access_token
 * via Supabase encrypted storage (TODO when supabase write path lands)
 * so subsequent /assets/get + /income/verification calls can run server-side.
 */
export async function POST(request: Request) {
  if (!env.PLAID_CLIENT_ID || !env.PLAID_SECRET) {
    return NextResponse.json({ ok: false, error: "plaid_not_configured" }, { status: 503 });
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const plaidEnv = env.PLAID_ENV ?? "sandbox";
  const baseUrl =
    plaidEnv === "production"
      ? "https://production.plaid.com"
      : plaidEnv === "development"
        ? "https://development.plaid.com"
        : "https://sandbox.plaid.com";

  const res = await fetch(`${baseUrl}/item/public_token/exchange`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.PLAID_CLIENT_ID,
      secret: env.PLAID_SECRET,
      public_token: body.public_token,
    }),
  });
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "plaid_exchange_failed" }, { status: 502 });
  }

  // TODO(supabase-write): persist access_token to finance_applications
  // (encrypted via pgsodium) and run /income/verification asynchronously.
  return NextResponse.json({ ok: true });
}

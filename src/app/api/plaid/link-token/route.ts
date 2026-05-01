import { NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * Mints a Plaid Link token for the current user. Token is short-lived
 * (4 hours) and used by the Plaid Link UI to start the OAuth flow.
 *
 * Wires up to the real Plaid API once PLAID_CLIENT_ID + PLAID_SECRET
 * are set. Until then, returns 503.
 */
export async function POST() {
  if (!env.PLAID_CLIENT_ID || !env.PLAID_SECRET) {
    return NextResponse.json({ ok: false, error: "plaid_not_configured" }, { status: 503 });
  }

  const plaidEnv = env.PLAID_ENV ?? "sandbox";
  const baseUrl =
    plaidEnv === "production"
      ? "https://production.plaid.com"
      : plaidEnv === "development"
        ? "https://development.plaid.com"
        : "https://sandbox.plaid.com";

  const res = await fetch(`${baseUrl}/link/token/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: env.PLAID_CLIENT_ID,
      secret: env.PLAID_SECRET,
      client_name: "Peel Car Sales",
      country_codes: ["CA"],
      language: "en",
      products: ["income_verification", "assets"],
      user: { client_user_id: crypto.randomUUID() },
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "plaid_link_create_failed" }, { status: 502 });
  }
  const json = (await res.json()) as { link_token: string };
  return NextResponse.json({ ok: true, link_token: json.link_token });
}

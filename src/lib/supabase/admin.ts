import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/db.types";
import { env } from "@/lib/env";

let adminClient: ReturnType<typeof createClient<Database>> | undefined;

/**
 * Service-role Supabase client. **Server-only** — the service role key
 * bypasses RLS, so leaking it would be catastrophic. The `import "server-only"`
 * directive at the top guarantees this module errors at build time if
 * imported from a client component.
 *
 * Use only from:
 *   - Webhook handlers (Stripe, Twilio, fal.ai, etc.)
 *   - Cron jobs
 *   - One-off admin actions that need to escape RLS (rare)
 *
 * For normal server reads, use getSupabaseServer() instead — that respects
 * the user's session and RLS.
 */
export function getSupabaseAdmin() {
  if (adminClient) return adminClient;
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const service = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) {
    throw new Error(
      "Supabase admin is not configured. Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  adminClient = createClient<Database>(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "public" },
  });
  return adminClient;
}

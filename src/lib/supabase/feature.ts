import { env } from "@/lib/env";

/**
 * Server-side feature flag for Supabase. The browser-equivalent lives in
 * src/lib/supabase/client.ts. Anything that imports the admin client also
 * needs SUPABASE_SERVICE_ROLE_KEY.
 */
export function isSupabaseConfiguredOnServer(): boolean {
  return Boolean(
    env.NEXT_PUBLIC_SUPABASE_URL &&
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

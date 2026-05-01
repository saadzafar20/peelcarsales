import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/db.types";
import { env } from "@/lib/env";

/**
 * Server Supabase client — reads cookies for the user's session, so RLS
 * policies see them as the right authenticated identity. Use from server
 * components and route handlers.
 */
export async function getSupabaseServer() {
  const cookieStore = await cookies();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createServerClient<Database>(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server components can't write cookies — only middleware can.
          // This try/catch is a Supabase SSR convention.
        }
      },
    },
  });
}

"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db.types";
import { env } from "@/lib/env";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Browser Supabase client. Memoized so navigation between client components
 * shares one instance. Call from components marked "use client".
 *
 * Throws if Supabase env isn't configured — features that need DB should
 * either render a fallback before calling this or be gated on env presence.
 */
export function getSupabaseBrowser() {
  if (client) return client;
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  client = createBrowserClient<Database>(url, anon);
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

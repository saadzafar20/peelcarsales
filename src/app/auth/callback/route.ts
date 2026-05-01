import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Magic-link callback. Supabase appends `code` (PKCE) which we exchange for
 * a session cookie. The `next` query param controls the post-login destination.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/admin";

  if (code) {
    // biome-ignore lint/suspicious/noExplicitAny: db.types.ts hand-rolled
    const supabase: any = await getSupabaseServer();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

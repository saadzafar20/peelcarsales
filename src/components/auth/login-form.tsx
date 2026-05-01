"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

type Props = { redirectTo: string };

export function LoginForm({ redirectTo }: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isSupabaseConfigured()) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/40 p-5 text-sm">
        Sign-in needs <code>NEXT_PUBLIC_SUPABASE_URL</code> +{" "}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>.
      </div>
    );
  }

  if (sent) {
    return (
      <div className="space-y-2 rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm">
        <p className="font-semibold">Check your inbox</p>
        <p className="text-muted-foreground">
          We sent a sign-in link to <strong>{email}</strong>. It expires in 1 hour.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
          const supabase = getSupabaseBrowser();
          const { error: authError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            },
          });
          if (authError) throw authError;
          setSent(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Sign-in failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="space-y-1.5">
        <label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider">
          Work email
        </label>
        <Input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Sending link…" : "Send magic link"}
      </Button>
    </form>
  );
}

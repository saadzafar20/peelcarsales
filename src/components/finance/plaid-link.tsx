"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";

type Props = {
  onSuccess?: (publicToken: string) => void;
};

/**
 * Plaid Link button — opens the Plaid OAuth flow and returns a public_token
 * that the server immediately exchanges for an access_token via /api/plaid/exchange.
 *
 * Until PLAID_CLIENT_ID + PLAID_SECRET are set in the server env, this
 * renders a clearly-labelled placeholder so customers can still complete
 * the rest of the wizard manually.
 */
export function PlaidLinkButton({ onSuccess }: Props) {
  // We only check the public env here — the actual Plaid SDK is loaded
  // dynamically when the customer clicks the button.
  const enabled = Boolean(env.NEXT_PUBLIC_SITE_URL); // placeholder gate

  if (!enabled) {
    return (
      <Button variant="outline" size="lg" disabled className="w-full">
        Connect bank to verify income (Plaid pending)
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="lg"
      className="w-full"
      onClick={async () => {
        try {
          const res = await fetch("/api/plaid/link-token", { method: "POST" });
          if (!res.ok) throw new Error("link_token_failed");
          const { link_token } = await res.json();

          // Lazy-load Plaid Link to avoid pulling it into the main bundle.
          const Plaid = await loadPlaid();
          const handler = Plaid.create({
            token: link_token,
            onSuccess: async (publicToken) => {
              await fetch("/api/plaid/exchange", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ public_token: publicToken }),
              });
              onSuccess?.(publicToken);
            },
          });
          handler.open();
        } catch (err) {
          console.error("[plaid-link]", err);
        }
      }}
    >
      Connect bank to verify income
    </Button>
  );
}

type PlaidHandler = {
  open: () => void;
};

type PlaidGlobal = {
  create: (config: { token: string; onSuccess: (publicToken: string) => void }) => PlaidHandler;
};

async function loadPlaid(): Promise<PlaidGlobal> {
  // biome-ignore lint/suspicious/noExplicitAny: Plaid is loaded via global script
  const w = window as any;
  if (w.Plaid) return w.Plaid;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.body.appendChild(s);
  });
  return w.Plaid;
}

"use client";

import Script from "next/script";
import { useEffect } from "react";
import { env } from "@/lib/env";

type Props = {
  /** "banner" mounts the on-page banner; "iframe" mounts the full widget */
  variant?: "banner" | "iframe";
  /** Optional starting VIN */
  vin?: string;
  className?: string;
};

const TRUETRADE_BASE = "https://truetrade.carfax.ca";
const TRUETRADE_SCRIPT = "https://cdn-tradein.carfax.ca/js/cfcTiBanner.js";

/**
 * Carfax TrueTrade trade-in valuation embed.
 *
 * Two display modes:
 *   - "banner": loads cfcTiBanner.js and renders the dealer's branded
 *     banner with a VIN/plate input. Accepts dealer account via env.
 *   - "iframe": mounts the full TrueTrade form in an iframe, used on
 *     /sell-trade where it's the page's primary content.
 *
 * postMessage events from truetrade.carfax.ca are forwarded to
 * /api/widget-events for the unified leads inbox.
 */
export function CarfaxTrueTrade({ variant = "banner", vin, className }: Props) {
  const dealerAccount = env.NEXT_PUBLIC_CARFAX_TRUETRADE_ACCOUNT;

  useEffect(() => {
    function handler(event: MessageEvent) {
      if (event.origin !== env.NEXT_PUBLIC_CARFAX_TRUETRADE_ORIGIN) return;
      const payload = event.data;
      if (!payload || typeof payload !== "object") return;
      void fetch("/api/widget-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "truetrade", variant, payload }),
        keepalive: true,
      }).catch(() => {
        /* widget keeps working even if mirror fails */
      });
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [variant]);

  if (!dealerAccount) {
    return (
      <div className={className}>
        <div className="rounded-lg border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          Carfax TrueTrade widget loads here once{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            NEXT_PUBLIC_CARFAX_TRUETRADE_ACCOUNT
          </code>{" "}
          is set. In the meantime, please call us at{" "}
          <a className="font-semibold text-primary" href="tel:9056780048">
            905-678-0048
          </a>{" "}
          for an instant valuation.
        </div>
      </div>
    );
  }

  if (variant === "iframe") {
    const params = new URLSearchParams({ account: dealerAccount });
    if (vin) params.set("vin", vin);
    return (
      <iframe
        title="Carfax TrueTrade trade-in valuation"
        src={`${TRUETRADE_BASE}/?${params.toString()}`}
        className={`h-[680px] w-full rounded-xl border border-border bg-card ${className ?? ""}`}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  // banner
  return (
    <>
      <Script src={TRUETRADE_SCRIPT} strategy="afterInteractive" />
      <div
        className={className}
        id="carfaxTiBanner"
        data-account={dealerAccount}
        data-vin={vin ?? ""}
      />
    </>
  );
}

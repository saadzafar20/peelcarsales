"use client";

import Script from "next/script";
import { useEffect } from "react";
import { env } from "@/lib/env";

type Props = {
  /** "home" or "vdp" — selects which widget ID to mount */
  placement: "home" | "vdp";
  /** Optional className applied to the AutoVerify container element */
  className?: string;
};

/**
 * AutoVerify pre-qualification SDK embed.
 *
 * Loads the public SDK from sdk.autoverify.com, mounts the configured widget
 * (home or VDP), and listens for postMessage events from the iframe so we
 * can mirror lead activity into our own DB later (Supabase `leads` table).
 *
 * Widget IDs come from env (configured at the dealership account level).
 * The CSP allowlist in src/middleware.ts already permits sdk.autoverify.com
 * and assets.askava.ai (their static assets host).
 */
export function AutoVerifyWidget({ placement, className }: Props) {
  const widgetId =
    placement === "home"
      ? env.NEXT_PUBLIC_AUTOVERIFY_HOME_WIDGET_ID
      : env.NEXT_PUBLIC_AUTOVERIFY_VDP_WIDGET_ID;

  // Mirror widget events to /api/widget-events so they land in the unified
  // admin inbox alongside web-form, AutoRaptor, and TrueTrade leads.
  useEffect(() => {
    function handler(event: MessageEvent) {
      if (event.origin !== env.NEXT_PUBLIC_AUTOVERIFY_ORIGIN) return;
      const payload = event.data;
      if (!payload || typeof payload !== "object") return;
      void fetch("/api/widget-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "autoverify", placement, payload }),
        keepalive: true,
      }).catch(() => {
        /* swallow — widget remains functional even if mirror fails */
      });
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [placement]);

  if (!widgetId) {
    // Without a widget ID we render an explicit fallback CTA so the page
    // doesn't go silent. Set NEXT_PUBLIC_AUTOVERIFY_*_WIDGET_ID to enable.
    return (
      <div className={className}>
        <div className="rounded-lg border border-dashed border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          AutoVerify pre-qualification will load here once the widget ID is set in environment
          variables. Until then, please call us at{" "}
          <a className="font-semibold text-primary" href="tel:9056780048">
            905-678-0048
          </a>
          .
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src={`${env.NEXT_PUBLIC_AUTOVERIFY_ORIGIN}/v2/api.js`} strategy="afterInteractive" />
      <Script src="https://assets.askava.ai/v2/api.js" strategy="afterInteractive" />
      <div
        className={className}
        data-av-widget-id={widgetId}
        // The SDK introspects this attribute and replaces the inner content
        // with the rendered widget once api.js has loaded.
      />
    </>
  );
}

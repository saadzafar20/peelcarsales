"use client";

import Script from "next/script";
import { env } from "@/lib/env";

/**
 * AutoRaptor chatbot. Loads site-wide. Renders nothing visible until the
 * vendor script binds to the page. Account ID comes from env so the embed
 * is gracefully no-op'd if the dealership hasn't configured it yet.
 *
 * Phase 3 also wires ADF/XML email forwarding for non-chatbot leads —
 * that's a server-side route, not this component.
 */
export function AutoRaptorChatbot() {
  const accountId = env.NEXT_PUBLIC_AUTORAPTOR_ACCOUNT_ID;
  if (!accountId) return null;
  return (
    <Script
      id="autoraptor-chatbot"
      src={`https://chatbot.autoraptor.com/?account=${encodeURIComponent(accountId)}`}
      strategy="afterInteractive"
    />
  );
}

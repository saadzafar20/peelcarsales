import { type NextRequest, NextResponse } from "next/server";

/**
 * Per-request CSP nonce + security policy.
 *
 * Pages that need to inject inline <script> tags (GTM, AutoVerify SDK,
 * AutoRaptor chatbot, Klaviyo, etc.) must read `x-nonce` from headers()
 * and pass it as nonce={nonce} to the <script>. Without the nonce the
 * script is blocked.
 */
const isProd = process.env.NODE_ENV === "production";

const SCRIPT_ALLOWLIST = [
  "'self'",
  // Phase 3 — AutoVerify pre-qual SDK
  "https://sdk.autoverify.com",
  "https://assets.askava.ai",
  // Phase 3 — Carfax TrueTrade trade-in
  "https://cdn-tradein.carfax.ca",
  "https://truetrade.carfax.ca",
  // Phase 3 — AutoRaptor chatbot
  "https://chatbot.autoraptor.com",
  // Phase 5 — Stripe.js
  "https://js.stripe.com",
  // Phase 6 — Klaviyo client SDK
  "https://static.klaviyo.com",
  // Phase 9 — tag manager + analytics
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  // Legacy parity
  "https://cdn.luckyorange.com",
];

const CONNECT_ALLOWLIST = [
  "'self'",
  "https://*.supabase.co",
  "wss://*.supabase.co",
  "https://*.algolia.net",
  "https://*.algolianet.com",
  "https://api.anthropic.com",
  "https://api.fal.ai",
  "https://*.klaviyo.com",
  "https://api.stripe.com",
  "https://www.google-analytics.com",
  "https://us.i.posthog.com",
  "https://us-assets.i.posthog.com",
];

const FRAME_ALLOWLIST = [
  "'self'",
  "https://truetrade.carfax.ca",
  "https://js.stripe.com",
  "https://hooks.stripe.com",
  "https://chatbot.autoraptor.com",
];

function getCorsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return null;
  }

  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!allowedOrigins.includes(origin)) {
    return null;
  }

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin",
  };
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const corsHeaders = getCorsHeaders(request);

    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: corsHeaders ? 204 : 403,
        headers: corsHeaders ?? undefined,
      });
    }

    const response = NextResponse.next();
    if (corsHeaders) {
      for (const [key, value] of Object.entries(corsHeaders)) {
        response.headers.set(key, value);
      }
    }

    return response;
  }

  const nonce = btoa(crypto.randomUUID());

  const csp = [
    "default-src 'self'",
    `script-src ${SCRIPT_ALLOWLIST.join(" ")} 'nonce-${nonce}'${
      isProd ? " 'strict-dynamic'" : " 'unsafe-eval' 'unsafe-inline'"
    }`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https:",
    "font-src 'self' https://fonts.gstatic.com data:",
    `connect-src ${CONNECT_ALLOWLIST.join(" ")}`,
    `frame-src ${FRAME_ALLOWLIST.join(" ")}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

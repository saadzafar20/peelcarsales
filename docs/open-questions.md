# Open Questions

Track everything we owe the product owner answers on. Each item is one of:

- **BLOCKER** — phase cannot start without an answer
- **CREDENTIAL** — feature flag stays off until secret arrives; we ship a typed mock
- **DECISION** — a call we deferred and need to make before launch

When an item is resolved, move it to `## Resolved` with a date and one-line outcome.

---

## BLOCKER

_(none)_

## CREDENTIAL

_All Phase 0 placeholders. Each will be flipped from "mock" to "live" by populating the
corresponding env var; `src/lib/env.ts` defines the typed contract._

| Phase | Env var(s)                                                                     | Owner                    | Status                       |
| ----- | ------------------------------------------------------------------------------ | ------------------------ | ---------------------------- |
| 1     | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID` | saadzafar20              | user creating project later  |
| 1     | `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`, `ALGOLIA_ADMIN_KEY` | saadzafar20              | will be arranged             |
| 1     | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`   | saadzafar20              | will be arranged             |
| 2     | `FAL_KEY`, `FAL_WEBHOOK_SECRET`                                                 | saadzafar20              | will be arranged             |
| 3     | `AUTORAPTOR_LEAD_EMAIL`                                                         | Peel Car Sales (via saad) | "I'll provide at later stage" |
| 3     | AutoVerify postMessage origin (already known: `https://sdk.autoverify.com`)     | n/a                      | confirmed                    |
| 3     | Carfax TrueTrade postMessage origin (already known: `https://truetrade.carfax.ca`) | n/a                   | confirmed                    |
| 4     | AutoTrader.ca CAMS feed credentials, Kijiji partner ID, CarGurus feed token, Google Vehicle Listings merchant, Facebook catalog ID, TikTok catalog ID | saadzafar20 | mock until creds arrive |
| 5     | `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`                                  | saadzafar20              | will be arranged             |
| 5     | RouteOne / Dealertrack Canada API credentials                                   | saadzafar20              | will be arranged             |
| 5     | `APP_SIN_HMAC_SECRET` (must be generated server-side and stored in Supabase Vault) | saadzafar20             | will be arranged             |
| 5     | DocuSign / SignWell API key + template IDs                                      | saadzafar20              | will be arranged             |
| 6     | `ANTHROPIC_API_KEY`                                                             | saadzafar20              | will be arranged             |
| 6     | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_CONVERSATIONS_SERVICE_SID`, `TWILIO_WHATSAPP_FROM` | saadzafar20 | will be arranged   |
| 6     | WhatsApp Business Cloud API access (Meta business verification)                 | saadzafar20              | will be arranged             |
| 6     | `RESEND_API_KEY`, `KLAVIYO_PRIVATE_API_KEY`, `NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY`   | saadzafar20              | will be arranged             |
| 9     | `SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`                                         | saadzafar20              | will be arranged             |
| —     | `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`       | saadzafar20              | port from current site       |
| —     | Lucky Orange site key (legacy parity)                                           | saadzafar20              | port from current site       |
| —     | GitHub remote (need `gh` CLI installed or manual repo creation)                 | saadzafar20              | local-only commit until then |
| —     | Vercel team slug                                                                | saadzafar20              | needed before first preview deploy |

## DECISION

| Topic                               | Why it matters                                                                                         | Default if unanswered                                |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Domain cutover plan                  | When does `peelcarsales.com` redirect to `peelcarsales.ca`? Affects SEO migration + 301 map.            | Run on `peelcarsales.ca` until launch, plan 301s pre-cutover. |
| Brand colour confirmation           | Logo is white-on-transparent — current palette (crimson + navy + amber) is my call, not yours.          | Ship as-is, swap in real brand HSL when provided.    |
| Multilingual scope (Phase 8)        | Confirm priority of EN / Punjabi / Hindi / Urdu / Quebec-French. AI translations need staff review.    | Start with EN-only, scaffold next-intl now.          |
| Sales rep roster                    | `/staff` page needs current Inder, Mehran, Gurpreet/Gurri, Sami Haq plus any others, with photo + bio. | Pull from Google reviews + current site, confirm.    |
| Voice concierge after-hours         | ElevenLabs voice persona, scripts, escalation thresholds.                                              | Off by default in Phase 6, build behind flag.        |
| Customer portal scope               | Which post-purchase features ship at launch vs. Phase 8.                                                | Start with referral tracker only.                    |
| Privacy policy + ToS                | Legal review required before financing flow goes live (PIPEDA consent text).                           | Hold launch of Phase 5 until lawyer signs off.       |

## Resolved

- **2026-04-27 — Next.js stack version.** Spec §2 locked Next 14, but 14.2.35
  shipped with 5 unpatched CVEs (2 HIGH). PO approved bump to Next 15.5.15 +
  React 19 during the Phase 0.1 hardening pass. CLAUDE.md §2 updated with a
  note on the deviation.

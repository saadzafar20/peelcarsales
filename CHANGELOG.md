# Changelog

All notable changes to Peel Car Sales 2.0. We follow [Keep a Changelog](https://keepachangelog.com)
and [Semantic Versioning](https://semver.org). Until cutover the version stays at `0.x`.

## [Unreleased]

### Phase 2 — Live integrations: embeds, Supabase, Stripe, admin, financing wizard

5 progressive commits delivering the full integration spec end-to-end.
Everything compiles green; runtime gates on env vars (Supabase / Stripe /
Plaid) are explicit so the site stays usable as accounts are provisioned.

#### Embeds (commit A)

- AutoVerify pre-qualification SDK on home + VDP + financing sidebar
- Carfax TrueTrade trade-in (banner + iframe variants)
- AutoRaptor chatbot site-wide
- /api/widget-events POST endpoint mirrors widget events
- All gracefully no-op when account IDs aren't set

#### Supabase (commit B)

- 5 SQL migrations: schema (17 tables), RLS deny-by-default, pgsodium
  PII encryption (peel_pii_v1 key), pii_access_log + audit RPC,
  high-level RPCs (create_lead, submit_finance_application)
- src/lib/supabase/{client,server,admin,feature,staff}.ts wrappers
- src/lib/db.types.ts hand-rolled (regenerates from live schema)

#### Stripe (commit C)

- $500 manual-capture PaymentIntent flow with 72h hold
- /api/stripe/create-hold + /api/stripe/capture + /api/webhooks/stripe
- HoldCarButton client component with Stripe Elements modal
- Webhook handlers toggle vehicle.status active <-> on_hold

#### Admin (commit D)

- Magic-link auth (/login + /auth/callback via Supabase OTP)
- Role-gated /admin layout, role-aware sidebar
- Pages: dashboard with KPIs, inventory list + new (3-step VIN UI),
  unified leads inbox, finance-applications with PIPEDA callout,
  pii_access_log audit viewer, staff roster

#### Financing wizard (commit E)

- 5-step secure intake at /financing/apply
- Per-step Zod validation, draft localStorage *excluding SIN*
- SinInput masks + defeats autofill; PlaidLinkButton lazy-loads
  link-initialize.js
- /api/financing/submit enforces consent_version match (defense in
  depth), encrypts SIN/DOB/income via pgsodium, writes immutable
  consent rows
- Versioned PIPEDA consent text (TODO: legal review pre-launch)

#### Stack additions

- `stripe@22`, `@stripe/stripe-js`, `@stripe/react-stripe-js`
- commitlint scope enum extended with `embeds`, `admin`, `stripe`, `supabase`

---

### Phase 1 (UI shell with sample data) — full clickable site

A real dealership site backed by hardcoded sample data tagged
`IS_SAMPLE: true`, so Phase 1's Supabase work plugs into the existing UI
without rework. Six progressive commits.

#### Added — chrome + UI primitives

- **shadcn-pattern UI primitives** with brand-token-driven CVA variants:
  Button (8 variants × 5 sizes), Card family, Badge, Input, Separator
- **SiteHeader** with utility bar (hours + WhatsApp + phone), main nav,
  mobile horizontal-scroll nav, Browse + Call CTAs
- **SiteFooter** with brand + OMVIC/UCDA/AutoTrader seals, both lot
  addresses with Maps deep-links, hours, quick links, financing intent
  links, legal strip
- **WhatsAppFab** floating chat button (will deconflict with AutoRaptor
  chatbot in Phase 3)
- **VehiclePhoto** + **VehicleGallery** components (Picsum-seeded
  deterministic photos until Phase 2 fal.ai pipeline)
- **VehicleCard** for grids (badges, discount callout, mileage, body,
  drivetrain, location, price + bi-weekly estimate)
- **PageHero** shared component (eyebrow + title + subtitle, dark|light)

#### Added — sample inventory + helpers

- 12 sample vehicles spanning Honda, Toyota, Hyundai, Mazda, Lexus, Kia,
  BMW, Ford, VW, Nissan; both lots; price range $19,499–$35,995
- `src/lib/sample-inventory.ts` with `getFeaturedSampleVehicles`,
  `getSampleVehicleBySlug`, `getSimilarSampleVehicles`
- `src/lib/inventory.ts` formatting helpers + `estimateBiweeklyPaymentCents`
  (84mo @ 7.99% APR default, 13% HST applied)
- `src/lib/cities.ts` with 10 GTA cities for programmatic SEO

#### Added — public pages

| Route | What |
| ----- | ---- |
| `/` | Hero + featured grid + Why Peel + TrueTrade band + intent lanes + reviews + crimson CTA |
| `/inventory` | Filter rail (working `?body=`, visual placeholders for the rest) + sort + result grid + empty state |
| `/inventory/[slug]` | VDP with gallery, price card, bi-weekly + monthly estimate, specs table, features list, similar vehicles, sticky desktop sidebar |
| `/financing` | Hero + 4-step process + 5-step wizard skeleton + 5 intent lanes + 4-point trust strip |
| `/financing/calculator` | Interactive client-side calculator with sliders for price/down/term/APR; live bi-weekly + monthly + total interest output |
| `/sell-trade` | Carfax TrueTrade entry placeholder + 4-step process + sample valuation card |
| `/services` | 6 buyer-protection cards + 12-category inspection breakdown + warranty extension callout |
| `/about` | Family-run narrative + values + awards/licensing table |
| `/staff` | Inder, Mehran, Gurpreet (Gurri), Sami Haq team grid with bios + languages |
| `/contact` | Both lots in cards with hours, contact form (Phase 3), WhatsApp CTA |
| `/directions` | Embedded Google Maps for both lots, landmarks, Get Directions deep-links |
| `/referral` | $250-for-you/$250-for-them program, fine print, signup form (Phase 8) |
| `/bad-credit-car-loans` | Subprime intent landing page |
| `/no-credit-car-loans` | First-time-buyer intent landing |
| `/work-permit-car-loans` | Open WP / LMIA / PGWP intent landing |
| `/student-car-loans` | Domestic + international student intent landing |
| `/newcomer-car-loans` | PR-within-5-years intent landing |
| `/[city]/used-cars` × 10 | Programmatic SEO pages: Mississauga, Oakville, Brampton, Toronto, Etobicoke, Hamilton, Burlington, Milton, Vaughan, Markham — each with city-specific copy, nearest-lot inventory ordering, internal-link cluster |

All routes (except `/financing/calculator` which is necessarily client) are
server components. VDPs and city pages are statically prerendered via
`generateStaticParams`.

#### Updated

- Sitemap now lists all 11 static + 5 intent + 10 city + 12 VDP routes
- E2E tests updated: home renders + security headers + 404 + a11y
  (Picsum images excluded from axe due to MIME-tight checks)

### Phase 0.1 — security + hygiene patch

#### Changed (stack lock — PO-approved deviation from spec §2)

- **Bumped Next.js 14.2.35 → 15.5.15 + React 18 → 19.** The original spec
  locked Next 14, but `next@14.2.35` (the latest 14.x release) had **5 active
  CVEs** with no patched 14.x release available — 2 HIGH (HTTP request
  deserialization → DoS, Server Components DoS) and 3 MODERATE (Image
  Optimizer DoS, request smuggling in rewrites, next/image cache exhaustion).
  All five are patched in 15.5.15+. The chained `postcss <8.5.10` XSS is also
  resolved. Build remains static-only on the placeholder home (5.45 kB / 107 kB
  First Load JS).
- `next.config.mjs` — promoted `experimental.typedRoutes` → top-level
  `typedRoutes` (stable in Next 15) and wrapped with `@next/bundle-analyzer`.
- `pnpm.overrides` forces `postcss >=8.5.12` across the entire dep tree —
  Next 15.5.15 still bundles `postcss@8.4.31` internally despite the
  Next-side patches. With the override `pnpm audit` reports **zero
  vulnerabilities** (was 6 before this patch).

#### Added — security

- `src/middleware.ts` enforcing **Content-Security-Policy** with per-request
  base64 nonce. Vendor allowlist baked in for AutoVerify SDK, Carfax TrueTrade,
  AutoRaptor chatbot, Stripe, Klaviyo, GTM/GA, Lucky Orange, Supabase, Algolia,
  Anthropic, fal.ai, PostHog. `frame-ancestors 'none'`, `object-src 'none'`,
  `upgrade-insecure-requests`. Pages adding inline `<script>` tags must read
  `headers().get("x-nonce")` and pass `nonce={nonce}` — without it the script
  is blocked.
- `.github/dependabot.yml` — weekly grouped npm updates (minor + patch grouped,
  types/tooling grouped) + GitHub Actions updates. Toronto timezone, scoped
  conventional commit prefix.
- `SECURITY.md` — disclosure policy referencing PIPEDA + non-negotiables.
- `.github/CODEOWNERS` — flagging middleware, env contract, migrations, CI,
  CLAUDE.md, SECURITY.md for explicit review.

#### Added — App Router conventions

- `src/app/not-found.tsx` — styled 404 on brand navy.
- `src/app/error.tsx` — per-route client error boundary (no PII in console).
- `src/app/global-error.tsx` — root error boundary (own `<html>`, no app deps).
- `src/app/robots.ts` — disallows all non-production environments so preview
  deploys never get indexed; production allows everything except `/admin`,
  `/api`, `/my`.
- `src/app/sitemap.ts` — Phase 0 stub returning home only. Phase 1+ expands.

#### Added — favicon + OG

- `src/app/icon.tsx` (32×32), `apple-icon.tsx` (180×180), `opengraph-image.tsx`
  (1200×630). All generated via `next/og` `ImageResponse` from JSX — brand
  letterform on navy, crimson accent, AutoTrader award callout on the OG card.

#### Added — developer experience

- `.nvmrc` pinning Node 20.
- `.editorconfig` for cross-editor consistency.
- `commitlint` + `.husky/commit-msg` hook enforcing conventional commits with a
  curated scope enum.
- `@next/bundle-analyzer` wired behind `ANALYZE=true` (`pnpm analyze`).
- `@axe-core/playwright` a11y scan on the home e2e — fails on any wcag2a/2aa
  violation.
- `.github/pull_request_template.md` with phase + test plan + security
  checklist.
- `pnpm.onlyBuiltDependencies = ["sharp"]` to allow Next's image optimizer
  native binding to install without weakening pnpm 10's default script
  sandboxing.

#### Tests

- E2E now covers: home renders, security headers landing (HSTS / X-CTO /
  X-Frame-Options / Referrer-Policy / **CSP with nonce**), styled 404, and
  axe-core a11y violations (WCAG 2.0 A + AA).

---

### Phase 0 — scaffold + tooling + design tokens

#### Added

- Next.js 14 App Router project (TypeScript strict, src dir, `@/*` import alias).
- Tailwind CSS theme with HSL-based design tokens (crimson primary, navy secondary, amber accent),
  shadcn-compatible CSS variables, light + dark schemes, `tailwindcss-animate` plugin.
- Biome 2.4 as the single lint + formatter (replaces ESLint + Prettier).
- Strict TypeScript: `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`.
- Typed env contract via `@t3-oss/env-nextjs` + Zod (`src/lib/env.ts`) — build fails on missing or
  malformed required vars, optional vars unlock features at the call site.
- Vitest + Testing Library + jsdom (`vitest.config.ts`, `vitest.setup.ts`).
- Playwright config with auto-build webServer + GitHub reporter in CI.
- GitHub Actions CI: typecheck, biome, unit tests, playwright, supabase-migrations sanity job.
- Security headers in `next.config.mjs`: HSTS, X-Content-Type-Options, X-Frame-Options,
  Referrer-Policy, Permissions-Policy.
- `src/lib/utils.ts` with `cn`, `formatPriceCAD`, `formatMileage` helpers.
- `supabase/` directory stub (`config.toml` + `migrations/`).
- VS Code settings + recommended extensions.
- Phase 0 placeholder home page using brand mark + typography tokens.
- Project documentation: `CLAUDE.md`, `README.md`, `docs/open-questions.md`.

#### Deferred

- Vercel project + preview deploys (waiting on team selection).
- GitHub remote (waiting on `gh` CLI install or manual repo creation).
- Supabase project (user creating later).
- shadcn/ui CLI init — design tokens are wired so `pnpm dlx shadcn@latest init` will pick them up
  in Phase 1.

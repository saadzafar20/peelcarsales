# Front-end brief — Peel Car Sales 2.0

> **For the front-end designer / Lovable / Vercel v0 / any UI agent.**
> The backend is done. Your job is to make the front-end stunning. This
> document explains the boundary so you don't break what's underneath.

---

## What's locked (DO NOT MODIFY)

These directories contain the production backend. Don't touch their files
or change their public exports — the front-end calls them through stable
contracts.

```
src/app/api/**/*               # All HTTP API routes
src/lib/supabase/**/*          # Supabase server / browser / admin clients
src/lib/stripe/**/*            # Stripe server + client wrappers
src/lib/financing/**/*         # Zod schemas + PIPEDA consent
src/lib/env.ts                 # Typed env contract (single source of truth)
src/lib/db.types.ts            # Database TypeScript types
src/lib/cities.ts              # 10 GTA cities for programmatic SEO
src/lib/sample-inventory.ts    # 12 sample vehicles (replaceable later, but shape is locked)
src/lib/inventory.ts           # Formatting helpers (vehicleTitle, formatPriceCAD, etc.)
src/middleware.ts              # CSP nonce + security headers
src/components/embeds/**/*     # AutoVerify, Carfax TrueTrade, AutoRaptor SDK loaders
src/components/finance/**/*    # SinInput, document upload, Plaid Link, wizard logic
src/components/auth/**/*       # Magic-link sign-in form
supabase/**/*                  # SQL migrations + seed
.github/**/*                   # Dependabot + workflows + CODEOWNERS
biome.json · tsconfig.json · next.config.mjs · package.json · CLAUDE.md
```

If you need a new API route, add a new file under `src/app/api/<your-feature>/route.ts`
— don't modify the existing ones.

---

## What's open (REDESIGN AT WILL)

Everything visual. Make it gorgeous.

```
src/app/page.tsx                          # Home
src/app/inventory/page.tsx                # Listing
src/app/inventory/[slug]/page.tsx         # VDP
src/app/financing/page.tsx                # Financing landing
src/app/financing/calculator/page.tsx     # Payment calculator
src/app/financing/apply/page.tsx          # Wizard wrapper
src/app/sell-trade/page.tsx               # Trade-in
src/app/about/page.tsx                    # About
src/app/staff/page.tsx                    # Team
src/app/contact/page.tsx                  # Contact
src/app/services/page.tsx                 # Why Peel
src/app/directions/page.tsx               # Maps
src/app/referral/page.tsx                 # Referral
src/app/[city]/used-cars/page.tsx         # Programmatic SEO (10 cities)
src/app/{bad,no,work-permit,student,newcomer}-credit-car-loans/page.tsx  # Intent landings
src/app/admin/**/*                        # Admin chrome (use ours as a starting point)
src/app/login/page.tsx                    # Login chrome (form is locked, page is open)
src/components/site/**/*                  # Hero, vehicle-card, headers, footers — REDESIGN
src/components/ui/**/*                    # Button, Card, Badge, Input, Separator
src/components/admin/**/*                 # Admin sidebar + page header
src/app/globals.css                       # Design tokens — ADJUST not REPLACE
tailwind.config.ts                        # Theme — ADJUST
public/**/*                               # Static assets
```

### Rules for design changes

1. **Brand tokens may evolve, but they live in HSL CSS variables in
   `src/app/globals.css`.** Don't hard-code hex colors in components —
   adjust the `--primary` / `--secondary` / `--accent` variables instead.
2. **Don't break the URL contract.** Don't rename routes. The sitemap +
   Google Search Console + AutoTrader feed all depend on these slugs.
3. **Sample data shape is locked** — `SampleVehicle` type in
   `src/lib/sample-inventory.ts`. You can change how it's displayed; you
   can't rename fields.
4. **Inventory listing must accept `?body=<sedan|suv|...>` and `?sort=<...>`
   search params.** The programmatic SEO and admin pages link to
   filtered URLs.
5. **VDP gallery photos** come from `<VehiclePhoto seed={vehicle.photoSeed} />`
   today (Picsum). Don't replace the component until Phase 2 fal.ai
   images land — just style the wrapper.
6. **Financing wizard pages** under `/financing/apply/*` MUST use the
   existing `<FinancingWizard />` component from
   `src/components/finance/financing-wizard.tsx` — restyle the visuals,
   don't reimplement the state machine. The SIN handling and PIPEDA
   consent are legally critical.
7. **Stripe Hold button** must use `<HoldCarButton vehicleId={...}
   vehicleLabel={...} />` from `src/components/site/hold-car-button.tsx`.
   Restyle the button trigger; the modal flow + Elements integration is
   tested.
8. **Embeds** (`<AutoVerifyWidget>`, `<CarfaxTrueTrade>`,
   `<AutoRaptorChatbot>`) are SDK loaders — drop them into pages, but
   don't modify their internals.
9. **Auth flow** uses `<LoginForm redirectTo="..." />` from
   `src/components/auth/login-form.tsx`. Restyle the page chrome around it.
10. **Server components are the default.** Only mark a component
    `"use client"` when you actually need state, refs, or browser APIs.
    Server components fetch data at request time and ship zero JS.

---

## API contract (the calls front-end already makes)

```
POST /api/widget-events           — fired by AutoVerify/TrueTrade postMessage
POST /api/stripe/create-hold      — body: { vehicle_id, customer_name, customer_email, customer_phone }
                                    returns: { client_secret, payment_intent_id }
POST /api/stripe/capture          — admin only — body: { payment_intent_id, action: 'capture'|'release' }
POST /api/webhooks/stripe         — Stripe → server (signature verified)
POST /api/financing/submit        — body: { personal, employment, residence, identity, consent }
                                    returns: { application_id, lead_id }
POST /api/plaid/link-token        — returns: { link_token }
POST /api/plaid/exchange          — body: { public_token } → returns: { ok }
GET  /auth/callback?code=...      — magic-link PKCE exchange
```

Front-end pages can call these freely with `fetch(...)`. Don't move them
or change their request/response shapes.

---

## Design tokens

Brand palette (in `src/app/globals.css`, expressed as HSL):

```
--primary       350  78%  42%   /* Crimson — CTAs, key actions */
--secondary     215  60%  11%   /* Navy — header, premium surfaces */
--accent         38  92%  50%   /* Amber — badges, "best price" callouts */
--background      0   0% 100%   /* White */
--foreground    222  47%  11%   /* Near-black slate */
--muted         220  14%  96%   /* Light grey */
--destructive     0  84%  60%   /* Red */
--border        220  13%  91%
--ring          350  78%  42%
--radius        0.625rem
```

You can shift any of these; just keep them as HSL variables so dark mode
keeps working.

---

## Brand voice

- **Honesty over the close.** "If a car has a story — a repaired panel,
  a former rental, anything — we tell you before you ask."
- **Family-run + multilingual.** English / Punjabi / Hindi / Urdu spoken
  on the lot.
- **Transparent pricing.** OMVIC + UCDA licensed. AutoTrader Best Priced
  Dealer 2024 + 2025. CarGurus Top Rated.
- **Visible reps:** Inder, Mehran, Gurpreet (Gurri), Sami Haq.
- **Two locations:**
  - Mississauga: 2701 Derry Rd East, Mississauga, ON L4T 1A2
  - Oakville: 333 Wyecroft Rd Unit 11, Oakville, ON L6K 2H2
  - Phone: 905-678-0048 (both)
- **Hours:** Mon–Fri 9 AM – 8 PM · Sat 9 AM – 6 PM · Sun 11 AM – 5 PM

---

## How to run locally

```bash
pnpm install
cp .env.example .env.local       # fill in what you have, leave rest blank
pnpm dev                         # http://localhost:3000
pnpm verify                      # typecheck + biome + vitest + build
pnpm e2e                         # Playwright smoke tests
```

The site works without any third-party credentials — Supabase / Stripe /
Plaid / AutoVerify / TrueTrade / AutoRaptor all gracefully no-op when env
vars are missing. Ship visual changes against `pnpm dev` and let the
backend wake up when keys land.

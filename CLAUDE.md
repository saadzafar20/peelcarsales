# CLAUDE.md — Peel Car Sales 2.0

Authoritative guidance for any Claude Code session working on this repo.
Read this **before** writing code. Keep it in sync as the project evolves —
when you change something the next session needs to know, update this file
in the same commit.

---

## 1. Project overview

**Peel Car Sales 2.0** is a complete rebuild of the live WordPress site
[peelcarsales.com](https://peelcarsales.com) — a 150-vehicle, OMVIC + UCDA
licensed used-car dealership at:

- 2701 Derry Rd East, Mississauga, ON L4T 1A2
- 333 Wyecroft Rd Unit 11, Oakville, ON L6K 2H2
- 905-678-0048

The new site ships at [peelcarsales.ca](https://peelcarsales.ca). Customer
base skews South Asian / Punjabi / new-Canadian; primary financing intents
are good credit, bad credit, no credit, student permit, work permit,
bankruptcy, and consumer proposal. Awards: AutoTrader Best Priced Dealer
2024 + 2025, CarGurus Top Rated. Visible reps in Google reviews: Inder,
Mehran, Gurpreet (Gurri), Sami Haq.

**Why we're rebuilding:** the current WP + Contact Form 7 stack is slow,
hard to extend, and (critically) collects SIN through WPCF7 in cleartext
— a PIPEDA exposure. We are fixing performance, fixing compliance,
unlocking programmatic SEO, layering AI on the conversation flow, and
modernizing the photo + lead pipeline.

Product owner: **Saad Zafar** (saadzafar.20@gmail.com, GitHub
`saadzafar20`). Saad is the PO, not a developer for this project — make
architectural calls and explain tradeoffs in plain English when they
matter; do not ask low-stakes questions.

---

## 2. Locked stack — DO NOT NEGOTIATE

| Concern         | Choice                                                              |
| --------------- | ------------------------------------------------------------------- |
| Framework       | Next.js 15 App Router (React 19), TypeScript strict mode            |
| UI              | Tailwind + shadcn/ui + Framer Motion + lucide-react                 |
| Database        | Supabase Postgres + RLS + pgsodium for PII envelope encryption      |
| Auth            | Supabase Auth (magic link + Google for staff)                       |
| Storage         | Supabase Storage (raw + processed images)                           |
| Search          | Algolia                                                             |
| Email           | Resend (transactional) + Klaviyo (marketing)                        |
| SMS + WhatsApp  | Twilio Conversations                                                |
| Payments        | Stripe (manual-capture deposit holds)                               |
| AI              | Anthropic API — `claude-sonnet-4-6` default, `claude-opus-4-6` for concierge |
| Hosting         | Vercel (frontend + edge functions) + Supabase (db)                  |
| Cron            | Vercel Cron + Supabase scheduled functions                          |
| Observability   | Sentry + PostHog (analytics + session replay)                       |
| Tag mgmt        | Google Tag Manager (port existing tags)                             |
| Testing         | Vitest + Playwright + supabase-js test client                       |
| Migrations      | Supabase CLI migrations (no raw SQL in app code)                    |
| Schema typing   | Generated Supabase TS types into `src/lib/db.types.ts`              |
| Package mgmt    | pnpm (pinned via `packageManager` in `package.json`)                |
| Code quality    | Biome (replaces ESLint + Prettier), strict TS, no `any`             |
| Git             | Conventional commits, feature branches, GitHub PRs, Vercel previews |

If any of these need to change, raise it with the PO before acting — do
not silently swap a library.

> **Note on Next.js version:** the original spec called for Next 14. We
> bumped to **Next 15** (React 19) during the Phase 0.1 hardening pass,
> with PO sign-off, because Next 14 had 5 unpatched CVEs (2 HIGH) and
> there is no patched 14.x release. See `CHANGELOG.md` Phase 0.1 entry.

---

## 3. Repo layout

```
peel-car-sales-2/
├── .github/workflows/        CI: typecheck, biome, vitest, playwright, supabase
├── .husky/                   Git hooks (pre-commit runs lint-staged)
├── .vscode/                  Biome formatter + recommended extensions
├── docs/                     open-questions.md and similar long-lived notes
├── public/                   Static assets (logo.png is the brand mark)
├── src/
│   ├── app/                  App Router — public + /admin/*
│   │   ├── globals.css       Tailwind + design-token CSS variables
│   │   ├── layout.tsx        Root layout (fonts, metadata, viewport)
│   │   ├── page.tsx          Phase 0 placeholder (replace in Phase 1)
│   │   ├── not-found.tsx     Styled 404 (brand navy + crimson)
│   │   ├── error.tsx         Per-route error boundary (client component)
│   │   ├── global-error.tsx  Root error boundary (renders own <html>)
│   │   ├── robots.ts         robots.txt — blocks non-prod environments
│   │   ├── sitemap.ts        Sitemap (Phase 0: home only; Phase 1+ adds VDPs)
│   │   ├── icon.tsx          32×32 favicon (ImageResponse, brand glyph)
│   │   ├── apple-icon.tsx    180×180 Apple touch icon
│   │   └── opengraph-image.tsx 1200×630 social share card
│   ├── middleware.ts         Per-request CSP nonce + security headers
│   ├── components/
│   │   └── ui/               shadcn/ui components (generated)
│   └── lib/
│       ├── env.ts            Typed env via t3-env + Zod (single source of truth)
│       ├── utils.ts          cn(), formatPriceCAD(), formatMileage()
│       └── db.types.ts       Generated Supabase types (placeholder until DB exists)
├── supabase/
│   ├── config.toml           Supabase CLI config
│   └── migrations/           SQL migrations (one per change)
├── tests/
│   ├── unit/                 Vitest
│   └── e2e/                  Playwright
├── biome.json                Lint + format config
├── tailwind.config.ts        Theme tokens (read globals.css for the values)
├── tsconfig.json             Strict TS with noUncheckedIndexedAccess + friends
├── playwright.config.ts
├── vitest.config.ts
├── vitest.setup.ts
├── next.config.mjs           Security headers + image remotePatterns
├── .env.example              Env contract (copy to .env.local)
├── CLAUDE.md                 ← you are here
├── CHANGELOG.md
├── README.md
└── package.json
```

Add new top-level dirs sparingly; prefer `src/lib/<domain>/` for new
integrations (e.g. `src/lib/algolia/`, `src/lib/fal/`, `src/lib/twilio/`).

---

## 4. Common commands

| Command                | What it does                                                |
| ---------------------- | ----------------------------------------------------------- |
| `pnpm dev`             | Next dev server on http://localhost:3000                    |
| `pnpm build`           | Production build                                             |
| `pnpm start`           | Run the production build                                     |
| `pnpm typecheck`       | `tsc --noEmit` (strict)                                      |
| `pnpm check`           | Biome lint + format check                                    |
| `pnpm check:fix`       | Biome auto-fix (run before opening a PR)                     |
| `pnpm test`            | Vitest unit tests                                            |
| `pnpm test:watch`      | Vitest watch mode                                            |
| `pnpm e2e`             | Playwright e2e (auto-builds + serves)                        |
| `pnpm e2e:install`     | Install Chromium with deps (run once after `pnpm install`)   |
| `pnpm verify`          | Full local CI gate: typecheck + check + test + build         |
| `pnpm analyze`         | Build with `@next/bundle-analyzer` HTML reports under .next/  |
| `pnpm commitlint`      | Validate the commit message at `.git/COMMIT_EDITMSG`         |
| `pnpm supabase:types`  | Regenerate `src/lib/db.types.ts` (needs `SUPABASE_PROJECT_ID`) |

CI runs `typecheck + check + test + e2e + supabase-migrations` on every
push and PR. Don't merge red.

---

## 5. Role conventions

These are the kinds of files you'll write often. Stay consistent.

### Server vs client

- App Router defaults to **server components**. Add `"use client"` only
  when you actually need state, refs, effects, or browser APIs.
- Server-side data fetching: use Supabase server client (`@supabase/ssr`).
  Never reach for `fetch` to your own DB.
- Edge functions: each integration gets its own route under
  `src/app/api/<integration>/...` with its own webhook secret env var.

### Env vars

- **Never** read `process.env.X` directly. Import from `@/lib/env`.
- New env var? Add to `src/lib/env.ts` Zod schema **and** to
  `.env.example` in the same commit. Required vars cause the build to
  fail when missing — that is the desired behavior.
- Public vars must be prefixed `NEXT_PUBLIC_`. If you're unsure if a var
  should be public, it shouldn't.

### Styling

- Use Tailwind utility classes; reach for `cn()` from `@/lib/utils` to
  merge conditional classes.
- Use design tokens (`bg-primary`, `text-secondary-foreground`, etc.) —
  do **not** hard-code colors except for one-off marketing assets.
- Brand palette: crimson primary (CTA), navy secondary (header / dark
  surface), amber accent (badges, "best price" callouts). Defined as
  HSL CSS variables in `src/app/globals.css`.

### Components

- shadcn/ui primitives live under `src/components/ui/` — generated via
  `pnpm dlx shadcn@latest add <component>`. Don't write your own button
  primitive; use shadcn's.
- Page-level / domain components live alongside the route or in
  `src/components/<domain>/`.

### Database

- Every schema change is a Supabase CLI migration in `supabase/migrations/`.
- After any migration, regenerate `src/lib/db.types.ts` via
  `pnpm supabase:types` and commit the result in the same PR.
- All tables get RLS policies. Default deny. Allow by role.

### Tests

- Unit: `tests/unit/<file>.test.ts` (or co-located `*.test.ts` next to
  the file under `src/`). Use Testing Library for React.
- E2E: `tests/e2e/<flow>.spec.ts`. Smoke-test every new public page.
  Don't mock the database in E2E — Playwright drives a real built app.

### Errors

- Use `Result`-style returns at integration boundaries (lib/) — throwing
  is fine inside a single request handler but never bubble unfiltered
  errors to the client.
- Sentry captures server errors. Never put PII into Sentry breadcrumbs.

---

## 6. Security non-negotiables

These are the lines that legally and financially matter. Treat them as
hard rules:

1. **SIN is tokenized — never stored in cleartext.** Token = HMAC(SIN,
   `APP_SIN_HMAC_SECRET`) for matching/dedupe. The cleartext SIN
   submitted by the applicant must be encrypted with pgsodium envelope
   encryption (key in Supabase Vault) **or** vaulted to a third-party
   token vault before persistence.
2. **DOB and `gross_income` are encrypted at rest** with pgsodium envelope
   encryption.
3. **Every read of a PII column writes to `pii_access_log`** with
   `user_id`, timestamp, reason, IP. Implemented as a trigger or a
   server-side wrapper — never trust app code alone.
4. **PIPEDA consent is explicit and versioned.** Per-data-use checkboxes
   (financing, marketing, lender share). Versioned consent text. Stored
   per submission with timestamp + IP + user agent.
5. **RLS on every table.** Default deny. Allow by role only.
6. **Webhook signature verification on every inbound endpoint** — Stripe,
   Twilio, WhatsApp, fal.ai, AutoRaptor, AutoVerify postMessage origin,
   TrueTrade postMessage origin.
7. **Forms have honeypot + reCAPTCHA Enterprise + rate limiting.**
8. **Financial fields are masked while typing and never logged.**
9. **Document storage uses signed URLs only.** No public buckets for
   anything containing PII.
10. **CSP headers, HSTS, SameSite=Strict cookies.** CSP is enforced via
    `src/middleware.ts` with a per-request nonce. The vendor allowlist
    lives there — adding a new third-party script means updating
    `SCRIPT_ALLOWLIST` / `CONNECT_ALLOWLIST` / `FRAME_ALLOWLIST` in that
    file, then passing `nonce={nonce}` from `headers().get("x-nonce")`
    on the inline script tag. Current allowlist: AutoVerify SDK, Carfax
    TrueTrade, AutoRaptor chatbot, Stripe, Klaviyo, GTM/GA, Lucky
    Orange, Supabase, Algolia, Anthropic, fal.ai, PostHog.
11. **Backups:** daily encrypted Supabase backups + nightly `pg_dump` to
    S3 with 14-day retention.
12. **No PII in URLs, no PII in logs, no PII in Sentry.**

If you are about to do something that touches the SIN handling path or
adds a new PII column, **stop and ask the PO before proceeding.**

---

## 7. Integrations matrix

Three categories: **embed** (vendor's iframe/script, we listen via
postMessage and mirror to our DB), **build** (we own the code), **bridge**
(we forward data to a third party we don't control the UI of).

| Integration                  | Mode    | Phase | Notes                                                      |
| ---------------------------- | ------- | ----- | ---------------------------------------------------------- |
| AutoVerify pre-qual           | embed   | 3     | SDK from sdk.autoverify.com; widget IDs in `.env.example`  |
| Carfax TrueTrade              | embed   | 3     | iframe truetrade.carfax.ca + cdn-tradein.carfax.ca         |
| AutoRaptor chatbot            | embed   | 3     | chatbot.autoraptor.com — kept site-wide                    |
| AutoRaptor lead bridge        | bridge  | 3     | ADF/XML email forwarding only (no API). Email TBD by PO.   |
| NHTSA vPIC                    | build   | 1–2   | Free VIN decode                                            |
| Plate-photo → VIN             | build   | 8     | PlateXL or equivalent                                       |
| Canadian Black Book vBook     | build   | 1     | Second valuation signal vs. TrueTrade                      |
| fal.ai photo pipeline         | build   | 2     | birefnet/v2 + product-photography + gpt-image-2 relight    |
| AutoTrader feed (out)         | build   | 4     | XML CAMS-style every 30 min                                 |
| Kijiji Autos feed (out)       | build   | 4     | Schema TBD                                                  |
| CarGurus feed (out)           | build   | 4     | CSV                                                         |
| Google Vehicle Listings       | build   | 4     | XML                                                         |
| Facebook Vehicles             | build   | 4     | CSV                                                         |
| TikTok Catalog                | build   | 4     | CSV                                                         |
| GBP posts                     | build   | 4     | Posts API                                                   |
| ADF receivers (in)            | build   | 3–4   | One endpoint per partner, tag origin                        |
| RouteOne / Dealertrack        | bridge  | 5     | Behind feature flag until creds                              |
| Plaid Income + Assets         | bridge  | 5     | Sandbox until production verification                       |
| DocuSign / SignWell           | bridge  | 5     | E-signature for credit app + bill of sale                   |
| Stripe                        | build   | 1     | Manual-capture $500 hold on "Hold this car"                 |
| Twilio Conversations          | build   | 6     | SMS + WhatsApp unified                                       |
| WhatsApp Business Cloud       | bridge  | 6     | Inbound webhook → leads                                      |
| Anthropic API                 | build   | 6     | Sales concierge — RAG over inventory + warranty + financing  |
| Resend                        | build   | 1     | Transactional email                                          |
| Klaviyo                       | build   | 1+    | Marketing + drip campaigns                                   |
| Algolia                       | build   | 1     | Inventory search                                             |
| Sentry + PostHog              | build   | 9     | Errors + product analytics + session replay                  |
| GTM + GA4 + FB Pixel ×2 + TikTok Pixel | build | 9 | Port existing tag IDs                                       |

When you stand up a new integration, scaffold:

1. `src/lib/<integration>/client.ts` — typed wrapper with retries
2. `src/app/api/<integration>/route.ts` (or webhook subroute)
3. Webhook signature verification before any DB write
4. A feature flag in `src/lib/env.ts` that gates the route until the
   secret is set
5. A unit test for the signature verifier
6. An entry in `docs/open-questions.md` if creds are pending

---

## 8. Phase plan (build in this order — do not skip)

| Phase | Goal                                                                                        |
| ----- | ------------------------------------------------------------------------------------------- |
| 0     | scaffold + CLAUDE.md + CI + design tokens — **DONE**                                        |
| 1     | inventory data model + admin CRUD + public listing/VDP                                      |
| 2     | fal.ai photo pipeline                                                                        |
| 3     | lead capture + AutoRaptor ADF bridge + AV/TrueTrade embeds                                   |
| 4     | marketplace feeds (mock first, real on credentials)                                          |
| 5     | financing flow with PIPEDA + pgsodium + Plaid                                                |
| 6     | Twilio Conversations + WhatsApp + AI concierge                                               |
| 7     | programmatic SEO + Google Vehicle Listings + JSON-LD                                         |
| 8     | outside-the-box: TikTok generator, plate-to-VIN, customer portal, multilingual, recall widget |
| 9     | hardening: pen-test fixes, PostHog funnels, perf budget                                      |

### Phase definition of done

For every phase:

- [ ] Tests passing (unit + e2e)
- [ ] Preview deploy URL shared with the PO
- [ ] `CHANGELOG.md` updated (under `[Unreleased]` until launch)
- [ ] `CLAUDE.md` updated with anything the next session needs to know
- [ ] `docs/open-questions.md` updated with new follow-ups
- [ ] Conventional-commit messages on every commit
- [ ] PR opened (draft is fine while iterating)

---

## 9. How to work with the PO

- Before writing code, address ambiguities — but batch into ≤6 questions
  in one message, not back-and-forth.
- Don't ask styling questions in isolation — make the call, ship a
  preview deploy.
- Don't ask about library choices already locked in §2.
- **DO ask before:**
  - Irreversible data-model changes after Phase 2
  - Anything touching SIN handling
  - Anything affecting the legal liability surface (consent text, ToS,
    privacy policy)
  - Launching to production
- When you encounter a real-world detail you can't know without
  credentials (AutoTrader feed schema, Kijiji partner ID, Plaid env),
  scaffold a mock behind a feature flag and document what we need from
  the partner in `docs/open-questions.md`. Keep going.
- Don't generate placeholder content the PO will throw away — if you
  don't know a value, leave a typed TODO that breaks the build until
  it's filled in (i.e. mark the env var required in `src/lib/env.ts`).

---

## 10. Things in production today (DO NOT REBUILD)

- **AutoVerify** — soft-pull pre-qual widget tied to a Canadian lender
  network. Embed with our brand container.
- **Carfax TrueTrade** — instant trade valuation tied to Carfax Canada
  history. Embed on `/sell-trade` and every VDP.
- **AutoRaptor chatbot** — active CRM. Site-wide embed kept; we forward
  ADF leads from non-chatbot sources via email.

For all three: we capture `window.postMessage` events from the widgets
and **also** write a row to `leads` / `appraisals` so `/admin/leads` is
a unified inbox.

---

## 11. Style + tone

- Conventional commits: `feat(scope): ...`, `fix(scope): ...`,
  `chore(scope): ...`. Scopes match top-level dirs (`app`, `lib`, `db`,
  `ci`, `docs`).
- Comments: default to none. Only add a comment when **why** is
  non-obvious — a hidden constraint, a subtle invariant, a workaround
  for a specific bug. Don't narrate **what** the code does; the code
  already does that.
- Multi-line comment blocks: avoid. One-liners only.

---

## 12. Quick references

- Production site (legacy): https://peelcarsales.com
- New site (target): https://peelcarsales.ca
- Phone: 905-678-0048
- Brand mark: `public/logo.png` (white-on-transparent — use on dark surfaces)
- Brand HSL tokens: see `src/app/globals.css`

End of CLAUDE.md.

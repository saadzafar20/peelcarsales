# Changelog

All notable changes to Peel Car Sales 2.0. We follow [Keep a Changelog](https://keepachangelog.com)
and [Semantic Versioning](https://semver.org). Until cutover the version stays at `0.x`.

## [Unreleased]

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

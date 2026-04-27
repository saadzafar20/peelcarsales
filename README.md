# Peel Car Sales 2.0

Rebuild of [peelcarsales.com](https://peelcarsales.com) — a 150-vehicle, OMVIC + UCDA licensed
used-car dealership serving Mississauga, Oakville, and the GTA. Live target domain:
[peelcarsales.ca](https://peelcarsales.ca). The current WordPress site stays online until cutover.

> 🤖 **Working on this repo with Claude Code?** Read [CLAUDE.md](./CLAUDE.md) first. It contains the
> locked stack, repo layout, security rules, and the phase plan.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind + shadcn/ui · Supabase Postgres + RLS +
pgsodium · Algolia · Resend · Twilio · Stripe · Anthropic API · Vercel · Biome · Vitest + Playwright.

## Prerequisites

- Node.js ≥ 20.11
- `pnpm` (auto-enabled via `corepack enable pnpm` — repo pins `pnpm@10.33.2`)
- macOS or Linux

## Quick start

```bash
pnpm install
cp .env.example .env.local      # fill in credentials as you receive them
pnpm dev                         # http://localhost:3000
```

## Common commands

| Command                | What it does                                                |
| ---------------------- | ----------------------------------------------------------- |
| `pnpm dev`             | Next dev server                                              |
| `pnpm build`           | Production build                                             |
| `pnpm typecheck`       | `tsc --noEmit` (strict)                                      |
| `pnpm check`           | Biome lint + format check (replaces ESLint + Prettier)       |
| `pnpm check:fix`       | Biome auto-fix                                               |
| `pnpm test`            | Vitest unit tests                                            |
| `pnpm e2e`             | Playwright e2e (builds + serves the app)                     |
| `pnpm verify`          | Full local CI gate (typecheck + check + test + build)        |
| `pnpm supabase:types`  | Regenerate `src/lib/db.types.ts` from the live Supabase schema |

## Repo layout

```
src/
  app/         App Router routes (public + /admin/*)
  components/  Reusable UI (shadcn/ui generated under components/ui)
  lib/         env.ts, utils.ts, db.types.ts, integration clients
public/        Static assets (logo.png, favicons, OG images)
supabase/      config.toml + migrations/ (managed via Supabase CLI)
tests/
  unit/        Vitest
  e2e/         Playwright
docs/          open-questions.md and similar
.github/
  workflows/   CI: typecheck + biome + vitest + playwright + supabase
```

## Security non-negotiables

See [CLAUDE.md §6](./CLAUDE.md#6-security-non-negotiables). Highlights: SIN tokenized via HMAC,
DOB + gross_income encrypted at rest with pgsodium, every PII read writes to `pii_access_log`, all
webhooks signature-verified, RLS deny-by-default on every table.

## License

Proprietary — Peel Car Sales.

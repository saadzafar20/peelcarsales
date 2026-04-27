# Changelog

All notable changes to Peel Car Sales 2.0. We follow [Keep a Changelog](https://keepachangelog.com)
and [Semantic Versioning](https://semver.org). Until cutover the version stays at `0.x`.

## [Unreleased]

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

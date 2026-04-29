## Summary

<!-- 1–3 bullets describing what changed and why -->

## Phase

<!-- e.g. Phase 1, Phase 0.1 patch, Phase 7 follow-up -->

## Test plan

- [ ] `pnpm verify` passes (typecheck + biome + vitest + build)
- [ ] `pnpm e2e` smoke test passes (or N/A if no UI change)
- [ ] Manual smoke on preview deploy
- [ ] _(if DB)_ migration runs forward + rollback drafted
- [ ] _(if PII)_ pii_access_log entry verified
- [ ] _(if webhook)_ signature verifier covered by unit test

## Security checklist (delete if not applicable)

- [ ] No new env var read outside `src/lib/env.ts`
- [ ] No PII in URLs, logs, or Sentry breadcrumbs
- [ ] CSP allowlist updated if a new third-party script was added
- [ ] RLS policy added/updated for any new table

## Notes

<!-- Anything reviewers should know — feature flags, breaking changes, follow-ups -->

## Open questions logged

<!-- If this introduces "we'll figure this out later" items, link to the entry in docs/open-questions.md -->

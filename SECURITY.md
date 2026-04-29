# Security Policy

Peel Car Sales 2.0 handles personally identifiable information regulated under
[PIPEDA](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/),
including SIN, DOB, gross income, and identification documents. We take security
disclosures seriously.

## Reporting a vulnerability

**Do not open a public GitHub issue for security disclosures.**

Email **saadzafar.20@gmail.com** with:

- A description of the vulnerability and the affected route, file, or endpoint
- Steps to reproduce
- Impact assessment (data exposure, account takeover, etc.)
- Optional: suggested mitigation

You will receive an acknowledgment within **48 hours**. We aim to triage and
patch HIGH-severity issues within 7 days and MODERATE issues within 30 days.

## Scope

In scope:

- The application running at `peelcarsales.ca` and Vercel preview deploys
- All edge / server functions under `/api/*`
- Supabase RLS policies, triggers, and stored procedures
- Webhook handlers (Stripe, Twilio, fal.ai, AutoVerify, Carfax, AutoRaptor)

Out of scope:

- Third-party widgets we embed but do not control (AutoVerify, TrueTrade,
  AutoRaptor chatbot — report directly to the vendor)
- Social engineering against staff
- DoS amplification testing without prior arrangement

## Hard rules we never violate

(Excerpt from [`CLAUDE.md` §6](./CLAUDE.md#6-security-non-negotiables) — full
rules apply.)

1. SIN is tokenized via HMAC; cleartext SIN is encrypted with pgsodium envelope
   encryption (key in Supabase Vault) before persistence.
2. DOB and `gross_income` are encrypted at rest with pgsodium.
3. Every read of a PII column writes to `pii_access_log` with user, timestamp,
   reason, and IP.
4. PIPEDA consent is explicit, versioned, and stored per submission with
   timestamp, IP, and user agent.
5. RLS deny-by-default on every Supabase table.
6. Webhook signature verification on every inbound endpoint.
7. CSP, HSTS, SameSite=Strict cookies. No third-party scripts not in the
   explicit allowlist.
8. No PII in URLs, logs, or Sentry breadcrumbs.

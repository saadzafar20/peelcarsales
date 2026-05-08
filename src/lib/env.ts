import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Typed env contract.
 *
 * Vars marked REQUIRED will fail the build (and crash dev) if missing or
 * malformed. Vars marked OPTIONAL unlock features when present and are
 * gated at the call site.
 *
 * Add new vars here AND in .env.example so the contract stays the source
 * of truth. Never read process.env directly from app code.
 */
export const env = createEnv({
  server: {
    // --- Phase 1 (Supabase) -------------------------------------------------
    CORS_ALLOWED_ORIGINS: z.string().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    SUPABASE_PROJECT_ID: z.string().optional(),

    // --- Phase 2 (fal.ai) ---------------------------------------------------
    FAL_KEY: z.string().optional(),
    FAL_WEBHOOK_SECRET: z.string().optional(),

    // --- Phase 3 (lead bridge) ----------------------------------------------
    AUTORAPTOR_LEAD_EMAIL: z.string().email().optional(),

    // --- Phase 5 (financing) ------------------------------------------------
    PLAID_CLIENT_ID: z.string().optional(),
    PLAID_SECRET: z.string().optional(),
    PLAID_ENV: z.enum(["sandbox", "development", "production"]).optional(),
    APP_SIN_HMAC_SECRET: z
      .string()
      .regex(/^[0-9a-f]{64}$/, "must be 64 hex chars")
      .optional(),

    // --- Phase 6 (AI + messaging) -------------------------------------------
    ANTHROPIC_API_KEY: z.string().optional(),
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_CONVERSATIONS_SERVICE_SID: z.string().optional(),
    TWILIO_WHATSAPP_FROM: z.string().optional(),

    // --- Phase 1 (commerce + email) -----------------------------------------
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    KLAVIYO_PRIVATE_API_KEY: z.string().optional(),

    // --- Phase 1 (search admin) ---------------------------------------------
    ALGOLIA_ADMIN_KEY: z.string().optional(),

    // --- Phase 9 (observability) --------------------------------------------
    SENTRY_DSN: z.string().url().optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_SITE_ENV: z.enum(["development", "preview", "production"]).default("development"),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().optional(),
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().default("https://us.i.posthog.com"),
    NEXT_PUBLIC_GTM_ID: z.string().optional(),
    NEXT_PUBLIC_GA4_ID: z.string().optional(),
    NEXT_PUBLIC_FB_PIXEL_ID_PRIMARY: z.string().optional(),
    NEXT_PUBLIC_FB_PIXEL_ID_SECONDARY: z.string().optional(),
    NEXT_PUBLIC_TIKTOK_PIXEL_ID: z.string().optional(),
    NEXT_PUBLIC_CARFAX_TRUETRADE_ORIGIN: z.string().url().default("https://truetrade.carfax.ca"),
    NEXT_PUBLIC_AUTOVERIFY_ORIGIN: z.string().url().default("https://sdk.autoverify.com"),
    NEXT_PUBLIC_AUTOVERIFY_HOME_WIDGET_ID: z.string().optional(),
    NEXT_PUBLIC_AUTOVERIFY_VDP_WIDGET_ID: z.string().optional(),
    NEXT_PUBLIC_CARFAX_TRUETRADE_ACCOUNT: z.string().optional(),
    NEXT_PUBLIC_AUTORAPTOR_ACCOUNT_ID: z.string().optional(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_ENV: process.env.NEXT_PUBLIC_SITE_ENV,
    CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID,
    FAL_KEY: process.env.FAL_KEY,
    FAL_WEBHOOK_SECRET: process.env.FAL_WEBHOOK_SECRET,
    AUTORAPTOR_LEAD_EMAIL: process.env.AUTORAPTOR_LEAD_EMAIL,
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_SECRET: process.env.PLAID_SECRET,
    PLAID_ENV: process.env.PLAID_ENV,
    APP_SIN_HMAC_SECRET: process.env.APP_SIN_HMAC_SECRET,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_CONVERSATIONS_SERVICE_SID: process.env.TWILIO_CONVERSATIONS_SERVICE_SID,
    TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    KLAVIYO_PRIVATE_API_KEY: process.env.KLAVIYO_PRIVATE_API_KEY,
    NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY: process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY,
    NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
    ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    NEXT_PUBLIC_GA4_ID: process.env.NEXT_PUBLIC_GA4_ID,
    NEXT_PUBLIC_FB_PIXEL_ID_PRIMARY: process.env.NEXT_PUBLIC_FB_PIXEL_ID_PRIMARY,
    NEXT_PUBLIC_FB_PIXEL_ID_SECONDARY: process.env.NEXT_PUBLIC_FB_PIXEL_ID_SECONDARY,
    NEXT_PUBLIC_TIKTOK_PIXEL_ID: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    NEXT_PUBLIC_CARFAX_TRUETRADE_ORIGIN: process.env.NEXT_PUBLIC_CARFAX_TRUETRADE_ORIGIN,
    NEXT_PUBLIC_AUTOVERIFY_ORIGIN: process.env.NEXT_PUBLIC_AUTOVERIFY_ORIGIN,
    NEXT_PUBLIC_AUTOVERIFY_HOME_WIDGET_ID: process.env.NEXT_PUBLIC_AUTOVERIFY_HOME_WIDGET_ID,
    NEXT_PUBLIC_AUTOVERIFY_VDP_WIDGET_ID: process.env.NEXT_PUBLIC_AUTOVERIFY_VDP_WIDGET_ID,
    NEXT_PUBLIC_CARFAX_TRUETRADE_ACCOUNT: process.env.NEXT_PUBLIC_CARFAX_TRUETRADE_ACCOUNT,
    NEXT_PUBLIC_AUTORAPTOR_ACCOUNT_ID: process.env.NEXT_PUBLIC_AUTORAPTOR_ACCOUNT_ID,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

import "server-only";

import Stripe from "stripe";
import { env } from "@/lib/env";

let _stripe: Stripe | undefined;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }
  _stripe = new Stripe(key, {
    typescript: true,
    appInfo: { name: "Peel Car Sales", url: "https://peelcarsales.ca" },
  });
  return _stripe;
}

export const HOLD_AMOUNT_CENTS = 50_000;
export const HOLD_CURRENCY = "cad";
export const HOLD_EXPIRY_HOURS = 72;

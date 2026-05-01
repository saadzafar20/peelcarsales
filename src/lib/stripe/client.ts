"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { env } from "@/lib/env";

let stripePromise: Promise<Stripe | null> | undefined;

export function getStripeClient(): Promise<Stripe | null> {
  if (stripePromise) return stripePromise;
  const key = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) return Promise.resolve(null);
  stripePromise = loadStripe(key);
  return stripePromise;
}

export function isStripeConfigured(): boolean {
  return Boolean(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
}

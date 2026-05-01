/**
 * Versioned PIPEDA consent text. Every change to the wording bumps the
 * version + adds a new entry. Past consent rows are immutable and reference
 * the version they were granted under.
 *
 * The legal text below is a starting point — must be reviewed by a
 * Canadian privacy lawyer before going live in production. Marked as
 * a TODO so it can't be missed during launch checklist.
 */
export const CURRENT_CONSENT_VERSION = "2026-05-01.draft";

export type ConsentKind = "financing" | "lender_share" | "marketing";

export const CONSENT_TEXT: Record<ConsentKind, string> = {
  financing: `I authorize Peel Car Sales (and the dealership's authorized credit-bureau partner) to perform a soft credit check using the personal information I provide on this application. I understand a soft credit check does not affect my credit score. I confirm the information I have provided is true and accurate to the best of my knowledge.`,
  lender_share: `I consent to Peel Car Sales sharing my financing application — including my SIN, date of birth, employment, and credit information — with their network of approved Canadian automotive lenders for the purpose of obtaining a loan approval. Each lender that reviews my application will perform a hard credit check, which may affect my credit score. I have the right to withdraw this consent at any time, but doing so may stop the financing review in progress.`,
  marketing: `I consent to Peel Car Sales contacting me by email, SMS, WhatsApp, or phone with vehicle inventory updates, financing offers, service reminders, and promotional content. I can unsubscribe from these messages at any time using the link in any message or by replying STOP.`,
};

// TODO(legal): Have the above three consent paragraphs reviewed by a Canadian
// privacy lawyer (PIPEDA-qualified) before launching the live financing
// wizard. Bump CURRENT_CONSENT_VERSION when the wording is finalized.

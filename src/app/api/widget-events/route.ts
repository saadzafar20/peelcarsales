import { NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";

/**
 * Unified widget event sink. AutoVerify, TrueTrade, AutoRaptor (and any
 * future embed) postMessage their state changes; the corresponding embed
 * component listens, validates origin, and POSTs the payload here.
 *
 * For Phase 3 we just write to the server log — when Supabase lands
 * (Phase 1 in this code-base) this route will insert a row into `leads`
 * or `appraisals` so /admin/leads becomes the single source of truth.
 *
 * Origin check is enforced at the source (component) AND repeated here as
 * defense in depth.
 */
const VALID_SOURCES = ["autoverify", "truetrade", "autoraptor"] as const;

const Body = z.object({
  source: z.enum(VALID_SOURCES),
  placement: z.string().optional(),
  variant: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Defense-in-depth: block anything that sneaks past the per-component check.
  const referer = request.headers.get("referer") ?? "";
  const origin = request.headers.get("origin") ?? "";
  if (origin && !origin.startsWith(env.NEXT_PUBLIC_SITE_URL)) {
    return NextResponse.json({ ok: false, error: "bad_origin" }, { status: 403 });
  }

  // TODO(supabase): swap console.info for an insert into `leads` /
  // `appraisals` once the Supabase project is provisioned. The schema
  // and RLS policies for that table land in the next commit.
  console.info("[widget-event]", {
    source: body.source,
    placement: body.placement,
    variant: body.variant,
    referer,
    payloadKeys: Object.keys(body.payload),
  });

  return NextResponse.json({ ok: true });
}

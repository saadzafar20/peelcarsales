import "server-only";

import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * Typed query helpers for the public-facing vehicle catalog. RLS gates
 * the results to status in ('active','on_hold').
 */

export async function listActiveVehicles(opts?: {
  bodyType?: string;
  limit?: number;
  sort?: "featured" | "newest" | "price-asc" | "price-desc" | "km-asc";
}) {
  const supabase = await getSupabaseServer();
  let query = supabase.from("vehicles").select("*").eq("status", "active");
  if (opts?.bodyType) query = query.eq("body_type", opts.bodyType);
  switch (opts?.sort) {
    case "newest":
      query = query.order("year", { ascending: false });
      break;
    case "price-asc":
      query = query.order("price_cents", { ascending: true });
      break;
    case "price-desc":
      query = query.order("price_cents", { ascending: false });
      break;
    case "km-asc":
      query = query.order("mileage_km", { ascending: true });
      break;
    default:
      query = query.order("days_on_lot", { ascending: true });
  }
  if (opts?.limit) query = query.limit(opts.limit);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getVehicleBySlug(slug: string) {
  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.from("vehicles").select("*").eq("slug", slug).single();
  if (error) {
    if (error.code === "PGRST116") return null; // not found
    throw error;
  }
  return data;
}

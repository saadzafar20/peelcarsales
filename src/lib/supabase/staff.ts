import "server-only";

import type { UserRole } from "@/lib/db.types";
import { getSupabaseServer } from "@/lib/supabase/server";

const STAFF_ROLES: UserRole[] = [
  "owner",
  "manager",
  "sales",
  "finance",
  "photographer",
  "marketing",
  "service",
];

export type StaffUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
};

/**
 * Returns the current staff user or null. Used by the admin layout to
 * gate access. Customers are explicitly rejected — they get redirected
 * to /my (their self-serve portal) instead.
 */
export async function getCurrentStaffUser(): Promise<StaffUser | null> {
  // biome-ignore lint/suspicious/noExplicitAny: db.types.ts is hand-rolled
  const supabase: any = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  const p = profile as {
    id: string;
    email: string;
    full_name: string | null;
    role: UserRole;
  } | null;
  if (!p) return null;
  if (!STAFF_ROLES.includes(p.role)) return null;
  return p;
}

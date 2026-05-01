import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { isSupabaseConfiguredOnServer } from "@/lib/supabase/feature";
import { getCurrentStaffUser } from "@/lib/supabase/staff";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfiguredOnServer()) {
    return (
      <main className="container py-20">
        <div className="mx-auto max-w-2xl rounded-lg border border-dashed border-border bg-muted/40 p-10 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight">Admin not configured</h1>
          <p className="mt-3 text-muted-foreground">
            Set <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>,
            and <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, then run the
            migrations in <code>supabase/migrations/</code>.
          </p>
        </div>
      </main>
    );
  }

  const user = await getCurrentStaffUser();
  if (!user) redirect("/login?next=/admin");

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AdminSidebar role={user.role} email={user.email} />
      <main className="flex-1 bg-muted/30 p-8">{children}</main>
    </div>
  );
}

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseServer } from "@/lib/supabase/server";

type UserRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  location_id: string | null;
  created_at: string;
};

export default async function AdminUsers() {
  // biome-ignore lint/suspicious/noExplicitAny: db.types.ts hand-rolled
  const supabase: any = await getSupabaseServer();
  const { data } = await supabase
    .from("users")
    .select("id, email, full_name, role, location_id, created_at")
    .order("created_at", { ascending: false });
  const users = (data as UserRow[] | null) ?? [];

  return (
    <>
      <AdminPageHeader
        title="Staff"
        subtitle="Owners + managers can invite staff and assign roles. Customers don't appear here — they live under auth.users."
      />
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-3">{u.full_name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="capitalize">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-muted-foreground" colSpan={4}>
                    No staff yet. Sign in once with the seed account to create your first row.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </>
  );
}

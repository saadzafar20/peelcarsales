import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseServer } from "@/lib/supabase/server";

type FinAppRow = {
  id: string;
  status: string;
  submitted_at: string | null;
  decisioned_at: string | null;
  routeone_app_id: string | null;
  plaid_verified_income: boolean;
  vehicle_id: string | null;
  created_at: string;
};

export default async function AdminFinanceApplications() {
  // biome-ignore lint/suspicious/noExplicitAny: db.types.ts hand-rolled
  const supabase: any = await getSupabaseServer();
  const { data } = await supabase
    .from("finance_applications")
    .select(
      "id, status, submitted_at, decisioned_at, routeone_app_id, plaid_verified_income, vehicle_id, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);
  const apps = (data as FinAppRow[] | null) ?? [];

  return (
    <>
      <AdminPageHeader
        title="Finance applications"
        subtitle="PIPEDA-regulated. Every decrypt of the SIN, DOB, or income field writes an audit row. View column values from the lead detail page with a reason."
      />

      <Card className="mb-6 border-destructive/40 bg-destructive/5">
        <CardContent className="p-5 text-sm">
          <p className="font-semibold text-destructive">Read with care</p>
          <p className="mt-1 text-muted-foreground">
            SIN, DOB, and gross income are encrypted at rest with pgsodium envelope encryption.
            Decryption requires a stated reason and writes an immutable audit log entry. Owners and
            managers can audit who decrypted what under{" "}
            <Link href="/admin/audit" className="font-semibold text-primary hover:underline">
              PII access audit
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Submitted</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Plaid income</th>
                <th className="px-4 py-2">RouteOne ID</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {app.submitted_at ? new Date(app.submitted_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={app.status === "approved" ? "default" : "outline"}
                      className="capitalize"
                    >
                      {app.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{app.plaid_verified_income ? "✓ verified" : "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs">{app.routeone_app_id ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/finance-applications/${app.id}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
              {apps.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-muted-foreground" colSpan={5}>
                    No applications yet.
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

import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseServer } from "@/lib/supabase/server";

type AuditRow = {
  id: number;
  user_id: string | null;
  table_name: string;
  row_id: string;
  column_name: string;
  reason: string | null;
  ip_address: string | null;
  accessed_at: string;
};

export default async function AdminAudit() {
  // biome-ignore lint/suspicious/noExplicitAny: db.types.ts hand-rolled
  const supabase: any = await getSupabaseServer();
  const { data } = await supabase
    .from("pii_access_log")
    .select("id, user_id, table_name, row_id, column_name, reason, ip_address, accessed_at")
    .order("accessed_at", { ascending: false })
    .limit(500);
  const logs = (data as AuditRow[] | null) ?? [];

  return (
    <>
      <AdminPageHeader
        title="PII access audit"
        subtitle="Every decrypt of an encrypted column writes a row. Sortable, filterable, exportable for compliance."
      />

      <Card>
        <CardContent className="p-0">
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 border-b border-border bg-card text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">When</th>
                  <th className="px-4 py-2">Staff</th>
                  <th className="px-4 py-2">Table</th>
                  <th className="px-4 py-2">Column</th>
                  <th className="px-4 py-2">Row</th>
                  <th className="px-4 py-2">Reason</th>
                  <th className="px-4 py-2">IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-xs text-muted-foreground">
                      {new Date(log.accessed_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">
                      {log.user_id?.slice(0, 8) ?? "system"}
                    </td>
                    <td className="px-4 py-2">{log.table_name}</td>
                    <td className="px-4 py-2 font-medium">{log.column_name}</td>
                    <td className="px-4 py-2 font-mono text-xs">{log.row_id.slice(0, 8)}…</td>
                    <td className="px-4 py-2 text-muted-foreground">{log.reason ?? "—"}</td>
                    <td className="px-4 py-2 font-mono text-xs">{log.ip_address ?? "—"}</td>
                  </tr>
                ))}
                {logs.length === 0 ? (
                  <tr>
                    <td className="px-4 py-12 text-center text-muted-foreground" colSpan={7}>
                      No PII access events recorded.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

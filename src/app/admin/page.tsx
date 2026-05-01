import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatPriceCAD } from "@/lib/utils";

export default async function AdminDashboard() {
  // biome-ignore lint/suspicious/noExplicitAny: db.types.ts hand-rolled
  const supabase: any = await getSupabaseServer();

  const [
    { count: activeCount },
    { count: leadCount },
    { count: holdCount },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase
      .from("vehicle_holds")
      .select("*", { count: "exact", head: true })
      .eq("status", "requires_capture"),
    supabase
      .from("leads")
      .select("id, source, intent, status, created_at, vehicle_id")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Operational health at a glance. Lead volume, hold pipeline, and inventory status."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiTile label="Active inventory" value={String(activeCount ?? 0)} />
        <KpiTile label="New leads" value={String(leadCount ?? 0)} accent />
        <KpiTile label="Open holds" value={String(holdCount ?? 0)} />
        <KpiTile label="Avg margin" value={formatPriceCAD(0)} hint="Wires up with cost data" />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold">Recent leads</h2>
        <Card className="mt-3">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Created</th>
                  <th className="px-4 py-2">Source</th>
                  <th className="px-4 py-2">Intent</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(
                  (recentLeads as Array<{
                    id: string;
                    source: string;
                    intent: string | null;
                    status: string;
                    created_at: string;
                  }> | null) ?? []
                ).map((lead) => (
                  <tr key={lead.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 text-muted-foreground">
                      {new Date(lead.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 capitalize">{lead.source}</td>
                    <td className="px-4 py-2">{lead.intent ?? "—"}</td>
                    <td className="px-4 py-2 capitalize">{lead.status}</td>
                  </tr>
                ))}
                {!recentLeads || (recentLeads as unknown[]).length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={4}>
                      No leads yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function KpiTile({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${
        accent ? "border-primary/40 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

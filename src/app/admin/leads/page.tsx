import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getSupabaseServer } from "@/lib/supabase/server";

type LeadRow = {
  id: string;
  source: string;
  intent: string | null;
  status: string;
  message: string | null;
  created_at: string;
  vehicle_id: string | null;
  assigned_to: string | null;
};

export default async function AdminLeads() {
  // biome-ignore lint/suspicious/noExplicitAny: db.types.ts hand-rolled
  const supabase: any = await getSupabaseServer();
  const { data } = await supabase
    .from("leads")
    .select("id, source, intent, status, message, created_at, vehicle_id, assigned_to")
    .order("created_at", { ascending: false })
    .limit(100);
  const leads = (data as LeadRow[] | null) ?? [];

  return (
    <>
      <AdminPageHeader
        title="Leads"
        subtitle="Unified inbox across web forms, AutoVerify, TrueTrade, AutoRaptor, WhatsApp, SMS, and marketplace ADF."
      />

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Intent</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-border last:border-0 hover:bg-muted/20"
                >
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="capitalize">
                      {lead.source}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.intent ?? "—"}</td>
                  <td className="px-4 py-3 max-w-xs truncate">{lead.message ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{lead.status}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center text-muted-foreground" colSpan={6}>
                    No leads yet.
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

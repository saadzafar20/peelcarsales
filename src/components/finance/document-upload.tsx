"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Doc = { type: string; label: string; required: boolean };

const REQUIRED_DOCS: Doc[] = [
  { type: "drivers_license_front", label: "Driver's licence (front)", required: true },
  { type: "drivers_license_back", label: "Driver's licence (back)", required: true },
  { type: "paystub", label: "Recent paystub", required: true },
  { type: "void_cheque", label: "Void cheque or direct deposit form", required: true },
  { type: "utility_bill", label: "Utility bill (proof of address)", required: false },
];

type Props = {
  applicationId?: string;
};

/**
 * Document upload tile. Each file goes to Supabase Storage under a
 * private bucket — only signed URLs are ever exposed to the browser.
 * Until the application is created (post-submit), uploads are queued
 * client-side and dispatched after submit.
 *
 * Phase 5+ wires the actual upload + sha256 verification + RLS-gated
 * storage policy. UI shape is in place.
 */
export function DocumentUpload({ applicationId }: Props) {
  const [pending, setPending] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-3">
      {REQUIRED_DOCS.map((doc) => (
        <Card key={doc.type}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium">
                {doc.label}
                {doc.required ? (
                  <span className="ml-2 rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-destructive">
                    Required
                  </span>
                ) : (
                  <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Optional
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                JPG, PNG, or PDF · max 10 MB · stored in encrypted Supabase Storage
              </p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              id={`doc-${doc.type}`}
              onChange={() => {
                setPending((prev) => new Set(prev).add(doc.type));
                // TODO(supabase-storage): upload via signed-URL endpoint
                // /api/financing/upload-doc once the bucket + policies land.
              }}
            />
            <Button asChild size="sm" variant="outline">
              <label htmlFor={`doc-${doc.type}`} className="cursor-pointer">
                {pending.has(doc.type) ? "Queued ✓" : "Upload"}
              </label>
            </Button>
          </CardContent>
        </Card>
      ))}

      {!applicationId ? (
        <p className="text-[11px] text-muted-foreground">
          Documents queue here and upload after you submit. They go to a private Supabase Storage
          bucket — only staff with finance role can issue a signed read URL.
        </p>
      ) : null}
    </div>
  );
}

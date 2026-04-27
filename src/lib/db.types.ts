/**
 * Supabase generated types — placeholder until the project is created.
 *
 * Regenerate with:
 *   pnpm dlx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" \
 *     > src/lib/db.types.ts
 *
 * Tracked in git so PRs reflect schema changes.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

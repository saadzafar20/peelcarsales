/**
 * Supabase TypeScript types — manually crafted to match
 * supabase/migrations/0001_initial_schema.sql.
 *
 * Regenerate with the live project schema once provisioned:
 *   pnpm dlx supabase gen types typescript --project-id "$SUPABASE_PROJECT_ID" \
 *     > src/lib/db.types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BodyType = "sedan" | "suv" | "hatchback" | "coupe" | "truck" | "van" | "wagon";
export type FuelType = "gas" | "hybrid" | "electric" | "diesel";
export type Drivetrain = "fwd" | "rwd" | "awd" | "4wd";
export type Transmission = "automatic" | "manual" | "cvt" | "dct";
export type VehicleStatus = "draft" | "active" | "on_hold" | "sold" | "archived";
export type LeadSource =
  | "web"
  | "autoverify"
  | "truetrade"
  | "autoraptor"
  | "whatsapp"
  | "sms"
  | "phone"
  | "autotrader"
  | "kijiji"
  | "cargurus"
  | "walk_in";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "test_drive"
  | "negotiating"
  | "won"
  | "lost";
export type FinanceStatus =
  | "draft"
  | "submitted"
  | "lender_review"
  | "conditional"
  | "approved"
  | "declined"
  | "funded";
export type UserRole =
  | "owner"
  | "manager"
  | "sales"
  | "finance"
  | "photographer"
  | "marketing"
  | "service"
  | "customer";

type TimestampString = string;

export type Database = {
  public: {
    Tables: {
      locations: {
        Row: {
          id: string;
          slug: string;
          name: string;
          address: string;
          city: string;
          province: string;
          postal_code: string;
          phone: string;
          hours_jsonb: Json;
          created_at: TimestampString;
        };
        Insert: Partial<Database["public"]["Tables"]["locations"]["Row"]> & {
          slug: string;
          name: string;
          address: string;
          city: string;
          postal_code: string;
        };
        Update: Partial<Database["public"]["Tables"]["locations"]["Row"]>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          location_id: string | null;
          created_at: TimestampString;
          updated_at: TimestampString;
        };
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      vehicles: {
        Row: {
          id: string;
          vin: string;
          slug: string;
          year: number;
          make: string;
          model: string;
          trim: string | null;
          body_type: BodyType;
          fuel: FuelType;
          drivetrain: Drivetrain;
          transmission: Transmission;
          mileage_km: number;
          exterior_color: string | null;
          interior_color: string | null;
          price_cents: number;
          was_price_cents: number | null;
          cost_cents: number | null;
          status: VehicleStatus;
          location_id: string;
          badges: string[];
          features: Json;
          description: string | null;
          hero_image_id: string | null;
          cb_value_cents: number | null;
          truetrade_low_cents: number | null;
          truetrade_high_cents: number | null;
          days_on_lot: number;
          sold_at: TimestampString | null;
          created_at: TimestampString;
          updated_at: TimestampString;
        };
        Insert: Omit<
          Database["public"]["Tables"]["vehicles"]["Row"],
          "id" | "days_on_lot" | "created_at" | "updated_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Row"]>;
      };
      vehicle_images: {
        Row: {
          id: string;
          vehicle_id: string;
          raw_url: string;
          processed_url: string | null;
          role: string;
          sort_order: number;
          fal_job_id: string | null;
          status: string;
          alt_text: string | null;
          created_at: TimestampString;
        };
        Insert: Omit<
          Database["public"]["Tables"]["vehicle_images"]["Row"],
          "id" | "created_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["vehicle_images"]["Row"]>;
      };
      leads: {
        Row: {
          id: string;
          source: LeadSource;
          source_lead_id: string | null;
          vehicle_id: string | null;
          name_enc: string | null;
          email_enc: string | null;
          email_token: string | null;
          phone_enc: string | null;
          phone_token: string | null;
          message: string | null;
          intent: string | null;
          payload: Json;
          status: LeadStatus;
          assigned_to: string | null;
          autoraptor_synced_at: TimestampString | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: TimestampString;
          updated_at: TimestampString;
        };
        Insert: Partial<Database["public"]["Tables"]["leads"]["Row"]> & {
          source: LeadSource;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Row"]>;
      };
      finance_applications: {
        Row: {
          id: string;
          lead_id: string | null;
          applicant_id: string | null;
          applicant_enc: Json | null;
          employment_enc: Json | null;
          residence_enc: Json | null;
          references_enc: Json | null;
          sin_token: string | null;
          sin_enc: string | null;
          dob_enc: string | null;
          gross_income_enc: string | null;
          av_pre_qual_band: Json | null;
          plaid_verified_income: boolean;
          plaid_assets_token: string | null;
          routeone_app_id: string | null;
          vehicle_id: string | null;
          status: FinanceStatus;
          version: number;
          submitted_at: TimestampString | null;
          decisioned_at: TimestampString | null;
          created_at: TimestampString;
          updated_at: TimestampString;
        };
        Insert: Partial<Database["public"]["Tables"]["finance_applications"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["finance_applications"]["Row"]>;
      };
      finance_consents: {
        Row: {
          id: string;
          application_id: string;
          consent_version: string;
          consent_kind: string;
          consent_text: string;
          granted: boolean;
          signed_at: TimestampString;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["finance_consents"]["Row"],
          "id" | "signed_at"
        > & { id?: string };
        Update: Partial<Database["public"]["Tables"]["finance_consents"]["Row"]>;
      };
      vehicle_holds: {
        Row: {
          id: string;
          vehicle_id: string;
          lead_id: string | null;
          stripe_payment_intent_id: string;
          amount_cents: number;
          status: string;
          expires_at: TimestampString;
          captured_at: TimestampString | null;
          released_at: TimestampString | null;
          created_at: TimestampString;
        };
        Insert: Partial<Database["public"]["Tables"]["vehicle_holds"]["Row"]> & {
          vehicle_id: string;
          stripe_payment_intent_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["vehicle_holds"]["Row"]>;
      };
      pii_access_log: {
        Row: {
          id: number;
          user_id: string | null;
          table_name: string;
          row_id: string;
          column_name: string;
          reason: string | null;
          ip_address: string | null;
          user_agent: string | null;
          accessed_at: TimestampString;
        };
        Insert: Partial<Database["public"]["Tables"]["pii_access_log"]["Row"]>;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      hmac_token: { Args: { p_value: string }; Returns: string };
      encrypt_pii: { Args: { p_plaintext: string }; Returns: string };
      decrypt_pii: {
        Args: {
          p_ciphertext: string;
          p_table: string;
          p_row_id: string;
          p_column: string;
          p_reason?: string;
        };
        Returns: string;
      };
      log_pii_access: {
        Args: {
          p_table: string;
          p_row_id: string;
          p_column: string;
          p_reason?: string;
        };
        Returns: void;
      };
      create_lead: {
        Args: {
          p_source: LeadSource;
          p_name: string | null;
          p_email: string | null;
          p_phone: string | null;
          p_message?: string | null;
          p_intent?: string | null;
          p_vehicle_id?: string | null;
          p_payload?: Json;
          p_ip?: string | null;
          p_user_agent?: string | null;
        };
        Returns: string;
      };
      submit_finance_application: {
        Args: {
          p_lead_id: string;
          p_applicant: Json;
          p_employment: Json;
          p_residence: Json;
          p_sin: string;
          p_dob: string;
          p_gross_income: string;
          p_consents: Json;
          p_ip: string | null;
          p_user_agent: string | null;
        };
        Returns: string;
      };
      current_user_role: { Args: Record<string, never>; Returns: UserRole | null };
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_finance: { Args: Record<string, never>; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      body_type: BodyType;
      fuel_type: FuelType;
      drivetrain: Drivetrain;
      transmission: Transmission;
      vehicle_status: VehicleStatus;
      lead_source: LeadSource;
      lead_status: LeadStatus;
      finance_status: FinanceStatus;
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
};

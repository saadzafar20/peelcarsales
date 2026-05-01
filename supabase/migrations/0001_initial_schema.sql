-- =============================================================================
-- Peel Car Sales 2.0 — Initial Schema
-- =============================================================================
-- This migration creates the core tables. RLS policies live in 0002.
-- pgsodium envelope encryption helpers live in 0003. PII access audit
-- triggers live in 0004. RPC helpers live in 0005.
-- =============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pgsodium";

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type public.body_type as enum
  ('sedan', 'suv', 'hatchback', 'coupe', 'truck', 'van', 'wagon');

create type public.fuel_type as enum
  ('gas', 'hybrid', 'electric', 'diesel');

create type public.drivetrain as enum
  ('fwd', 'rwd', 'awd', '4wd');

create type public.transmission as enum
  ('automatic', 'manual', 'cvt', 'dct');

create type public.vehicle_status as enum
  ('draft', 'active', 'on_hold', 'sold', 'archived');

create type public.lead_source as enum
  ('web', 'autoverify', 'truetrade', 'autoraptor', 'whatsapp', 'sms',
   'phone', 'autotrader', 'kijiji', 'cargurus', 'walk_in');

create type public.lead_status as enum
  ('new', 'contacted', 'qualified', 'test_drive', 'negotiating',
   'won', 'lost');

create type public.finance_status as enum
  ('draft', 'submitted', 'lender_review', 'conditional', 'approved',
   'declined', 'funded');

create type public.user_role as enum
  ('owner', 'manager', 'sales', 'finance', 'photographer', 'marketing',
   'service', 'customer');

-- -----------------------------------------------------------------------------
-- Locations (the two physical lots)
-- -----------------------------------------------------------------------------
create table public.locations (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  name          text not null,
  address       text not null,
  city          text not null,
  province      text not null default 'ON',
  postal_code   text not null,
  phone         text not null default '905-678-0048',
  hours_jsonb   jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

insert into public.locations (slug, name, address, city, postal_code) values
  ('mississauga', 'Mississauga', '2701 Derry Rd East', 'Mississauga', 'L4T 1A2'),
  ('oakville',    'Oakville',    '333 Wyecroft Rd, Unit 11', 'Oakville', 'L6K 2H2');

-- -----------------------------------------------------------------------------
-- Users (extends auth.users with role + location)
-- -----------------------------------------------------------------------------
create table public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        citext unique not null,
  full_name    text,
  role         user_role not null default 'customer',
  location_id  uuid references public.locations(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index users_role_idx on public.users(role);

-- -----------------------------------------------------------------------------
-- Vehicles (inventory)
-- -----------------------------------------------------------------------------
create table public.vehicles (
  id                   uuid primary key default uuid_generate_v4(),
  vin                  text unique not null check (length(vin) = 17),
  slug                 text unique not null,
  year                 int not null check (year between 1980 and 2100),
  make                 text not null,
  model                text not null,
  trim                 text,
  body_type            body_type not null,
  fuel                 fuel_type not null default 'gas',
  drivetrain           drivetrain not null,
  transmission         transmission not null,
  mileage_km           int not null check (mileage_km >= 0),
  exterior_color       text,
  interior_color       text,
  /* prices stored in cents (CAD) for currency-precision */
  price_cents          int not null check (price_cents > 0),
  was_price_cents      int check (was_price_cents > 0),
  cost_cents           int,                                 -- internal — not exposed via RLS
  status               vehicle_status not null default 'draft',
  location_id          uuid not null references public.locations(id),
  badges               text[] not null default '{}',
  features             jsonb not null default '[]'::jsonb,
  description          text,
  hero_image_id        uuid,
  /* third-party valuation cache */
  cb_value_cents       int,
  truetrade_low_cents  int,
  truetrade_high_cents int,
  days_on_lot          int generated always as
    (greatest(0, extract(day from now() - created_at)::int)) stored,
  sold_at              timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index vehicles_status_idx     on public.vehicles(status);
create index vehicles_make_model_idx on public.vehicles(make, model);
create index vehicles_price_idx      on public.vehicles(price_cents);
create index vehicles_year_idx       on public.vehicles(year);

-- -----------------------------------------------------------------------------
-- Vehicle images
-- -----------------------------------------------------------------------------
create table public.vehicle_images (
  id            uuid primary key default uuid_generate_v4(),
  vehicle_id    uuid not null references public.vehicles(id) on delete cascade,
  raw_url       text not null,
  processed_url text,
  role          text not null default 'gallery',  -- gallery|hero|360
  sort_order    int not null default 0,
  fal_job_id    text,
  status        text not null default 'pending',  -- pending|processing|ready|failed
  alt_text      text,
  created_at    timestamptz not null default now()
);
create index vehicle_images_vehicle_idx on public.vehicle_images(vehicle_id, sort_order);

alter table public.vehicles
  add constraint vehicles_hero_image_fk
  foreign key (hero_image_id) references public.vehicle_images(id) on delete set null;

-- -----------------------------------------------------------------------------
-- Leads — unified inbox (web forms + AutoVerify + TrueTrade + AutoRaptor +
-- WhatsApp + SMS + phone + marketplace ADF)
-- -----------------------------------------------------------------------------
create table public.leads (
  id                   uuid primary key default uuid_generate_v4(),
  source               lead_source not null,
  source_lead_id       text,
  vehicle_id           uuid references public.vehicles(id),
  /* PII columns end with _enc and store pgsodium aead-encrypted values.
     Plaintext names: name, email, phone. Reads go through helpers in 0005. */
  name_enc             bytea,
  email_enc            bytea,
  email_token          text,                       -- HMAC for dedupe
  phone_enc            bytea,
  phone_token          text,                       -- HMAC for dedupe
  message              text,
  intent               text,
  payload              jsonb not null default '{}'::jsonb,
  status               lead_status not null default 'new',
  assigned_to          uuid references public.users(id),
  autoraptor_synced_at timestamptz,
  ip_address           inet,
  user_agent           text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index leads_status_idx       on public.leads(status);
create index leads_source_idx       on public.leads(source);
create index leads_assigned_to_idx  on public.leads(assigned_to);
create index leads_email_token_idx  on public.leads(email_token);
create index leads_phone_token_idx  on public.leads(phone_token);

-- -----------------------------------------------------------------------------
-- Trade-in appraisals
-- -----------------------------------------------------------------------------
create table public.appraisals (
  id                  uuid primary key default uuid_generate_v4(),
  lead_id             uuid references public.leads(id),
  vin                 text,
  year                int,
  make                text,
  model               text,
  mileage_km          int,
  condition           jsonb not null default '{}'::jsonb,
  photos              text[] not null default '{}',
  cf_low_cents        int,
  cf_high_cents       int,
  cb_value_cents      int,
  offer_cents         int,
  status              text not null default 'estimated',
  created_at          timestamptz not null default now()
);
create index appraisals_lead_idx on public.appraisals(lead_id);

-- -----------------------------------------------------------------------------
-- Finance applications — most sensitive table; SIN/DOB/income encrypted
-- -----------------------------------------------------------------------------
create table public.finance_applications (
  id                       uuid primary key default uuid_generate_v4(),
  lead_id                  uuid references public.leads(id),
  applicant_id             uuid references auth.users(id),
  applicant_enc            jsonb,                            -- pgsodium-encrypted full applicant card
  employment_enc           jsonb,
  residence_enc            jsonb,
  references_enc           jsonb,
  /* SIN: never stored cleartext.
     - sin_token = HMAC(sin, app_secret) for matching/dedupe
     - sin_enc   = pgsodium aead-encrypted SIN bytes
   */
  sin_token                text,
  sin_enc                  bytea,
  dob_enc                  bytea,
  gross_income_enc         bytea,
  av_pre_qual_band         jsonb,
  plaid_verified_income    boolean not null default false,
  plaid_assets_token       text,
  routeone_app_id          text,
  vehicle_id               uuid references public.vehicles(id),
  status                   finance_status not null default 'draft',
  version                  int not null default 1,
  submitted_at             timestamptz,
  decisioned_at            timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index finance_applications_lead_idx     on public.finance_applications(lead_id);
create index finance_applications_status_idx   on public.finance_applications(status);
create index finance_applications_sin_token_idx on public.finance_applications(sin_token);

-- -----------------------------------------------------------------------------
-- Finance consents (PIPEDA — versioned, immutable)
-- -----------------------------------------------------------------------------
create table public.finance_consents (
  id              uuid primary key default uuid_generate_v4(),
  application_id  uuid not null references public.finance_applications(id) on delete cascade,
  consent_version text not null,
  consent_kind    text not null,                  -- 'financing' | 'marketing' | 'lender_share'
  consent_text    text not null,
  granted         boolean not null,
  signed_at       timestamptz not null default now(),
  ip_address      inet,
  user_agent      text
);
create index finance_consents_app_idx on public.finance_consents(application_id);

-- -----------------------------------------------------------------------------
-- Documents (DL, paystubs, utility bills, void cheques, etc.)
-- -----------------------------------------------------------------------------
create table public.documents (
  id            uuid primary key default uuid_generate_v4(),
  lead_id       uuid references public.leads(id),
  application_id uuid references public.finance_applications(id) on delete cascade,
  type          text not null,                    -- 'drivers_license_front' | 'paystub' | etc.
  storage_path  text not null,                    -- path inside Supabase Storage bucket
  sha256        text,                              -- file integrity hash
  uploaded_by   uuid references public.users(id),
  uploaded_at   timestamptz not null default now()
);
create index documents_application_idx on public.documents(application_id);

-- -----------------------------------------------------------------------------
-- Stripe holds
-- -----------------------------------------------------------------------------
create table public.vehicle_holds (
  id                       uuid primary key default uuid_generate_v4(),
  vehicle_id               uuid not null references public.vehicles(id),
  lead_id                  uuid references public.leads(id),
  stripe_payment_intent_id text unique not null,
  amount_cents             int not null default 50000,        -- $500
  status                   text not null default 'requires_capture',
  expires_at               timestamptz not null default now() + interval '72 hours',
  captured_at              timestamptz,
  released_at              timestamptz,
  created_at               timestamptz not null default now()
);
create index vehicle_holds_vehicle_idx on public.vehicle_holds(vehicle_id);
create index vehicle_holds_status_idx  on public.vehicle_holds(status);

-- -----------------------------------------------------------------------------
-- Saved searches + price alerts
-- -----------------------------------------------------------------------------
create table public.saved_searches (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references auth.users(id) on delete cascade,
  query_json          jsonb not null,
  last_match_count    int not null default 0,
  last_alerted_at     timestamptz,
  created_at          timestamptz not null default now()
);

create table public.price_alerts (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade,
  vehicle_id      uuid not null references public.vehicles(id) on delete cascade,
  target_price_cents int not null,
  channel         text not null default 'email',
  status          text not null default 'active',
  created_at      timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Conversations (Twilio Conversations + WhatsApp + SMS + chatbot)
-- -----------------------------------------------------------------------------
create table public.conversations (
  id                  uuid primary key default uuid_generate_v4(),
  lead_id             uuid references public.leads(id),
  channel             text not null,             -- 'whatsapp' | 'sms' | 'chatbot' | 'web_chat'
  twilio_sid          text unique,
  started_at          timestamptz not null default now(),
  last_message_at     timestamptz
);

create table public.messages (
  id                  uuid primary key default uuid_generate_v4(),
  conversation_id     uuid not null references public.conversations(id) on delete cascade,
  direction           text not null,             -- 'inbound' | 'outbound'
  body                text,
  media_url           text,
  ts                  timestamptz not null default now()
);
create index messages_conversation_idx on public.messages(conversation_id, ts desc);

-- -----------------------------------------------------------------------------
-- Marketplace feed run history
-- -----------------------------------------------------------------------------
create table public.feed_runs (
  id              uuid primary key default uuid_generate_v4(),
  channel         text not null,                  -- 'autotrader' | 'kijiji' | 'cargurus' | etc.
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  vehicles_sent   int,
  errors          jsonb,
  status          text not null default 'running'
);
create index feed_runs_channel_idx on public.feed_runs(channel, started_at desc);

-- -----------------------------------------------------------------------------
-- CMS pages (services, about, etc.)
-- -----------------------------------------------------------------------------
create table public.pages (
  slug         text primary key,
  title        text not null,
  body_mdx     text not null,
  updated_at   timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Reviews (synced from Google Business Profile)
-- -----------------------------------------------------------------------------
create table public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  source      text not null default 'google',
  rating      int not null check (rating between 1 and 5),
  body        text,
  author      text,
  rep         text,
  ts          timestamptz not null,
  created_at  timestamptz not null default now()
);
create index reviews_ts_idx on public.reviews(ts desc);

-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger users_touch                before update on public.users                for each row execute function public.touch_updated_at();
create trigger vehicles_touch             before update on public.vehicles             for each row execute function public.touch_updated_at();
create trigger leads_touch                before update on public.leads                for each row execute function public.touch_updated_at();
create trigger finance_applications_touch before update on public.finance_applications for each row execute function public.touch_updated_at();

-- =============================================================================
-- Row-Level Security policies — DENY BY DEFAULT, allow per role
-- =============================================================================
-- Helper: read the requesting user's role.
-- Cached in a SECURITY DEFINER function so RLS policies don't recurse.
-- =============================================================================

create or replace function public.current_user_role()
  returns user_role
  language sql
  security definer
  stable
  set search_path = public
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.is_staff()
  returns boolean
  language sql
  stable
as $$
  select public.current_user_role() in ('owner', 'manager', 'sales', 'finance',
                                        'photographer', 'marketing', 'service')
$$;

create or replace function public.is_finance()
  returns boolean
  language sql
  stable
as $$
  select public.current_user_role() in ('owner', 'manager', 'finance')
$$;

create or replace function public.is_admin()
  returns boolean
  language sql
  stable
as $$
  select public.current_user_role() in ('owner', 'manager')
$$;

-- =============================================================================
-- Enable RLS on every table — deny by default
-- =============================================================================

alter table public.locations              enable row level security;
alter table public.users                  enable row level security;
alter table public.vehicles               enable row level security;
alter table public.vehicle_images         enable row level security;
alter table public.leads                  enable row level security;
alter table public.appraisals             enable row level security;
alter table public.finance_applications   enable row level security;
alter table public.finance_consents       enable row level security;
alter table public.documents              enable row level security;
alter table public.vehicle_holds          enable row level security;
alter table public.saved_searches         enable row level security;
alter table public.price_alerts           enable row level security;
alter table public.conversations          enable row level security;
alter table public.messages               enable row level security;
alter table public.feed_runs              enable row level security;
alter table public.pages                  enable row level security;
alter table public.reviews                enable row level security;

-- =============================================================================
-- Public read for public-facing content
-- =============================================================================

create policy "locations_public_read" on public.locations
  for select using (true);

create policy "vehicles_public_read_active" on public.vehicles
  for select using (status in ('active', 'on_hold'));

create policy "vehicle_images_public_read" on public.vehicle_images
  for select using (
    exists (select 1 from public.vehicles v
            where v.id = vehicle_id and v.status in ('active', 'on_hold'))
  );

create policy "pages_public_read" on public.pages
  for select using (true);

create policy "reviews_public_read" on public.reviews
  for select using (true);

-- =============================================================================
-- Staff: full read on operational tables
-- =============================================================================

create policy "vehicles_staff_all" on public.vehicles
  for all using (public.is_staff()) with check (public.is_staff());

create policy "vehicle_images_staff_all" on public.vehicle_images
  for all using (public.is_staff()) with check (public.is_staff());

create policy "leads_staff_read" on public.leads
  for select using (public.is_staff());

create policy "leads_staff_write" on public.leads
  for all using (public.is_staff()) with check (public.is_staff());

create policy "appraisals_staff_all" on public.appraisals
  for all using (public.is_staff()) with check (public.is_staff());

create policy "vehicle_holds_staff_all" on public.vehicle_holds
  for all using (public.is_staff()) with check (public.is_staff());

create policy "feed_runs_staff_read" on public.feed_runs
  for select using (public.is_staff());

create policy "conversations_staff_all" on public.conversations
  for all using (public.is_staff()) with check (public.is_staff());

create policy "messages_staff_all" on public.messages
  for all using (public.is_staff()) with check (public.is_staff());

-- =============================================================================
-- Finance applications — finance-role only (most sensitive)
-- =============================================================================

create policy "finance_applications_finance_read" on public.finance_applications
  for select using (public.is_finance());

create policy "finance_applications_finance_write" on public.finance_applications
  for all using (public.is_finance()) with check (public.is_finance());

create policy "finance_applications_owner_read" on public.finance_applications
  for select using (applicant_id = auth.uid());

create policy "finance_consents_finance_read" on public.finance_consents
  for select using (public.is_finance());

create policy "finance_consents_owner_read" on public.finance_consents
  for select using (
    exists (select 1 from public.finance_applications
            where id = application_id and applicant_id = auth.uid())
  );

create policy "finance_consents_anyone_insert" on public.finance_consents
  for insert with check (true);  -- consent rows are immutable + append-only

create policy "documents_finance_read" on public.documents
  for select using (public.is_finance());

create policy "documents_finance_write" on public.documents
  for all using (public.is_finance()) with check (public.is_finance());

create policy "documents_owner_read" on public.documents
  for select using (
    exists (select 1 from public.finance_applications
            where id = application_id and applicant_id = auth.uid())
  );

-- =============================================================================
-- Users
-- =============================================================================

create policy "users_self_read" on public.users
  for select using (id = auth.uid());

create policy "users_admin_all" on public.users
  for all using (public.is_admin()) with check (public.is_admin());

create policy "users_staff_read" on public.users
  for select using (public.is_staff());

-- =============================================================================
-- Saved searches + price alerts — owned by user
-- =============================================================================

create policy "saved_searches_owner_all" on public.saved_searches
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "price_alerts_owner_all" on public.price_alerts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- =============================================================================
-- Anonymous lead creation — public can insert leads but only as anon source
-- =============================================================================

create policy "leads_anon_insert" on public.leads
  for insert
  to anon
  with check (source in ('web', 'autoverify', 'truetrade', 'autoraptor'));

create policy "appraisals_anon_insert" on public.appraisals
  for insert
  to anon
  with check (true);

-- =============================================================================
-- CMS — admin only writes
-- =============================================================================

create policy "pages_admin_write" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

-- =============================================================================
-- Locations — admin only writes
-- =============================================================================

create policy "locations_admin_write" on public.locations
  for all using (public.is_admin()) with check (public.is_admin());

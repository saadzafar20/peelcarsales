-- =============================================================================
-- PII access audit log — every read of an encrypted column writes a row
-- =============================================================================

create table public.pii_access_log (
  id            bigserial primary key,
  user_id       uuid references auth.users(id),
  table_name    text not null,
  row_id        uuid not null,
  column_name   text not null,
  reason        text,
  ip_address    inet,
  user_agent    text,
  accessed_at   timestamptz not null default now()
);
create index pii_access_log_user_idx        on public.pii_access_log(user_id, accessed_at desc);
create index pii_access_log_row_idx         on public.pii_access_log(table_name, row_id, accessed_at desc);
create index pii_access_log_accessed_at_idx on public.pii_access_log(accessed_at desc);

alter table public.pii_access_log enable row level security;

create policy "pii_access_log_admin_read" on public.pii_access_log
  for select using (public.is_admin());

create policy "pii_access_log_finance_self_read" on public.pii_access_log
  for select using (public.is_finance() and user_id = auth.uid());

-- Only the system (via RPC helpers using SECURITY DEFINER) can write.
-- No direct INSERT policy → default deny.

-- Helper invoked from the decrypt RPCs in 0005.
create or replace function public.log_pii_access(
  p_table       text,
  p_row_id      uuid,
  p_column      text,
  p_reason      text default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.pii_access_log(user_id, table_name, row_id, column_name, reason)
  values (auth.uid(), p_table, p_row_id, p_column, p_reason);
end
$$;

revoke all on function public.log_pii_access(text, uuid, text, text) from public;
grant execute on function public.log_pii_access(text, uuid, text, text) to authenticated;

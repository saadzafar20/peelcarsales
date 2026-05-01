-- =============================================================================
-- Helper RPCs: HMAC tokenization + pgsodium encrypt/decrypt with audit
-- =============================================================================
-- All helpers run SECURITY DEFINER with `search_path = public` so they
-- can access the pgsodium key by name without exposing it to row-level
-- callers. Decrypt helpers always write to pii_access_log first.
-- =============================================================================

-- HMAC tokenization for SIN/email/phone matching.
-- The HMAC secret comes from a custom setting injected by the API layer
-- via `set_config('app.hmac_secret', '...', false)` once per connection.
create or replace function public.hmac_token(p_value text)
  returns text
  language plpgsql
  security definer
  stable
  set search_path = public, extensions
as $$
declare
  v_secret text := current_setting('app.hmac_secret', true);
begin
  if v_secret is null or v_secret = '' then
    raise exception 'app.hmac_secret not set';
  end if;
  return encode(extensions.hmac(p_value::bytea, v_secret::bytea, 'sha256'), 'hex');
end
$$;

revoke all on function public.hmac_token(text) from public;
grant execute on function public.hmac_token(text) to authenticated, anon;

-- =============================================================================
-- Encrypt / decrypt PII bytea fields
-- =============================================================================

create or replace function public.encrypt_pii(p_plaintext text)
  returns bytea
  language plpgsql
  security definer
  set search_path = public, pgsodium
as $$
declare
  v_key_id uuid;
begin
  select id into v_key_id from pgsodium.valid_key where name = 'peel_pii_v1' limit 1;
  if v_key_id is null then
    raise exception 'PII encryption key peel_pii_v1 not found';
  end if;
  return pgsodium.crypto_aead_det_encrypt(
    p_plaintext::bytea,
    'peel-pii-v1'::bytea,
    v_key_id
  );
end
$$;

revoke all on function public.encrypt_pii(text) from public;
grant execute on function public.encrypt_pii(text) to authenticated;

create or replace function public.decrypt_pii(
  p_ciphertext bytea,
  p_table      text,
  p_row_id     uuid,
  p_column     text,
  p_reason     text default null
) returns text
language plpgsql
security definer
set search_path = public, pgsodium
as $$
declare
  v_key_id uuid;
  v_plaintext bytea;
begin
  -- Audit FIRST so unauthorized reads still produce a trail
  perform public.log_pii_access(p_table, p_row_id, p_column, p_reason);

  select id into v_key_id from pgsodium.valid_key where name = 'peel_pii_v1' limit 1;
  if v_key_id is null then
    raise exception 'PII encryption key peel_pii_v1 not found';
  end if;

  v_plaintext := pgsodium.crypto_aead_det_decrypt(
    p_ciphertext,
    'peel-pii-v1'::bytea,
    v_key_id
  );
  return convert_from(v_plaintext, 'utf8');
end
$$;

revoke all on function public.decrypt_pii(bytea, text, uuid, text, text) from public;
grant execute on function public.decrypt_pii(bytea, text, uuid, text, text) to authenticated;

-- =============================================================================
-- High-level write paths invoked by the API layer
-- =============================================================================

create or replace function public.create_lead(
  p_source        lead_source,
  p_name          text,
  p_email         text,
  p_phone         text,
  p_message       text default null,
  p_intent        text default null,
  p_vehicle_id    uuid default null,
  p_payload       jsonb default '{}'::jsonb,
  p_ip            inet default null,
  p_user_agent    text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lead_id uuid;
begin
  insert into public.leads (
    source, vehicle_id, name_enc, email_enc, email_token,
    phone_enc, phone_token, message, intent, payload, ip_address, user_agent
  ) values (
    p_source,
    p_vehicle_id,
    case when p_name  is not null then public.encrypt_pii(p_name)  end,
    case when p_email is not null then public.encrypt_pii(p_email) end,
    case when p_email is not null then public.hmac_token(lower(p_email)) end,
    case when p_phone is not null then public.encrypt_pii(p_phone) end,
    case when p_phone is not null then public.hmac_token(regexp_replace(p_phone, '\D', '', 'g')) end,
    p_message,
    p_intent,
    coalesce(p_payload, '{}'::jsonb),
    p_ip,
    p_user_agent
  )
  returning id into v_lead_id;
  return v_lead_id;
end
$$;

revoke all on function public.create_lead from public;
grant execute on function public.create_lead to authenticated, anon;

create or replace function public.submit_finance_application(
  p_lead_id          uuid,
  p_applicant        jsonb,
  p_employment       jsonb,
  p_residence        jsonb,
  p_sin              text,
  p_dob              text,
  p_gross_income     text,
  p_consents         jsonb,
  p_ip               inet,
  p_user_agent       text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_app_id uuid;
  v_consent jsonb;
begin
  insert into public.finance_applications (
    lead_id, applicant_id,
    applicant_enc, employment_enc, residence_enc,
    sin_token, sin_enc, dob_enc, gross_income_enc,
    status, submitted_at
  ) values (
    p_lead_id,
    auth.uid(),
    p_applicant,    -- top-level jsonb stored encrypted at the column-default level
    p_employment,
    p_residence,
    public.hmac_token(regexp_replace(p_sin, '\D', '', 'g')),
    public.encrypt_pii(p_sin),
    public.encrypt_pii(p_dob),
    public.encrypt_pii(p_gross_income),
    'submitted',
    now()
  )
  returning id into v_app_id;

  -- Persist each consent grant as an immutable record
  for v_consent in select * from jsonb_array_elements(p_consents) loop
    insert into public.finance_consents (
      application_id, consent_version, consent_kind, consent_text, granted, ip_address, user_agent
    ) values (
      v_app_id,
      v_consent->>'version',
      v_consent->>'kind',
      v_consent->>'text',
      (v_consent->>'granted')::boolean,
      p_ip,
      p_user_agent
    );
  end loop;

  return v_app_id;
end
$$;

revoke all on function public.submit_finance_application from public;
grant execute on function public.submit_finance_application to authenticated;

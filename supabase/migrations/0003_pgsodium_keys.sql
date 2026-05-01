-- =============================================================================
-- pgsodium envelope encryption setup
-- =============================================================================
-- pgsodium provides authenticated encryption (AEAD) using a master key
-- stored in Supabase Vault. We register a single key for application-level
-- PII fields (SIN, DOB, gross_income, applicant card, employment card).
--
-- All RPC helpers in 0005 use this key by name.
-- =============================================================================

do $$
declare
  key_id uuid;
begin
  -- Create the key only if it doesn't already exist.
  if not exists (select 1 from pgsodium.valid_key where name = 'peel_pii_v1') then
    perform pgsodium.create_key('aead-det', 'peel_pii_v1');
  end if;
end $$;

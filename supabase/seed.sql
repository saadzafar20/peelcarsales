-- =============================================================================
-- Seed data — Mississauga + Oakville lots already inserted in 0001.
-- This file adds sample inventory equivalent to src/lib/sample-inventory.ts
-- so dev environments have something to query against.
-- =============================================================================

-- The HMAC secret needs to be present for create_lead etc., but seed only
-- inserts vehicles directly so we skip it here.

with l as (
  select id, slug from public.locations
)
insert into public.vehicles (
  vin, slug, year, make, model, trim, body_type, fuel, drivetrain,
  transmission, mileage_km, exterior_color, interior_color,
  price_cents, was_price_cents, status, location_id, badges, features, description
)
values
  ('2HGFE2F50MH500111', '2021-honda-civic-lx-mississauga', 2021, 'Honda', 'Civic', 'LX',
   'sedan', 'gas', 'fwd', 'cvt', 48320, 'Aegean Blue Metallic', 'Black',
   1999500, 2149500, 'active', (select id from l where slug='mississauga'),
   array['best-priced','carfax-clean','price-drop'],
   '["Apple CarPlay & Android Auto","Honda Sensing","Heated front seats","Backup camera","Lane keep assist"]'::jsonb,
   'One-owner Civic LX with full Carfax history. Honda Sensing standard.'),

  ('2T3F1RFV5LC100222', '2020-toyota-rav4-le-awd-oakville', 2020, 'Toyota', 'RAV4', 'LE AWD',
   'suv', 'gas', 'awd', 'automatic', 62180, 'Magnetic Grey', 'Black',
   2849900, null, 'active', (select id from l where slug='oakville'),
   array['fresh-arrival','carfax-clean'],
   '["AWD","Toyota Safety Sense 2.0","Adaptive cruise","Heated seats","Remote start"]'::jsonb,
   'Fresh trade. AWD RAV4 with Toyota Safety Sense and a clean Carfax.'),

  ('KMHLM4AG3NU300333', '2022-hyundai-elantra-preferred-mississauga', 2022, 'Hyundai', 'Elantra', 'Preferred',
   'sedan', 'gas', 'fwd', 'cvt', 31640, 'Phantom Black', 'Black',
   2189900, null, 'active', (select id from l where slug='mississauga'),
   array['low-km'],
   '["Wireless Apple CarPlay","Lane following assist","Blind spot warning","10.25-in infotainment","Heated steering"]'::jsonb,
   'Low-km Elantra Preferred with wireless CarPlay and Hyundai SmartSense.')
on conflict (vin) do nothing;

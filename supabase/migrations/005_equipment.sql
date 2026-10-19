-- ============================================================
-- Dotazioni di serie e accessori per veicolo
-- ============================================================

alter table public.cars
  add column if not exists standard_features text[] not null default '{}',
  add column if not exists accessories        text[] not null default '{}';

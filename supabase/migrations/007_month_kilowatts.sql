-- ============================================================
-- Autovanny — Migrazione 007: Immatricolazione e Potenza (kW)
-- - month:      mese di immatricolazione (1-12), con l'anno in year
-- - kilowatts:  potenza del motore in kW
-- Idempotente: può essere eseguita più volte.
-- ============================================================

alter table public.cars
  add column if not exists month integer check (month between 1 and 12);

alter table public.cars
  add column if not exists kilowatts integer;

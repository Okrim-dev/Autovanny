-- ============================================================
-- Autovanny — Migrazione 003: Condizione e Cilindrata
-- - condition:    stato del veicolo (es. "Usato", "Nuovo (KM0)")
-- - displacement: cilindrata in cc
-- Idempotente: può essere eseguita più volte.
-- ============================================================

alter table public.cars
  add column if not exists condition text default 'Usato';

alter table public.cars
  add column if not exists displacement integer;

-- I veicoli già presenti sono usati di concessionaria.
update public.cars
  set condition = 'Usato'
  where condition is null;

create index if not exists cars_condition_idx on public.cars (condition);
create index if not exists cars_displacement_idx on public.cars (displacement);

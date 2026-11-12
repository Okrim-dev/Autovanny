-- ============================================================
-- Autovanny — Migrazione 008: Recensioni, Tipologia, Posti
-- - reviews:        recensioni clienti (slider nella home)
-- - cars.vehicle_type: autovettura / autocarro
-- - cars.seats:     posti a sedere (testo libero)
-- Idempotente: può essere eseguita più volte.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Recensioni
-- ------------------------------------------------------------
create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  text       text not null,
  rating     integer not null check (rating between 1 and 5),
  visible    boolean not null default true,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "Reviews are publicly viewable" on public.reviews;
create policy "Reviews are publicly viewable"
  on public.reviews for select
  using (visible = true);

drop policy if exists "Admins can view all reviews" on public.reviews;
create policy "Admins can view all reviews"
  on public.reviews for select
  to authenticated
  using (true);

drop policy if exists "Admins can insert reviews" on public.reviews;
create policy "Admins can insert reviews"
  on public.reviews for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update reviews" on public.reviews;
create policy "Admins can update reviews"
  on public.reviews for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete reviews" on public.reviews;
create policy "Admins can delete reviews"
  on public.reviews for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- 2) Veicoli: tipologia e posti a sedere
-- ------------------------------------------------------------
alter table public.cars
  add column if not exists vehicle_type text not null default 'autovettura';

alter table public.cars
  add column if not exists seats text;

create index if not exists cars_vehicle_type_idx
  on public.cars (vehicle_type) where stock = true;

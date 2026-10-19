-- ============================================================
-- Autovanny — Migrazione 004: Noleggio + Categorie
-- - cars.rental:      veicolo disponibile a noleggio
-- - categories:       categorie create dall'admin
-- - cars.category_id: categoria assegnata al veicolo
-- Idempotente: può essere eseguita più volte.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Noleggio
-- ------------------------------------------------------------
alter table public.cars
  add column if not exists rental boolean not null default false;

create index if not exists cars_rental_idx on public.cars (rental) where stock = true;

-- ------------------------------------------------------------
-- 2) Categorie create dall'admin
-- ------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  tagline    text,
  image      text,
  position   integer not null default 0,
  visible    boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.cars
  add column if not exists category_id uuid references public.categories (id) on delete set null;

create index if not exists cars_category_idx on public.cars (category_id) where stock = true;

-- ------------------------------------------------------------
-- 3) Row Level Security — lettura pubblica + CRUD admin
-- ------------------------------------------------------------
alter table public.categories enable row level security;

drop policy if exists "Categories are publicly viewable" on public.categories;
create policy "Categories are publicly viewable"
  on public.categories for select
  using (visible = true);

drop policy if exists "Admins can view all categories" on public.categories;
create policy "Admins can view all categories"
  on public.categories for select
  to authenticated
  using (true);

drop policy if exists "Admins can insert categories" on public.categories;
create policy "Admins can insert categories"
  on public.categories for insert
  to authenticated
  with check (true);

drop policy if exists "Admins can update categories" on public.categories;
create policy "Admins can update categories"
  on public.categories for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Admins can delete categories" on public.categories;
create policy "Admins can delete categories"
  on public.categories for delete
  to authenticated
  using (true);

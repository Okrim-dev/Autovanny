-- ============================================================
-- Autovanny — Schema database (Supabase / PostgreSQL)
-- Fase 1: catalogo auto + articoli blog
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Tabella categorie (create dall'admin)
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

-- ------------------------------------------------------------
-- Tabella veicoli
-- ------------------------------------------------------------
create table if not exists public.cars (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  brand         text not null,
  model         text not null,
  trim          text,
  title         text not null,
  year          integer not null check (year between 1900 and 2100),
  price         numeric(12, 2) not null check (price >= 0),
  currency      text not null default 'GBP',
  mileage       integer not null default 0,
  fuel          text not null,
  transmission  text not null,
  body_style    text,
  condition     text not null default 'Usato',
  engine        text,
  displacement  integer,
  bhp           integer,
  km_per_l      numeric(6, 1),
  certified     boolean not null default false,
  featured      boolean not null default false,
  rental        boolean not null default false,
  stock         boolean not null default true,
  category_id   uuid references public.categories (id) on delete set null,
  description   text,
  exterior_color text,
  deposit       numeric(10, 2),
  monthly_note  text,
  specs         jsonb,
  images        text[] not null default '{}',
  standard_features text[] not null default '{}',
  accessories        text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists cars_brand_idx on public.cars (brand);
create index if not exists cars_year_idx on public.cars (year desc);
create index if not exists cars_price_idx on public.cars (price);
create index if not exists cars_featured_idx on public.cars (featured) where stock = true;

-- ------------------------------------------------------------
-- Tabella articoli (blog / news)
-- ------------------------------------------------------------
create table if not exists public.articles (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  content      text,
  category     text,
  cover_image  text,
  author       text,
  published_at timestamptz not null default now(),
  visible      boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists articles_published_idx on public.articles (published_at desc);

-- ------------------------------------------------------------
-- Row Level Security
-- Fase 1: lettura pubblica (anon key).
-- Fase 2: area admin protetta con autenticazione — si aggiungeranno
-- policy INSERT/UPDATE/DELETE riservate ai ruoli autenticati.
-- ------------------------------------------------------------
alter table public.cars enable row level security;
alter table public.articles enable row level security;
alter table public.categories enable row level security;

create policy "Cars are publicly viewable"
  on public.cars for select
  using (stock = true);

create policy "Articles are publicly viewable"
  on public.articles for select
  using (visible = true);

create policy "Categories are publicly viewable"
  on public.categories for select
  using (visible = true);
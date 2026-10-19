-- ============================================================
-- Autovanny — Migrazione 002: Area Admin
-- - RLS: CRUD completo su cars/articles riservato agli utenti autenticati
-- - Storage: bucket pubblici per immagini veicoli e articoli
-- Idempotente: può essere eseguita più volte.
-- ============================================================

-- ------------------------------------------------------------
-- 1) Row Level Security — accesso admin (role "authenticated")
--    L'admin vede TUTTI i veicoli/articoli (anche non in vendita).
-- ------------------------------------------------------------

-- VEHICLES
drop policy if exists "Admins can view all vehicles" on public.cars;
drop policy if exists "Admins can insert vehicles" on public.cars;
drop policy if exists "Admins can update vehicles" on public.cars;
drop policy if exists "Admins can delete vehicles" on public.cars;

create policy "Admins can view all vehicles"
  on public.cars for select
  to authenticated
  using (true);

create policy "Admins can insert vehicles"
  on public.cars for insert
  to authenticated
  with check (true);

create policy "Admins can update vehicles"
  on public.cars for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can delete vehicles"
  on public.cars for delete
  to authenticated
  using (true);

-- ARTICLES
drop policy if exists "Admins can view all articles" on public.articles;
drop policy if exists "Admins can insert articles" on public.articles;
drop policy if exists "Admins can update articles" on public.articles;
drop policy if exists "Admins can delete articles" on public.articles;

create policy "Admins can view all articles"
  on public.articles for select
  to authenticated
  using (true);

create policy "Admins can insert articles"
  on public.articles for insert
  to authenticated
  with check (true);

create policy "Admins can update articles"
  on public.articles for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can delete articles"
  on public.articles for delete
  to authenticated
  using (true);

-- ------------------------------------------------------------
-- 2) Storage — bucket immagini (pubblici, max 5MB, jpg/png/webp)
-- ------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('vehicle-images', 'vehicle-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('article-images', 'article-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lettura pubblica (anon + autenticati)
drop policy if exists "Public read vehicle-images" on storage.objects;
drop policy if exists "Public read article-images" on storage.objects;
drop policy if exists "Admins upload vehicle-images" on storage.objects;
drop policy if exists "Admins update vehicle-images" on storage.objects;
drop policy if exists "Admins delete vehicle-images" on storage.objects;
drop policy if exists "Admins upload article-images" on storage.objects;
drop policy if exists "Admins update article-images" on storage.objects;
drop policy if exists "Admins delete article-images" on storage.objects;

create policy "Public read vehicle-images"
  on storage.objects for select
  using (bucket_id = 'vehicle-images');

create policy "Public read article-images"
  on storage.objects for select
  using (bucket_id = 'article-images');

-- Scrittura riservata agli utenti autenticati (admin)
create policy "Admins upload vehicle-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehicle-images');

create policy "Admins update vehicle-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehicle-images');

create policy "Admins delete vehicle-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehicle-images');

create policy "Admins upload article-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'article-images');

create policy "Admins update article-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'article-images');

create policy "Admins delete article-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'article-images');

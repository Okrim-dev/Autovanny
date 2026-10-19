"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorizzato");
  return { supabase, user };
}

function revalidateSite() {
  revalidatePath("/");
  revalidatePath("/showroom");
  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath("/admin/vehicles");
  revalidatePath("/admin/articles");
  revalidatePath("/admin/categorie");
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(supabase: Awaited<ReturnType<typeof createClient>>, base: string) {
  let slug = base;
  let i = 1;
  for (;;) {
    const { data } = await supabase.from("cars").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i++}`;
  }
}

async function uniqueArticleSlug(supabase: Awaited<ReturnType<typeof createClient>>, base: string) {
  let slug = base;
  let i = 1;
  for (;;) {
    const { data } = await supabase.from("articles").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i++}`;
  }
}

async function deleteStorageImages(urls: string[], bucket: string) {
  const supabase = await createClient();
  const paths = (urls ?? [])
    .filter((u) => u.includes(`/${bucket}/`))
    .map((u) => u.split(`/${bucket}/`)[1]);
  if (paths.length > 0) {
    await supabase.storage.from(bucket).remove(paths);
  }
}

// ------------------------------------------------------------------
// Veicoli
// ------------------------------------------------------------------

export interface VehicleInput {
  id?: string | null;
  brand: string;
  model: string;
  trim?: string | null;
  title?: string | null;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  body_style?: string | null;
  condition?: string | null;
  engine?: string | null;
  displacement?: number | null;
  bhp?: number | null;
  km_per_l?: number | null;
  certified: boolean;
  featured: boolean;
  rental?: boolean;
  stock: boolean;
  category_id?: string | null;
  description?: string | null;
  exterior_color?: string | null;
  images: string[];
  standard_features?: string[];
  accessories?: string[];
}

export async function saveVehicleAction(input: VehicleInput): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await requireUser();

  const brand = input.brand.trim();
  const model = input.model.trim();
  if (!brand || !model) return { ok: false, error: "Marca e modello sono obbligatori." };
  if (!input.year || input.year < 1900 || input.year > 2100)
    return { ok: false, error: "Anno non valido." };
  if (input.price <= 0) return { ok: false, error: "Prezzo non valido." };

  const title = (input.title?.trim() || `${brand} ${model}${input.trim ? ` ${input.trim}` : ""}`).trim();

  const cleanList = (list?: string[]) =>
    (list ?? []).map((item) => item.trim()).filter(Boolean);

  const row = {
    brand,
    model,
    trim: input.trim?.trim() || null,
    title,
    year: input.year,
    price: input.price,
    mileage: input.mileage || 0,
    fuel: input.fuel,
    transmission: input.transmission,
    body_style: input.body_style?.trim() || null,
    condition: input.condition?.trim() || "Usato",
    engine: input.engine?.trim() || null,
    displacement: input.displacement ?? null,
    bhp: input.bhp ?? null,
    km_per_l: input.km_per_l ?? null,
    certified: Boolean(input.certified),
    featured: Boolean(input.featured),
    rental: Boolean(input.rental),
    stock: Boolean(input.stock),
    category_id: input.category_id || null,
    description: input.description?.trim() || null,
    exterior_color: input.exterior_color?.trim() || null,
    images: input.images ?? [],
    standard_features: cleanList(input.standard_features),
    accessories: cleanList(input.accessories),
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await supabase.from("cars").update(row).eq("id", input.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const slug = await uniqueSlug(supabase, slugify(`${brand} ${model}`));
    const { error } = await supabase.from("cars").insert({ ...row, slug });
    if (error) return { ok: false, error: error.message };
  }

  revalidateSite();
  return { ok: true };
}

export async function deleteVehicleAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await requireUser();

  const { data: car } = await supabase.from("cars").select("images").eq("id", id).maybeSingle();
  const { error } = await supabase.from("cars").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  if (car && Array.isArray((car as { images?: string[] }).images)) {
    await deleteStorageImages((car as { images: string[] }).images, "vehicle-images");
  }

  revalidateSite();
  return { ok: true };
}

// ------------------------------------------------------------------
// Articoli
// ------------------------------------------------------------------

export interface ArticleInput {
  id?: string | null;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  category?: string | null;
  cover_image?: string | null;
  author?: string | null;
  published_at?: string | null;
  visible: boolean;
}

export async function saveArticleAction(input: ArticleInput): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await requireUser();

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Il titolo è obbligatorio." };

  let publishedAt = input.published_at ? new Date(input.published_at).toISOString() : null;
  if (publishedAt && Number.isNaN(new Date(publishedAt).getTime())) publishedAt = null;

  const row = {
    title,
    excerpt: input.excerpt?.trim() || null,
    content: input.content ?? null,
    category: input.category?.trim() || null,
    cover_image: input.cover_image?.trim() || null,
    author: input.author?.trim() || null,
    published_at: publishedAt ?? new Date().toISOString(),
    visible: Boolean(input.visible),
  };

  if (input.id) {
    const { error } = await supabase.from("articles").update(row).eq("id", input.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const slug = await uniqueArticleSlug(supabase, slugify(title));
    const { error } = await supabase.from("articles").insert({ ...row, slug });
    if (error) return { ok: false, error: error.message };
  }

  revalidateSite();
  return { ok: true };
}

export async function deleteArticleAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await requireUser();

  const { data: article } = await supabase.from("articles").select("cover_image").eq("id", id).maybeSingle();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  if (article && (article as { cover_image?: string }).cover_image) {
    await deleteStorageImages([(article as { cover_image: string }).cover_image], "article-images");
  }

  revalidateSite();
  return { ok: true };
}

// ------------------------------------------------------------------
// Categorie
// ------------------------------------------------------------------

export interface CategoryInput {
  id?: string | null;
  name: string;
  tagline?: string | null;
  image?: string | null;
  position?: number | null;
  visible?: boolean;
}

async function uniqueCategorySlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  base: string,
  excludeId?: string | null
) {
  let slug = base;
  let i = 1;
  for (;;) {
    const { data } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!data || (excludeId && data.id === excludeId)) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function saveCategoryAction(
  input: CategoryInput
): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await requireUser();

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Il nome della categoria è obbligatorio." };

  const base = slugify(name);
  if (!base) return { ok: false, error: "Nome categoria non valido." };
  const slug = await uniqueCategorySlug(supabase, base, input.id);

  const row = {
    name,
    slug,
    tagline: input.tagline?.trim() || null,
    image: input.image?.trim() || null,
    position: input.position ?? 0,
    visible: input.visible !== false,
  };

  if (input.id) {
    const { error } = await supabase.from("categories").update(row).eq("id", input.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("categories").insert(row);
    if (error) return { ok: false, error: error.message };
  }

  revalidateSite();
  return { ok: true };
}

export async function deleteCategoryAction(id: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await requireUser();

  const { data: category } = await supabase
    .from("categories")
    .select("image")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  if (category && (category as { image?: string }).image) {
    await deleteStorageImages([(category as { image: string }).image], "vehicle-images");
  }

  revalidateSite();
  return { ok: true };
}

// ------------------------------------------------------------------
// Sessione / account
// ------------------------------------------------------------------

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function updatePasswordAction(newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const { supabase } = await requireUser();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

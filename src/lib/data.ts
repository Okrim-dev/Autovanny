import { isSupabaseConfigured, supabase } from "./supabase";
import { mockArticles, mockCars } from "./mock-data";
import type { CarCategory } from "./categories";
import type { Article, Car, CarFilters, CarResults, Category, FilterOptions } from "./types";

const EMPTY_UUID = "00000000-0000-0000-0000-000000000000";

async function resolveCategoryId(slug: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return (data as { id: string } | null)?.id ?? null;
  } catch {
    return null;
  }
}

function safeParseInt(
  value: string | string[] | null | undefined
): number | undefined {
  if (value === undefined || value === null) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function safeParseBrands(
  value: string | string[] | null | undefined
): string[] | undefined {
  if (value === undefined || value === null) return undefined;
  const list = Array.isArray(value) ? value : [value];
  return list.length > 0 ? list : undefined;
}

export function parseCarFilters(searchParams: URLSearchParams): CarFilters {
  const brands = searchParams.getAll("brand");
  const certified = searchParams.get("certified") === "true";
  const model = searchParams.get("model") || undefined;

  const sort = searchParams.get("sort") || undefined;
  const page = safeParseInt(searchParams.get("page")) ?? 1;

  return {
    brand: brands.length > 0 ? brands : safeParseBrands(searchParams.get("brand")),
    certified: searchParams.has("certified") ? certified : undefined,
    rental: searchParams.get("rental") === "true" ? true : undefined,
    model,
    body_style: searchParams.get("body_style") || undefined,
    fuel: searchParams.get("fuel") || undefined,
    transmission: searchParams.get("transmission") || undefined,
    condition: searchParams.get("condition") || undefined,
    category: searchParams.get("category") || undefined,
    price_min: safeParseInt(searchParams.get("price_min")),
    price_max: safeParseInt(searchParams.get("price_max")),
    year_from: safeParseInt(searchParams.get("year_from")),
    year_to: safeParseInt(searchParams.get("year_to")),
    sort,
    page,
  };
}

const sortBy = (list: Car[], sort: string | undefined): Car[] => {
  switch (sort) {
    case "price_asc":
      return [...list].sort((a, b) => a.price - b.price);
    case "price_desc":
      return [...list].sort((a, b) => b.price - a.price);
    case "year_desc":
      return [...list].sort((a, b) => b.year - a.year);
    case "mileage_asc":
      return [...list].sort((a, b) => a.mileage - b.mileage);
    case "newest":
    default:
      return [...list].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }
};

function applyMockFilters(cars: Car[], filters: CarFilters): Car[] {
  return cars.filter((car) => {
    if (filters.brand && filters.brand.length > 0 && !filters.brand.includes(car.brand))
      return false;
    if (filters.certified && !car.certified) return false;
    if (filters.rental && !car.rental) return false;
    if (filters.model && car.model.toLowerCase() !== filters.model.toLowerCase()) return false;
    if (
      filters.body_style &&
      car.body_style?.toLowerCase() !== filters.body_style.toLowerCase()
    )
      return false;
    if (filters.fuel && car.fuel.toLowerCase() !== filters.fuel.toLowerCase()) return false;
    if (
      filters.transmission &&
      car.transmission.toLowerCase() !== filters.transmission.toLowerCase()
    )
      return false;
    if (filters.condition && (car.condition ?? "").toLowerCase() !== filters.condition.toLowerCase())
      return false;
    if (filters.price_min !== undefined && car.price < filters.price_min) return false;
    if (filters.price_max !== undefined && car.price > filters.price_max) return false;
    if (filters.year_from !== undefined && car.year < filters.year_from) return false;
    if (filters.year_to !== undefined && car.year > filters.year_to) return false;
    return true;
  });
}

const brandCounts = (cars: Car[]): { brand: string; count: number }[] => {
  const map = new Map<string, number>();
  for (const car of cars) map.set(car.brand, (map.get(car.brand) ?? 0) + 1);
  return [...map.entries()].map(([brand, count]) => ({ brand, count })).sort((a, b) => a.brand.localeCompare(b.brand));
};

export async function getCarCategories(): Promise<CarCategory[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const [{ data: categoryRows, error: categoryError }, { data: carRows, error: carError }] =
      await Promise.all([
        supabase
          .from("categories")
          .select("id, name, slug, tagline, image, position")
          .eq("visible", true)
          .order("position")
          .order("name"),
        supabase.from("cars").select("category_id, images").eq("stock", true),
      ]);

    if (categoryError) throw categoryError;
    if (carError) throw carError;

    const categories = (categoryRows ?? []) as {
      id: string;
      name: string;
      slug: string;
      tagline: string | null;
      image: string | null;
      position: number;
    }[];
    const cars = (carRows ?? []) as { category_id: string | null; images: string[] }[];

    return categories.map((category) => {
      const matches = cars.filter((car) => car.category_id === category.id);
      return {
        name: category.name,
        slug: category.slug,
        tagline: category.tagline ?? "",
        count: matches.length,
        image: matches.find((c) => c.images?.length > 0)?.images[0] ?? category.image,
        url: `/showroom?category=${encodeURIComponent(category.slug)}`,
        filter: { key: "category", value: category.slug },
      };
    });
  } catch {
    return [];
  }
}

export async function getAdminCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("position")
      .order("name");
    if (error) throw error;
    return (data ?? []) as Category[];
  } catch {
    return [];
  }
}

export async function getCars(filters: CarFilters, perPage = 9): Promise<CarResults> {
  if (!isSupabaseConfigured || !supabase) {
    const filtered = applyMockFilters(mockCars, filters);
    const sorted = sortBy(filtered, filters.sort);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
    const start = (page - 1) * perPage;
    return {
      cars: sorted.slice(start, start + perPage),
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
      brands: brandCounts(mockCars),
    };
  }

  try {
    let query = supabase.from("cars").select("*", { count: "exact" }).eq("stock", true);

    if (filters.brand && filters.brand.length > 0) {
      query = query.in("brand", filters.brand);
    }
    if (filters.certified) query = query.eq("certified", true);
    if (filters.rental) query = query.eq("rental", true);
    if (filters.model) query = query.ilike("model", `%${filters.model}%`);
    if (filters.body_style) query = query.eq("body_style", filters.body_style);
    if (filters.fuel) query = query.eq("fuel", filters.fuel);
    if (filters.transmission) query = query.eq("transmission", filters.transmission);
    if (filters.condition) query = query.eq("condition", filters.condition);
    if (filters.category) {
      const categoryId = await resolveCategoryId(filters.category);
      query = query.eq("category_id", categoryId ?? EMPTY_UUID);
    }
    if (filters.price_min !== undefined) query = query.gte("price", filters.price_min);
    if (filters.price_max !== undefined) query = query.lte("price", filters.price_max);
    if (filters.year_from !== undefined) query = query.gte("year", filters.year_from);
    if (filters.year_to !== undefined) query = query.lte("year", filters.year_to);

    const orderColumn =
      filters.sort === "price_asc" || filters.sort === "price_desc"
        ? "price"
        : filters.sort === "year_desc"
          ? "year"
          : filters.sort === "mileage_asc"
            ? "mileage"
            : "created_at";
    const ascending = filters.sort === "price_asc" || filters.sort === "mileage_asc";
    query = query.order(orderColumn, { ascending });

    const totalPages = 1;
    const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
    const start = (page - 1) * perPage;
    const { data, count, error } = await query.range(start, start + perPage - 1);

    if (error) throw error;

    const { data: brandRows, error: brandError } = await supabase
      .from("cars")
      .select("brand")
      .eq("stock", true);
    if (brandError) throw brandError;

    const countMap = new Map<string, number>();
    for (const row of (brandRows ?? []) as { brand: string }[]) {
      countMap.set(row.brand, (countMap.get(row.brand) ?? 0) + 1);
    }
    const counts = [...countMap.entries()]
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => a.brand.localeCompare(b.brand));

    const total = count ?? data?.length ?? 0;
    const pages = Math.max(1, Math.ceil(total / perPage));

    return {
      cars: (data ?? []) as Car[],
      total,
      page,
      per_page: perPage,
      total_pages: pages,
      brands: counts.length > 0 ? counts : brandCounts((data ?? []) as Car[]),
    };
  } catch {
    const filtered = applyMockFilters(mockCars, filters);
    const sorted = sortBy(filtered, filters.sort);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
    const start = (page - 1) * perPage;
    return {
      cars: sorted.slice(start, start + perPage),
      total,
      page,
      per_page: perPage,
      total_pages: totalPages,
      brands: brandCounts(mockCars),
    };
  }
}

export async function getBrands(): Promise<string[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [...new Set(mockCars.map((c) => c.brand))].sort();
  }
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("brand")
      .eq("stock", true)
      .order("brand");
    if (error) throw error;
    return [...new Set((data ?? []).map((r) => r.brand as string))];
  } catch {
    return [...new Set(mockCars.map((c) => c.brand))].sort();
  }
}

export async function getFeaturedCars(limit = 6): Promise<Car[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockCars.filter((c) => c.featured).slice(0, limit);
  }
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("stock", true)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Car[];
  } catch {
    return mockCars.filter((c) => c.featured).slice(0, limit);
  }
}

export async function getLatestCars(limit = 10): Promise<Car[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [...mockCars]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .eq("stock", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as Car[];
  } catch {
    return [...mockCars]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const fallback = (): FilterOptions => {
    const uniq = (values: (string | null | undefined)[]) =>
      [...new Set(values.filter((v): v is string => Boolean(v)))].sort((a, b) =>
        a.localeCompare(b)
      );
    return {
      models: uniq(mockCars.map((c) => c.model)),
      transmissions: uniq(mockCars.map((c) => c.transmission)),
      fuels: uniq(mockCars.map((c) => c.fuel)),
      bodyStyles: uniq(mockCars.map((c) => c.body_style)),
      conditions: uniq(mockCars.map((c) => c.condition)),
    };
  };

  if (!isSupabaseConfigured || !supabase) return fallback();
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("model, transmission, fuel, body_style, condition")
      .eq("stock", true);
    if (error) throw error;

    const rows = (data ?? []) as {
      model: string;
      transmission: string;
      fuel: string;
      body_style: string | null;
      condition: string | null;
    }[];

    const uniq = (values: (string | null | undefined)[]) =>
      [...new Set(values.filter((v): v is string => Boolean(v)))].sort((a, b) =>
        a.localeCompare(b)
      );

    return {
      models: uniq(rows.map((r) => r.model)),
      transmissions: uniq(rows.map((r) => r.transmission)),
      fuels: uniq(rows.map((r) => r.fuel)),
      bodyStyles: uniq(rows.map((r) => r.body_style)),
      conditions: uniq(rows.map((r) => r.condition)),
    };
  } catch {
    return fallback();
  }
}

export async function countCars(filters: CarFilters): Promise<number> {
  if (!isSupabaseConfigured || !supabase) {
    return applyMockFilters(mockCars, filters).length;
  }
  try {
    let query = supabase.from("cars").select("id", { count: "exact", head: true }).eq("stock", true);
    if (filters.brand && filters.brand.length > 0) query = query.in("brand", filters.brand);
    if (filters.certified) query = query.eq("certified", true);
    if (filters.rental) query = query.eq("rental", true);
    if (filters.model) query = query.ilike("model", `%${filters.model}%`);
    if (filters.body_style) query = query.eq("body_style", filters.body_style);
    if (filters.fuel) query = query.eq("fuel", filters.fuel);
    if (filters.transmission) query = query.eq("transmission", filters.transmission);
    if (filters.condition) query = query.eq("condition", filters.condition);
    if (filters.category) {
      const categoryId = await resolveCategoryId(filters.category);
      query = query.eq("category_id", categoryId ?? EMPTY_UUID);
    }
    if (filters.price_min !== undefined) query = query.gte("price", filters.price_min);
    if (filters.price_max !== undefined) query = query.lte("price", filters.price_max);
    if (filters.year_from !== undefined) query = query.gte("year", filters.year_from);
    if (filters.year_to !== undefined) query = query.lte("year", filters.year_to);

    const { count, error } = await query;
    if (error) throw error;
    return count ?? 0;
  } catch {
    return applyMockFilters(mockCars, filters).length;
  }
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockCars.find((c) => c.slug === slug) ?? null;
  }
  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*, category:categories(name)")
      .eq("slug", slug)
      .eq("stock", true)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const row = data as Car & { category: { name: string } | null };
    const { category, ...car } = row;
    return { ...(car as Car), category_name: category?.name ?? null };
  } catch {
    return mockCars.find((c) => c.slug === slug) ?? null;
  }
}

export async function getArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockArticles;
  }
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("visible", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Article[];
  } catch {
    return mockArticles;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockArticles.find((a) => a.slug === slug) ?? null;
  }
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("visible", true)
      .maybeSingle();
    if (error) throw error;
    return (data as Article) ?? null;
  } catch {
    return mockArticles.find((a) => a.slug === slug) ?? null;
  }
}
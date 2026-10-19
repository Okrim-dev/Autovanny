export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  trim: string;
  title: string;
  year: number;
  price: number;
  currency: string;
  mileage: number;
  fuel: string;
  transmission: string;
  body_style: string | null;
  condition?: string | null;
  engine: string | null;
  displacement?: number | null;
  bhp: number | null;
  km_per_l: number | null;
  certified: boolean;
  featured: boolean;
  rental?: boolean;
  stock: boolean;
  category_id?: string | null;
  category_name?: string | null;
  description: string | null;
  exterior_color: string | null;
  deposit: number | null;
  monthly_note: string | null;
  specs: Record<string, string> | null;
  images: string[];
  standard_features?: string[];
  accessories?: string[];
  created_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  cover_image: string | null;
  author: string | null;
  published_at: string;
  visible: boolean;
  created_at: string;
}

export interface CarFilters {
  brand?: string[];
  certified?: boolean;
  rental?: boolean;
  model?: string;
  body_style?: string;
  fuel?: string;
  transmission?: string;
  condition?: string;
  category?: string;
  price_min?: number;
  price_max?: number;
  year_from?: number;
  year_to?: number;
  sort?: string;
  page?: number;
  per_page?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  image: string | null;
  position: number;
  visible: boolean;
  created_at: string;
}

export interface FilterOptions {
  models: string[];
  transmissions: string[];
  fuels: string[];
  bodyStyles: string[];
  conditions: string[];
}

export interface CarResults {
  cars: Car[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  brands: { brand: string; count: number }[];
}

export type SortOption = "newest" | "price_asc" | "price_desc" | "year_desc" | "mileage_asc";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { mockCars } from "@/lib/mock-data";
import Slideshow from "@/components/Slideshow";

export const metadata = {
  title: "Slideshow — Autovanny",
};

type Slide = {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  engine: string | null;
  image: string;
};

type CarRow = {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  engine: string | null;
  images: string[];
  created_at: string;
};

function toSlide(c: {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  engine: string | null;
  images: string[];
}): Slide {
  return {
    id: c.id,
    title: c.title,
    brand: c.brand,
    model: c.model,
    price: c.price,
    year: c.year,
    mileage: c.mileage,
    fuel: c.fuel,
    engine: c.engine,
    image: c.images[0],
  };
}

async function getSlideCars(): Promise<Slide[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockCars
      .filter((c) => c.stock && c.images.length > 0)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(toSlide);
  }

  try {
    const { data, error } = await supabase
      .from("cars")
      .select("id, title, brand, model, price, year, mileage, fuel, engine, images, created_at")
      .eq("stock", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data as CarRow[] ?? []).filter((c) => c.images?.length > 0).map(toSlide);
  } catch {
    return mockCars
      .filter((c) => c.stock && c.images.length > 0)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(toSlide);
  }
}

export default async function SlideshowPage() {
  const slides = await getSlideCars();

  if (slides.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink text-white">
        <p className="text-lg">Nessun veicolo disponibile per lo slideshow.</p>
      </div>
    );
  }

  return <Slideshow slides={slides} />;
}

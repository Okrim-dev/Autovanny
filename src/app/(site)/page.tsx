import { Suspense } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import CategoryTiles from "@/components/CategoryTiles";
import FeaturedInventory from "@/components/FeaturedInventory";
import LatestCars from "@/components/LatestCars";
import SectionHeading from "@/components/SectionHeading";
import { getBrands, getCarCategories } from "@/lib/data";
import { siteConfig } from "@/lib/site";

export default async function Home() {
  const [brands, categories] = await Promise.all([getBrands(), getCarCategories()]);

  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-28 text-center sm:px-6 sm:pt-28 sm:pb-36 lg:px-8">
          <p className="mt-5 mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-medium tracking-wider text-zinc-300 backdrop-blur-sm">
            <span className="h-3.5 w-3.5 rounded-full bg-accent text-3xl" />
            Dal <span className="font-bold text-white text-3xl">1989</span> al{" "}
            <span className="font-bold text-white text-3xl">2026</span>
          </p>
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Le migliori auto
            <br />
            selezionate da professionisti.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            {siteConfig.description}
          </p>
          <Link
            href="#find"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
          >
            Trova il tuo veicolo
          </Link>
        </div>

        <div id="find" className="mx-auto -mb-24 max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
          <SearchBar brands={brands} />
        </div>
      </section>

      <div className="pt-28">
        <LatestCars limit={10} />

        {categories.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
            <SectionHeading
              eyebrow="Sfoglia"
              title="Categorie"
              subtitle="Sfoglia le auto in base alle categorie create da noi: trova subito quella che fa per te."
            />
            <div className="mt-8">
              <CategoryTiles categories={categories} />
            </div>
          </section>
        )}

        <Suspense
          fallback={
            <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-zinc-200" />
              ))}
            </div>
          }
        >
        </Suspense>
      </div>
    </>
  );
}
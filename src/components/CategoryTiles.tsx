import Link from "next/link";
import Image from "next/image";
import type { CarCategory } from "@/lib/categories";

export default function CategoryTiles({ categories }: { categories: CarCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={category.url}
          className="group flex aspect-square w-52 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg sm:w-64"
        >
          <span className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden bg-zinc-100">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 208px, 256px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="flex h-full items-center justify-center text-xs text-zinc-400">
                Nessuna immagine
              </span>
            )}
          </span>
          <span className="flex min-h-0 flex-1 flex-col justify-center p-3">
            <span className="block truncate text-sm font-bold leading-tight text-ink">
              {category.name}
            </span>
            {category.tagline && (
              <span className="mt-0.5 block truncate text-xs text-zinc-500">
                {category.tagline}
              </span>
            )}
          </span>
        </Link>
      ))}
    </div>
  );
}

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
          className="group relative block h-56 w-44 shrink-0 snap-start overflow-hidden rounded-2xl sm:h-64 sm:w-52"
        >
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 176px, 208px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-zinc-200 text-zinc-400">
              Nessuna immagine
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-base font-bold leading-tight text-white">{category.name}</p>
            <p className="mt-1 text-xs text-white/70">{category.tagline}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
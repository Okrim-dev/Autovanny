import Link from "next/link";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { getLatestCars } from "@/lib/data";
import { formatCurrency, formatMileage } from "@/lib/format";
import { fuelLabel } from "@/lib/labels";

export default async function LatestCars({ limit = 10 }: { limit?: number }) {
  const cars = await getLatestCars(limit);

  if (cars.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Appena arrivate"
          title="Novità"
          subtitle="Le auto che abbiamo appena immesso in parco, pronte per essere viste dal vivo."
        />
        <Link
          href="/showroom?sort=newest"
          className="shrink-0 text-sm font-semibold text-accent transition-colors hover:text-ink"
        >
          Vedi tutte le novità →
        </Link>
      </div>

      <div className="mt-8 -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ul className="flex snap-x snap-mandatory gap-5">
          {cars.map((car) => (
            <li
              key={car.id}
              className="w-[260px] shrink-0 snap-start sm:w-[300px]"
            >
              <Link
                href={`/auto/${car.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-zinc-100">
                  {car.images[0] ? (
                    <Image
                      src={car.images[0]}
                      alt={`${car.brand} ${car.model}`}
                      fill
                      sizes="300px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-zinc-300">
                      Nessuna immagine
                    </span>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {car.year}
                  </span>
                </span>

                <span className="flex flex-1 flex-col gap-2 p-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    {car.brand}
                  </span>
                  <span className="text-base font-semibold leading-snug text-ink">
                    {car.model}
                    {car.trim ? ` ${car.trim}` : ""}
                  </span>
                  <span className="mt-auto text-lg font-bold text-ink">
                    {formatCurrency(car.price)}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {formatMileage(car.mileage)} · {fuelLabel(car.fuel)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

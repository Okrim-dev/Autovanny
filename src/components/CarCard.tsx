import Link from "next/link";
import Image from "next/image";
import type { Car } from "@/lib/types";
import { formatCurrency, formatMileage } from "@/lib/format";
import { fuelLabel, transmissionLabel } from "@/lib/labels";

function SpecIcon({ name }: { name: string }) {
  const common = "h-4 w-4 text-zinc-400";
  switch (name) {
    case "year":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
        </svg>
      );
    case "mileage":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 3" strokeLinecap="round" />
        </svg>
      );
    case "fuel":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 21V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v16" strokeLinecap="round" />
          <path d="M9 8h3" strokeLinecap="round" />
          <path d="M14 8h1a2 2 0 0 1 2 2v6a2 2 0 0 0 4 0V11l-2.5-2.5" strokeLinecap="round" />
        </svg>
      );
    case "transmission":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="6" cy="6" r="2" />
          <circle cx="6" cy="18" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M6 8v8M8 6h8M8 18h8" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function Spec({ name, label, value }: { name: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <SpecIcon name={name} />
      <span className="truncate text-sm text-zinc-700">{value}</span>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default function CarCard({ car }: { car: Car }) {
  const image = car.images[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg">
      <Link
        href={`/auto/${car.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-zinc-100"
      >
        {image ? (
          <Image
            src={image}
            alt={`${car.title} ${car.trim}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300">
            Nessuna immagine
          </div>
        )}
        {car.certified && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            Certificato
          </span>
        )}
        {car.rental && (
          <span className={`absolute ${car.certified ? "left-3 top-12" : "left-3 top-3"} rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white`}>
            Noleggio
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            {car.trim}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-ink">
            <Link href={`/auto/${car.slug}`} className="transition-colors hover:text-accent">
              {car.title}
            </Link>
          </h3>
        </div>

        <p className="text-xl font-bold text-ink">{formatCurrency(car.price)}</p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line pt-4">
          <Spec name="year" label="Anno" value={String(car.year)} />
          <Spec name="mileage" label="Kilometraggio" value={formatMileage(car.mileage)} />
          <Spec name="fuel" label="Carburante" value={fuelLabel(car.fuel)} />
          <Spec
            name="transmission"
            label="Cambio"
            value={transmissionLabel(car.transmission)}
          />
        </div>

        <Link
          href={`/auto/${car.slug}`}
          className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-accent"
        >
          Vedi dettagli
        </Link>
      </div>
    </article>
  );
}
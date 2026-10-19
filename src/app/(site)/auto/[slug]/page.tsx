import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";
import BackButton from "@/components/BackButton";
import { getCarBySlug } from "@/lib/data";
import {
  formatConsumption,
  formatCurrency,
  formatDisplacement,
  formatMileage,
  formatNumber,
  formatPower,
  parseEngineDisplacement,
} from "@/lib/format";
import {
  bodyStyleLabel,
  conditionLabel,
  fuelLabel,
  transmissionLabel,
} from "@/lib/labels";
import { siteConfig, telHref, whatsappHref } from "@/lib/site";

export async function generateMetadata(
  props: PageProps<"/auto/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const car = await getCarBySlug(slug);
  return {
    title: car ? `${car.year} ${car.title}` : "Veicolo",
    description: car?.description ?? undefined,
  };
}

export default function CarDetailPage(props: PageProps<"/auto/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <CarDetail params={props.params} />
    </Suspense>
  );
}

async function CarDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const car = await getCarBySlug(slug);

  if (!car) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">Veicolo non trovato</h1>
        <p className="mt-3 text-sm text-zinc-500">
          Il veicolo che stai cercando non è più disponibile.
        </p>
        <Link
          href="/showroom"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-ink"
        >
          Torna allo showroom
        </Link>
      </div>
    );
  }

  const displacement = car.displacement ?? parseEngineDisplacement(car.engine);
  const standardFeatures = (car.standard_features ?? []).filter(Boolean);
  const accessories = (car.accessories ?? []).filter(Boolean);

  const specs: { label: string; value: string }[] = [
    { label: "Marca", value: car.brand },
    { label: "Modello", value: car.model },
    { label: "Anno", value: String(car.year) },
    { label: "Alimentazione", value: fuelLabel(car.fuel) },
    { label: "Categoria", value: car.category_name ?? bodyStyleLabel(car.body_style) },
    { label: "Cilindrata", value: displacement ? formatDisplacement(displacement) : "—" },
    { label: "Kilometraggio", value: formatMileage(car.mileage) },
    { label: "Condizione", value: conditionLabel(car.condition) },
    { label: "Cambio", value: transmissionLabel(car.transmission) },
  ];
  if (car.bhp) specs.push({ label: "Potenza (CV)", value: formatPower(car.bhp) });
  if (car.trim) specs.push({ label: "Allestimento", value: car.trim });
  if (car.rental) specs.push({ label: "Noleggio", value: "Disponibile" });
  specs.push({ label: "Prezzo", value: formatCurrency(car.price) });
  if (car.km_per_l && car.fuel !== "Electric") {
    specs.push({ label: "Consumo combinato", value: formatConsumption(car.km_per_l) });
  }

  const whatsappUrl = whatsappHref(
    `Ciao ${siteConfig.name}, sono interessato/a alla ${car.brand} ${car.model} (${car.year}, ${formatNumber(car.mileage)} km) a ${formatCurrency(car.price)}. È ancora disponibile?`
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <BackButton fallback="/showroom" />
      </div>

      <nav
        className="flex items-center gap-2 text-sm text-zinc-500"
        aria-label="Percorso di navigazione"
      >
        <Link href="/showroom" className="transition-colors hover:text-ink">
          Showroom
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/showroom?brand=${encodeURIComponent(car.brand)}`} className="transition-colors hover:text-ink">
          {car.brand}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-700">{car.title}</span>
      </nav>

      <div className="mt-8 grid items-start gap-10 lg:grid-cols-2">
        <ImageGallery images={car.images} alt={`${car.year} ${car.title}`} />

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              {car.certified && (
                <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Certificato Premium
                </span>
              )}
              {car.rental && (
                <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
                  Disponibile a noleggio
                </span>
              )}
              <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-zinc-600">
                {car.year} · {car.brand}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {car.year} {car.title}
            </h1>
            <p className="mt-2 text-base text-zinc-500">{car.trim}</p>
          </div>

          <div>
            <p className="text-4xl font-bold tracking-tight text-ink">
              {formatCurrency(car.price)}
            </p>
            {car.monthly_note && (
              <p className="mt-1 text-sm text-zinc-500">{car.monthly_note}</p>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Specifiche principali
            </h2>
            <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt className="text-xs text-zinc-400">{spec.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-ink">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-green-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-ink"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M20.5 3.5A11.8 11.8 0 0 0 12.05 0C5.5 0 .2 5.3.2 11.85c0 2.1.55 4.1 1.6 5.9L0 24l6.4-1.7a11.9 11.9 0 0 0 5.65 1.45h.05c6.55 0 11.85-5.3 11.85-11.85 0-3.17-1.23-6.15-3.45-8.4zM12.1 21.7h-.04a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.8 1 1.02-3.7-.24-.38a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 7c0 5.46-4.44 9.9-9.88 9.9zm5.42-7.42c-.3-.15-1.76-.87-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.53.07-.8.38-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.5.71.3 1.26.48 1.7.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
              </svg>
              Contattaci su whatsapp
            </a>
            <a
              href={telHref(siteConfig.contact.phone)}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h1.8a1.5 1.5 0 0 1 1.45 1.1l.7 2.6a1.5 1.5 0 0 1-.55 1.6L8.9 9.4a12 12 0 0 0 5.7 5.7l1.1-1.55a1.5 1.5 0 0 1 1.6-.55l2.6.7A1.5 1.5 0 0 1 21 16.2V18a2.5 2.5 0 0 1-2.5 2.5C10.5 20.5 3.5 13.5 3.5 6A2.5 2.5 0 0 1 4.5 5.5z" strokeLinejoin="round" />
              </svg>
              Chiama ora
            </a>
          </div>

          <p className="text-center text-xs text-zinc-400">
            Acconto di {formatCurrency(car.deposit ?? siteConfig.deposit)}{" "}
            completamente rimborsabile per bloccare questo veicolo
          </p>
        </div>
      </div>

      {car.description && (
        <section className="mt-14 rounded-2xl border border-line bg-white p-8">
          <h2 className="text-lg font-semibold text-ink">Su questo veicolo</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">{car.description}</p>
        </section>
      )}

      {standardFeatures.length > 0 && (
        <section className="mt-8 rounded-2xl border border-line bg-white p-8">
          <h2 className="text-lg font-semibold text-ink">Dotazioni di serie</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {standardFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-zinc-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                >
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </section>
      )}

      {accessories.length > 0 && (
        <section className="mt-8 rounded-2xl border border-line bg-white p-8">
          <h2 className="text-lg font-semibold text-ink">Accessori</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {accessories.map((accessory) => (
              <li key={accessory} className="flex items-start gap-2.5 text-sm text-zinc-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
                {accessory}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse rounded-2xl bg-zinc-200" />
        <div className="space-y-5">
          <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
          <div className="h-10 w-64 animate-pulse rounded bg-zinc-200" />
          <div className="h-9 w-48 animate-pulse rounded bg-zinc-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-zinc-200" />
          <div className="h-12 animate-pulse rounded-full bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}
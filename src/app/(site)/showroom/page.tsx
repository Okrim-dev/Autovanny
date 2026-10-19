import { Suspense } from "react";
import CarCard from "@/components/CarCard";
import FiltersSidebar from "@/components/FiltersSidebar";
import SortSelect from "@/components/SortSelect";
import Pagination from "@/components/Pagination";
import { getCarCategories, getCars, getFilterOptions, parseCarFilters } from "@/lib/data";
import { bricks } from "@/lib/site";

function toUrlSearchParams(
  record: Record<string, string | string[] | undefined>
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, v));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  }
  return params;
}

export default function ShowroomPage(props: PageProps<"/showroom">) {
  return (
    <Suspense fallback={<ShowroomSkeleton />}>
      <ShowroomContent searchParams={props.searchParams} />
    </Suspense>
  );
}

async function ShowroomContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const record = await searchParams;
  const filters = parseCarFilters(toUrlSearchParams(record));
  const [results, categories, options] = await Promise.all([
    getCars(filters, bricks.perPage),
    getCarCategories(),
    getFilterOptions(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 border-b border-line pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Showroom</h1>
        <p className="text-sm text-zinc-500">
          {results.total} {results.total === 1 ? "veicolo" : "veicoli"} in evidenza
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div>
          <FiltersSidebar brands={results.brands} categories={categories} options={options} />
        </div>

        <div>
          <div className="flex items-center justify-end">
            <SortSelect />
          </div>

          {results.cars.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-line bg-white p-12 text-center">
              <p className="text-lg font-semibold text-ink">
                Nessun veicolo corrisponde alla ricerca
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Prova a rimuovere alcuni filtri oppure a azzerarli qui sotto.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {results.cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              <Pagination page={results.page} totalPages={results.total_pages} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ShowroomSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-9 w-48 animate-pulse rounded bg-zinc-200" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="h-[420px] animate-pulse rounded-2xl bg-zinc-200" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-zinc-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
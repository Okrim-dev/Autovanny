"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CarCategory } from "@/lib/categories";
import type { FilterOptions } from "@/lib/types";
import {
  CONDITION_OPTIONS,
  FUEL_OPTIONS,
  TRANSMISSION_OPTIONS,
  fuelOptionLabel,
  transmissionOptionLabel,
} from "@/lib/labels";

interface FiltersSidebarProps {
  brands: { brand: string; count: number }[];
  categories?: CarCategory[];
  options?: FilterOptions;
}

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent";

function Select({
  label,
  param,
  placeholder,
  values,
}: {
  label: string;
  param: string;
  placeholder: string;
  values: { value: string; label: string }[];
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = searchParams.get(param) ?? "";

  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</span>
      <select
        value={active}
        onChange={(e) => {
          const value = e.target.value;
          const params = new URLSearchParams(searchParams.toString());
          if (value) params.set(param, value);
          else params.delete(param);
          params.delete("page");
          const query = params.toString();
          router.push(query ? `${pathname}?${query}` : pathname);
        }}
        className={`${inputClass} mt-3`}
      >
        <option value="">{placeholder}</option>
        {values.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function FiltersSidebar({
  brands,
  categories = [],
  options,
}: FiltersSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(updater: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const selectedBrands = searchParams.getAll("brand");
  const certified = searchParams.get("certified") === "true";
  const rental = searchParams.get("rental") === "true";
  const [priceMin, priceMax] = [
    searchParams.get("price_min") ?? "",
    searchParams.get("price_max") ?? "",
  ];

  function toggleBrand(brand: string) {
    update((params) => {
      const current = params.getAll("brand");
      const next = current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand];
      params.delete("brand");
      next.forEach((b) => params.append("brand", b));
    });
  }

  const modelValues = (options?.models ?? []).map((value) => ({ value, label: value }));
  const transmissionValues = (options?.transmissions ?? []).map((value) => ({
    value,
    label: transmissionOptionLabel(value),
  }));
  const fuelValues = (options?.fuels ?? []).map((value) => ({
    value,
    label: fuelOptionLabel(value),
  }));
  const conditionMap = new Map<string, string>();
  CONDITION_OPTIONS.forEach((option) => conditionMap.set(option.value, option.label));
  (options?.conditions ?? []).forEach((value) => {
    if (!conditionMap.has(value)) conditionMap.set(value, value);
  });
  const conditionValues = [...conditionMap].map(([value, label]) => ({ value, label }));

  return (
    <aside className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink">Filtri</h2>
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="text-xs font-medium text-accent transition-colors hover:text-ink"
        >
          Azzera tutto
        </button>
      </div>

      <div className="mt-6 space-y-7">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Marca</h3>
          <ul className="mt-3 space-y-2">
            {brands.map(({ brand, count }) => (
              <li key={brand}>
                <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="h-4 w-4 rounded border-line accent-accent"
                  />
                  <span className="flex-1">{brand}</span>
                  <span className="text-xs text-zinc-400">({count})</span>
                </label>
              </li>
            ))}
            {brands.length === 0 && <li className="text-sm text-zinc-400">Nessuna marca</li>}
          </ul>
        </section>

        <Select label="Modello" param="model" placeholder="Tutti i modelli" values={modelValues} />

        <Select
          label="Cambio"
          param="transmission"
          placeholder="Tutti i cambi"
          values={
            transmissionValues.length > 0
              ? transmissionValues
              : TRANSMISSION_OPTIONS
          }
        />

        <Select
          label="Alimentazione"
          param="fuel"
          placeholder="Tutte le alimentazioni"
          values={fuelValues.length > 0 ? fuelValues : FUEL_OPTIONS}
        />

        {categories.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Categoria
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = searchParams.get(category.filter.key) === category.filter.value;
                return (
                  <button
                    key={category.slug}
                    type="button"
                    onClick={() =>
                      update((params) => {
                        if (active) params.delete(category.filter.key);
                        else params.set(category.filter.key, category.filter.value);
                      })
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-accent bg-accent text-white"
                        : "border-line text-zinc-600 hover:border-accent hover:text-accent"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <Select
          label="Condizione"
          param="condition"
          placeholder="Tutte le condizioni"
          values={conditionValues}
        />

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Noleggio
          </h3>
          <label className="mt-3 flex cursor-pointer items-center gap-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={rental}
              onChange={() =>
                update((params) => {
                  if (rental) params.delete("rental");
                  else params.set("rental", "true");
                })
              }
              className="h-4 w-4 rounded border-line accent-accent"
            />
            <span className="flex-1">Solo veicoli a noleggio</span>
          </label>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Fascia di prezzo
          </h3>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              defaultValue={priceMin}
              onChange={(e) => {
                const value = e.target.value;
                update((params) => {
                  if (value) params.set("price_min", value);
                  else params.delete("price_min");
                });
              }}
              className={inputClass}
            />
            <span className="text-zinc-400">–</span>
            <input
              type="number"
              placeholder="Max"
              defaultValue={priceMax}
              onChange={(e) => {
                const value = e.target.value;
                update((params) => {
                  if (value) params.set("price_max", value);
                  else params.delete("price_max");
                });
              }}
              className={inputClass}
            />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Anno</h3>
          <select
            defaultValue={searchParams.get("year_from") ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              update((params) => {
                if (value) params.set("year_from", value);
                else params.delete("year_from");
              });
            }}
            className={`${inputClass} mt-3`}
          >
            <option value="">Qualsiasi anno</option>
            {Array.from({ length: 12 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </section>
      </div>
    </aside>
  );
}

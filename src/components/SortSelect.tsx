"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "newest", label: "Più recenti" },
  { value: "price_asc", label: "Prezzo: dal più basso" },
  { value: "price_desc", label: "Prezzo: dal più alto" },
  { value: "year_desc", label: "Anno: dal più recente" },
  { value: "mileage_asc", label: "Kilometraggio: dal più basso" },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "newest") params.set("sort", value);
    else params.delete("sort");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <label className="flex items-center gap-3 text-sm text-zinc-600">
      <span className="whitespace-nowrap">Ordina per:</span>
      <select
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-accent"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FUEL_OPTIONS, TRANSMISSION_OPTIONS } from "@/lib/labels";

const YEARS = Array.from({ length: 22 }, (_, i) => new Date().getFullYear() - i);

interface SearchBarProps {
  brands: string[];
}

export default function SearchBar({ brands }: SearchBarProps) {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [tipologia, setTipologia] = useState("");
  const [alimentazione, setAlimentazione] = useState("");
  const [cambio, setCambio] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [result, setResult] = useState<{ key: string; total: number } | null>(null);
  const [failed, setFailed] = useState(false);
  const requestRef = useRef(0);
  const modelsCacheRef = useRef(new Map<string, string[]>());

  useEffect(() => {
    const cached = modelsCacheRef.current.get(brand);
    if (cached) {
      setModels(cached);
      setModelsLoading(false);
      return;
    }

    let cancelled = false;
    setModelsLoading(true);

    (async () => {
      try {
        const res = await fetch(`/api/models?brand=${encodeURIComponent(brand)}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { models: string[] };
        if (cancelled) return;
        modelsCacheRef.current.set(brand, data.models);
        setModels(data.models);
      } catch {
        if (!cancelled) setModels([]);
      } finally {
        if (!cancelled) setModelsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [brand]);

  const params = new URLSearchParams();
  if (tipologia) params.set("type", tipologia);
  if (brand) params.set("brand", brand);
  if (model) params.set("model", model);
  if (alimentazione) params.set("fuel", alimentazione);
  if (cambio) params.set("transmission", cambio);
  if (yearFrom) params.set("year_from", yearFrom);
  const queryString = params.toString();

  useEffect(() => {
    const current = ++requestRef.current;
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-count?${queryString}`, { cache: "no-store" });
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { total: number };
        if (!cancelled && requestRef.current === current) {
          setResult({ key: queryString, total: data.total });
          setFailed(false);
        }
      } catch {
        if (!cancelled && requestRef.current === current) setFailed(true);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [queryString]);

  const done = result !== null && result.key === queryString;
  const statusText = failed
    ? "Conteggio non disponibile al momento."
    : done
      ? result!.total === 0
        ? "Nessun veicolo corrisponde ai filtri selezionati."
        : result!.total === 1
          ? "1 veicolo trovato con questi filtri."
          : `${result!.total} veicoli trovati con questi filtri.`
      : result
        ? "Aggiorno il numero di risultati…"
        : "Seleziona i filtri per vedere quanti veicoli troviamo.";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/showroom?${queryString}`);
  }

  const selectClass =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-accent";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-white p-5 shadow-xl shadow-ink/5"
    >
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Tipologia
          </span>
          <select
            value={tipologia}
            onChange={(e) => setTipologia(e.target.value)}
            className={selectClass}
          >
            <option value="">Tutte</option>
            <option value="autovettura">Autovettura</option>
            <option value="autocarro">Autocarro</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Marca</span>
          <select
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setModel("");
            }}
            className={selectClass}
          >
            <option value="">Tutte le marche</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Modello</span>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={modelsLoading}
            className={selectClass}
          >
            <option value="">
              {modelsLoading ? "Caricamento modelli…" : "Tutti i modelli"}
            </option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Alimentazione
          </span>
          <select
            value={alimentazione}
            onChange={(e) => setAlimentazione(e.target.value)}
            className={selectClass}
          >
            <option value="">Tutto</option>
            {FUEL_OPTIONS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Cambio
          </span>
          <select value={cambio} onChange={(e) => setCambio(e.target.value)} className={selectClass}>
            <option value="">Tutto</option>
            {TRANSMISSION_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Immatricolazione da
          </span>
          <select value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} className={selectClass}>
            <option value="">Qualsiasi anno</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500" aria-live="polite">
          {statusText}
        </p>
        <button
          type="submit"
          className="h-12 w-full shrink-0 rounded-xl bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-ink sm:w-auto"
        >
          Mostra risultati
        </button>
      </div>
    </form>
  );
}

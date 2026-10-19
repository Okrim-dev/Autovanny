"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Car, Category } from "@/lib/types";
import { deleteVehicleAction, saveVehicleAction } from "@/app/admin/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import PointListEditor from "@/components/admin/PointListEditor";
import { formatCurrency, formatNumber } from "@/lib/format";
import { CONDITION_OPTIONS } from "@/lib/labels";

const EMPTY_FORM = {
  brand: "",
  model: "",
  trim: "",
  title: "",
  year: "",
  mileage: "",
  price: "",
  fuel: "Petrol",
  transmission: "Automatic",
  body_style: "",
  category_id: "",
  condition: "Usato",
  engine: "",
  displacement: "",
  bhp: "",
  km_per_l: "",
  exterior_color: "",
  description: "",
  certified: false,
  featured: false,
  rental: false,
  stock: true,
};

type FormState = typeof EMPTY_FORM;

const FUELS = [
  { value: "Petrol", label: "Benzina" },
  { value: "Diesel", label: "Diesel" },
  { value: "Hybrid", label: "Ibrida" },
  { value: "Plug-in Hybrid", label: "Ibrida plug-in" },
  { value: "Electric", label: "Elettrica" },
];

const TRANSMISSIONS = [
  { value: "Automatic", label: "Automatica" },
  { value: "Manual", label: "Manuale" },
];

const BODY_STYLES = [
  { value: "Saloon", label: "Berlina" },
  { value: "SUV", label: "SUV" },
  { value: "Estate", label: "Familiare" },
  { value: "Coupe", label: "Coupé" },
  { value: "Convertible", label: "Cabriolet" },
  { value: "Hatchback", label: "Utilitaria" },
];

const PER_PAGE = 5;

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

export default function AdminVehicles({
  cars,
  categories = [],
}: {
  cars: Car[];
  categories?: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [images, setImages] = useState<string[]>([]);
  const [standardFeatures, setStandardFeatures] = useState<string[]>([]);
  const [accessories, setAccessories] = useState<string[]>([]);
  const [hasAccessories, setHasAccessories] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cars;
    return cars.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
    );
  }, [cars, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const conditionOptions = useMemo(() => {
    if (form.condition && !CONDITION_OPTIONS.some((o) => o.value === form.condition)) {
      return [...CONDITION_OPTIONS, { value: form.condition, label: form.condition }];
    }
    return CONDITION_OPTIONS;
  }, [form.condition]);

  function notify(type: "ok" | "error", text: string) {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(car: Car) {
    setEditingId(car.id);
    setForm({
      brand: car.brand,
      model: car.model,
      trim: car.trim ?? "",
      title: car.title,
      year: String(car.year),
      mileage: String(car.mileage),
      price: String(car.price),
      fuel: car.fuel,
      transmission: car.transmission,
      body_style: car.body_style ?? "",
      category_id: car.category_id ?? "",
      condition: car.condition ?? "Usato",
      engine: car.engine ?? "",
      displacement: car.displacement ? String(car.displacement) : "",
      bhp: car.bhp ? String(car.bhp) : "",
      km_per_l: car.km_per_l ? String(car.km_per_l) : "",
      exterior_color: car.exterior_color ?? "",
      description: car.description ?? "",
      certified: car.certified,
      featured: car.featured,
      rental: car.rental ?? false,
      stock: car.stock,
    });
    setImages(car.images ?? []);
    setStandardFeatures(car.standard_features ?? []);
    setAccessories(car.accessories ?? []);
    setHasAccessories((car.accessories ?? []).length > 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImages([]);
    setStandardFeatures([]);
    setAccessories([]);
    setHasAccessories(false);
    setEditingId(null);
  }

  async function handleSave() {
    const payload = {
      id: editingId,
      brand: form.brand,
      model: form.model,
      trim: form.trim || null,
      title: form.title || null,
      year: Number(form.year),
      price: Number(form.price),
      mileage: Number(form.mileage) || 0,
      fuel: form.fuel,
      transmission: form.transmission,
      body_style: form.body_style || null,
      category_id: form.category_id || null,
      condition: form.condition || "Usato",
      engine: form.engine || null,
      displacement: form.displacement ? Number(form.displacement) : null,
      bhp: form.bhp ? Number(form.bhp) : null,
      km_per_l: form.km_per_l ? Number(form.km_per_l) : null,
      certified: form.certified,
      featured: form.featured,
      rental: form.rental,
      stock: form.stock,
      description: form.description || null,
      exterior_color: form.exterior_color || null,
      images,
      standard_features: standardFeatures,
      accessories: hasAccessories ? accessories : [],
    };

    startTransition(async () => {
      const res = await saveVehicleAction(payload);
      if (res.ok) {
        notify("ok", editingId ? "Veicolo aggiornato." : "Veicolo aggiunto al parco auto.");
        resetForm();
        router.refresh();
      } else {
        notify("error", res.error ?? "Errore durante il salvataggio.");
      }
    });
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Eliminare "${title}"? L'operazione non è reversibile.`)) return;
    startTransition(async () => {
      const res = await deleteVehicleAction(id);
      if (res.ok) {
        notify("ok", "Veicolo eliminato.");
        router.refresh();
      } else {
        notify("error", res.error ?? "Errore durante l'eliminazione.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Gestione Parco Auto</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Aggiungi, modifica o rimuovi i veicoli disponibili in concessionaria.
          </p>
        </div>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
          >
            Annulla modifica
          </button>
        )}
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border-accent/20 bg-accent-soft text-accent"
          }`}
        >
          {message.text}
        </div>
      )}

      <section className="rounded-2xl border border-line bg-white">
        <div className="border-b border-line px-6 py-5">
          <h2 className="text-lg font-bold text-ink">
            {editingId ? "Modifica Veicolo" : "Nuovo Veicolo"}
          </h2>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Marca</label>
              <input
                value={form.brand}
                onChange={(e) => set("brand", e.target.value)}
                placeholder="es. Audi"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Modello</label>
              <input
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                placeholder="es. Q3 Sportback"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Allestimento <span className="text-zinc-400">(opzionale)</span>
              </label>
              <input
                value={form.trim}
                onChange={(e) => set("trim", e.target.value)}
                placeholder="es. S line S Tronic"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Titolo <span className="text-zinc-400">(opzionale)</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="auto-generato da marca e modello"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Immagini del Veicolo</label>
            <ImageUploader images={images} onChange={setImages} bucket="vehicle-images" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Anno</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => set("year", e.target.value)}
                placeholder="es. 2022"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Chilometraggio (km)</label>
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => set("mileage", e.target.value)}
                placeholder="es. 45000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Prezzo (€)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="es. 35000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Motore</label>
              <input
                value={form.engine}
                onChange={(e) => set("engine", e.target.value)}
                placeholder="es. 2.0 TDI"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Cilindrata (cc) <span className="text-zinc-400">(opzionale)</span>
              </label>
              <input
                type="number"
                value={form.displacement}
                onChange={(e) => set("displacement", e.target.value)}
                placeholder="es. 1968"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Alimentazione</label>
              <select value={form.fuel} onChange={(e) => set("fuel", e.target.value)} className={inputClass}>
                {FUELS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Trasmissione</label>
              <select
                value={form.transmission}
                onChange={(e) => set("transmission", e.target.value)}
                className={inputClass}
              >
                {TRANSMISSIONS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Carrozzeria</label>
              <select
                value={form.body_style}
                onChange={(e) => set("body_style", e.target.value)}
                className={inputClass}
              >
                <option value="">Seleziona…</option>
                {BODY_STYLES.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Condizione</label>
              <select
                value={form.condition}
                onChange={(e) => set("condition", e.target.value)}
                className={inputClass}
              >
                {conditionOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Categoria</label>
              <select
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className={inputClass}
              >
                <option value="">Nessuna categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="mt-1 text-xs text-zinc-400">
                  Crea le categorie in “Categorie” nel menu admin.
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Colore esterno</label>
              <input
                value={form.exterior_color}
                onChange={(e) => set("exterior_color", e.target.value)}
                placeholder="es. Daytona Grey"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Potenza (CV)</label>
              <input
                type="number"
                value={form.bhp}
                onChange={(e) => set("bhp", e.target.value)}
                placeholder="es. 204"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Consumi (km/l) <span className="text-zinc-400">(opzionale)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={form.km_per_l}
                onChange={(e) => set("km_per_l", e.target.value)}
                placeholder="es. 15.5"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Descrizione</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Descrivi il veicolo, i suoi punti di forza e gli optional."
              className={inputClass}
            />
          </div>

          <div className="rounded-xl border border-line bg-zinc-50/60 p-5">
            <PointListEditor
              items={standardFeatures}
              onChange={setStandardFeatures}
              label="Dotazioni di serie"
              placeholder="es. Fari a LED adattivi"
              addLabel="Aggiungi dotazione"
              emptyLabel="Nessuna dotazione inserita."
            />
            <div className="mt-5 border-t border-line pt-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={hasAccessories}
                  onChange={(e) => setHasAccessories(e.target.checked)}
                  className="h-4 w-4 accent-accent"
                />
                Accessori <span className="text-zinc-400">(a pagamento)</span>
              </label>
              {hasAccessories && (
                <div className="mt-4">
                  <PointListEditor
                    items={accessories}
                    onChange={setAccessories}
                    label="Elenco accessori"
                    placeholder="es. Tetto apribile panoramico"
                    addLabel="Aggiungi accessorio"
                    emptyLabel="Nessun accessorio inserito."
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.certified}
                onChange={(e) => set("certified", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Certificata (150 punti)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              In evidenza
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.rental}
                onChange={(e) => set("rental", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Disponibile a noleggio
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.stock}
                onChange={(e) => set("stock", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Online (visibile sul sito)
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line pt-5">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-zinc-300"
            >
              Annulla
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Salvataggio…" : editingId ? "Salva Modifiche" : "Salva Veicolo"}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Veicoli in Vendita</h2>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cerca veicolo..."
            className="w-full rounded-lg border border-line bg-zinc-50 px-3 py-2 text-sm text-ink placeholder:text-zinc-400 outline-none focus:border-accent sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-6 py-3 font-medium">Veicolo</th>
                <th className="px-6 py-3 font-medium">Specifiche</th>
                <th className="px-6 py-3 font-medium">Prezzo</th>
                <th className="px-6 py-3 font-medium">Stato</th>
                <th className="px-6 py-3 text-right font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {pageRows.map((car) => (
                <tr key={car.id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={car.images?.[0]}
                        alt=""
                        className="h-12 w-16 shrink-0 rounded-lg object-cover ring-1 ring-line"
                      />
                      <div>
                        <p className="font-semibold text-ink">{car.title}</p>
                        <p className="text-xs text-zinc-400">{car.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">
                    {car.year} · {formatNumber(car.mileage)} km
                    <br />
                    <span className="text-xs text-zinc-400">
                      {car.fuel} · {car.transmission}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-ink">{formatCurrency(car.price)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                        car.stock
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                          : "bg-zinc-100 text-zinc-500 ring-zinc-200"
                      }`}
                    >
                      {car.stock ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(car)}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-accent hover:text-accent"
                      >
                        Modifica
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(car.id, car.title)}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent hover:text-white"
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-500">
                    Nessun veicolo trovato.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-line px-6 py-4 text-sm text-zinc-500">
          <p>
            Mostrando {filtered.length === 0 ? 0 : (current - 1) * PER_PAGE + 1}-
            {Math.min(current * PER_PAGE, filtered.length)} di {filtered.length} veicoli
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current <= 1}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Precedente
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={current >= totalPages}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              Successivo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

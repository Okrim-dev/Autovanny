"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import { deleteCategoryAction, saveCategoryAction } from "@/app/admin/actions";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY_FORM = {
  name: "",
  tagline: "",
  position: "0",
  visible: true,
};

type FormState = typeof EMPTY_FORM;

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

export default function AdminCategories({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [image, setImage] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  function notify(type: "ok" | "error", text: string) {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(category: Category) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      tagline: category.tagline ?? "",
      position: String(category.position ?? 0),
      visible: category.visible,
    });
    setImage(category.image ? [category.image] : []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setImage([]);
    setEditingId(null);
  }

  async function handleSave() {
    startTransition(async () => {
      const res = await saveCategoryAction({
        id: editingId,
        name: form.name,
        tagline: form.tagline || null,
        image: image[0] ?? null,
        position: Number(form.position) || 0,
        visible: form.visible,
      });
      if (res.ok) {
        notify("ok", editingId ? "Categoria aggiornata." : "Categoria creata.");
        resetForm();
        router.refresh();
      } else {
        notify("error", res.error ?? "Errore durante il salvataggio.");
      }
    });
  }

  async function handleDelete(id: string, name: string) {
    if (
      !window.confirm(
        `Eliminare la categoria "${name}"? I veicoli associati restano online senza categoria.`
      )
    )
      return;
    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res.ok) {
        notify("ok", "Categoria eliminata.");
        router.refresh();
      } else {
        notify("error", res.error ?? "Errore durante l'eliminazione.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Categorie Veicoli</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Crea le categorie che raggruppano le auto: compaiono nei filtri del parco auto e nelle
          anteprime della home.
        </p>
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
            {editingId ? "Modifica Categoria" : "Nuova Categoria"}
          </h2>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Nome</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="es. SUV"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Descrizione <span className="text-zinc-400">(opzionale)</span>
              </label>
              <input
                value={form.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                placeholder="es. Presenza imponente"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Ordine</label>
              <input
                type="number"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="es. 1"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Immagine <span className="text-zinc-400">(opzionale)</span>
            </label>
            <ImageUploader
              images={image}
              onChange={(images) => setImage(images.slice(-1))}
              bucket="vehicle-images"
              hint="Una sola immagine: verrà usata come copertina della categoria."
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => set("visible", e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Visibile sul sito
          </label>

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
              {isPending ? "Salvataggio…" : editingId ? "Salva Modifiche" : "Crea Categoria"}
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Categorie esistenti</h2>
        </div>

        {categories.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-zinc-500">
            Nessuna categoria creata. Le categorie che crei qui compaiono nella home e nei filtri
            del parco auto: non ce ne sono di predefinite.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {categories.map((category) => (
              <li key={category.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt=""
                    className="h-14 w-20 shrink-0 rounded-lg object-cover ring-1 ring-line"
                  />
                ) : (
                  <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs text-zinc-400">
                    Nessuna foto
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{category.name}</p>
                  <p className="truncate text-xs text-zinc-400">
                    /showroom?category={category.slug}
                    {category.tagline ? ` · ${category.tagline}` : ""}
                  </p>
                </div>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                    category.visible
                      ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                      : "bg-zinc-100 text-zinc-500 ring-zinc-200"
                  }`}
                >
                  {category.visible ? "Visibile" : "Nascosta"}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-accent hover:text-accent"
                  >
                    Modifica
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category.id, category.name)}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent hover:text-white"
                  >
                    Elimina
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

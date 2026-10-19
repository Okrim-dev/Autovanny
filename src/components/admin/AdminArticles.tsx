"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/lib/types";
import { deleteArticleAction, saveArticleAction } from "@/app/admin/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import { formatDate } from "@/lib/format";

const CATEGORIES = [
  "Recensioni Veicoli",
  "Guide e Consigli",
  "News",
  "Financing",
  "Manutenzione",
  "Valutazione",
];

const EMPTY_FORM = {
  title: "",
  category: "",
  published_at: "",
  author: "",
  excerpt: "",
  content: "",
  visible: true,
};

type FormState = typeof EMPTY_FORM;

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

export default function AdminArticles({ articles }: { articles: Article[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [cover, setCover] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const stats = useMemo(
    () => ({
      total: articles.length,
      published: articles.filter((a) => a.visible).length,
      drafts: articles.filter((a) => !a.visible).length,
      draftsList: articles.filter((a) => !a.visible).slice(0, 4),
    }),
    [articles]
  );

  function notify(type: "ok" | "error", text: string) {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 4000);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(article: Article) {
    setEditingId(article.id);
    setForm({
      title: article.title,
      category: article.category ?? "",
      published_at: article.published_at ? article.published_at.slice(0, 10) : "",
      author: article.author ?? "",
      excerpt: article.excerpt ?? "",
      content: article.content ?? "",
      visible: article.visible,
    });
    setCover(article.cover_image ? [article.cover_image] : []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setCover([]);
    setEditingId(null);
  }

  async function handleSave() {
    const payload = {
      id: editingId,
      title: form.title,
      category: form.category || null,
      published_at: form.published_at || null,
      author: form.author || null,
      excerpt: form.excerpt || null,
      content: form.content || null,
      cover_image: cover[0] ?? null,
      visible: form.visible,
    };

    startTransition(async () => {
      const res = await saveArticleAction(payload);
      if (res.ok) {
        notify("ok", editingId ? "Articolo aggiornato." : "Articolo salvato.");
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
      const res = await deleteArticleAction(id);
      if (res.ok) {
        notify("ok", "Articolo eliminato.");
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
          <h1 className="text-2xl font-bold tracking-tight text-ink">Gestione Articoli Blog</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Crea, modifica e monitora le performance delle tue pubblicazioni.
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-white lg:col-span-2">
          <div className="border-b border-line px-6 py-5">
            <h2 className="text-lg font-bold text-ink">
              {editingId ? "Modifica Articolo" : "Nuovo Articolo"}
            </h2>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Titolo Articolo</label>
              <input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Es. I vantaggi delle auto ibride premium"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Categoria</label>
                <input
                  list="admin-categories"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="Es. Recensioni Veicoli"
                  className={inputClass}
                />
                <datalist id="admin-categories">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Data Pubblicazione
                </label>
                <input
                  type="date"
                  value={form.published_at}
                  onChange={(e) => set("published_at", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Autore</label>
                <input
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                  placeholder="Es. Autovanny Team"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Immagine in Evidenza</label>
              <ImageUploader
                images={cover}
                onChange={setCover}
                bucket="article-images"
                hint="Trascina un'immagine qui o clicca per caricare"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Estratto</label>
              <textarea
                rows={2}
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="Breve riassunto mostrato nell'anteprima."
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Contenuto</label>
              <textarea
                rows={12}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="Inizia a scrivere qui... (paragrafi separati da una riga vuota)"
                className={`${inputClass} font-mono text-[13px] leading-6`}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => set("visible", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Pubblicato (visibile sul blog)
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
                {isPending ? "Salvataggio…" : editingId ? "Salva Modifiche" : "Pubblica Articolo"}
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">Panoramica Blog</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-zinc-50 p-3">
                <p className="text-xl font-bold text-ink">{stats.total}</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">Articoli</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xl font-bold text-emerald-600">{stats.published}</p>
                <p className="mt-0.5 text-[11px] text-emerald-600/70">Pubblicati</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3">
                <p className="text-xl font-bold text-ink">{stats.drafts}</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">Bozze</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white">
            <div className="border-b border-line px-5 py-4">
              <h2 className="text-sm font-semibold text-ink">Bozze Recenti</h2>
            </div>
            <ul className="divide-y divide-line">
              {stats.draftsList.map((article) => (
                <li key={article.id} className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => startEdit(article)}
                    className="text-left transition-colors hover:text-accent"
                  >
                    <p className="line-clamp-2 text-sm font-medium text-ink">{article.title}</p>
                    <p className="mt-1 text-xs text-zinc-400">Ultima modifica: {formatDate(article.created_at)}</p>
                  </button>
                </li>
              ))}
              {stats.draftsList.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-zinc-500">
                  Nessuna bozza in sospeso.
                </li>
              )}
            </ul>
          </section>
        </aside>
      </div>

      <section className="rounded-2xl border border-line bg-white">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Tutti gli Articoli</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wider text-zinc-400">
                <th className="px-6 py-3 font-medium">Titolo</th>
                <th className="px-6 py-3 font-medium">Categoria</th>
                <th className="px-6 py-3 font-medium">Data</th>
                <th className="px-6 py-3 font-medium">Stato</th>
                <th className="px-6 py-3 text-right font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {article.cover_image && (
                        <img
                          src={article.cover_image}
                          alt=""
                          className="h-11 w-16 shrink-0 rounded-lg object-cover ring-1 ring-line"
                        />
                      )}
                      <p className="max-w-xs font-semibold text-ink">{article.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{article.category ?? "—"}</td>
                  <td className="px-6 py-4 text-zinc-600">{formatDate(article.published_at)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                        article.visible
                          ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                          : "bg-amber-50 text-amber-600 ring-amber-200"
                      }`}
                    >
                      {article.visible ? "Pubblicato" : "Bozza"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(article)}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-accent hover:text-accent"
                      >
                        Modifica
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id, article.title)}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent hover:text-white"
                      >
                        Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {articles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-zinc-500">
                    Nessun articolo scritto ancora.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

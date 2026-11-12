"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Review } from "@/lib/types";
import { deleteReviewAction, saveReviewAction } from "@/app/admin/actions";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

type Message = { type: "ok" | "error"; text: string } | null;

function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (rating: number) => void;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) =>
        onChange ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`${star} stelle`}
            className={`transition-transform hover:scale-110 ${
              star <= value ? "text-amber-400" : "text-zinc-300"
            }`}
          >
            <i className={`${star <= value ? "fas" : "far"} fa-star`} aria-hidden="true" />
          </button>
        ) : (
          <i
            key={star}
            className={`${star <= value ? "fas fa-star text-amber-400" : "far fa-star text-zinc-300"}`}
            aria-hidden="true"
          />
        )
      )}
    </span>
  );
}

export default function AdminReviews({ reviews }: { reviews: Review[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState<Message>(null);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const res = await saveReviewAction({ name, text, rating });
      if (res.ok) {
        setMessage({ type: "ok", text: "Recensione aggiunta." });
        setName("");
        setText("");
        setRating(5);
        router.refresh();
      } else {
        setMessage({ type: "error", text: res.error ?? "Errore durante il salvataggio." });
      }
    });
  }

  function handleDelete(review: Review) {
    if (!window.confirm(`Eliminare la recensione di "${review.name}"?`)) return;
    startTransition(async () => {
      const res = await deleteReviewAction(review.id);
      if (res.ok) {
        setMessage({ type: "ok", text: "Recensione eliminata." });
        router.refresh();
      } else {
        setMessage({ type: "error", text: res.error ?? "Errore durante l'eliminazione." });
      }
    });
  }

  function handleToggle(review: Review) {
    startTransition(async () => {
      const res = await saveReviewAction({
        id: review.id,
        name: review.name,
        text: review.text,
        rating: review.rating,
        visible: !review.visible,
      });
      if (res.ok) router.refresh();
      else setMessage({ type: "error", text: res.error ?? "Errore." });
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Recensioni</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Le recensioni visibili compaiono nello slider della home, prima del footer.
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
          <h2 className="text-lg font-bold text-ink">Nuova recensione</h2>
        </div>
        <form onSubmit={handleSave} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Nome del cliente</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="es. Marco R."
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Valutazione</label>
              <div className="flex h-[42px] items-center gap-3">
                <Stars value={rating} onChange={setRating} />
                <span className="text-sm text-zinc-500">{rating}/5</span>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Recensione</label>
            <textarea
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Scrivi cosa ha vissuto il cliente…"
              required
              className={inputClass}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Salvataggio…" : "Aggiungi Recensione"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-white">
        <div className="border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Recensioni esistenti ({reviews.length})</h2>
        </div>
        <ul className="divide-y divide-line">
          {reviews.map((review) => (
            <li key={review.id} className="flex flex-wrap items-start gap-4 px-6 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-ink">{review.name}</p>
                  <Stars value={review.rating} />
                  {!review.visible && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
                      Nascondi dalla home
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-600">{review.text}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleToggle(review)}
                  disabled={isPending}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-accent hover:text-accent disabled:opacity-50"
                >
                  {review.visible ? "Nascondi" : "Mostra"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(review)}
                  disabled={isPending}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-accent transition hover:bg-accent hover:text-white disabled:opacity-50"
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
          {reviews.length === 0 && (
            <li className="px-6 py-10 text-center text-sm text-zinc-500">
              Nessuna recensione ancora. Aggiungine una qui sopra.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

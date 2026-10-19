"use client";

import { useState } from "react";
import { updatePasswordAction } from "@/app/admin/actions";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

export default function AdminSettings({ userEmail }: { userEmail: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    if (password.length < 8) {
      setMessage({ type: "error", text: "La password deve contenere almeno 8 caratteri." });
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "Le due password non coincidono." });
      return;
    }

    setLoading(true);
    const res = await updatePasswordAction(password);
    setLoading(false);

    if (res.ok) {
      setMessage({ type: "ok", text: "Password aggiornata con successo." });
      setPassword("");
      setConfirm("");
    } else {
      setMessage({ type: "error", text: res.error ?? "Errore durante l'aggiornamento." });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Impostazioni</h1>
        <p className="mt-1 text-sm text-zinc-500">Gestisci il tuo account amministratore.</p>
      </div>

      <div className="grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white">
          <div className="border-b border-line px-6 py-5">
            <h2 className="text-lg font-bold text-ink">Profilo</h2>
          </div>
          <div className="p-6">
            <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
            <input readOnly value={userEmail} className={`${inputClass} bg-zinc-50 text-zinc-500`} />
            <p className="mt-2 text-xs text-zinc-400">
              L&apos;email di accesso non è modificabile da qui.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white">
          <div className="border-b border-line px-6 py-5">
            <h2 className="text-lg font-bold text-ink">Cambia Password</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Nuova password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Almeno 8 caratteri"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Conferma password</label>
              <input
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Ripeti la password"
                className={inputClass}
              />
            </div>

            {message && (
              <p
                className={`rounded-lg border px-3 py-2 text-sm ${
                  message.type === "ok"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                    : "border-accent/20 bg-accent-soft text-accent"
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Salvataggio…" : "Aggiorna Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

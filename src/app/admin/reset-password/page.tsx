"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Phase = "checking" | "form" | "error";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

function friendlyError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("expired") || lower.includes("invalid"))
    return "Il link di recupero non è valido o è scaduto. Richiedine uno nuovo dalla pagina di accesso.";
  if (lower.includes("same as the old password"))
    return "La nuova password deve essere diversa da quella attuale.";
  return message;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("checking");
  const [linkError, setLinkError] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) {
        setPhase("form");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const errorDescription =
        params.get("error_description") ?? params.get("error_code") ?? params.get("error");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setLinkError(friendlyError(error.message));
          setPhase("error");
          return;
        }
        setPhase("form");
        return;
      }

      if (errorDescription) {
        setLinkError(friendlyError(decodeURIComponent(errorDescription)));
        setPhase("error");
        return;
      }

      setLinkError(
        "Link di recupero non valido o scaduto. Richiedine uno nuovo dalla pagina di accesso."
      );
      setPhase("error");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError("La password deve contenere almeno 8 caratteri.");
      return;
    }
    if (password !== confirm) {
      setFormError("Le due password non coincidono.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setFormError(friendlyError(error.message));
        setLoading(false);
        return;
      }
      setDone(true);
      window.setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch {
      setFormError("Errore di rete. Riprova.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #d03732 0, transparent 45%), radial-gradient(circle at 80% 80%, #d03732 0, transparent 45%)",
        }}
      />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center text-white">
          <div className="flex items-center justify-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-lg font-black text-white">
              A
            </span>
            <div className="text-left">
              <p className="text-lg font-bold leading-tight tracking-tight">AutoVanny</p>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-7 shadow-2xl sm:p-8">
          {phase === "checking" && (
            <p className="text-center text-sm text-zinc-500">Verifica del link in corso…</p>
          )}

          {phase === "error" && (
            <div className="space-y-4 text-center">
              <h1 className="text-xl font-bold tracking-tight text-ink">Link non valido</h1>
              <p className="text-sm text-zinc-500">{linkError}</p>
              <Link
                href="/admin/login"
                className="inline-flex rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90"
              >
                Torna al login
              </Link>
            </div>
          )}

          {phase === "form" && (
            <>
              <h1 className="text-xl font-bold tracking-tight text-ink">
                {done ? "Password aggiornata" : "Imposta una nuova password"}
              </h1>
              <p className="mt-1.5 text-sm text-zinc-500">
                {done
                  ? "Stai per essere reindirizzato all'area admin…"
                  : "Scegli una nuova password per il tuo account amministratore."}
              </p>

              {!done && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label
                      htmlFor="new-password"
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      Nuova password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Almeno 8 caratteri"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      Conferma password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Ripeti la password"
                      className={inputClass}
                    />
                  </div>

                  {formError && (
                    <p className="rounded-lg border border-accent/20 bg-accent-soft px-3 py-2 text-sm text-accent">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Salvataggio…" : "Aggiorna password"}
                  </button>
                </form>
              )}

              {done && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600">
                  Password aggiornata con successo.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

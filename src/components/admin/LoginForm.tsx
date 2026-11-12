"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const IT = {
  "Invalid login credentials": "Credenziali non valide. Controlla email e password.",
  "Failed to fetch":
    "Impossibile contattare il server di autenticazione. Verifica la connessione e riprova.",
  "FetchError":
    "Impossibile contattare il server di autenticazione. Verifica la connessione e riprova.",
  "User not found": "Nessun account trovato con questa email.",
  "Email not confirmed":
    "Email non confermata. Controlla la tua casella di posta per confermare l'account.",
} as Record<string, string>;

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<{ type: "ok" | "error"; text: string } | null>(
    null
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setError(IT[signInError.message] ?? signInError.message);
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(IT[message] ?? "Errore di rete durante l'accesso. Riprova.");
      setLoading(false);
    }
  }

  async function handleForgot(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setForgotMessage(null);

    if (!email.trim()) {
      setForgotMessage({ type: "error", text: "Inserisci l'email del tuo account." });
      return;
    }

    setForgotLoading(true);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (resetError) {
        setForgotMessage({
          type: "error",
          text: IT[resetError.message] ?? resetError.message,
        });
      } else {
        setForgotMessage({
          type: "ok",
          text: "Se l'email esiste, hai ricevuto un link di recupero. Controlla anche lo spam.",
        });
      }
    } catch {
      setForgotMessage({
        type: "error",
        text: "Impossibile contattare il server. Riprova più tardi.",
      });
    } finally {
      setForgotLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

  if (mode === "forgot") {
    return (
      <form onSubmit={handleForgot} className="space-y-4">
        <div>
          <label htmlFor="recovery-email" className="mb-1.5 block text-sm font-medium text-ink">
            Email
          </label>
          <input
            id="recovery-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="amministrazione@autovannygroupsrl.it"
            className={inputClass}
          />
          <p className="mt-2 text-xs text-zinc-500">
            Ti invieremo un link per impostare una nuova password.
          </p>
        </div>

        {forgotMessage && (
          <p
            className={`rounded-lg border px-3 py-2 text-sm ${
              forgotMessage.type === "ok"
                ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                : "border-accent/20 bg-accent-soft text-accent"
            }`}
          >
            {forgotMessage.text}
          </p>
        )}

        <button
          type="submit"
          disabled={forgotLoading}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {forgotLoading ? "Invio in corso…" : "Invia link di recupero"}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
            setForgotMessage(null);
          }}
          className="w-full rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-zinc-300"
        >
          Torna al login
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="amministrazione@autovannygroupsrl.it"
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Password
          </label>
          <button
            type="button"
            onClick={() => {
              setMode("forgot");
              setError(null);
              setForgotMessage(null);
            }}
            className="text-xs font-medium text-accent transition-colors hover:text-ink"
          >
            Password dimenticata?
          </button>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-accent/20 bg-accent-soft px-3 py-2 text-sm text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Accesso in corso…" : "Accedi"}
      </button>

      <p className="text-center text-xs text-zinc-500">
        Area riservata —{" "}
        <Link href="/" className="font-medium text-accent hover:underline">
          torna al sito
        </Link>
      </p>
    </form>
  );
}

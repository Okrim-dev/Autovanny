"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createUserAction, updatePasswordAction } from "@/app/admin/actions";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

type Message = { type: "ok" | "error"; text: string } | null;

export default function AdminSettings({ userEmail }: { userEmail: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<Message>(null);
  const [loading, setLoading] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState<Message>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  const [accountEmail, setAccountEmail] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [accountMessage, setAccountMessage] = useState<Message>(null);
  const [accountLoading, setAccountLoading] = useState(false);

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

  async function handleEmailSubmit(event: React.FormEvent) {
    event.preventDefault();
    setEmailMessage(null);

    const trimmed = newEmail.trim().toLowerCase();
    if (trimmed === userEmail.toLowerCase()) {
      setEmailMessage({ type: "error", text: "È già l'email attuale." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailMessage({ type: "error", text: "Indirizzo email non valido." });
      return;
    }

    setEmailLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ email: trimmed });
      setEmailLoading(false);

      if (error) {
        setEmailMessage({ type: "error", text: error.message });
        return;
      }

      setEmailMessage({
        type: "ok",
        text: `Email di conferma inviata a ${trimmed}. Finché non la confermi, accedi con l'email precedente.`,
      });
      setNewEmail("");
    } catch {
      setEmailLoading(false);
      setEmailMessage({ type: "error", text: "Errore di rete. Riprova." });
    }
  }

  async function handleCreateAccount(event: React.FormEvent) {
    event.preventDefault();
    setAccountMessage(null);

    if (accountPassword.length < 8) {
      setAccountMessage({ type: "error", text: "La password deve contenere almeno 8 caratteri." });
      return;
    }

    setAccountLoading(true);
    const res = await createUserAction(accountEmail, accountPassword);
    setAccountLoading(false);

    if (res.ok) {
      setAccountMessage({ type: "ok", text: `Account ${accountEmail.trim()} creato con successo.` });
      setAccountEmail("");
      setAccountPassword("");
    } else {
      setAccountMessage({ type: "error", text: res.error ?? "Errore durante la creazione." });
    }
  }

  const messageClass = (m: Message) =>
    `rounded-lg border px-3 py-2 text-sm ${
      m?.type === "ok"
        ? "border-emerald-200 bg-emerald-50 text-emerald-600"
        : "border-accent/20 bg-accent-soft text-accent"
    }`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Impostazioni</h1>
        <p className="mt-1 text-sm text-zinc-500">Gestisci il tuo account amministratore.</p>
      </div>

      <div className="grid max-w-4xl grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white">
          <div className="border-b border-line px-6 py-5">
            <h2 className="text-lg font-bold text-ink">Email di accesso</h2>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-4 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Email attuale</label>
              <input
                readOnly
                value={userEmail}
                className={`${inputClass} bg-zinc-50 text-zinc-500`}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Nuova email</label>
              <input
                type="email"
                autoComplete="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="es. amministrazione@autovannygroupsrl.it"
                className={inputClass}
              />
              <p className="mt-2 text-xs text-zinc-400">
                Riceverai un&apos;email di conferma al nuovo indirizzo: l&apos;accesso resta con
                quella attuale finché non confermi.
              </p>
            </div>

            {emailMessage && <p className={messageClass(emailMessage)}>{emailMessage.text}</p>}

            <button
              type="submit"
              disabled={emailLoading}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {emailLoading ? "Invio in corso…" : "Aggiorna Email"}
            </button>
          </form>
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

            {message && <p className={messageClass(message)}>{message.text}</p>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Salvataggio…" : "Aggiorna Password"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-line bg-white lg:col-span-2">
          <div className="border-b border-line px-6 py-5">
            <h2 className="text-lg font-bold text-ink">Nuovo account</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Aggiungi un altro utente con accesso all&apos;area admin.
            </p>
          </div>
          <form onSubmit={handleCreateAccount} className="space-y-4 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Email del nuovo account</label>
                <input
                  type="email"
                  autoComplete="off"
                  required
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="es. nome@autovannygroupsrl.it"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Password iniziale</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="Almeno 8 caratteri"
                  className={inputClass}
                />
              </div>
            </div>

            {accountMessage && <p className={messageClass(accountMessage)}>{accountMessage.text}</p>}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-zinc-400">
                Il nuovo utente potrà accedere a /admin con queste credenziali.
              </p>
              <button
                type="submit"
                disabled={accountLoading}
                className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {accountLoading ? "Creazione…" : "Crea Account"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

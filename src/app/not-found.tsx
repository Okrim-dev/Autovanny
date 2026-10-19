import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink">
        Pagina non trovata
      </h1>
      <p className="mt-4 text-zinc-500">
        La pagina che stai cercando non esiste oppure è stata spostata.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-ink"
      >
        Torna alla home
      </Link>
    </div>
  );
}
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Valutazioni" };

export default function ValuationPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Valutazioni</h1>
      <p className="mt-4 text-zinc-500">
        Ottieni una valutazione gratuita e senza impegno del tuo veicolo
        attuale. Questa sezione arriva a breve — nel frattempo leggi la nostra
        guida alla valutazione per qualche consiglio.
      </p>
      <Link
        href="/blog/free-valuation-trade-in-guide"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-accent"
      >
        Leggi la guida alla valutazione
      </Link>
    </div>
  );
}
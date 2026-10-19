import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Finanziamenti" };

export default function FinancingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Finanziamenti</h1>
      <p className="mt-4 text-zinc-500">
        Soluzioni PCP e HP pensate per il tuo budget. Questa sezione arriva a
        breve — nel frattempo puoi parlare con il nostro team.
      </p>
      <Link
        href="/contact"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white transition-colors hover:bg-accent"
      >
        Contattaci
      </Link>
    </div>
  );
}
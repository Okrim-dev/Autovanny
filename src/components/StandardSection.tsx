const standards = [
  {
    title: "Garanzia completa",
    description:
      "Ogni veicolo è coperto da una garanzia completa di almeno 12 mesi sui principali componenti.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7">
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Ispezione di 150 punti",
    description:
      "I nostri tecnici certificati eseguono controlli rigorosi per garantire che ogni veicolo rispetti i nostri severi standard di qualità.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        <path d="M8.5 11l2 2 3.5-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Storico trasparente",
    description:
      "Storico dei tagliandi completo e garanzia di assenza di sinistri forniti in modo esplicito. Crediamo nella massima trasparenza sul tuo investimento.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7">
        <path d="M4 6h8M4 12h8M4 18h8" strokeLinecap="round" />
        <path d="M16 10l3 3 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 18l3-3 4 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function StandardSection() {
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Lo standard Autovanny
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Ogni veicolo con garanzia di almeno 12 mesi
          </h2>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {standards.map((item) => (
            <div key={item.title} className="flex flex-col gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-accent">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-6 text-zinc-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
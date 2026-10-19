import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { fullAddress, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Autovanny è una concessionaria specializzata in auto europee usate di pregio: selezione curata, ispezione di 150 punti e garanzia di almeno 12 mesi su ogni veicolo.",
};

const stats = [
  { value: "37+", label: "anni di esperienza nel settore" },
  { value: "1500+", label: "veicoli consegnati ai nostri clienti" },
  // { value: "150", label: "punti di ispezione su ogni auto" },
  // { value: "12 mesi", label: "di garanzia completa di serie" },
];

const steps = [
  {
    number: "01",
    title: "Selezione",
    text: "I nostri acquirenti scelgono a mano ogni veicolo tra le migliori auto europee di pregio, privilegiando storia documentata, equipaggiamento e stato di conservazione.",
  },
  // {
  //   number: "02",
  //   title: "Ispezione",
  //   text: "Un collaudo di 150 punti eseguito da tecnici certificati copre motore, carrozzeria, abitacolo ed elettronica. Nessun veicolo passa senza superare ogni controllo.",
  // },
  {
    number: "02",
    title: "Preparazione",
    text: "Ripristini, tagliandi e rifinitura professionale: ogni auto arriva in showroom pronta da guidare, con lo storico completo e documentato.",
  },
  {
    number: "03",
    title: "Consegna e garanzia",
    text: "Ti accompagniamo nella scelta, gestiamo finanziamento e passaggio di consegne e copriamo il veicolo con garanzia completa di almeno 12 mesi.",
  },
];

const values = [
  {
    title: "Trasparenza totale",
    // text: "Storico dei tagliandi, verifica di sinistri e documentazione sempre a disposizione. Sai esattamente cosa stai comprando, senza sorprese.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7">
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  },
  {
    title: "Qualità certificata",
    // text: "Ispezione di 150 punti e garanzia completa su ogni veicolo: il nostro standard non è negoziabile, auto dopo auto.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7">
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Consulenza dedicata",
    // text: "Un consulente segue te e il tuo veicolo dalla prima visita fino alla consegna, e resta il tuo referente anche dopo l'acquisto.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7">
        <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" />
        <circle cx="12" cy="8" r="4" />
      </svg>
    ),
  },
  {
    title: "Servizi su misura",
    // text: "Finanziamento personalizzato, valutazione e permuta del tuo usato, consegna in tutta Italia e assistenza post-vendita dedicata.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7">
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.5" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Chi siamo
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            La concessionaria per chi non accetta compromessi sull&apos;auto giusta.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Da oltre dieci anni Autovanny seleziona, ispeziona e garantisce auto
            europee usate di pregio. Ogni veicolo del nostro showroom è scelto a
            mano, è così che lavoriamo, e non cambieremo.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/showroom"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
            >
              Scopri lo showroom
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Parla con un consulente
            </Link>
          </div>

          {/* <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-10 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-sm leading-6 text-zinc-400">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl> */}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="La nostra storia"
            title="Nati dall'amore per l'ingegneria europea"
            subtitle="Autovanny nasce dall'idea semplice che comprare un'auto usata debba essere un'esperienza chiara, sicura e senza pressioni."
          />
          <div className="space-y-5 text-sm leading-7 text-zinc-600 sm:text-base">
            <p>
              Abbiamo iniziato con poche auto curate maniacalmente e una regola
              non scritta: in showroom entra solo ciò che guidiamo noi per
              primi. Da allora abbiamo accompagnato centinaia di clienti nella
              scelta del loro veicolo, mantenendo lo stesso metodo di sempre —
              selezione rigorosa, documentazione completa e un rapporto
              trasparente che continua anche dopo la consegna delle chiavi.
            </p>
            <p>
              Oggi Autovanny è un punto di riferimento per chi cerca vetture
              europee di pregio: berline, sportive, SUV e cabrio con storia
              verificata, pronte a essere guidate con la certezza di aver fatto
              la scelta giusta.
            </p>
            <blockquote className="rounded-2xl border-l-4 border-accent bg-white p-6 text-base font-medium leading-7 text-ink">
              &ldquo;Non vendiamo la prima auto che troviamo: vendiamo solo
              l&apos;auto che consiglieremmo a un amico.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Il metodo Autovanny"
            title="Quattro passaggi, zero sorprese"
            subtitle="Ogni veicolo che entra nel nostro showroom segue lo stesso percorso: è così che garantiamo qualità costante."
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.number} className="rounded-2xl border border-line bg-paper p-6">
                <span className="text-sm font-bold tracking-widest text-accent">
                  {step.number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="I nostri valori"
          title="Ciò che non è in discussione"
          subtitle="Selezione curata, qualità certificata e trasparenza: i pilastri su cui costruiamo ogni relazione con i nostri clienti."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {values.map((value) => (
            <div
              key={value.title}
              className="flex gap-5 rounded-2xl border border-line bg-white p-6"
            >
              <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                {value.icon}
              </div>
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-ink">{value.title}</h3>
                {/* <p className="mt-2 text-sm leading-6 text-zinc-500">{value.text}</p> */}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Vieni a trovarci
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Showroom Autovanny
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-300">
              Prenota una visita o una prova su strada: il nostro team è a tua
              disposizione per farti provare il veicolo che hai scelto, senza
              impegno e con tutti i tempi necessari.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
            >
              Prenota una visita
            </Link>
          </div>

          <dl className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Indirizzo
              </dt>
              <dd className="mt-3 text-base leading-7 text-white">
                Autovanny Motors
                <br />
                {fullAddress}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Contatti
              </dt>
              <dd className="mt-3 space-y-1 text-base leading-7 text-white">
                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="block transition-colors hover:text-accent"
                >
                  {siteConfig.contact.phone}
                </a>
                {/* <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="block transition-colors hover:text-accent"
                >
                  {siteConfig.contact.email}
                </a> */}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Orari
              </dt>
              <dd className="mt-3 text-base leading-7 text-white">
                Lun – Sab: 8:30 – 13:00
                <br />
                Lun – Venerdì: 15:00 – 19:30
                <br />
                Domenica: chiuso
              </dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Servizi
              </dt>
              <dd className="mt-3 text-base leading-7 text-white">
                Permuta e valutazione
                <br />
                Finanziamento su misura
                <br />
                Consegna in tutta Italia
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Pronto a trovare la tua prossima auto?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-600">
          Esplora il nostro inventario aggiornato ogni settimana oppure
          contattaci per un consulente dedicato: ti aiutiamo a scegliere il
          veicolo giusto, al prezzo giusto.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/showroom"
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm font-semibold text-white transition-colors hover:bg-accent"
          >
            Vedi i veicoli disponibili
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white px-8 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            Contattaci
          </Link>
        </div>
      </section>
    </>
  );
}

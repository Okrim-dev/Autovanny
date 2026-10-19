import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/lib/site";

const OLD_YEAR = 2024;
const THIS_YEAR = new Date().getFullYear();
const YEAR_RANGE = OLD_YEAR === THIS_YEAR ? String(OLD_YEAR) : `${OLD_YEAR}–${THIS_YEAR}`;

const sections = {
  privacy: [
    {
      title: "Dati che raccogliamo",
      text: `Raccogliamo le informazioni che ci comunichi quando contatti il team, fissi una visione o effettui una prenotazione. Queste includono nome, dati di contatto e, ove pertinente, preferenze di finanziamento.`,
    },
    {
      title: "Come li utilizziamo",
      text: `I tuoi dati sono usati per rispondere alle richieste, preparare preventivi e gestire le prenotazioni dei veicoli. Non vendiamo mai i tuoi dati personali a terze parti.`,
    },
    {
      title: "I tuoi diritti",
      text: `Puoi richiederci una copia dei dati che deteniamo, chiedere correzioni oppure chiedere la cancellazione dei tuoi dati in qualsiasi momento contattando il nostro team.`,
    },
  ],
  terms: [
    {
      title: "Disponibilità e prezzi",
      text: `Tutti i veicoli sono soggetti a disponibilità. I prezzi sono espressi in euro e includono l'IVA. Facciamo del nostro meglio per mantenere gli annunci accurati, ma sono fatte salve eventuali errori e omissioni.`,
    },
    {
      title: "Prenotazioni",
      text: `Un acconto di 210 €, completamente rimborsabile, blocca un veicolo. Se decidi di non procedere, l'acconto viene restituito per intero.`,
    },
    {
      title: "Garanzia",
      text: `Ogni veicolo include una garanzia completa di almeno 12 mesi sui principali componenti. I termini completi vengono forniti prima dell'acquisto.`,
    },
  ],
  cookies: [
    {
      title: "Cosa sono i cookie",
      text: `I cookie sono piccoli file memorizzati sul tuo dispositivo che aiutano il sito a funzionare correttamente e a ricordare le tue preferenze durante la navigazione.`,
    },
    {
      title: "Quali cookie utilizziamo",
      text: `Utilizziamo cookie strettamente necessari per le funzionalità di base, più cookie di analisi facoltativi per capire come i visitatori usano il sito. Non vengono impostati cookie pubblicitari.`,
    },
    {
      title: "Gestire i cookie",
      text: `Puoi disattivare i cookie in qualsiasi momento dalle impostazioni del browser. Se lo fai, il sito continuerà a funzionare, anche se alcune funzionalità potrebbero essere limitate.`,
    },
  ],
} as const;

const titles = {
  privacy: "Informativa sulla privacy",
  terms: "Termini di servizio",
  cookies: "Informativa sui cookie",
} as const;

export function generateStaticParams() {
  return Object.keys(sections).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const key = slug as keyof typeof titles;
  if (!titles[key]) return { title: "Note legali" };
  return { title: titles[key] };
}

export default async function LegalPage(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const key = slug as keyof typeof sections;
  const legal = sections[key];
  const title = titles[key];

  if (!legal || !title) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <nav
        className="flex items-center gap-2 text-sm text-zinc-500"
        aria-label="Percorso di navigazione"
      >
        <Link href="/" className="transition-colors hover:text-ink">
          {siteConfig.name}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-700">{title}</span>
      </nav>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-sm text-zinc-500">Ultimo aggiornamento: {YEAR_RANGE}</p>

      <div className="mt-8 space-y-8">
        {legal.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600">{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
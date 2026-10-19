import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import {
  fullAddress,
  mapsEmbedUrl,
  mapsLink,
  siteConfig,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Contatta Autovanny: showroom su SS 18 Tirrena Inferiore, 84025 Eboli (SA). Telefono, email, WhatsApp, orari e indicazioni per raggiungerci.",
};

const hours = [
  { day: "Lunedì – Sabato", time: "8:30 – 13:00" },
  { day: "Lunedì – Venerdi", time: "15:00 – 19:30" },
  { day: "Domenica", time: "Chiuso" },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            Contatti
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Parliamo della tua prossima auto.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Vieni a trovarci in showroom, chiamaci o scrivici su WhatsApp:
            rispondiamo in giornata e organizziamo prove su strada in tutta
            fretta, senza impegno.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-8 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
            >
              Chiama ora
            </a>
            {siteConfig.social.whatsapp && (
              <a
                href={siteConfig.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#1EBE5B]"
              >
                <i className="fab fa-whatsapp text-lg leading-none" aria-hidden="true" />
                <span>Scrivi su WhatsApp</span>
              </a>
            )}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              Invia una email
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="group rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h1.8a1.5 1.5 0 0 1 1.45 1.1l.7 2.6a1.5 1.5 0 0 1-.55 1.6L8.9 9.4a12 12 0 0 0 5.7 5.7l1.1-1.55a1.5 1.5 0 0 1 1.6-.55l2.6.7A1.5 1.5 0 0 1 21 16.2V18a2.5 2.5 0 0 1-2.5 2.5C10.5 20.5 3.5 13.5 3.5 6A2.5 2.5 0 0 1 4.5 5.5z" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-ink">Telefono</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Risposta immediata negli orari di apertura
            </p>
            <p className="mt-3 text-base font-semibold text-ink group-hover:text-accent">
              {siteConfig.contact.phone}
            </p>
          </a>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="group rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-ink">Email</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Per preventivi, permuta e finanziamenti
            </p>
            <p className="mt-3 text-base font-semibold text-ink group-hover:text-accent">
              {siteConfig.contact.email}
            </p>
          </a>

          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
                <path d="M12 21s-7-5.2-7-11a7 7 0 1 1 14 0c0 5.8-7 11-7 11z" strokeLinejoin="round" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-ink">Showroom</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Ottieni indicazioni stradali per raggiungerci
            </p>
            <p className="mt-3 text-base font-semibold text-ink group-hover:text-accent">
              {fullAddress}
            </p>
          </a>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <SectionHeading
                eyebrow="Dove siamo"
                title="Vieni a vedere le auto dal vivo"
                subtitle="Lo showroom è affacciato sulla SS 18, a pochi minuti dal centro di Eboli. Parcheggio gratuito davanti all'ingresso."
              />

              <dl className="mt-8 space-y-6">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Indirizzo
                  </dt>
                  <dd className="mt-1 text-base leading-7 text-ink">
                    Autovanny Motors
                    <br />
                    {fullAddress}
                  </dd>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-ink"
                  >
                    Apri in Google Maps
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Orari di apertura
                  </dt>
                  <dd className="mt-2 divide-y divide-line rounded-2xl border border-line bg-paper">
                    {hours.map((item) => (
                      <div
                        key={item.day}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                      >
                        <span className="text-zinc-600">{item.day}</span>
                        <span className="font-semibold text-ink">{item.time}</span>
                      </div>
                    ))}
                  </dd>
                </div>

                <div className="rounded-2xl border border-line bg-accent-soft p-5">
                  <p className="text-sm font-semibold text-ink">
                    Prove su strada su appuntamento
                  </p>
                  <p className="mt-1 text-sm leading-6 text-zinc-600">
                    Chiamaci o scrivici su WhatsApp per fissare un orario:
                    prepareremo il veicolo che ti interessa prima del tuo arrivo.
                  </p>
                </div>
              </dl>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line bg-white">
              <iframe
                title="Mappa dello showroom Autovanny"
                src={mapsEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full border-0 lg:h-[560px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <Link
            href="/showroom"
            className="group rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink"
          >
            <h2 className="text-lg font-semibold text-ink">
              Sfoglia lo showroom
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Scopri i veicoli disponibili, con foto, specifiche e storico
              completo di ogni auto.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Vedi i veicoli
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          <Link
            href="https://wa.me/335421810"
            className="group rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink"
          >
            <h2 className="text-lg font-semibold text-ink">
              Valuta o permuta la tua auto
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Portaci il tuo usato: ti offriamo una valutazione gratuita e
              senza impegno, anche in conto vendita.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Richiedi una valutazione
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>

          <Link
            href="/financing"
            className="group rounded-2xl border border-line bg-white p-6 transition-colors hover:border-ink"
          >
            <h2 className="text-lg font-semibold text-ink">
              Finanziamenti su misura
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Rate personalizzate e risposta rapida: costruiamo insieme il
              piano di pagamento più adatto a te.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent">
              Scopri le soluzioni
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}

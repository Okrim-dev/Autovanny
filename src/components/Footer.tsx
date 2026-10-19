import Link from "next/link";
import { siteConfig, telHref } from "@/lib/site";

const companyLinks = [
  { label: "Informativa sulla privacy", href: "/privacy" },
  { label: "Termini di servizio", href: "/terms" },
  { label: "Informativa sui cookie", href: "/cookies" },
];

export default function Footer() {
  const legal = siteConfig.legal;

  return (
    <footer className="bg-ink text-zinc-300 mt-10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xl font-bold tracking-tight text-white">{siteConfig.name}</p>
            <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-400">{siteConfig.tagline}</p>
            <address className="mt-6 text-sm not-italic leading-6 text-zinc-400">
              {siteConfig.contact.address.street}
              <br />
              {siteConfig.contact.address.city}
            </address>
            <div className="mt-5 flex gap-3">
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-white hover:text-white"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-white hover:text-white"
                >
                  <i className="fab fa-facebook"></i>
                </a>
              )}
              {siteConfig.social.tiktok && (
                <a
                  href={siteConfig.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-colors hover:border-white hover:text-white"
                >
                  <i className="fab fa-tiktok"></i>
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Navigazione</p>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.nav.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={item.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">Contatti</p>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-400">
              <li>
                <a href={telHref(siteConfig.contact.phone)} className="transition-colors hover:text-white">
                  Fisso: {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a href={telHref(siteConfig.contact.mobile)} className="transition-colors hover:text-white">
                  Cellulare: {siteConfig.contact.mobile}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-white">
              Orari di apertura
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-zinc-400">
              {siteConfig.hours.map((item) => (
                <li key={item.day} className="flex justify-between gap-4">
                  <span>{item.day}</span>
                  <span className="font-medium text-zinc-300">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white">
              Dati societari
            </p>
            <dl className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
              <div>
                <dt className="text-zinc-500">Ragione sociale</dt>
                <dd className="text-zinc-300">{legal.companyName}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Sede</dt>
                <dd className="text-zinc-300">{legal.address}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Partita IVA / Codice Fiscale</dt>
                <dd className="text-zinc-300">{legal.vat}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Numero REA</dt>
                <dd className="text-zinc-300">{legal.rea}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Capitale Sociale</dt>
                <dd className="text-zinc-300">{legal.shareCapital}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {legal.companyName}. Tutti i diritti riservati.
          </p>
          <p>Created by OM Studio Design</p>
          <p>Storico trasparente</p>
        </div>
      </div>
    </footer>
  );
}

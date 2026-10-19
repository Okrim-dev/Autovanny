"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site";
import Logo from "@/components/Logo";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center"
          aria-label={siteConfig.name}
        >
          <img src="/logo-autovanny.svg" alt={siteConfig.name} className="h-15 w-15" />
          {/* <Logo className="h-15 w-15" title={siteConfig.name} /> */}
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => {
            const itemPath = item.href.split("?")[0];
            const active =
              itemPath === "/" ? pathname === "/" : pathname.startsWith(itemPath);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-ink ${
                  active ? "text-ink" : "text-zinc-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {siteConfig.social.instagram && (
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-medium transition-colors hover:text-ink text-zinc-500"
            >
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {siteConfig.social.tiktok && (
            <a
              href={siteConfig.social.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-medium transition-colors hover:text-ink text-zinc-500"
            >
              <i className="fab fa-tiktok"></i>
            </a>
          )}
          {siteConfig.social.facebook && (
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-medium transition-colors hover:text-ink text-zinc-500"
            >
              <i className="fab fa-facebook"></i>
            </a>
          )}
          {siteConfig.social.whatsapp && (
            <a
              href={siteConfig.social.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1EBE5B]"
            >
              <i className="fab fa-whatsapp text-lg leading-none" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Attiva o disattiva il menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink md:hidden"
        >
          <span className="sr-only">Apri il menu</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-white px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {siteConfig.social.whatsapp && (
              <li>
                <a
                  href={siteConfig.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1EBE5B]"
                >
                  <i className="fab fa-whatsapp text-lg leading-none" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatMileage } from "@/lib/format";
import { fuelLabel } from "@/lib/labels";
import { siteConfig, telHref } from "@/lib/site";

type Slide = {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel: string;
  engine: string | null;
  image: string;
};

const SLIDE_INTERVAL = 8000;

export default function Slideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;

    const fadeTimer = setTimeout(() => setFading(true), SLIDE_INTERVAL - 700);
    const nextTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
      setFading(false);
    }, SLIDE_INTERVAL);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(nextTimer);
    };
  }, [index, slides.length]);

  const current = slides[index];
  const nextIdx = (index + 1) % slides.length;
  const next = slides[nextIdx];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-ink">
      <img
        src={current.image}
        alt={`${current.brand} ${current.title}`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: fading ? 0 : 1,
          transition: "opacity 0.7s ease-in-out",
        }}
      />

      <img
        src={next.image}
        alt={`${next.brand} ${next.title}`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: fading ? 1 : 0,
          transition: "opacity 0.7s ease-in-out",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="mx-auto max-w-7xl px-10 py-10">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-base font-medium uppercase tracking-widest text-zinc-300">
                {current.brand}
              </p>
              <h2 className="mt-1 text-4xl font-bold text-white sm:text-5xl">{current.model}</h2>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/15 px-4 py-1.5 text-base font-medium text-white backdrop-blur-sm">
                  {fuelLabel(current.fuel)}
                </span>
                <span className="rounded-full bg-white/15 px-4 py-1.5 text-base font-medium text-white backdrop-blur-sm">
                  {current.year}
                </span>
                <span className="rounded-full bg-white/15 px-4 py-1.5 text-base font-medium text-white backdrop-blur-sm">
                  {formatMileage(current.mileage)}
                </span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-4">
              <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {formatCurrency(current.price)}
              </p>
              <a
                href={telHref(siteConfig.contact.phone)}
                className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-lg font-semibold text-ink transition-colors hover:bg-accent hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                  <path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h1.8a1.5 1.5 0 0 1 1.45 1.1l.7 2.6a1.5 1.5 0 0 1-.55 1.6L8.9 9.4a12 12 0 0 0 5.7 5.7l1.1-1.55a1.5 1.5 0 0 1 1.6-.55l2.6.7A1.5 1.5 0 0 1 21 16.2V18a2.5 2.5 0 0 1-2.5 2.5C10.5 20.5 3.5 13.5 3.5 6A2.5 2.5 0 0 1 4.5 5.5z" strokeLinejoin="round" />
                </svg>
                {siteConfig.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
        <div
          key={index}
          className="h-full bg-accent"
          style={{ animation: `shrink ${SLIDE_INTERVAL}ms linear` }}
        />
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

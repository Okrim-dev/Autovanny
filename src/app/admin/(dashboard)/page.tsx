import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Car, Article } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createClient();

  const [{ count: carsTotal }, { count: carsOnline }, { count: carsFeatured }, { count: articlesTotal }, { count: articlesVisible }] =
    await Promise.all([
      supabase.from("cars").select("*", { count: "exact", head: true }),
      supabase.from("cars").select("*", { count: "exact", head: true }).eq("stock", true),
      supabase.from("cars").select("*", { count: "exact", head: true }).eq("featured", true),
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("visible", true),
    ]);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [{ count: carsNew }, { count: articlesNew }] = await Promise.all([
    supabase.from("cars").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
    supabase.from("articles").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo),
  ]);

  const { data: recentCars } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);
  const { data: recentArticles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return {
    cards: [
      {
        label: "Veicoli in Inventario",
        value: carsTotal ?? 0,
        sub: `+${carsNew ?? 0} questo mese`,
      },
      { label: "Veicoli Online", value: carsOnline ?? 0, sub: `+${(carsFeatured ?? 0)} in evidenza` },
      // { label: "Articoli Pubblicati", value: articlesVisible ?? 0, sub: `+${articlesNew ?? 0} questo mese` },
      // {
      //   label: "Bozze Articoli",
      //   value: (articlesTotal ?? 0) - (articlesVisible ?? 0),
      //   sub: "Non ancora pubblicati",
      // },
    ],
    recentCars: (recentCars ?? []) as Car[],
    recentArticles: (recentArticles ?? []) as Article[],
  };
}

const STATUS = {
  online: { label: "Online", className: "bg-emerald-50 text-emerald-600 ring-emerald-200" },
  offline: { label: "Offline", className: "bg-zinc-100 text-zinc-500 ring-zinc-200" },
} as const;

export default async function AdminDashboard() {
  const { cards, recentCars, recentArticles } = await getStats();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Panoramica</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Statistiche e attività recenti della concessionaria.
          </p>
        </div>
        <Link
          href="/admin/vehicles"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent/90"
        >
          + Nuovo Inserimento
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-line bg-white p-5">
            <p className="text-sm text-zinc-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-ink">{card.value}</p>
            <p className="mt-1 text-xs font-medium text-emerald-600">{card.sub}</p>
          </div>
        ))}
      </div>

      
        <section className="rounded-2xl border border-line bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Ultimi Veicoli Aggiunti</h2>
            <Link href="/admin/vehicles" className="text-sm font-medium text-accent hover:underline">
              Vedi Tutti
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {recentCars.map((car) => {
              const online = STATUS[car.stock ? "online" : "offline"];
              return (
                <li key={car.id} className="flex items-center gap-4 px-5 py-4">
                  <img
                    src={car.images?.[0]}
                    alt=""
                    className="h-14 w-20 shrink-0 rounded-lg object-cover ring-1 ring-line"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{car.title}</p>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      {car.year} · {car.fuel}
                    </p>
                  </div>
                  <span
                    className={`hidden shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 sm:inline ${online.className}`}
                  >
                    {online.label}
                  </span>
                  <p className="shrink-0 text-sm font-bold text-ink">{formatCurrency(car.price)}</p>
                </li>
              );
            })}
            {recentCars.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-zinc-500">
                Nessun veicolo in inventario.
              </li>
            )}
          </ul>
        </section>

        {/* <section className="rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Articoli Recenti</h2>
            <Link href="/admin/articles" className="text-sm font-medium text-accent hover:underline">
              Vai agli articoli
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {recentArticles.map((article) => (
              <li key={article.id} className="px-5 py-4">
                <p className="line-clamp-2 font-medium text-ink">{article.title}</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {article.visible ? "Pubblicato" : "Bozza"} · {formatDate(article.published_at)}
                </p>
              </li>
            ))}
            {recentArticles.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-zinc-500">
                Nessun articolo scritto.
              </li>
            )}
          </ul>
        </section> */}
      
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg">
      <Link href={`/blog/${article.slug}`} className="relative block aspect-[16/10] bg-zinc-100">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300">
            Nessuna immagine
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          {article.category && (
            <span className="rounded-full bg-accent-soft px-2.5 py-1 font-semibold text-accent">
              {article.category}
            </span>
          )}
          <span>{formatDate(article.published_at)}</span>
        </div>
        <h2 className="text-lg font-semibold leading-snug text-ink">
          <Link
            href={`/blog/${article.slug}`}
            className="transition-colors hover:text-accent"
          >
            {article.title}
          </Link>
        </h2>
        <p className="line-clamp-3 text-sm leading-6 text-zinc-500">{article.excerpt}</p>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-auto text-sm font-semibold text-accent transition-colors hover:text-ink"
        >
          Leggi tutto →
        </Link>
      </div>
    </article>
  );
}
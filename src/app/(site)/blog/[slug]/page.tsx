import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getArticleBySlug } from "@/lib/data";
import { formatDate } from "@/lib/format";

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticleBySlug(slug);
  return {
    title: article?.title ?? "Articolo",
    description: article?.excerpt ?? undefined,
  };
}

export default function ArticleDetailPage(props: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-20">
      <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200" />
      <div className="mt-6 aspect-[16/9] animate-pulse rounded-2xl bg-zinc-200" />
    </div>}>
      <ArticleDetail params={props.params} />
    </Suspense>
  );
}

async function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-ink">Articolo non trovato</h1>
        <Link
          href="/blog"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-ink"
        >
          Torna a Notizie e guide
        </Link>
      </div>
    );
  }

  const paragraphs = (article.content ?? "").split(/\n\n+/);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <nav
        className="flex items-center gap-2 text-sm text-zinc-500"
        aria-label="Percorso di navigazione"
      >
        <Link href="/blog" className="transition-colors hover:text-ink">
          Notizie e guide
        </Link>
        <span aria-hidden>/</span>
        <span className="text-zinc-700">{article.category}</span>
      </nav>

      <div className="mt-6 flex items-center gap-3 text-xs text-zinc-400">
        {article.category && (
          <span className="rounded-full bg-accent-soft px-2.5 py-1 font-semibold text-accent">
            {article.category}
          </span>
        )}
        <span>{formatDate(article.published_at)}</span>
        {article.author && <span>· {article.author}</span>}
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {article.title}
      </h1>
      {article.excerpt && (
        <p className="mt-4 text-lg leading-7 text-zinc-500">{article.excerpt}</p>
      )}

      {article.cover_image && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-line">
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8 space-y-5">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-base leading-7 text-zinc-700">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
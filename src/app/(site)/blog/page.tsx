import { Suspense } from "react";
import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import SectionHeading from "@/components/SectionHeading";
import { getArticles } from "@/lib/data";

export const metadata: Metadata = {
  title: "Notizie e guide",
  description: "Consigli, guide e novità dal team Autovanny.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Magazine"
        title="Notizie e guide"
        subtitle="Consigli per l'acquisto, guide al finanziamento e novità dal team Autovanny."
      />
      <Suspense
        fallback={
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-2xl bg-zinc-200" />
            ))}
          </div>
        }
      >
        <ArticleList />
      </Suspense>
    </div>
  );
}

async function ArticleList() {
  const articles = await getArticles();

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
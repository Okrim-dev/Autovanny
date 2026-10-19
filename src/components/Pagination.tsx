"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(target: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (target <= 1) params.delete("page");
    else params.set("page", String(target));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginazione">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-zinc-600 transition-colors hover:border-accent hover:text-accent"
        >
          ‹
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          aria-current={p === page ? "page" : undefined}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
            p === page
              ? "border-accent bg-accent text-white"
              : "border-line text-zinc-600 hover:border-accent hover:text-accent"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-zinc-600 transition-colors hover:border-accent hover:text-accent"
        >
          ›
        </Link>
      )}
    </nav>
  );
}
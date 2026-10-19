"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ fallback = "/showroom" }: { fallback?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Torna indietro"
      className="group inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-white pl-4 pr-5 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-ink hover:bg-ink hover:text-white"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="transition-transform group-hover:-translate-x-0.5"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      Torna indietro
    </button>
  );
}

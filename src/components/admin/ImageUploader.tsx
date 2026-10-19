"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploader({
  images,
  onChange,
  bucket,
  hint,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  bucket: "vehicle-images" | "article-images";
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [dragging, setDragging] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    const supabase = createClient();
    const list = Array.from(files).filter((file) => ACCEPTED.includes(file.type));

    if (list.length === 0) {
      setError("Formato non supportato. Usa JPG, PNG o WebP.");
      return;
    }
    if (list.some((f) => f.size > MAX_SIZE)) {
      setError("Ogni immagine deve pesare al massimo 5MB.");
      return;
    }

    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of list) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { data, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadError) throw new Error(uploadError.message);
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        urls.push(publicData.publicUrl);
      }
      onChange([...images, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload fallito.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function addUrl() {
    const value = urlInput.trim();
    if (!value) return;
    if (images.includes(value)) return;
    onChange([...images, value]);
    setUrlInput("");
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragging ? "border-accent bg-accent-soft" : "border-line bg-zinc-50"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="h-8 w-8 text-zinc-400"
        >
          <path d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
        </svg>
        <p className="mt-2 text-sm font-medium text-ink">
          Trascina le immagini qui o <span className="text-accent">sfoglia</span>
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          {hint ?? "Formati supportati: JPG, PNG, WebP · Max 5MB per file"}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files?.length && uploadFiles(e.target.files)}
        />
      </div>

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {uploading ? "Caricamento…" : "Seleziona File"}
        </button>
        <input
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          placeholder="Oppure incolla un URL immagine"
          className="min-w-0 flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-zinc-400 outline-none focus:border-accent"
        />
      </div>

      {error && <p className="mt-2 text-sm text-accent">{error}</p>}

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((url, index) => (
            <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-line">
              <img src={url} alt="" className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Copertina
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-ink shadow transition hover:bg-accent hover:text-white"
                aria-label="Rimuovi immagine"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

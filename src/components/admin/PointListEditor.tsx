"use client";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-zinc-400 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15";

export default function PointListEditor({
  items,
  onChange,
  label,
  placeholder,
  addLabel = "Aggiungi punto",
  emptyLabel = "Nessun punto aggiunto.",
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
  addLabel?: string;
  emptyLabel?: string;
}) {
  function update(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span aria-hidden className="shrink-0 text-accent">
              •
            </span>
            <input
              value={item}
              onChange={(e) => update(index, e.target.value)}
              placeholder={placeholder}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              aria-label={`Rimuovi punto ${index + 1}`}
              className="shrink-0 rounded-lg border border-line px-3 py-2.5 text-sm text-zinc-400 transition hover:border-accent hover:text-accent"
            >
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-zinc-400">{emptyLabel}</p>}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-medium text-ink transition hover:border-accent hover:text-accent"
        >
          + {addLabel}
        </button>
      </div>
    </div>
  );
}

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && key);

// Durante il build Next.js mette in cache le risposte di fetch: per il
// catalogo questo è dannoso (dati vecchi tra un build e l'altro).
// Forziamo quindi "no-store" su ogni richiesta a Supabase.
const liveFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

export const supabase = isSupabaseConfigured
  ? createClient(url as string, key as string, {
      global: { fetch: liveFetch },
    })
  : null;

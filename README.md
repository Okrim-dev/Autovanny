# Autovanny — Dealership Website

Sito web per una concessionaria di auto premium europee, costruito con **Next.js (App Router)**, **Tailwind CSS** e **Supabase (PostgreSQL)**.

## Stack

- Next.js 16 (App Router, React Server Components)
- Tailwind CSS v4 (config via CSS `@theme`)
- Supabase `@supabase/supabase-js` (lettura pubblica via anon key)
- Supabase Auth + `@supabase/ssr` (autenticazione admin)

## Struttura

```
src/
  app/
    (site)/                    # Area pubblica (Header + Footer)
      page.tsx                 # Home (hero + ricerca + vetrina + standard)
      showroom/page.tsx        # Catalogo auto con filtri, ordinamento e paginazione
      auto/[slug]/page.tsx     # Scheda dettaglio veicolo
      blog/page.tsx            # Elenco articoli / news
      blog/[slug]/page.tsx     # Dettaglio articolo
      [slug]/page.tsx          # Pagine legali (privacy, terms, cookies)
    admin/                     # Area riservata
      login/page.tsx           # Accesso con email + password
      page.tsx                 # Dashboard (KPI e attività recenti)
      vehicles/page.tsx        # Gestione parco auto (CRUD)
      articles/page.tsx        # Gestione articoli blog (CRUD)
      impostazioni/page.tsx    # Profilo e cambio password
      actions.ts               # Server Actions (auth + CRUD)
    layout.tsx                 # Layout root
  components/
    admin/                     # Componenti admin (shell, form, uploader)
    Header.tsx, Footer.tsx, CarCard.tsx, SearchBar.tsx, ...
  lib/
    site.ts                    # Config sito (nome, valuta, contatti)
    types.ts                   # Tipi Car / Article
    supabase.ts                # Client Supabase (pubblico, con fallback)
    supabase/server.ts         # Client SSR (cookie session) per l'admin
    supabase/client.ts         # Client browser per login/upload
    data.ts                    # Data layer (query + fallback mock)
    mock-data.ts               # Dati di esempio (senza credenziali)
    format.ts                  # Formattazione valuta / numeri / date
  proxy.ts                     # Protezione route /admin (refresh sessione)
supabase/
  schema.sql                   # Schema DB + RLS (Fase 1)
  seed.sql                     # Dati di esempio
  migrations/002_admin.sql     # Policy RLS admin + storage immagini
  create-admin.mjs             # Creazione utente amministratore iniziale
```

## Setup

### 1. Variabili d'ambiente

```bash
cp .env.local.example .env.local
```

Inserisci i valori del tuo progetto Supabase (Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Senza credenziali il sito non si rompe: usa automaticamente i dati di esempio in `src/lib/mock-data.ts`.

### 2. Database

1. Crea un nuovo progetto in [Supabase](https://supabase.com).
2. Nel **SQL Editor** esegui `supabase/schema.sql` (crea tabelle `cars` e `articles` + policy RLS di lettura pubblica).
3. Esegui `supabase/seed.sql` per popolare i dati di esempio.

In alternativa, con la `SUPABASE_DB_URL` (Project Settings → Database → Connection pooling) nel `.env`:

```bash
npm run db:schema   # crea le tabelle
npm run db:seed     # popola i dati
npm run db:migrate  # migrazione 002: policy admin + storage
```

### 3. Area admin (autenticazione)

1. Nel pannello Supabase verifica che il provider **Email** sia attivo (Authentication → Sign In / Up → Email).
2. Crea l'utente amministratore iniziale (usa `ADMIN_EMAIL` / `ADMIN_PASSWORD` nel `.env` o passa email e password come argomenti):

```bash
npm run db:admin                          # migrazione + crea admin
node supabase/create-admin.mjs admin@esempio.com "PasswordSicura123"
```

3. Accedi su [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

L'area admin consente di aggiungere/modificare/eliminare veicoli e articoli e di caricare immagini su **Supabase Storage** (bucket `vehicle-images` / `article-images`, max 5MB). La protezione è gestita da `src/proxy.ts` + verifica della sessione in ogni pagina e Server Action.

### 4. Avvio

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Route principali

| URL | Descrizione |
| --- | --- |
| `/` | Home con hero, ricerca e vetrina |
| `/showroom` | Catalogo con filtri (marca, certified, prezzo, anno), sort e paginazione |
| `/auto/[slug]` | Dettaglio veicolo (galleria, specifiche, CTA) |
| `/blog` | Articoli e guide |
| `/admin` | Dashboard amministratore (protetta) |
| `/admin/login` | Accesso area riservata |

## Fasi

- **Fase 1:** struttura app, DB Supabase con dati seed, rendering dinamico dei veicoli e degli articoli dal design dei mockup.
- **Fase 2 (attuale):** area admin protetta con autenticazione (email + password) e CRUD completo su `cars` e `articles`, con upload immagini su Supabase Storage.

## Note design (estratti dai mockup)

- Palette: sfondo `#F9FAFB`, scuro `#0B1425`, accento `#D03732` (definiti come token `paper` / `ink` / `accent` in `globals.css`).
- Valuta di riferimento: GBP (`£`). Per cambiarla modifica `siteConfig.currency` in `src/lib/site.ts`.

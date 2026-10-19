// Crea l'utente amministratore per l'area admin (auth Supabase).
// Uso:
//   node supabase/create-admin.mjs                       -> usa ADMIN_EMAIL / ADMIN_PASSWORD (env)
//   node supabase/create-admin.mjs email@example.com pw   -> oppure argomenti CLI
// Richiede SUPABASE_DB_URL. Crea l'utente SOLO se non esiste già.
import pg from "pg";
import { randomBytes } from "node:crypto";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("Manca SUPABASE_DB_URL (connection string).");
  process.exit(1);
}

const args = process.argv.slice(2);
const email = args[0] ?? process.env.ADMIN_EMAIL;
let password = args[1] ?? process.env.ADMIN_PASSWORD;

if (!email) {
  console.error("Manca l'email dell'admin (env ADMIN_EMAIL o argomento CLI).");
  process.exit(1);
}
if (!password) {
  password = "AutoVanny@" + randomBytes(6).toString("hex");
  console.log("Password generata automaticamente:", password);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();

  const existing = await client.query("select id from auth.users where email = $1", [email]);
  if (existing.rowCount > 0) {
    const userId = existing.rows[0].id;
    await client.query(
      `insert into auth.identities (
         provider_id, user_id, identity_data, provider,
         last_sign_in_at, created_at, updated_at, id
       ) values (
         $1::text, $2::uuid, jsonb_build_object('sub', $1::text, 'email', $3::text),
         'email', now(), now(), now(), $2::uuid
       ) on conflict (provider_id, provider) do nothing`,
      [String(userId), String(userId), email]
    );
    console.log("L'utente", email, "esiste già: identità verificata.");
    process.exit(0);
  }

  const cols = await client.query(
    `select column_name from information_schema.columns
     where table_schema = 'auth' and table_name = 'users'
     and column_name in ('encrypted_password', 'password_hash')`
  );
  const hasEnc = cols.rows.some((r) => r.column_name === "encrypted_password");
  const hasHash = cols.rows.some((r) => r.column_name === "password_hash");
  if (!hasEnc && !hasHash) {
    console.error("ERRORE: la tabella auth.users non ha colonne password note.");
    process.exit(1);
  }

  const id = (await client.query("select gen_random_uuid() as id")).rows[0].id;
  const passwordCols = [
    hasEnc ? "encrypted_password" : null,
    hasHash ? "password_hash" : null,
  ].filter(Boolean);
  const passwordValues = passwordCols.map(() => `crypt($3, gen_salt('bf'))`).join(", ");

  await client.query(
    `insert into auth.users (
       instance_id, id, aud, role, email,
       ${passwordCols.join(", ")},
       email_confirmed_at, confirmation_sent_at,
       raw_app_meta_data, raw_user_meta_data,
       created_at, updated_at, confirmation_token, recovery_token,
       email_change_token_new, email_change, is_sso_user
     ) values (
       '00000000-0000-0000-0000-000000000000', $1::uuid, 'authenticated', 'authenticated', $2,
       ${passwordValues},
       now(), now(),
       '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
       now(), now(), '', '', '', '', false
     )`,
    [id, email, password]
  );

  await client.query(
    `insert into auth.identities (
       provider_id, user_id, identity_data, provider,
       last_sign_in_at, created_at, updated_at, id
     ) values (
       $1::text, $2::uuid, jsonb_build_object('sub', $1::text, 'email', $3::text),
       'email', now(), now(), now(), $2::uuid
     ) on conflict (provider_id, provider) do nothing`,
    [String(id), String(id), email]
  );

  console.log("Admin creato:", email, "(id:", id, ")");
  console.log("Se la password non è visibile sopra, è in ADMIN_PASSWORD nel .env.");
} catch (err) {
  console.error("ERRORE:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}

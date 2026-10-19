// Runner SQL per Supabase: esegue un file .sql sul database.
// Uso: node supabase/run-sql.mjs <file.sql>
// Richiede la variabile SUPABASE_DB_URL (connection string) nell'ambiente.
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("Manca SUPABASE_DB_URL (connection string).");
  process.exit(1);
}

const file = process.argv[2];
if (!file) {
  console.error("Uso: node supabase/run-sql.mjs <file.sql>");
  process.exit(1);
}

const sqlPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), file);
const sql = await readFile(sqlPath, "utf8");

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
try {
  await client.connect();
  console.log(`Connesso. Eseguo ${file}...`);
  await client.query(sql);
  console.log("OK:", file);
} catch (err) {
  console.error("ERRORE:", err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
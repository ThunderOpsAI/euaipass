import "dotenv/config";
import fs from "fs";
import path from "path";
import { Pool } from "pg";

async function migrate() {
  const databaseUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL or DIRECT_DATABASE_URL is required to run migrations.");
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const migrationsDir = path.join(process.cwd(), "db", "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      console.log(`Applying migration: ${file}`);
      await pool.query(sql);
    }
    console.log("All migrations applied successfully.");
  } finally {
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

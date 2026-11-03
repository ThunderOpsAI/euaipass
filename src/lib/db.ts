import { Pool } from "pg";

const globalForPg = globalThis as unknown as {
  pool: Pool | undefined;
};

export function getDbPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === "") {
    return null;
  }

  if (!globalForPg.pool) {
    globalForPg.pool = new Pool({
      connectionString,
      connectionTimeoutMillis: 4000,
    });
  }

  return globalForPg.pool;
}

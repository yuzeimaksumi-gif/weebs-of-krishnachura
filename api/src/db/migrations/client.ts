import { neon } from '@neondatabase/serverless'

// Creates a database connection helper.
// Usage:  const sql = getDb(url);  const rows = await sql`SELECT 1`
// Values placed inside ${...} are sent safely, which protects against SQL injection.
export function getDb(databaseUrl: string) {
  return neon(databaseUrl)
}
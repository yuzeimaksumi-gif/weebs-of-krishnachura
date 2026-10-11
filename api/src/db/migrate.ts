import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is missing. Check api/.env')
  process.exit(1)
}

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations')
const client = new pg.Client({ connectionString: url })

async function main() {
  await client.connect()

  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `)

  const result = await client.query('SELECT name FROM schema_migrations')
  const done = new Set<string>(result.rows.map((r) => r.name as string))

  const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort()
  let applied = 0

  for (const file of files) {
    if (done.has(file)) {
      console.log(`skip   ${file} (already applied)`)
      continue
    }
    const sqlText = await readFile(path.join(dir, file), 'utf8')
    try {
      await client.query('BEGIN')
      await client.query(sqlText)
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file])
      await client.query('COMMIT')
      console.log(`apply  ${file}`)
      applied++
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  }

  console.log(applied > 0 ? `Done. ${applied} migration(s) applied.` : 'Database is up to date.')
}

main()
  .catch((err) => {
    console.error('Migration failed:', err instanceof Error ? err.message : err)
    process.exitCode = 1
  })
  .finally(() => client.end())
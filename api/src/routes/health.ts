import { Hono } from 'hono'
import { env } from 'hono/adapter'
import type { AppEnv, Bindings } from '../types'
import { getDb } from '../db/client'

const health = new Hono<AppEnv>()

// Quick check that the API and the database are both working.
health.get('/', async (c) => {
  const { DATABASE_URL } = env<Bindings>(c)
  try {
    const sql = getDb(DATABASE_URL)
    await sql`SELECT 1 AS ok`
    return c.json({ ok: true, db: 'up' })
  } catch (err) {
    console.error('Health check: database error', err)
    return c.json({ ok: false, db: 'down' }, 503)
  }
})

export default health
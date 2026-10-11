import { Hono } from 'hono'
import { env } from 'hono/adapter'
import type { AppEnv, Bindings } from '../types'
import { getDb } from '../db/client'

const events = new Hono<AppEnv>()

// Public list of published events. (Empty for now, which is correct.)
events.get('/', async (c) => {
  const { DATABASE_URL } = env<Bindings>(c)
  const sql = getDb(DATABASE_URL)
  const rows = await sql`
    SELECT id, slug, name, description, starts_at, venue, city
    FROM events
    WHERE is_published = true
    ORDER BY starts_at NULLS LAST, created_at
  `
  return c.json({ events: rows })
})

export default events
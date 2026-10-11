import { Hono } from 'hono'
import { env } from 'hono/adapter'
import type { AppEnv, Bindings } from '../types'
import { getDb } from '../db/client'

const tickets = new Hono<AppEnv>()

// The next published event and its ticket types, with live availability.
tickets.get('/', async (c) => {
  const { DATABASE_URL } = env<Bindings>(c)
  const sql = getDb(DATABASE_URL)
  const slug = c.req.query('event')

  c.header('Cache-Control', 'no-store') // availability must never be cached

  // Return stock from expired reservations first so numbers are accurate
  await sql`SELECT release_expired_orders()`

  const events = slug
    ? await sql`
        SELECT id, slug, name, description, starts_at, venue, city
        FROM events WHERE is_published = true AND slug = ${slug} LIMIT 1`
    : await sql`
        SELECT id, slug, name, description, starts_at, venue, city
        FROM events WHERE is_published = true
        ORDER BY starts_at NULLS LAST, created_at LIMIT 1`

  const event = events[0]
  if (!event) return c.json({ event: null, ticketTypes: [] })

  const ticketTypes = await sql`
    SELECT id, name, description, benefits, price_paise, max_per_order,
           GREATEST(quantity_total - quantity_sold - quantity_reserved, 0) AS available,
           CASE
             WHEN sales_start IS NOT NULL AND sales_start > now() THEN 'upcoming'
             WHEN sales_end IS NOT NULL AND sales_end < now() THEN 'ended'
             WHEN quantity_total - quantity_sold - quantity_reserved <= 0 THEN 'sold_out'
             ELSE 'on_sale'
           END AS sale_status
    FROM ticket_types
    WHERE event_id = ${event.id} AND is_active = true
    ORDER BY sort_order, created_at
  `

  return c.json({ event, ticketTypes })
})

export default tickets
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { z } from 'zod'
import type { AppEnv, Bindings } from '../types'
import { getDb } from '../db/client'
import { makeBookingRef } from '../lib/ref'

const HOLD_MINUTES = 15

const schema = z.object({
  eventId: z.string().uuid(),
  items: z
    .array(
      z.object({
        ticketTypeId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(10),
  buyer: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().toLowerCase().email().max(120),
    phone: z.union([z.literal(''), z.string().trim().regex(/^[0-9+\-\s]{7,15}$/)]).optional(),
  }),
  acceptTerms: z.literal(true),
})

const MESSAGES: Record<string, string> = {
  eventId: 'Invalid event.',
  items: 'Please choose at least one ticket.',
  name: 'Please enter your name (2 to 80 characters).',
  email: 'Please enter a valid email address.',
  phone: 'Please enter a valid phone number, or leave it empty.',
  acceptTerms: 'Please accept the terms to continue.',
}

const orders = new Hono<AppEnv>()

// Create a pending order and reserve stock. No payment happens here.
orders.post('/', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'invalid_json' }, 400)
  }

  // Spam trap: real people never fill this hidden field
  const raw = (body ?? {}) as Record<string, unknown>
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return c.json({ error: 'rejected' }, 400)
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const first = String(issue.path[0] ?? 'form')
      const key = first === 'buyer' ? String(issue.path[1] ?? 'form') : first
      if (!fields[key]) fields[key] = MESSAGES[key] ?? 'Invalid value.'
    }
    return c.json({ error: 'validation', fields }, 400)
  }

  const { eventId, items, buyer } = parsed.data
  const dbItems = items.map((i) => ({ ticket_type_id: i.ticketTypeId, quantity: i.quantity }))
  const phone = buyer.phone ? buyer.phone : null

  const { DATABASE_URL } = env<Bindings>(c)
  const sql = getDb(DATABASE_URL)

  for (let attempt = 0; attempt < 3; attempt++) {
    const ref = makeBookingRef()
    try {
      const rows = await sql`
        SELECT * FROM create_pending_order(
          ${eventId}::uuid, ${buyer.name}, ${buyer.email}, ${phone}::text,
          ${JSON.stringify(dbItems)}::jsonb, ${ref}, ${HOLD_MINUTES}::integer
        )`
      const row = rows[0]
      return c.json(
        {
          ok: true,
          order: {
            bookingRef: row.out_booking_ref,
            totalPaise: row.out_total_paise,
            expiresAt: row.out_expires_at,
          },
        },
        201,
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('duplicate key')) continue // extremely rare reference clash: try again
      if (msg.includes('sold_out')) {
        return c.json(
          { error: 'sold_out', message: 'Sorry, one of the tickets you chose just sold out or has fewer left than you asked for. Please review your selection.' },
          409,
        )
      }
      if (msg.includes('not_available')) {
        return c.json(
          { error: 'not_available', message: 'One of the tickets you chose is not on sale right now.' },
          409,
        )
      }
      if (msg.includes('invalid_quantity') || msg.includes('invalid_items')) {
        return c.json({ error: 'invalid_quantity', message: 'Please check the ticket quantities.' }, 400)
      }
      throw err // unknown problem: handled by the global error handler
    }
  }
  return c.json({ error: 'server_error' }, 500)
})

// Look up an order. Needs BOTH the booking reference and the buyer's email.
orders.get('/lookup', async (c) => {
  const ref = (c.req.query('ref') ?? '').trim().toUpperCase()
  const email = (c.req.query('email') ?? '').trim().toLowerCase()
  c.header('Cache-Control', 'no-store')

  if (!/^WOK-[A-Z0-9]{8}$/.test(ref) || !email || email.length > 120) {
    return c.json({ error: 'not_found' }, 404)
  }

  const { DATABASE_URL } = env<Bindings>(c)
  const sql = getDb(DATABASE_URL)

  const found = await sql`
    SELECT o.id, o.booking_ref, o.status, o.total_paise, o.created_at, o.paid_at,
           o.expires_at, e.name AS event_name
    FROM orders o JOIN events e ON e.id = o.event_id
    WHERE o.booking_ref = ${ref} AND lower(o.buyer_email) = ${email}`
  const order = found[0]
  if (!order) return c.json({ error: 'not_found' }, 404)

  const items = await sql`
    SELECT tt.name, oi.quantity, oi.unit_price_paise
    FROM order_items oi JOIN ticket_types tt ON tt.id = oi.ticket_type_id
    WHERE oi.order_id = ${order.id}`

  return c.json({
    order: {
      bookingRef: order.booking_ref,
      status: order.status,
      eventName: order.event_name,
      totalPaise: order.total_paise,
      createdAt: order.created_at,
      paidAt: order.paid_at,
      expiresAt: order.expires_at,
      items,
    },
  })
})

export default orders
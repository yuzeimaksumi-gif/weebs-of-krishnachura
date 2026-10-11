import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { z } from 'zod'
import type { AppEnv, Bindings } from '../types'
import { getDb } from '../db/client'

const INTERESTS = ['Anime', 'K-pop', 'Cosplay', 'Art', 'Gaming', 'Volunteering'] as const

// The server re-checks everything. Never trust the browser's validation.
const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(120),
  interests: z.array(z.enum(INTERESTS)).max(INTERESTS.length).default([]),
  consent: z.literal(true),
})

const MESSAGES: Record<string, string> = {
  name: 'Please enter your name (2 to 80 characters).',
  email: 'Please enter a valid email address.',
  interests: 'Invalid interest selection.',
  consent: 'Please tick the box so we may contact you.',
}

const members = new Hono<AppEnv>()

members.post('/', async (c) => {
  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'invalid_json' }, 400)
  }

  // Spam trap: real people never see or fill the hidden "website" field.
  const raw = (body ?? {}) as Record<string, unknown>
  if (typeof raw.website === 'string' && raw.website.trim() !== '') {
    return c.json({ ok: true })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      if (!fields[key]) fields[key] = MESSAGES[key] ?? 'Invalid value.'
    }
    return c.json({ error: 'validation', fields }, 400)
  }

  const { name, email, interests } = parsed.data
  const unique = [...new Set(interests)]

  const { DATABASE_URL } = env<Bindings>(c)
  const sql = getDb(DATABASE_URL)

  // If the email is already registered we do nothing, and we still answer "ok",
  // so nobody can use this form to find out who is a member.
  await sql`
    INSERT INTO members (name, email, interests, consent_given)
    VALUES (${name}, ${email}, ${unique}::text[], true)
    ON CONFLICT DO NOTHING
  `

  return c.json({ ok: true })
})

export default members
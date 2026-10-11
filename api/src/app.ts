import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { bodyLimit } from 'hono/body-limit'
import { env } from 'hono/adapter'
import type { AppEnv, Bindings } from './types'
import health from './routes/health'
import events from './routes/events'
import members from './routes/members'
import tickets from './routes/tickets'
import orders from './routes/orders'

const app = new Hono<AppEnv>()

// Safe default security headers on every response
app.use('*', secureHeaders())

// Only our own website may call the API from a browser
app.use('/api/*', async (c, next) => {
  const { WEB_ORIGIN } = env<Bindings>(c)
  const origins = (WEB_ORIGIN ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return cors({
    origin: origins,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 600,
  })(c, next)
})

// Reject oversized requests (20 KB is plenty for our forms)
app.use(
  '/api/*',
  bodyLimit({
    maxSize: 20 * 1024,
    onError: (c) => c.json({ error: 'payload_too_large' }, 413),
  }),
)

app.route('/api/health', health)
app.route('/api/events', events)
app.route('/api/members', members)
app.route('/api/tickets', tickets)
app.route('/api/orders', orders)

app.notFound((c) => c.json({ error: 'not_found' }, 404))

// Never leak internal details to visitors; log them for ourselves instead.
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'server_error' }, 500)
})

export default app
import { useCallback, useEffect, useState, type FormEvent } from 'react'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import EmptyState from '../components/EmptyState'
import { apiGet, apiPost } from '../lib/api'
import { formatPaise } from '../lib/money'

type TicketType = {
  id: string
  name: string
  description: string
  benefits: string[]
  price_paise: number
  max_per_order: number
  available: number
  sale_status: 'on_sale' | 'sold_out' | 'upcoming' | 'ended'
}

type EventInfo = {
  id: string
  slug: string
  name: string
  description: string
  starts_at: string | null
  venue: string | null
  city: string | null
}

type TicketsResponse = { event: EventInfo | null; ticketTypes: TicketType[] }
type Reserved = { bookingRef: string; totalPaise: number; expiresAt: string }

const STATUS_LABEL: Record<TicketType['sale_status'], string> = {
  on_sale: 'On sale',
  sold_out: 'Sold out',
  upcoming: 'Not on sale yet',
  ended: 'Sales ended',
}

export default function Tickets() {
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [data, setData] = useState<TicketsResponse | null>(null)
  const [qty, setQty] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [reserved, setReserved] = useState<Reserved | null>(null)

  const load = useCallback(async () => {
    const res = await apiGet<TicketsResponse>('/api/tickets')
    if (res.ok) {
      setData(res.data)
      setState('ready')
    } else {
      setState('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  function setQuantity(id: string, value: number) {
    setQty((prev) => ({ ...prev, [id]: value }))
  }

  const types = data?.ticketTypes ?? []
  const lines = types.filter((t) => (qty[t.id] ?? 0) > 0)
  const total = lines.reduce((sum, t) => sum + t.price_paise * (qty[t.id] ?? 0), 0)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!data?.event) return
    setFormError('')

    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const phone = String(form.get('phone') ?? '').trim()
    const accept = form.get('accept') === 'on'
    const website = String(form.get('website') ?? '') // hidden spam-trap field

    const next: Record<string, string> = {}
    if (lines.length === 0) next.items = 'Please choose at least one ticket.'
    if (name.length < 2 || name.length > 80) next.name = 'Please enter your name (2 to 80 characters).'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
      next.email = 'Please enter a valid email address.'
    }
    if (phone && !/^[0-9+\-\s]{7,15}$/.test(phone)) next.phone = 'Please enter a valid phone number, or leave it empty.'
    if (!accept) next.acceptTerms = 'Please accept the terms to continue.'
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const res = await apiPost<{ ok: true; order: Reserved }>('/api/orders', {
      eventId: data.event.id,
      items: lines.map((t) => ({ ticketTypeId: t.id, quantity: qty[t.id] })),
      buyer: { name, email, phone },
      acceptTerms: accept,
      website,
    })
    setSubmitting(false)

    if (res.ok) {
      setReserved(res.data.order)
      return
    }
    if (res.error === 'validation' && res.fields) {
      setErrors(res.fields)
    } else if (res.error === 'network') {
      setFormError('We could not reach the server. Please check your connection and try again.')
    } else if (res.message) {
      setFormError(res.message)
      setQty({})
      void load() // refresh the numbers
    } else {
      setFormError('Something went wrong on our side. Please try again in a moment.')
    }
  }

  function startOver() {
    setReserved(null)
    setQty({})
    setErrors({})
    setState('loading')
    void load()
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder-white/40'

  return (
    <>
      <PageHeader
        eyebrow="Passes"
        title="Passes & Tickets"
        subtitle="Choose your passes, check the price breakdown, and reserve them."
      />

      {state === 'loading' && (
        <Section eyebrow="One moment" title="Loading tickets…">
          <p className="text-white/70" role="status">Fetching the latest availability.</p>
        </Section>
      )}

      {state === 'error' && (
        <Section eyebrow="Oops" title="We couldn't load the tickets">
          <EmptyState
            icon="⚠️"
            title="Please try again"
            text="The ticket service did not respond. Check your connection and refresh the page."
          />
        </Section>
      )}

      {state === 'ready' && (!data?.event || types.length === 0) && (
        <Section eyebrow="Coming soon" title="No tickets on sale yet">
          <EmptyState
            icon="🎟️"
            title="Passes will appear here"
            text="Ticket sales have not opened yet. Check back soon, or follow our community for updates."
          />
        </Section>
      )}

      {state === 'ready' && data?.event && types.length > 0 && reserved && (
        <Section eyebrow="Reserved" title="Your tickets are on hold">
          <div className="glass max-w-2xl rounded-2xl p-6 sm:p-8" role="status">
            <p className="text-sm text-white/60">Booking reference</p>
            <p className="font-display text-2xl font-bold text-gold">{reserved.bookingRef}</p>
            <p className="mt-4 text-white/80">
              Total: <strong>{formatPaise(reserved.totalPaise)}</strong>. Held until{' '}
              <strong>
                {new Date(reserved.expiresAt).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
              </strong>
              .
            </p>
            <p className="mt-4 rounded-xl border border-gold/40 bg-gold/10 p-4 text-sm">
              <strong>Payment is not connected yet.</strong> Nothing has been charged and no ticket
              has been issued. This is a reservation test. Online payment is added in the next stage.
            </p>
            <button type="button" onClick={startOver} className="btn-ghost mt-6">
              Start over
            </button>
          </div>
        </Section>
      )}

      {state === 'ready' && data?.event && types.length > 0 && !reserved && (
        <>
          <Section eyebrow="Choose your passes" title={data.event.name}>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {types.map((t) => {
                const max = Math.min(t.max_per_order, t.available)
                const q = qty[t.id] ?? 0
                const canBuy = t.sale_status === 'on_sale' && max > 0
                return (
                  <article key={t.id} className="glass flex flex-col rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-base font-bold">{t.name}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          canBuy ? 'bg-neon/15 text-neon' : 'bg-white/10 text-white/60'
                        }`}
                      >
                        {STATUS_LABEL[t.sale_status]}
                      </span>
                    </div>
                    <p className="mt-3 font-display text-2xl font-black text-gradient">
                      {formatPaise(t.price_paise)}
                    </p>
                    <p className="mt-3 text-sm text-white/70">{t.description}</p>
                    {t.benefits.length > 0 && (
                      <ul className="mt-4 space-y-1 text-sm text-white/80">
                        {t.benefits.map((b) => (
                          <li key={b} className="flex gap-2">
                            <span aria-hidden="true" className="text-flame">✦</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    {canBuy && t.available <= 10 && (
                      <p className="mt-3 text-xs text-gold">Only {t.available} left</p>
                    )}

                    <div className="mt-auto pt-5">
                      {canBuy ? (
                        <div className="flex items-center gap-3" role="group" aria-label={`Quantity for ${t.name}`}>
                          <button
                            type="button"
                            className="h-10 w-10 rounded-lg border border-white/25 text-lg disabled:opacity-40"
                            aria-label={`Remove one ${t.name} ticket`}
                            disabled={q <= 0}
                            onClick={() => setQuantity(t.id, q - 1)}
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-display text-lg" aria-live="polite">
                            {q}
                          </span>
                          <button
                            type="button"
                            className="h-10 w-10 rounded-lg border border-white/25 text-lg disabled:opacity-40"
                            aria-label={`Add one ${t.name} ticket`}
                            disabled={q >= max}
                            onClick={() => setQuantity(t.id, q + 1)}
                          >
                            +
                          </button>
                          <span className="text-xs text-white/50">max {max}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-white/50">Not available to buy</p>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
            {errors.items && (
              <p role="alert" className="mt-4 text-sm text-flame">{errors.items}</p>
            )}
          </Section>

          <Section eyebrow="Your order" title="Summary and details">
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-base font-bold">Price breakdown</h3>
                {lines.length === 0 ? (
                  <p className="mt-4 text-sm text-white/60">No tickets selected yet.</p>
                ) : (
                  <dl className="mt-4 space-y-3 text-sm">
                    {lines.map((t) => (
                      <div key={t.id} className="flex justify-between gap-4">
                        <dt className="text-white/80">
                          {t.name} × {qty[t.id]}
                        </dt>
                        <dd>{formatPaise(t.price_paise * (qty[t.id] ?? 0))}</dd>
                      </div>
                    ))}
                    <div className="flex justify-between gap-4 border-t border-white/15 pt-3 font-bold">
                      <dt>Total</dt>
                      <dd>{formatPaise(total)}</dd>
                    </div>
                  </dl>
                )}
                <p className="mt-4 text-xs text-white/50">
                  The final price is confirmed by our server when you reserve.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="glass grid gap-5 rounded-2xl p-6">
                {/* Spam trap: hidden from people, visible to bots */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Leave this field empty
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div>
                  <label htmlFor="buyer-name" className="font-semibold">Full name</label>
                  <input id="buyer-name" name="name" type="text" autoComplete="name" maxLength={80}
                    className={inputClass} aria-invalid={!!errors.name} />
                  {errors.name && <p role="alert" className="mt-2 text-sm text-flame">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="buyer-email" className="font-semibold">Email address</label>
                  <input id="buyer-email" name="email" type="email" autoComplete="email" maxLength={120}
                    className={inputClass} aria-invalid={!!errors.email} />
                  {errors.email && <p role="alert" className="mt-2 text-sm text-flame">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="buyer-phone" className="font-semibold">Phone (optional)</label>
                  <input id="buyer-phone" name="phone" type="tel" autoComplete="tel" maxLength={15}
                    className={inputClass} aria-invalid={!!errors.phone} />
                  {errors.phone && <p role="alert" className="mt-2 text-sm text-flame">{errors.phone}</p>}
                </div>

                <div>
                  <label className="flex items-start gap-3 text-sm text-white/80">
                    <input type="checkbox" name="accept" className="mt-1" aria-invalid={!!errors.acceptTerms} />
                    <span>
                      I accept the ticket terms and the refund policy.
                      [Placeholder: link to the real terms and refund policy once they are written.]
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p role="alert" className="mt-2 text-sm text-flame">{errors.acceptTerms}</p>
                  )}
                </div>

                {formError && (
                  <p role="alert" className="rounded-xl border border-flame/50 bg-flame/10 p-3 text-sm">
                    {formError}
                  </p>
                )}

                <button type="submit" disabled={submitting} className="btn-primary justify-self-start disabled:opacity-60">
                  {submitting ? 'Reserving…' : 'Reserve tickets'}
                </button>
              </form>
            </div>
          </Section>
        </>
      )}
    </>
  )
}
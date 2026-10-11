import { useState, type FormEvent } from 'react'
import { apiPost } from '../lib/api'

const INTERESTS = ['Anime', 'K-pop', 'Cosplay', 'Art', 'Gaming', 'Volunteering']

type Errors = {
  name?: string
  email?: string
  consent?: string
  interests?: string
}

export default function JoinForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError('')
    const data = new FormData(event.currentTarget)

    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const consent = data.get('consent') === 'on'
    const website = String(data.get('website') ?? '') // hidden spam-trap field
    const interests = data.getAll('interests').map(String)

    // Quick checks in the browser for a friendly experience.
    // The server checks everything again, which is the real protection.
    const next: Errors = {}
    if (name.length < 2 || name.length > 80) {
      next.name = 'Please enter your name (2 to 80 characters).'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
      next.email = 'Please enter a valid email address.'
    }
    if (!consent) {
      next.consent = 'Please tick the box so we may contact you.'
    }
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const result = await apiPost<{ ok: true }>('/api/members', {
      name,
      email,
      interests,
      consent,
      website,
    })
    setSubmitting(false)

    if (result.ok) {
      setDone(true)
      return
    }

    if (result.error === 'validation' && result.fields) {
      setErrors(result.fields as Errors)
    } else if (result.error === 'network') {
      setServerError(
        'We could not reach the server. Please check your connection and try again.',
      )
    } else {
      setServerError('Something went wrong on our side. Please try again in a moment.')
    }
  }

  if (done) {
    return (
      <div className="glass rounded-2xl p-8" role="status">
        <p className="font-display text-lg font-bold">Welcome aboard! 🌺</p>
        <p className="mt-3 text-white/75">
          Thank you for joining Weebs of Krishnachura. We will be in touch about the
          community and upcoming events.
        </p>
      </div>
    )
  }

  const inputClass =
    'mt-2 w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder-white/40'

  return (
    <form onSubmit={handleSubmit} noValidate className="glass grid gap-6 rounded-2xl p-6 sm:p-8">
      {/* Spam trap: hidden from people, visible to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="name" className="font-semibold">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={80}
          className={inputClass}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-2 text-sm text-flame">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="font-semibold">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={120}
          className={inputClass}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-flame">
            {errors.email}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="font-semibold">What are you into? (optional)</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {INTERESTS.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm"
            >
              <input type="checkbox" name="interests" value={item} />
              {item}
            </label>
          ))}
        </div>
        {errors.interests && (
          <p role="alert" className="mt-2 text-sm text-flame">
            {errors.interests}
          </p>
        )}
      </fieldset>

      <div>
        <label className="flex items-start gap-3 text-sm text-white/80">
          <input
            type="checkbox"
            name="consent"
            className="mt-1"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span>
            I agree that Weebs of Krishnachura may contact me about the community and its
            events. [Placeholder: link to privacy notice once it is written.]
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-2 text-sm text-flame">
            {errors.consent}
          </p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-xl border border-flame/50 bg-flame/10 p-3 text-sm">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary justify-self-start disabled:opacity-60">
        {submitting ? 'Sending…' : 'Join the community'}
      </button>
    </form>
  )
}
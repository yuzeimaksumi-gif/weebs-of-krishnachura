import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import EmptyState from '../components/EmptyState'
import Countdown from '../components/Countdown'
import {
  EVENT,
  EVENT_ACTIVITY_TYPES,
  EVENT_GUESTS,
  EVENT_SCHEDULE,
} from '../config/site'

function formatDate(iso: string | null) {
  if (!iso) return 'To be announced'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'To be announced'
  return d.toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })
}

export default function Events() {
  return (
    <>
      <PageHeader
        eyebrow="What's happening"
        title="Events"
        subtitle="Everything we have confirmed so far. Details are added here as soon as they are final."
      />

      <Section eyebrow="Next up" title={EVENT.name}>
        <div className="glass grid gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-white/80">{EVENT.description}</p>
            <dl className="mt-6 space-y-3 text-white/80">
              <div>
                <dt className="text-xs uppercase tracking-widest text-gold">Date and time</dt>
                <dd>{formatDate(EVENT.date)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-gold">Venue</dt>
                <dd>{EVENT.venue}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-gold">City</dt>
                <dd>{EVENT.city}</dd>
              </div>
            </dl>
            <Link to="/tickets" className="btn-primary mt-8">
              Get Tickets 🎟️
            </Link>
          </div>
          <div className="flex flex-col justify-center">
            <Countdown date={EVENT.date} />
          </div>
        </div>
      </Section>

      <Section eyebrow="Planned" title="What to expect">
        <p className="mb-5 text-sm text-white/60">
          These are the kinds of activities we plan to offer. Which ones will run is not
          confirmed yet.
        </p>
        <ul className="flex flex-wrap gap-3">
          {EVENT_ACTIVITY_TYPES.map((a) => (
            <li key={a} className="rounded-full border border-neon/40 bg-neon/5 px-5 py-2 text-sm">
              {a}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Timeline" title="Schedule">
        {EVENT_SCHEDULE.length === 0 ? (
          <EmptyState
            icon="🗓️"
            title="Schedule coming soon"
            text="The timetable will be published here once it is confirmed."
          />
        ) : (
          <ol className="glass divide-y divide-white/10 rounded-2xl">
            {EVENT_SCHEDULE.map((s) => (
              <li key={s.time + s.title} className="flex gap-6 p-5">
                <span className="w-28 shrink-0 font-display text-sm text-gold">{s.time}</span>
                <span>{s.title}</span>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section eyebrow="On stage" title="Guests and performances">
        {EVENT_GUESTS.length === 0 ? (
          <EmptyState
            icon="🎤"
            title="No guests announced yet"
            text="Confirmed guests and performers will be listed here. We only announce what is confirmed."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EVENT_GUESTS.map((g) => (
              <article key={g.name} className="glass rounded-2xl p-5">
                <p className="font-semibold">{g.name}</p>
                <p className="text-sm text-white/60">{g.role}</p>
              </article>
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
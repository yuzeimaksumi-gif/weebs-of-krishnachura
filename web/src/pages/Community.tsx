import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import EmptyState from '../components/EmptyState'
import JoinForm from '../components/JoinForm'
import { GALLERY_PLACEHOLDERS, MEETUPS, SITE, SOCIALS } from '../config/site'

export default function Community() {
  return (
    <>
      <PageHeader eyebrow="Join us" title="Community" subtitle={SITE.intro} />

      <Section id="join" eyebrow="Become a member" title="Join the community">
        <div className="max-w-2xl">
          <JoinForm />
        </div>
      </Section>

      <Section eyebrow="Stay connected" title="Find us online">
        <ul className="flex flex-wrap gap-4">
          {SOCIALS.map((s) => (
            <li key={s.name}>
              {s.url ? (
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost"
                >
                  {s.name}
                </a>
              ) : (
                <span className="inline-flex rounded-xl border border-white/15 px-5 py-3 text-white/50">
                  {s.name} (link coming soon)
                </span>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="In person" title="Upcoming meetups">
        {MEETUPS.length === 0 ? (
          <EmptyState
            icon="🤝"
            title="No meetups scheduled yet"
            text="Meetups will appear here once they are confirmed."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {MEETUPS.map((m) => (
              <article key={m.title} className="glass rounded-2xl p-6">
                <h3 className="font-display text-base font-bold">{m.title}</h3>
                <p className="mt-2 text-sm text-white/70">{m.when}</p>
                <p className="text-sm text-white/70">{m.where}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="Memories" title="Photo gallery">
        <p className="mb-5 text-sm text-white/60">
          Placeholder tiles. Real photos will be added only when we have permission to
          publish them.
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {Array.from({ length: GALLERY_PLACEHOLDERS }, (_, i) => (
            <div
              key={i}
              role="img"
              aria-label="Photo placeholder"
              className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-white/10 text-sm text-white/60"
              style={{
                background: `linear-gradient(${120 + i * 40}deg, rgba(255,77,61,0.5), rgba(255,46,147,0.4), rgba(34,229,255,0.4))`,
              }}
            >
              [Photo]
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Showcase" title="Fan art and community highlights">
        <EmptyState
          icon="🎨"
          title="Fan art submissions open later"
          text="Members will be able to submit original artwork for review. We will only show work that creators have given us permission to display."
        />
        <p className="mt-6 text-sm text-white/60">
          Questions? Visit{' '}
          <Link to="/contact" className="text-neon underline">
            Contact & FAQ
          </Link>
          .
        </p>
      </Section>
    </>
  )
}
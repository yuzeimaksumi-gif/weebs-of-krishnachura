import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import EmptyState from '../components/EmptyState'
import { ABOUT, ACTIVITIES, SITE } from '../config/site'

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Who we are" title="About Us" subtitle={SITE.intro} />

      <Section eyebrow="Our story" title="Why we exist">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-base font-bold text-gold">Our story</h3>
            <p className="mt-3 text-white/80">{ABOUT.story}</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-display text-base font-bold text-gold">Our mission</h3>
            <p className="mt-3 text-white/80">{ABOUT.mission}</p>
          </div>
        </div>
      </Section>

      <Section eyebrow="Everyone is welcome" title="Who we bring together">
        <ul className="flex flex-wrap gap-3">
          {ABOUT.whoWeBring.map((item) => (
            <li key={item} className="rounded-full border border-neon/40 bg-neon/5 px-5 py-2 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Community activities" title="What we do">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map((a, i) => (
            <motion.article
              key={a.title}
              className="glass rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
            >
              <div className="text-3xl" aria-hidden="true">{a.icon}</div>
              <h3 className="mt-3 font-display text-base font-bold">{a.title}</h3>
              <p className="mt-2 text-sm text-white/70">{a.text}</p>
            </motion.article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Looking back" title="Past events">
        {ABOUT.pastEvents.length === 0 ? (
          <EmptyState
            icon="📸"
            title="Our event history is coming soon"
            text="Past events will be listed here once they are added."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {ABOUT.pastEvents.map((e) => (
              <article key={e.title} className="glass rounded-2xl p-6">
                <p className="text-xs uppercase tracking-widest text-neon">{e.date}</p>
                <h3 className="mt-2 font-display text-base font-bold">{e.title}</h3>
                <p className="mt-2 text-sm text-white/70">{e.text}</p>
              </article>
            ))}
          </div>
        )}
      </Section>

      <Section eyebrow="The people" title="Meet the team">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT.team.map((m, i) => (
            <article key={i} className="glass flex items-center gap-4 rounded-2xl p-5">
              <div
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-flame to-blossom text-2xl"
              >
                🌺
              </div>
              <div>
                <p className="font-semibold">{m.name}</p>
                <p className="text-sm text-white/60">{m.role}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow="Be kind" title="Community guidelines">
        <ul className="glass space-y-3 rounded-2xl p-6 text-white/80">
          {ABOUT.guidelines.map((g) => (
            <li key={g} className="flex gap-3">
              <span aria-hidden="true" className="text-flame">✦</span>
              <span>{g}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="Get involved" title="Ways to join us">
        <div className="grid gap-5 md:grid-cols-3">
          {ABOUT.joinWays.map((w) => (
            <article key={w.title} className="glass rounded-2xl p-6">
              <h3 className="font-display text-base font-bold">{w.title}</h3>
              <p className="mt-2 text-sm text-white/70">{w.text}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  )
}
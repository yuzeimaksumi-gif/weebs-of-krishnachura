import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ACTIVITIES, EVENT, MAGAZINE_PREVIEW, SITE } from '../config/site'
import Countdown from '../components/Countdown'
import PetalField from '../components/PetalField'

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative isolate -mt-20 flex min-h-[92vh] items-center overflow-hidden pt-20">
        <div className="hero-sun" aria-hidden="true" />
        <div className="grid-floor" aria-hidden="true" />
        <PetalField />
        <div
          className="absolute inset-0 bg-gradient-to-b from-void/30 via-transparent to-void"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Anime × K-pop × Community
          </motion.p>

          <motion.h1
            className="mt-6 font-display text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-gradient">{SITE.name}</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-white/80 sm:text-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {SITE.headline}
            <br />
            <span className="text-neon">{SITE.tagline}</span>
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Link to="/community" className="btn-ghost">
              Explore the Community
            </Link>
            <Link to="/tickets" className="btn-primary">
              Get Tickets 🎟️
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------- UPCOMING EVENT ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="glass grid gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Upcoming event</p>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{EVENT.name}</h2>
            <dl className="mt-6 space-y-3 text-white/80">
              <div>
                <dt className="text-xs uppercase tracking-widest text-gold">Venue</dt>
                <dd>{EVENT.venue}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-gold">City</dt>
                <dd>{EVENT.city}</dd>
              </div>
            </dl>
            <Link to="/events" className="btn-ghost mt-8">
              Event details
            </Link>
          </div>
          <div className="flex flex-col justify-center">
            <Countdown date={EVENT.date} />
          </div>
        </div>
      </section>

      {/* ---------- ACTIVITIES ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow">What we do</p>
        <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl">Featured activities</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map((a, i) => (
            <motion.article
              key={a.title}
              className="glass rounded-2xl p-6 transition-transform hover:-translate-y-1.5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <div className="text-3xl" aria-hidden="true">{a.icon}</div>
              <h3 className="mt-4 font-display text-base font-bold">{a.title}</h3>
              <p className="mt-2 text-sm text-white/70">{a.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ---------- MAGAZINE TEASER ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">E-Magazine</p>
            <h2 className="mt-3 font-display text-2xl font-bold sm:text-4xl">From the magazine</h2>
          </div>
          <Link to="/magazine" className="btn-ghost !px-4 !py-2 text-sm">
            All stories
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {MAGAZINE_PREVIEW.map((m) => (
            <article key={m.title} className="group overflow-hidden rounded-2xl border border-white/10 bg-panel">
              <div className="h-40 bg-gradient-to-br from-flame/70 via-blossom/60 to-neon/60 transition-transform duration-500 group-hover:scale-105" />
              <div className="relative bg-panel p-5">
                <span className="text-xs font-bold uppercase tracking-widest text-neon">{m.tag}</span>
                <h3 className="mt-2 font-display text-base font-bold">{m.title}</h3>
                <p className="mt-2 text-xs text-white/50">{m.byline}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- FINAL CALL TO ACTION ---------- */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-4xl">
          Ready to join the <span className="text-gradient">celebration</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/70">
          Passes will be available here as soon as the event details are confirmed.
        </p>
        <Link to="/tickets" className="btn-primary mt-8">
          View Passes
        </Link>
      </section>
    </>
  )
}
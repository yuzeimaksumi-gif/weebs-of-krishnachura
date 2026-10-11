import { Link } from 'react-router-dom'
import { NAV_LINKS, SITE, SOCIALS } from '../config/site'

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-ink/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">
            <span aria-hidden="true">🌺 </span>
            <span className="text-gradient">{SITE.name}</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-white/70">{SITE.tagline}</p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link className="text-white/70 hover:text-white" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="text-white/70 hover:text-white" to="/tickets">
                Tickets
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Follow us</p>
          <ul className="mt-4 space-y-2 text-sm">
            {SOCIALS.map((s) => (
              <li key={s.name}>
                {s.url ? (
                  <a
                    className="text-white/70 hover:text-white"
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.name}
                  </a>
                ) : (
                  <span className="text-white/40">{s.name} (link coming soon)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {SITE.name}. A fan community. Not affiliated with any
        anime studio or K-pop agency.
      </div>
    </footer>
  )
}
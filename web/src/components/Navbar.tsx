import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { NAV_LINKS, SITE } from '../config/site'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link rounded-lg px-3 py-2 text-sm font-semibold ${
      isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'
    }`

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className="nav-stage mx-auto max-w-6xl">
        <div className="nav-depth">
          {/* Two decorative glass plates stacked behind the bar for depth */}
          <span aria-hidden="true" className="nav-plate nav-plate-2" />
          <span aria-hidden="true" className="nav-plate nav-plate-1" />

          <nav
            aria-label="Main"
            className="glass nav-panel flex items-center justify-between rounded-2xl px-4 py-3"
          >
            <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <span aria-hidden="true" className="text-2xl">🌺</span>
              <span className="font-display text-sm font-bold tracking-wide">
                <span className="text-gradient">{SITE.shortName}</span>
                <span className="ml-2 hidden text-white/80 sm:inline">{SITE.name}</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
              <Link to="/tickets" className="btn-primary ml-2 !px-5 !py-2 text-sm">
                Get Tickets
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div
          id="mobile-menu"
          className="glass mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl p-3 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/tickets" className="btn-primary mt-2" onClick={() => setOpen(false)}>
            Get Tickets
          </Link>
        </div>
      )}
    </header>
  )
}
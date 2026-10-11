import PageHeader from '../components/PageHeader'
import Section from '../components/Section'
import { CONTACT, FAQ, SOCIALS } from '../config/site'

const GROUPS = ['Event', 'Tickets', 'Accessibility', 'Community']

export default function Contact() {
  const rows = [
    { label: 'Email', value: CONTACT.email },
    { label: 'Phone', value: CONTACT.phone },
    { label: 'Address', value: CONTACT.address },
    { label: 'Hours', value: CONTACT.hours },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact & FAQ"
        subtitle="Answers to common questions, and how to reach us."
      />

      <Section eyebrow="Reach us" title="Contact details">
        <dl className="glass grid gap-6 rounded-2xl p-6 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label}>
              <dt className="text-xs uppercase tracking-widest text-gold">{r.label}</dt>
              <dd className="mt-1 text-white/80">
                {r.value || <span className="text-white/40">[Coming soon]</span>}
              </dd>
            </div>
          ))}
          <div className="sm:col-span-2">
            <dt className="text-xs uppercase tracking-widest text-gold">Official social media</dt>
            <dd className="mt-2 flex flex-wrap gap-3">
              {SOCIALS.map((s) =>
                s.url ? (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon underline"
                  >
                    {s.name}
                  </a>
                ) : (
                  <span key={s.name} className="text-white/40">
                    {s.name} (link coming soon)
                  </span>
                ),
              )}
            </dd>
          </div>
        </dl>
      </Section>

      {GROUPS.map((group) => {
        const items = FAQ.filter((f) => f.group === group)
        if (items.length === 0) return null
        return (
          <Section key={group} eyebrow="FAQ" title={group}>
            <div className="space-y-3">
              {items.map((f) => (
                <details key={f.q} className="glass group rounded-2xl p-5">
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {f.q}
                      <span aria-hidden="true" className="text-neon transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-white/75">{f.a}</p>
                </details>
              ))}
            </div>
          </Section>
        )
      })}
    </>
  )
}
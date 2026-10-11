type Props = {
  eyebrow: string
  title: string
  subtitle?: string
}

export default function PageHeader({ eyebrow, title, subtitle }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8 pt-16 sm:pt-24">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-display text-3xl font-black leading-tight sm:text-5xl">
        <span className="text-gradient">{title}</span>
      </h1>
      {subtitle && <p className="mt-5 max-w-2xl text-lg text-white/70">{subtitle}</p>}
    </section>
  )
}
import type { ReactNode } from 'react'

type Props = {
  eyebrow: string
  title: string
  children: ReactNode
  id?: string
}

// A titled block used on every content page.
export default function Section({ eyebrow, title, children, id }: Props) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-6 py-10">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}
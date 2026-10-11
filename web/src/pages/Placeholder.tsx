import PageHeader from '../components/PageHeader'

type Props = {
  eyebrow: string
  title: string
  stage: string
}

// Temporary page used until the real page is built in a later stage.
export default function Placeholder({ eyebrow, title, stage }: Props) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} />
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="glass rounded-2xl p-8 text-white/80">
          This page is under construction. It will be built in <strong>{stage}</strong>.
        </div>
      </section>
    </>
  )
}
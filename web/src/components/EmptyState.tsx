type Props = {
  icon?: string
  title: string
  text: string
}

// Friendly message shown when a list has no content yet.
export default function EmptyState({ icon = '🌸', title, text }: Props) {
  return (
    <div className="glass rounded-2xl p-8 text-center">
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <p className="mt-3 font-display text-base font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-white/70">{text}</p>
    </div>
  )
}
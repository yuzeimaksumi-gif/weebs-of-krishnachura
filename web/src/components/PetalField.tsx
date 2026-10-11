import type { CSSProperties } from 'react'

// Falling krishnachura petals. Positions are fixed (not random) so
// the layout is stable between renders.
const PETALS = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i * 1.7) % 9}s`,
  dur: `${9 + ((i * 3) % 7)}s`,
  size: `${10 + ((i * 5) % 14)}px`,
}))

export default function PetalField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              '--left': p.left,
              '--delay': p.delay,
              '--dur': p.dur,
              '--size': p.size,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
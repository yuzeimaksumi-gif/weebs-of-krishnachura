import PetalField from './PetalField'

// The lightweight CSS-only hero background (no WebGL needed).
export default function HeroFallback() {
  return (
    <>
      <div className="hero-sun" aria-hidden="true" />
      <div className="grid-floor" aria-hidden="true" />
      <PetalField />
    </>
  )
}
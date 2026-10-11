import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import HeroFallback from './HeroFallback'
import SceneErrorBoundary from './SceneErrorBoundary'

// "lazy" means the 3D code is only downloaded when it is needed,
// so the rest of the page loads fast.
const Scene3D = lazy(() => import('./Scene3D'))

type NavigatorExtras = Navigator & {
  deviceMemory?: number
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}

function isLowPower() {
  const nav = navigator as NavigatorExtras
  return (
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4 ||
    window.innerWidth < 768
  )
}

export default function HeroBackground() {
  // 3D is always used, unless the visitor's device asks for reduced
  // motion or has no WebGL. (Checked once.)
  const [canUse3D] = useState(() => !prefersReducedMotion() && hasWebGL())
  const [lowPower] = useState(isLowPower)

  // Pause 3D rendering when the hero is not on screen (saves battery).
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {canUse3D ? (
        <SceneErrorBoundary fallback={<HeroFallback />}>
          <Suspense fallback={<HeroFallback />}>
            <div className="absolute inset-0" aria-hidden="true">
              <Scene3D lowPower={lowPower} active={visible} />
            </div>
          </Suspense>
        </SceneErrorBoundary>
      ) : (
        <HeroFallback />
      )}
    </div>
  )
}
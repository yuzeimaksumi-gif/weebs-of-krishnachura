import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ---------- Settings you can tweak ----------
const BG = '#07060f'
const CYAN = '#22e5ff'
const PINK = '#ff2e93'
const DEPTH = 48 // how long the tunnel is
const SPACING = 4 // distance between frames
const FRAME_COUNT = DEPTH / SPACING
const SPEED = 3 // how fast we fly forward
const FRAME_W = 14
const FRAME_H = 8
const THICK = 0.1

// ---------- Small helpers that draw textures with code ----------
function makeSunTexture() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#ffc857')
  grad.addColorStop(0.5, '#ff4d3d')
  grad.addColorStop(1, '#ff2e93')
  g.fillStyle = grad
  g.beginPath()
  g.arc(128, 128, 126, 0, Math.PI * 2)
  g.fill()
  // Cut horizontal stripes out of the lower half (retro sunset look)
  g.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 7; i++) {
    g.fillRect(0, 140 + i * 16, 256, 2 + i * 1.6)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function makeDotTexture() {
  const c = document.createElement('canvas')
  c.width = 64
  c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

// ---------- Neon frames that rush toward the camera ----------
function TunnelFrames() {
  const refs = useRef<(THREE.Group | null)[]>([])

  useFrame((state) => {
    const offset = state.clock.elapsedTime * SPEED
    refs.current.forEach((group, i) => {
      if (!group) return
      const d = (((i * SPACING - offset) % DEPTH) + DEPTH) % DEPTH
      group.position.z = -d
    })
  })

  return (
    <>
      {Array.from({ length: FRAME_COUNT }, (_, i) => {
        const color = i % 2 === 0 ? CYAN : PINK
        return (
          <group
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
          >
            <mesh position={[0, FRAME_H / 2, 0]}>
              <boxGeometry args={[FRAME_W, THICK, THICK]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, -FRAME_H / 2, 0]}>
              <boxGeometry args={[FRAME_W, THICK, THICK]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[-FRAME_W / 2, 0, 0]}>
              <boxGeometry args={[THICK, FRAME_H, THICK]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[FRAME_W / 2, 0, 0]}>
              <boxGeometry args={[THICK, FRAME_H, THICK]} />
              <meshBasicMaterial color={color} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

// ---------- Moving grid (used for the floor and the ceiling) ----------
function MovingGrid({ y, colorA, colorB }: { y: number; colorA: string; colorB: string }) {
  const ref = useRef<THREE.GridHelper>(null)
  useFrame((state) => {
    if (ref.current) {
      // The grid has 2-unit cells, so sliding by up to 2 loops seamlessly.
      ref.current.position.z = -30 + ((state.clock.elapsedTime * SPEED) % 2)
    }
  })
  return <gridHelper ref={ref} args={[120, 60, colorA, colorB]} position={[0, y, -30]} />
}

// ---------- Striped sunset at the end of the tunnel ----------
function Sun() {
  const texture = useMemo(() => makeSunTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <mesh position={[0, 1, -50]}>
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial map={texture} transparent fog={false} />
    </mesh>
  )
}

// ---------- Swinging concert light beams ----------
const BEAM_X = [-12, -6, 0, 6, 12]

function Beams() {
  const groups = useRef<(THREE.Group | null)[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    groups.current.forEach((g, i) => {
      if (g) g.rotation.z = Math.sin(t * 0.5 + i * 1.3) * 0.55
    })
  })

  return (
    <>
      {BEAM_X.map((x, i) => (
        <group
          key={x}
          position={[x, 7, -42]}
          ref={(el) => {
            groups.current[i] = el
          }}
        >
          <mesh position={[0, -18, 0]}>
            <planeGeometry args={[1.4, 36]} />
            <meshBasicMaterial
              color={i % 2 ? CYAN : PINK}
              transparent
              opacity={0.16}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              fog={false}
            />
          </mesh>
        </group>
      ))}
    </>
  )
}

// ---------- Drifting krishnachura petals ----------
function Petals({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const texture = useMemo(() => makeDotTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])

  const { positions, speeds } = useMemo(() => {
    const p = new Float32Array(count * 3)
    const s = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 18
      p[i * 3 + 1] = Math.random() * 9 - 4
      p[i * 3 + 2] = Math.random() * 30 - 26
      s[i] = 0.4 + Math.random() * 0.8
    }
    return { positions: p, speeds: s }
  }, [count])

  useFrame((state, delta) => {
    const points = ref.current
    if (!points) return
    const dt = Math.min(delta, 0.05)
    const attr = points.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= speeds[i] * dt
      arr[i * 3] += Math.sin(t + i) * 0.2 * dt
      if (arr[i * 3 + 1] < -4) arr[i * 3 + 1] = 5
    }
    attr.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color="#ff6a4d"
        size={0.2}
        transparent
        opacity={0.9}
        alphaTest={0.05}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// ---------- Camera drifts gently toward the pointer ----------
function CameraRig() {
  useFrame((state) => {
    const { camera, pointer } = state
    camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.04
    camera.position.y += (0.6 + pointer.y * 0.6 - camera.position.y) * 0.04
    camera.lookAt(0, 0.5, -30)
  })
  return null
}

// ---------- The whole scene ----------
type SceneProps = {
  lowPower: boolean // weaker devices get a lighter scene
  active: boolean // false when the hero is scrolled out of view
}

export default function Scene3D({ lowPower, active }: SceneProps) {
  return (
    <Canvas
      dpr={lowPower ? 1 : [1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.6, 6], fov: 60, near: 0.1, far: 120 }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 10, 46]} />

      <Sun />
      <TunnelFrames />
      <MovingGrid y={-4} colorA={PINK} colorB={CYAN} />
      <MovingGrid y={4} colorA={CYAN} colorB={PINK} />
      {!lowPower && <Beams />}
      <Petals count={lowPower ? 40 : 100} />
      <CameraRig />
    </Canvas>
  )
}
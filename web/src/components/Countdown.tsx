import { useEffect, useState } from 'react'

function remaining(target: number) {
  const ms = Math.max(0, target - Date.now())
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
    done: ms === 0,
  }
}

export default function Countdown({ date }: { date: string | null }) {
  const target = date ? new Date(date).getTime() : NaN
  const invalid = Number.isNaN(target)
  const [time, setTime] = useState(() => remaining(target))

  useEffect(() => {
    if (invalid) return
    const id = setInterval(() => setTime(remaining(target)), 1000)
    return () => clearInterval(id)
  }, [target, invalid])

  if (invalid) {
    return (
      <p className="text-white/70">
        Date to be announced. The countdown will start as soon as it is confirmed.
      </p>
    )
  }

  if (time.done) {
    return <p className="font-display text-xl text-gold">Event day is here! 🎉</p>
  }

  const boxes = [
    { label: 'Days', value: time.days },
    { label: 'Hours', value: time.hours },
    { label: 'Minutes', value: time.minutes },
    { label: 'Seconds', value: time.seconds },
  ]

  return (
    <div className="grid grid-cols-4 gap-3" role="timer" aria-label="Countdown to the event">
      {boxes.map((b) => (
        <div key={b.label} className="rounded-xl border border-white/10 bg-black/30 p-3 text-center">
          <div className="font-display text-2xl font-bold text-white sm:text-4xl">
            {String(b.value).padStart(2, '0')}
          </div>
          <div className="mt-1 text-[0.65rem] uppercase tracking-widest text-neon">{b.label}</div>
        </div>
      ))}
    </div>
  )
}
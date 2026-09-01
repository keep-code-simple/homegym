import { useCallback, useEffect, useRef, useState } from 'react'
import { cycleProgress, type Phase } from './tempo'

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/**
 * Drives one rep on the prescribed tempo. Time is accumulated per frame rather
 * than read off a start stamp, so changing speed mid-rep does not jump.
 */
export function useDemoLoop(active: boolean) {
  const [playing, setPlaying] = useState(true)
  const [slow, setSlow] = useState(false)
  const [state, setState] = useState<{ progress: number; phase: Phase; elapsed: number }>({
    progress: 0,
    phase: 'pause',
    elapsed: 0,
  })

  const elapsed = useRef(0)
  const last = useRef<number | null>(null)
  const slowRef = useRef(slow)
  useEffect(() => { slowRef.current = slow }, [slow])

  useEffect(() => {
    if (!active || !playing) {
      last.current = null
      return
    }
    let raf = 0
    const tick = (now: number) => {
      if (last.current !== null) {
        const dt = Math.min(now - last.current, 100) // survive a backgrounded tab
        elapsed.current += dt * (slowRef.current ? 0.5 : 1)
        setState({ ...cycleProgress(elapsed.current), elapsed: elapsed.current })
      }
      last.current = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, playing])

  const restart = useCallback(() => {
    elapsed.current = 0
    setState({ progress: 0, phase: 'pause', elapsed: 0 })
  }, [])

  return { ...state, playing, setPlaying, slow, setSlow, restart }
}

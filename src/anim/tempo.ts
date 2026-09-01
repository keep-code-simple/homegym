/**
 * The tempo is the teaching point: a slow eccentric is what we want the boys to
 * copy, so the demo never moves faster than they should.
 */
export const TEMPO = { up: 1000, hold: 1000, down: 2000, pause: 500 } as const

export const CYCLE = TEMPO.up + TEMPO.hold + TEMPO.down + TEMPO.pause

export type Phase = 'up' | 'hold' | 'down' | 'pause'

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/** Where we are in the rep: 0 = start position, 1 = peak. */
export function cycleProgress(elapsed: number): { progress: number; phase: Phase } {
  const t = ((elapsed % CYCLE) + CYCLE) % CYCLE
  if (t < TEMPO.up) return { progress: easeInOut(t / TEMPO.up), phase: 'up' }
  if (t < TEMPO.up + TEMPO.hold) return { progress: 1, phase: 'hold' }
  if (t < TEMPO.up + TEMPO.hold + TEMPO.down) {
    const d = (t - TEMPO.up - TEMPO.hold) / TEMPO.down
    return { progress: 1 - easeInOut(d), phase: 'down' }
  }
  return { progress: 0, phase: 'pause' }
}

export const PHASE_LABEL: Record<Phase, string> = {
  up: 'Lift',
  hold: 'Hold',
  down: 'Lower slowly',
  pause: 'Reset',
}

/**
 * How many reps have been counted at this point in a set.
 *
 * A rep counts at the top of the lift, not at the end of the cycle -- that is
 * the moment a person says the number out loud, and waiting until after the
 * slow lower would leave the counter reading zero for the first four seconds.
 */
export function repsCompletedAt(elapsed: number): number {
  return Math.max(0, Math.floor((elapsed - TEMPO.up) / CYCLE) + 1)
}

/** A set of `reps` at this tempo takes exactly this long. */
export const setDurationMs = (reps: number) => reps * CYCLE

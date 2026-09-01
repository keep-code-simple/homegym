import { useCallback, useEffect, useState } from 'react'
import { CYCLE, repsCompletedAt } from './tempo'
import type { Exercise } from '../types/program'
import type { useDemoLoop } from './useDemoLoop'

/** Roughly how long the other two take to have their turn on the stack. */
export const REST_SECONDS = 60

export type RunnerPhase = 'idle' | 'working' | 'resting' | 'done'

/**
 * Runs one person through their sets on one exercise, counting off the same
 * clock that drives the figure -- so the number on screen and the body on
 * screen can never drift apart.
 *
 * Everything that can be derived from that clock is derived from it: which rep
 * they are on, whether the set is over, how much rest is left. The only stored
 * state is what a person actually chose. That leaves exactly one moment where
 * time has to move state along -- the end of a set -- and one effect to do it.
 *
 * Nothing here is written to storage. Reps, sets and times live for as long as
 * the screen is open and no longer: the moment durations persist, the boys'
 * screens are one step from a personal best, which this app does not do.
 */
export function useSetRunner(
  exercise: Exercise,
  loop: ReturnType<typeof useDemoLoop>,
  initialPersonId: string,
  /**
   * Session mode hands out one set at a time, because the rotation -- not this
   * hook -- decides when a person is up again. A single-set runner is also a
   * runner with no rest: its one set is its last, so it reports done the moment
   * the set ends instead of starting a countdown nobody would sit through.
   */
  setsOverride?: number,
) {
  const [personId, setPerson] = useState(initialPersonId)
  const [stage, setStage] = useState<'idle' | 'running' | 'done'>('idle')
  const [setIndex, setSetIndex] = useState(0)

  const pres = exercise.prescription[personId]
  const isHold = Boolean(pres && 'holdSeconds' in pres)
  const sets = setsOverride ?? pres?.sets ?? 0
  const targetReps = pres && 'reps' in pres ? pres.reps[1] : 0
  const minReps = pres && 'reps' in pres ? pres.reps[0] : 0
  const holdSeconds = pres && 'holdSeconds' in pres ? pres.holdSeconds : 0

  // A rep set runs a full cycle per rep, so the last slow lower is not cut off.
  const setEndMs = isHold ? holdSeconds * 1000 : targetReps * CYCLE
  const restMs = REST_SECONDS * 1000
  const isLastSet = setIndex + 1 >= sets

  const running = stage === 'running'
  const resting = running && loop.elapsed >= setEndMs
  const working = running && !resting

  const phase: RunnerPhase = stage === 'running' ? (resting ? 'resting' : 'working') : stage

  const reps = working && !isHold
    ? Math.min(repsCompletedAt(loop.elapsed), targetReps)
    : 0
  const holdLeft = working && isHold
    ? Math.max(0, Math.ceil(holdSeconds - loop.elapsed / 1000))
    : holdSeconds
  const restLeft = resting
    ? Math.max(0, Math.ceil((setEndMs + restMs - loop.elapsed) / 1000))
    : REST_SECONDS

  const nextSet = useCallback(() => {
    if (isLastSet) setStage('done')
    else { setSetIndex((i) => i + 1); setStage('idle') }
  }, [isLastSet])

  // The one place time has to move state along: synchronising with the rAF
  // clock, which is an external system. The last set skips the rest and reports
  // done immediately rather than making anyone sit through a countdown.
  // Synchronising with the rAF clock is the exception this rule documents: a set
  // ending is a moment in time, not something a render or an event can derive.
  useEffect(() => {
    if (stage !== 'running') return
    const boundary = isLastSet ? setEndMs : setEndMs + restMs
    if (loop.elapsed < boundary) return
    // oxlint-disable-next-line react/set-state-in-effect
    nextSet()
  }, [stage, loop.elapsed, isLastSet, setEndMs, restMs, nextSet])

  const start = useCallback(() => {
    loop.restart()
    loop.setPlaying(true)
    setStage('running')
  }, [loop])

  /** Stop abandons the set; it does not count. */
  const stop = useCallback(() => setStage('idle'), [])
  const skipRest = useCallback(() => nextSet(), [nextSet])
  const again = useCallback(() => { setSetIndex(0); setStage('idle') }, [])

  const choosePerson = useCallback((id: string) => {
    setPerson(id)
    setSetIndex(0)
    setStage('idle')
  }, [])

  return {
    personId, choosePerson,
    phase, setIndex, sets,
    isHold, reps, targetReps, minReps, holdLeft, holdSeconds,
    restLeft,
    start, stop, skipRest, again,
  }
}

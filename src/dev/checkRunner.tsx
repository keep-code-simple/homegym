import { renderToStaticMarkup } from 'react-dom/server'
import { CYCLE, TEMPO, repsCompletedAt } from '../anim/tempo'
import { SetRunner } from '../components/SetRunner'
import { PEOPLE } from '../data/people'
import type { useSetRunner } from '../anim/useSetRunner'
import type { useDemoLoop } from '../anim/useDemoLoop'

type Runner = ReturnType<typeof useSetRunner>
type Loop = ReturnType<typeof useDemoLoop>

function assert(label: string, got: unknown, want: unknown, out: string[]) {
  const ok = got === want
  out.push(`${ok ? 'ok  ' : 'FAIL'} ${label}: got ${got}${ok ? '' : `, want ${want}`}`)
}

export function checkRunner(): string[] {
  const out: string[] = []

  // A rep lands at the top of the lift, not at the end of the cycle.
  assert('rep count at t=0', repsCompletedAt(0), 0, out)
  assert('just before the top of rep 1', repsCompletedAt(TEMPO.up - 1), 0, out)
  assert('at the top of rep 1', repsCompletedAt(TEMPO.up), 1, out)
  assert('at the top of rep 2', repsCompletedAt(TEMPO.up + CYCLE), 2, out)

  // The set must end with the counter reading exactly the target -- the last
  // rep is not done until its slow lower is done.
  for (const target of [12, 15]) {
    assert(`counter at end of a ${target}-rep set`, repsCompletedAt(target * CYCLE), target, out)
    assert(`counter one cycle earlier`, repsCompletedAt((target - 1) * CYCLE), target - 1, out)
  }
  out.push(`--- a 12-rep set takes ${(12 * CYCLE) / 1000}s, a 15-rep set ${(15 * CYCLE) / 1000}s`)

  // Every phase of the runner renders.
  const loop = { phase: 'down' } as Loop
  const base = {
    personId: 'son1', choosePerson: () => {},
    setIndex: 1, sets: 3, isHold: false,
    reps: 7, targetReps: 12, minReps: 10, holdLeft: 0, holdSeconds: 0,
    restLeft: 45, start: () => {}, stop: () => {}, skipRest: () => {}, again: () => {},
  }
  for (const phase of ['idle', 'working', 'resting', 'done'] as const) {
    const html = renderToStaticMarkup(
      <SetRunner runner={{ ...base, phase } as Runner} loop={loop}
        people={PEOPLE} pin={4} usesStack />,
    )
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    out.push(`${phase.padEnd(8)} -> ${text}`)
  }

  // A hold shows a countdown instead of reps.
  const hold = renderToStaticMarkup(
    <SetRunner
      runner={{ ...base, phase: 'working', isHold: true, holdLeft: 23, holdSeconds: 25 } as Runner}
      loop={loop} people={PEOPLE} pin={0} usesStack={false} />,
  )
  out.push(`hold     -> ${hold.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`)
  return out
}

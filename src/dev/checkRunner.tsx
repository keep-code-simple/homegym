import { renderToStaticMarkup } from 'react-dom/server'
import { CYCLE, TEMPO, repsCompletedAt } from '../anim/tempo'
import { Handoff } from '../components/SessionTurn'
import { SetRunner } from '../components/SetRunner'
import { PEOPLE } from '../data/people'
import { DAY1 } from '../data/exercises/day1'
import { pinCall, planSession, setsLeft } from '../data/session'
import { stubLoop } from './stubLoop'
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

  // ---- the session rotation ----
  const turns = planSession(DAY1, PEOPLE)
  assert('turns in Day 1', turns.length, 35, out)
  assert('turns per exercise', turns.length / DAY1.length, 7, out)

  const firstExercise = turns.filter((t) => t.exercise === DAY1[0]).map((t) => t.personId)
  assert('who takes the first exercise, in order',
    firstExercise.join(' '), 'dad son1 son2 dad son1 son2 dad', out)

  // Whoever has the extra sets must not end up lifting twice in a row inside an
  // exercise -- that is the whole reason the rotation orders people by sets.
  const doubled = turns.filter((t, i) =>
    i > 0 && turns[i - 1].exercise === t.exercise && turns[i - 1].personId === t.personId)
  assert('back-to-back sets within an exercise', doubled.length, 0, out)

  const left = setsLeft(turns, 0)
  assert('sets left at the first turn',
    `${left.dad} ${left.son1} ${left.son2}`, '3 2 2', out)

  // The handoff always says what the machine needs, including "nothing".
  assert('pin call, same weight', pinCall(turns[0], turns[1], 4, 4), 'Pin stays at 4 (40 lb).', out)
  assert('pin call, lighter', pinCall(turns[0], turns[1], 5, 2), 'Move the pin from 5 to 2 (20 lb).', out)
  assert('pin call, off the floor', pinCall(turns[34], turns[0], 0, 5), 'Set the pin to 5 (50 lb).', out)
  assert('pin call, last set of the day', pinCall(turns[34], undefined, 0, 0), null, out)
  assert('pin call, bodyweight next', pinCall(turns[27], turns[28], 4, 0), null, out)

  // Every phase of the runner renders.
  const loop = { ...stubLoop, phase: 'down' } as Loop
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
  // The handoff carries the instructions for the gap between two sets, so every
  // shape of that gap gets read here rather than discovered mid-session.
  const handoffs: [string, number, number, number][] = [
    ['next person, same weight', 0, 4, 4],
    ['next person, new weight', 1, 5, 2],
    ['new station', 6, 5, 4],
    ['same lifter again', 27, 4, 0],
    ['last set of the day', 34, 0, 0],
  ]
  for (const [label, i, pin, nextPin] of handoffs) {
    const next = turns[i + 1]
    const html = renderToStaticMarkup(
      <Handoff turn={turns[i]} next={next}
        nextName={PEOPLE.find((p) => p.id === next?.personId)?.name}
        pin={pin} nextPin={nextPin} />,
    )
    out.push(`${label.padEnd(24)} -> ${html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}`)
  }

  return out
}

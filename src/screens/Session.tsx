import { useMemo, useState } from 'react'
import { useDemoLoop } from '../anim/useDemoLoop'
import { CrewTicks } from '../components/CrewTicks'
import { SessionTurn } from '../components/SessionTurn'
import { getExercise } from '../data/exercises'
import { planSession } from '../data/session'
import { WARMUP } from '../data/program'
import type { Day, Person } from '../types/program'
import type { useStore } from '../storage/useStore'

type Step =
  | { kind: 'warmup' }
  | { kind: 'turn'; index: number }
  | { kind: 'done' }

type Props = {
  day: Day
  people: Person[]
  store: ReturnType<typeof useStore>
  onBack: () => void
}

/**
 * The whole day, run as one rotation: warm-up, then every set of every exercise
 * handed to whoever is up next, then the tick.
 *
 * One clock for the session, handed down to each turn, so the figure and the
 * count are the same rep here as they are on the exercise screen.
 */
export function Session({ day, people, store, onBack }: Props) {
  const loop = useDemoLoop(true)
  const exercises = useMemo(() => day.exercises.map(getExercise), [day.exercises])
  const turns = useMemo(() => planSession(exercises, people), [exercises, people])

  const [step, setStep] = useState<Step>({ kind: 'warmup' })

  const advance = () => setStep((s) => {
    const next = s.kind === 'turn' ? s.index + 1 : 0
    return next < turns.length ? { kind: 'turn', index: next } : { kind: 'done' }
  })

  const setsDone = step.kind === 'turn' ? step.index : step.kind === 'done' ? turns.length : 0

  return (
    <div className="app">
      <button className="back" onClick={onBack}>End session</button>

      <header className="sess-head">
        <h1 className="display">Day {day.id} · {day.focus}</h1>
        <p className="sess-count">
          {setsDone} of {turns.length} sets · {exercises.length} exercises
        </p>
        <div className="sess-bar" role="presentation">
          <span style={{ width: `${turns.length ? (setsDone / turns.length) * 100 : 0}%` }} />
        </div>
      </header>

      {step.kind === 'warmup' && (
        <>
          <section className="warmup">
            <h2 className="display">Warm-up · {WARMUP.minutes} min</h2>
            <ul>{WARMUP.items.map((w) => <li key={w}>{w}</li>)}</ul>
          </section>
          <p className="sess-note">
            Everyone warms up together. Then you take the machine in turns — one
            set each, round and round, so nobody is standing still for long.
          </p>
          <button className="start-session" onClick={advance}>
            Warmed up — start lifting
          </button>
        </>
      )}

      {step.kind === 'turn' && (
        <SessionTurn key={step.index} turns={turns} index={step.index}
          people={people} store={store} loop={loop}
          exerciseCount={exercises.length} onNext={advance} />
      )}

      {step.kind === 'done' && (
        <section className="sess-done">
          <p className="sess-done-big display">That is Day {day.id} done</p>
          <p className="sess-note">
            Stack down, pin back to the top, handles hung up. Tick off who
            actually trained.
          </p>
          <CrewTicks people={people} store={store} dayId={day.id} what={day.focus} />
          <button className="start-session" onClick={onBack}>Back to the week</button>
        </section>
      )}
    </div>
  )
}

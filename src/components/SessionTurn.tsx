import { useSetRunner } from '../anim/useSetRunner'
import { PLATE_HEX } from '../data/people'
import { PLATE_LB } from '../data/program'
import { pinCall, setsLeft, type Turn } from '../data/session'
import type { Person } from '../types/program'
import type { useDemoLoop } from '../anim/useDemoLoop'
import type { useStore } from '../storage/useStore'
import { ExerciseDemo } from './ExerciseDemo'
import { PinControl } from './PinControl'
import { RunnerStage } from './RunnerStage'
import './SessionTurn.css'

type Props = {
  turns: Turn[]
  index: number
  people: Person[]
  store: ReturnType<typeof useStore>
  /** The session's one clock, shared with the demonstration. */
  loop: ReturnType<typeof useDemoLoop>
  exerciseCount: number
  onNext: () => void
}

/**
 * One turn of the rotation: this person, this exercise, one set.
 *
 * The runner is handed a single set because the rotation decides when someone
 * is up again, not the runner. That also means no rest countdown here -- the
 * rest is the other two taking their turn, which is the whole reason three
 * people can share one stack.
 *
 * Mounted with the turn index as its key, so every turn starts from a clean
 * runner rather than needing an effect to reset one.
 */
export function SessionTurn({
  turns, index, people, store, loop, exerciseCount, onNext,
}: Props) {
  const turn = turns[index]
  const next: Turn | undefined = turns[index + 1]
  const runner = useSetRunner(turn.exercise, loop, turn.personId, 1)

  const person = people.find((p) => p.id === turn.personId) ?? people[0]
  const nextPerson = next && people.find((p) => p.id === next.personId)
  const usesStack = turn.exercise.station !== 'floor'
  const pin = store.getPin(turn.personId, turn.exercise.id)
  const nextPin = next ? store.getPin(next.personId, next.exercise.id) : 0
  const left = setsLeft(turns, index)

  const meta = `${person.name} · set ${turn.setIndex + 1} of ${turn.sets}` +
    (usesStack ? ` · pin ${pin} (${pin * PLATE_LB} lb)` : '')

  return (
    <>
      <header className="turn-head">
        <span className="turn-pos stencil">{turn.exerciseIndex + 1}/{exerciseCount}</span>
        <span className="turn-name">
          <span className="display">{turn.exercise.name}</span>
          <span className="turn-station">{turn.exercise.stationLabel}</span>
        </span>
      </header>

      <ExerciseDemo
        exercise={turn.exercise}
        loop={loop}
        pin={pin}
        plateColour={PLATE_HEX[turn.personId] ?? PLATE_HEX.dad}
        locked={runner.phase === 'working'}
      />

      <section className="runner" style={{ '--plate': person.plateColour } as React.CSSProperties}>
        <div className="runner-who" role="group" aria-label="The rotation">
          {people.map((p) => {
            const remaining = left[p.id] ?? 0
            return (
              <span key={p.id}
                className={`who is-static ${p.id === turn.personId ? 'is-on' : ''}`}
                style={{ '--plate': p.plateColour } as React.CSSProperties}>
                <b>{p.name}</b>
                <span className="who-left">
                  {remaining === 0 ? 'done' : `${remaining} left`}
                </span>
              </span>
            )
          })}
        </div>

        <RunnerStage runner={runner} loop={loop} meta={meta} doneText="Set done" />

        {runner.phase === 'done' && (
          <Handoff turn={turn} next={next} nextName={nextPerson?.name}
            pin={pin} nextPin={nextPin} />
        )}

        <div className="runner-controls">
          {runner.phase === 'idle' && (
            <>
              <button className="runner-go" onClick={runner.start}>Start set</button>
              <button className="turn-skip" onClick={onNext}>
                Skip {person.name}&rsquo;s set
              </button>
            </>
          )}
          {runner.phase === 'working' && (
            <button className="runner-go is-stop" onClick={runner.stop}>Stop</button>
          )}
          {runner.phase === 'done' && (
            <button className="runner-go" onClick={onNext}>
              {nextPerson ? `${nextPerson.name} is up` : 'Finish the session'}
            </button>
          )}
        </div>

        {usesStack && runner.phase === 'idle' && (
          <div className="turn-pin">
            <span className="turn-pin-who">{person.name}&rsquo;s pin</span>
            <PinControl pin={pin}
              onChange={(n) => store.setPin(turn.personId, turn.exercise.id, n)} />
          </div>
        )}
      </section>

      <section className="panel is-cues">
        <h2 className="display">Cues</h2>
        <ul>{turn.exercise.cues.map((c) => <li key={c}>{c}</li>)}</ul>
      </section>
    </>
  )
}

/**
 * What happens between this set and the next one, in the order the room needs
 * it: who is up, what the pin has to do, and -- when the station changes -- how
 * the machine is set up for it. This is the screen everybody is looking at
 * while the plates get moved, so it carries the instructions rather than the
 * congratulation.
 */
export function Handoff({ turn, next, nextName, pin, nextPin }: {
  turn: Turn
  next: Turn | undefined
  nextName: string | undefined
  pin: number
  nextPin: number
}) {
  const call = pinCall(turn, next, pin, nextPin)
  // A new station is the one real break in the rotation: seat, handles and side
  // of the machine all change, so the handoff hands the setup over as well.
  const newStation = next && next.exercise !== turn.exercise ? next.exercise : undefined

  return (
    <div className="handoff">
      <p className="handoff-next">
        {next && nextName
          ? <>
              <span className="handoff-tag stencil">Next</span>
              {nextName}
              {newStation && ` · ${newStation.name}`}
            </>
          : 'That was the last set of the day.'}
      </p>
      {call && <p className="handoff-pin">{call}</p>}
      {next && next.personId === turn.personId && (
        <p className="handoff-pin">
          {nextName} again — setting the next station up is the rest.
        </p>
      )}
      {newStation && (
        <ul className="handoff-setup">
          {newStation.setup.map((line) => <li key={line}>{line}</li>)}
        </ul>
      )}
    </div>
  )
}

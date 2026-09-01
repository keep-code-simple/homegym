import { PLATE_LB } from '../data/program'
import { PHASE_LABEL } from '../anim/tempo'
import type { useSetRunner } from '../anim/useSetRunner'
import type { useDemoLoop } from '../anim/useDemoLoop'
import type { Person } from '../types/program'
import './SetRunner.css'

type Props = {
  runner: ReturnType<typeof useSetRunner>
  loop: ReturnType<typeof useDemoLoop>
  people: Person[]
  pin: number
  usesStack: boolean
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/**
 * The coach: whose turn, what number they are on, and what their body should be
 * doing this second. Sized to be read from across the room.
 *
 * No elapsed time is shown during a rep set on purpose. A visible clock while
 * you lift invites racing, and the slow lower is the whole point of the tempo.
 * Time only appears where time is the exercise, and while resting.
 */
export function SetRunner({ runner, loop, people, pin, usesStack }: Props) {
  const person = people.find((p) => p.id === runner.personId) ?? people[0]
  const { phase } = runner

  return (
    <section className="runner" style={{ '--plate': person.plateColour } as React.CSSProperties}>
      <div className="runner-who" role="group" aria-label="Whose turn">
        {people.map((p) => (
          <button key={p.id}
            className={`who ${p.id === runner.personId ? 'is-on' : ''}`}
            style={{ '--plate': p.plateColour } as React.CSSProperties}
            aria-pressed={p.id === runner.personId}
            onClick={() => runner.choosePerson(p.id)}>
            {p.name}
          </button>
        ))}
      </div>

      <div className="runner-stage">
        {phase === 'working' && !runner.isHold && (
          <>
            <p className="runner-count stencil">
              {runner.reps}<span className="runner-of">/{runner.targetReps}</span>
            </p>
            <p className="runner-phase stencil">{PHASE_LABEL[loop.phase]}</p>
          </>
        )}

        {phase === 'working' && runner.isHold && (
          <>
            <p className="runner-count stencil">{runner.holdLeft}</p>
            <p className="runner-phase stencil">Hold still</p>
          </>
        )}

        {phase === 'resting' && (
          <>
            <p className="runner-count stencil is-rest">{mmss(runner.restLeft)}</p>
            <p className="runner-phase stencil">Rest — others are lifting</p>
          </>
        )}

        {phase === 'idle' && (
          <p className="runner-ready stencil">
            {runner.isHold
              ? `${runner.holdSeconds} seconds`
              : `${runner.minReps}–${runner.targetReps} reps`}
          </p>
        )}

        {phase === 'done' && (
          <p className="runner-ready stencil">All {runner.sets} sets done</p>
        )}

        <p className="runner-meta">
          {phase === 'done'
            ? `${person.name} is finished on this one`
            : `${person.name} · set ${runner.setIndex + 1} of ${runner.sets}`}
          {usesStack && phase !== 'done' && ` · pin ${pin} (${pin * PLATE_LB} lb)`}
        </p>
      </div>

      <div className="runner-controls">
        {phase === 'idle' && (
          <button className="runner-go" onClick={runner.start}>Start set</button>
        )}
        {phase === 'working' && (
          <button className="runner-go is-stop" onClick={runner.stop}>Stop</button>
        )}
        {phase === 'resting' && (
          <button className="runner-go is-quiet" onClick={runner.skipRest}>
            Ready now
          </button>
        )}
        {phase === 'done' && (
          <button className="runner-go is-quiet" onClick={runner.again}>Go again</button>
        )}
      </div>
    </section>
  )
}

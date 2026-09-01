import { PLATE_LB } from '../data/program'
import type { useSetRunner } from '../anim/useSetRunner'
import type { useDemoLoop } from '../anim/useDemoLoop'
import type { Person } from '../types/program'
import { RunnerStage } from './RunnerStage'
import './SetRunner.css'

type Props = {
  runner: ReturnType<typeof useSetRunner>
  loop: ReturnType<typeof useDemoLoop>
  people: Person[]
  pin: number
  usesStack: boolean
}

/**
 * The coach for one person practising one exercise on their own: whose turn,
 * what number they are on, and what their body should be doing this second.
 * Session mode replaces the picker and the controls with a rotation, but the
 * scoreboard in the middle is the same component.
 */
export function SetRunner({ runner, loop, people, pin, usesStack }: Props) {
  const person = people.find((p) => p.id === runner.personId) ?? people[0]
  const { phase } = runner

  const meta = phase === 'done'
    ? `${person.name} is finished on this one`
    : `${person.name} · set ${runner.setIndex + 1} of ${runner.sets}` +
      (usesStack ? ` · pin ${pin} (${pin * PLATE_LB} lb)` : '')

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

      <RunnerStage runner={runner} loop={loop} meta={meta} />

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

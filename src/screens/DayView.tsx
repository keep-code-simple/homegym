import { ExerciseIcon } from '../components/ExerciseIcon'
import { WARMUP, estimateMinutes } from '../data/program'
import { getExercise } from '../data/exercises'
import type { Day, Person, Prescription } from '../types/program'

function prescriptionText(p: Prescription | undefined) {
  if (!p) return '—'
  return 'reps' in p
    ? `${p.sets} × ${p.reps[0]}–${p.reps[1]}`
    : `${p.sets} × ${p.holdSeconds}s`
}

type Props = {
  day: Day
  people: Person[]
  onOpenExercise: (id: string) => void
  onBack: () => void
}

export function DayView({ day, people, onOpenExercise, onBack }: Props) {
  const exercises = day.exercises.map(getExercise)

  return (
    <div className="app">
      <button className="back" onClick={onBack}>Back to the week</button>

      <header className="day-head">
        <span className="day-num stencil is-big">{day.id}</span>
        <div>
          <h1 className="display">{day.focus}</h1>
          <p className="home-sub">
            {exercises.length} exercises · about {estimateMinutes(day.exercises)} min
          </p>
        </div>
      </header>

      <section className="warmup">
        <h2 className="display">Warm-up · {WARMUP.minutes} min</h2>
        <ul>{WARMUP.items.map((w) => <li key={w}>{w}</li>)}</ul>
      </section>

      <ol className="ex-list">
        {exercises.map((ex, i) => (
          <li key={ex.id}>
            <button className="ex-row" onClick={() => onOpenExercise(ex.id)}>
              <span className="ex-order stencil">{i + 1}</span>
              <span className="ex-icon"><ExerciseIcon exercise={ex} /></span>
              <span className="ex-text">
                <span className="ex-name display">{ex.name}</span>
                <span className="ex-station">{ex.stationLabel}</span>
              </span>
              <span className="ex-pres">
                {people.map((p) => (
                  <span key={p.id} className="pres-row">
                    <span className="pres-dot" style={{ background: p.plateColour }} />
                    <span className="pres-name">{p.name}</span>
                    <span className="pres-val stencil">
                      {prescriptionText(ex.prescription[p.id])}
                    </span>
                  </span>
                ))}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <button className="start-session" disabled>
        Start session
        <span className="start-note">Session mode is the next piece to build</span>
      </button>
    </div>
  )
}

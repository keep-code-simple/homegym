import { ExercisePractice } from '../components/ExercisePractice'
import { PinControl } from '../components/PinControl'
import type { Exercise, Person, Prescription } from '../types/program'
import type { useStore } from '../storage/useStore'

function prescriptionText(p: Prescription | undefined) {
  if (!p) return '—'
  return 'reps' in p
    ? `${p.sets} sets × ${p.reps[0]}–${p.reps[1]} reps`
    : `${p.sets} holds × ${p.holdSeconds} seconds`
}

type Props = {
  exercise: Exercise
  people: Person[]
  store: ReturnType<typeof useStore>
  onBack: () => void
}

export function ExerciseDetail({ exercise, people, store, onBack }: Props) {
  const usesStack = exercise.station !== 'floor'

  return (
    <div className="app">
      <button className="back" onClick={onBack}>Back to the day</button>

      <h1 className="display ex-title">{exercise.name}</h1>
      <p className="home-sub">{exercise.stationLabel} · {exercise.target.join(', ')}</p>

      {exercise.videoUrl && (
        <video className="ex-video" src={exercise.videoUrl} controls playsInline />
      )}

      <ExercisePractice exercise={exercise} people={people} store={store} />

      <section className="panel">
        <h2 className="display">Setup</h2>
        <ul>{exercise.setup.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>

      <section className="panel is-cues">
        <h2 className="display">Cues</h2>
        <ul>{exercise.cues.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>

      <section className="panel is-watch">
        <h2 className="display">Watch out for</h2>
        <ul>{exercise.watchOutFor.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>

      <section className="panel">
        <h2 className="display">Breathing</h2>
        <p>{exercise.breathing}</p>
      </section>

      <section className="panel">
        <h2 className="display">{usesStack ? 'Pin weight' : 'Your numbers'}</h2>
        <div className="people-rows">
          {people.map((p) => (
            <div key={p.id} className="person-row">
              <div className="person-id">
                <span className="pres-dot is-big" style={{ background: p.plateColour }} />
                <span>
                  <b>{p.name}</b>
                  <span className="person-pres">{prescriptionText(exercise.prescription[p.id])}</span>
                </span>
              </div>
              {usesStack && (
                <PinControl
                  pin={store.getPin(p.id, exercise.id)}
                  onChange={(n) => store.setPin(p.id, exercise.id, n)}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

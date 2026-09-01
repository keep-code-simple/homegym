import { ExercisePractice } from '../components/ExercisePractice'
import type { Exercise, Person } from '../types/program'
import type { useStore } from '../storage/useStore'

type Props = {
  exercise: Exercise
  people: Person[]
  store: ReturnType<typeof useStore>
  onBack: () => void
}

export function ExerciseDetail({ exercise, people, store, onBack }: Props) {
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

    </div>
  )
}

import { DAYS, estimateMinutes, todayDayId } from '../data/program'
import type { Person } from '../types/program'
import type { useStore } from '../storage/useStore'

type Props = {
  people: Person[]
  store: ReturnType<typeof useStore>
  onOpenDay: (dayId: number) => void
}

export function Home({ people, store, onOpenDay }: Props) {
  const today = todayDayId()

  return (
    <div className="app">
      <header className="home-head">
        <h1 className="display">The week</h1>
        <p className="home-sub">Five days. Thirty-ish minutes. Form before weight.</p>
      </header>

      <ol className="day-list">
        {DAYS.map((day) => {
          const built = day.exercises.length > 0
          return (
            <li key={day.id}>
              <article className={`day-card ${day.id === today ? 'is-today' : ''}`}>
                <button className="day-open" onClick={() => onOpenDay(day.id)}
                  disabled={!built}>
                  <span className="day-num stencil">{day.id}</span>
                  <span className="day-text">
                    <span className="day-focus display">{day.focus}</span>
                    <span className="day-meta">
                      {built
                        ? `${day.exercises.length} exercises · about ${estimateMinutes(day.exercises)} min`
                        : 'Not built yet'}
                      {day.id === today && <b className="day-today"> · Today</b>}
                    </span>
                  </span>
                </button>

                <div className="day-crew">
                  {people.map((p) => {
                    const done = store.isDone(p.id, day.id)
                    return (
                      <button key={p.id}
                        className={`crew-dot ${done ? 'is-done' : ''}`}
                        style={{ '--plate': p.plateColour } as React.CSSProperties}
                        aria-pressed={done}
                        aria-label={`${p.name}: ${day.focus} ${done ? 'done' : 'not done'} this week`}
                        onClick={() => store.toggleDone(p.id, day.id)}>
                        <span className="crew-name">{p.name}</span>
                      </button>
                    )
                  })}
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

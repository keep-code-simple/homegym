import type { Person } from '../types/program'
import type { useStore } from '../storage/useStore'

type Props = {
  people: Person[]
  store: ReturnType<typeof useStore>
  dayId: number
  /** What they did, for the label a screen reader gets. */
  what: string
}

/**
 * Who has done this day this week. Tapping a filled tick clears it -- a mis-tap
 * should not be permanent. This is the only thing a session writes down, and it
 * is a tick, not a time.
 */
export function CrewTicks({ people, store, dayId, what }: Props) {
  return (
    <div className="day-crew">
      {people.map((p) => {
        const done = store.isDone(p.id, dayId)
        return (
          <button key={p.id}
            className={`crew-dot ${done ? 'is-done' : ''}`}
            style={{ '--plate': p.plateColour } as React.CSSProperties}
            aria-pressed={done}
            aria-label={`${p.name}: ${what} ${done ? 'done' : 'not done'} this week`}
            onClick={() => store.toggleDone(p.id, dayId)}>
            <span className="crew-name">{p.name}</span>
          </button>
        )
      })}
    </div>
  )
}

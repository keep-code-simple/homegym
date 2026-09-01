import { renderToStaticMarkup } from 'react-dom/server'
import App from '../App'
import { DayView } from '../screens/DayView'
import { ExerciseDetail } from '../screens/ExerciseDetail'
import { Session } from '../screens/Session'
import { SessionTurn } from '../components/SessionTurn'
import { planSession } from '../data/session'
import { DAYS } from '../data/program'
import { DAY1 } from '../data/exercises/day1'
import { PEOPLE } from '../data/people'
import { getExercise } from '../data/exercises'
import { defaultStore, pinKey } from '../storage/schema'
import { stubLoop } from './stubLoop'

/** Renders every screen once and reports what came out, as a crash check. */
export function smoke(): string[] {
  const out: string[] = []
  const store = defaultStore()
  const api = {
    store,
    getPin: (p: string, e: string) => store.pins[pinKey(p, e)] ?? 1,
    setPin: () => {},
    isDone: () => false,
    toggleDone: () => {},
    dismissSafetyNote: () => {},
  } as unknown as Parameters<typeof ExerciseDetail>[0]['store']

  const home = renderToStaticMarkup(<App />)
  out.push(`App/Home: ${home.length} chars, safety note ${home.includes('house rules') ? 'shown' : 'MISSING'}`)

  const day = renderToStaticMarkup(
    <DayView day={DAYS[0]} people={PEOPLE} onOpenExercise={() => {}}
      onStartSession={() => {}} onBack={() => {}} />,
  )
  out.push(`DayView: ${day.length} chars, ${(day.match(/ex-row/g) ?? []).length} exercise rows`)

  for (const ex of DAY1) {
    const html = renderToStaticMarkup(
      <ExerciseDetail exercise={ex} people={PEOPLE} store={api} onBack={() => {}} />,
    )
    const cues = (html.match(/<li>/g) ?? []).length
    out.push(
      `ExerciseDetail ${ex.id.padEnd(16)}: ${String(html.length).padStart(5)} chars, ` +
      `${cues} list items, mistake toggle ${html.includes('Show the mistake') ? 'yes' : 'NO'}, ` +
      `pin controls ${(html.match(/pin-num/g) ?? []).length}`,
    )
  }
  const session = renderToStaticMarkup(
    <Session day={DAYS[0]} people={PEOPLE} store={api} onBack={() => {}} />,
  )
  out.push(`Session warm-up: ${session.length} chars, starts on ${
    session.includes('Warm-up') ? 'the warm-up' : 'SOMETHING ELSE'}`)

  // Every turn of the day, rendered where it would actually appear: a crash in
  // turn 30 is no less of a crash for being 30 turns in.
  const turns = planSession(DAYS[0].exercises.map(getExercise), PEOPLE)
  const lengths = turns.map((_, i) => renderToStaticMarkup(
    <SessionTurn turns={turns} index={i} people={PEOPLE} store={api}
      loop={stubLoop} exerciseCount={DAYS[0].exercises.length} onNext={() => {}} />,
  ).length)
  out.push(
    `Session turns: ${turns.length} rendered, ` +
    `${Math.min(...lengths)}-${Math.max(...lengths)} chars`,
  )

  return out
}

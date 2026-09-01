import { useEffect, useState } from 'react'
import { SafetyNote } from './components/SafetyNote'
import { DAYS } from './data/program'
import { getExercise } from './data/exercises'
import { DayView } from './screens/DayView'
import { ExerciseDetail } from './screens/ExerciseDetail'
import { Home } from './screens/Home'
import { Session } from './screens/Session'
import { useStore } from './storage/useStore'
import './screens/screens.css'

type View =
  | { name: 'home' }
  | { name: 'day'; dayId: number }
  | { name: 'exercise'; dayId: number; exerciseId: string }
  | { name: 'session'; dayId: number }

export default function App() {
  const store = useStore()
  const [view, setView] = useState<View>({ name: 'home' })

  // Push real history entries so the tablet's back gesture walks back a screen
  // instead of leaving the app.
  const go = (next: View) => {
    history.pushState(next, '')
    setView(next)
  }
  useEffect(() => {
    const onPop = (e: PopStateEvent) => setView((e.state as View) ?? { name: 'home' })
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const people = store.store.people

  return (
    <>
      {!store.store.seenSafetyNote && <SafetyNote onDismiss={store.dismissSafetyNote} />}

      {view.name === 'home' && (
        <Home people={people} store={store}
          onOpenDay={(dayId) => go({ name: 'day', dayId })} />
      )}

      {view.name === 'day' && (
        <DayView day={DAYS.find((d) => d.id === view.dayId)!} people={people}
          onOpenExercise={(exerciseId) => go({ name: 'exercise', dayId: view.dayId, exerciseId })}
          onStartSession={() => go({ name: 'session', dayId: view.dayId })}
          onBack={() => history.back()} />
      )}

      {view.name === 'exercise' && (
        <ExerciseDetail exercise={getExercise(view.exerciseId)} people={people}
          store={store} onBack={() => history.back()} />
      )}

      {view.name === 'session' && (
        <Session day={DAYS.find((d) => d.id === view.dayId)!} people={people}
          store={store} onBack={() => history.back()} />
      )}
    </>
  )
}

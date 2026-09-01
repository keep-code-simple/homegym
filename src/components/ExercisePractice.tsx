import { useDemoLoop } from '../anim/useDemoLoop'
import { useSetRunner } from '../anim/useSetRunner'
import { PLATE_HEX } from '../data/people'
import type { Exercise, Person, Prescription } from '../types/program'
import type { useStore } from '../storage/useStore'
import { ExerciseDemo } from './ExerciseDemo'
import { PinControl } from './PinControl'
import { SetRunner } from './SetRunner'

function prescriptionText(p: Prescription | undefined) {
  if (!p) return '—'
  return 'reps' in p
    ? `${p.sets} sets × ${p.reps[0]}–${p.reps[1]} reps`
    : `${p.sets} holds × ${p.holdSeconds} seconds`
}

/**
 * Holds the one clock that both the demonstration and the rep count run off.
 * They share it rather than each keeping their own, so the figure on screen is
 * always doing the rep the counter says it is.
 *
 * The pin controls live here too, and not further down the screen, because
 * there is one stack in the drawing and it can only show one person's pin. Kept
 * apart, the two disagree: you raise a boy's pin, the plates do not move,
 * because the demonstration is still showing the adult.
 */
export function ExercisePractice({ exercise, people, store }: {
  exercise: Exercise
  people: Person[]
  store: ReturnType<typeof useStore>
}) {
  const loop = useDemoLoop(true)
  const runner = useSetRunner(exercise, loop, people[0].id)
  const usesStack = exercise.station !== 'floor'
  const pin = store.getPin(runner.personId, exercise.id)

  return (
    <>
      <ExerciseDemo
        exercise={exercise}
        loop={loop}
        pin={pin}
        plateColour={PLATE_HEX[runner.personId] ?? PLATE_HEX.dad}
        // While a set is running the runner is in charge of the tempo, and the
        // wrong version of the movement is the last thing to be copying.
        locked={runner.phase === 'working'}
      />
      <SetRunner runner={runner} loop={loop} people={people} pin={pin}
        usesStack={usesStack} />

      <section className="panel">
        <h2 className="display">{usesStack ? 'Pin weight' : 'Your numbers'}</h2>
        <div className="people-rows">
          {people.map((p) => (
            <div key={p.id}
              className={`person-row ${p.id === runner.personId ? 'is-on' : ''}`}
              style={{ '--plate': p.plateColour } as React.CSSProperties}>
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
                  onChange={(n) => {
                    store.setPin(p.id, exercise.id, n)
                    // Show the stack you just set. Not mid-set though: switching
                    // person abandons the set that is being counted.
                    if (runner.phase !== 'working') runner.choosePerson(p.id)
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

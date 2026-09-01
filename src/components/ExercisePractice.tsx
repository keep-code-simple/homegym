import { useDemoLoop } from '../anim/useDemoLoop'
import { useSetRunner } from '../anim/useSetRunner'
import { PLATE_HEX } from '../data/people'
import type { Exercise, Person } from '../types/program'
import type { useStore } from '../storage/useStore'
import { ExerciseDemo } from './ExerciseDemo'
import { SetRunner } from './SetRunner'

/**
 * Holds the one clock that both the demonstration and the rep count run off.
 * They share it rather than each keeping their own, so the figure on screen is
 * always doing the rep the counter says it is.
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
    </>
  )
}

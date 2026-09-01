import type { Exercise, ExerciseId } from '../../types/program'
import { DAY1 } from './day1'

export const EXERCISES: Exercise[] = [...DAY1]

const byId = new Map(EXERCISES.map((e) => [e.id, e]))

export function getExercise(id: ExerciseId): Exercise {
  const found = byId.get(id)
  if (!found) throw new Error(`Unknown exercise: ${id}`)
  return found
}

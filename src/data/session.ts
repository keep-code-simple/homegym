import { PLATE_LB } from './program'
import type { Exercise, Person, PersonId, Prescription } from '../types/program'

/** One person's turn on the machine: one exercise, one set. */
export type Turn = {
  exercise: Exercise
  /** 0-based position of the exercise within the day. */
  exerciseIndex: number
  personId: PersonId
  /** Which of this person's sets on this exercise, 0-based. */
  setIndex: number
  /** How many sets this person does on this exercise. */
  sets: number
}

const setsFor = (p: Prescription | undefined) => p?.sets ?? 0

/**
 * The order the three of them actually take the machine: everybody does set one
 * before anybody does set two. There is one stack, so someone's rest is the
 * other two lifting -- which is why a session turn never shows a rest
 * countdown the way a single-person set does.
 *
 * Whoever has fewer sets simply drops out of the later rounds. The boys finish
 * an exercise before the adult does, and that is the intended shape rather than
 * something to pad out.
 *
 * Within an exercise nobody ever lifts twice in a row. Across the seam between
 * two exercises they can: the adult finishes one and starts the next. That one
 * is left alone on purpose -- the seat moves, the handles change and everybody
 * walks to the other side of the machine, which is the rest.
 */
export function planSession(exercises: Exercise[], people: Person[]): Turn[] {
  const turns: Turn[] = []
  exercises.forEach((exercise, exerciseIndex) => {
    // Most sets goes first. Whoever has the extra sets is the one still lifting
    // once the others have dropped out, and starting the round is what puts the
    // widest gap in front of those last sets -- start them last instead and the
    // adult's third set lands immediately after his second.
    const order = [...people].sort(
      (a, b) => setsFor(exercise.prescription[b.id]) - setsFor(exercise.prescription[a.id]),
    )
    const rounds = Math.max(0, ...people.map((p) => setsFor(exercise.prescription[p.id])))
    for (let setIndex = 0; setIndex < rounds; setIndex++) {
      for (const person of order) {
        const sets = setsFor(exercise.prescription[person.id])
        if (setIndex >= sets) continue
        turns.push({ exercise, exerciseIndex, personId: person.id, setIndex, sets })
      }
    }
  })
  return turns
}

/** How many sets this person has left on this exercise, this turn included. */
export function setsLeft(turns: Turn[], from: number): Record<PersonId, number> {
  const left: Record<PersonId, number> = {}
  const { exercise } = turns[from]
  for (let i = from; i < turns.length && turns[i].exercise === exercise; i++) {
    left[turns[i].personId] = (left[turns[i].personId] ?? 0) + 1
  }
  return left
}

const usesStack = (turn: Turn) => turn.exercise.station !== 'floor'
const lb = (pin: number) => `${pin} (${pin * PLATE_LB} lb)`

/**
 * What has to happen to the machine between two turns, said out loud.
 *
 * A session is won or lost at the handoff: whoever is next needs the pin number
 * before they sit down, not after. It says so even when the pin does not move,
 * because "pin stays at 4" is an instruction and silence is not.
 */
export function pinCall(
  turn: Turn, next: Turn | undefined, pin: number, nextPin: number,
): string | null {
  if (!next || !usesStack(next)) return null
  if (!usesStack(turn)) return `Set the pin to ${lb(nextPin)}.`
  if (nextPin === pin) return `Pin stays at ${lb(pin)}.`
  return `Move the pin from ${pin} to ${lb(nextPin)}.`
}

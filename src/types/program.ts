import type { Pose } from './pose'

export type PersonId = string

export type Person = {
  id: PersonId
  name: string
  /** Weight-plate colour -- this person's identity everywhere in the app. */
  plateColour: string
  /** Adults get progression prompts; the boys never do. */
  isAdult: boolean
}

/**
 * Which station of the MWM-988 an exercise uses. This is a union rather than a
 * free string because it selects which machine parts get drawn and where the
 * figure sits -- the person literally turns around between the press and the
 * pulldown.
 */
export type StationId =
  | 'pressArm'
  | 'highPulley'
  | 'lowPulley'
  | 'legDeveloper'
  | 'preacher'
  | 'floor'

/** Reps for lifts, seconds for holds. A plank has no reps. */
export type Prescription =
  | { sets: number; reps: [number, number] }
  | { sets: number; holdSeconds: number }

export type ExerciseId = string

export type Exercise = {
  id: ExerciseId
  name: string
  station: StationId
  stationLabel: string // what the person calls it out loud
  target: string[]
  setup: string[]
  cues: string[]
  watchOutFor: string[]
  breathing: string
  startPose: Pose
  endPose: Pose
  /** The same movement done wrong, for the "show the mistake" toggle. */
  mistakePose?: Pose
  mistakeCaption?: string
  /** How far the selected plates travel, in viewBox units. 0 for bodyweight. */
  stackTravel: number
  /** A hold (plank) animates nothing; it shows one pose and a timer. */
  isHold?: boolean
  /** Text alternative to the animation, for reduced motion and screen readers. */
  motionDescription: string
  /** Empty until real filmed demos land in /public/demos/. */
  videoUrl?: string
  prescription: Record<PersonId, Prescription>
}

export type DayId = number

export type Day = {
  id: DayId
  name: string
  focus: string
  exercises: ExerciseId[]
  /** Day 5 uses no stack at all. */
  usesStack: boolean
}

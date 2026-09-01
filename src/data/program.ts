import type { Day } from '../types/program'
import { DAY1 } from './exercises/day1'

export const WARMUP = {
  minutes: 3,
  items: [
    'Arm circles, 30 seconds each way',
    '10 slow bodyweight squats',
    '8 cat-cow',
    'One light set of the first exercise',
  ],
}

/**
 * Days 2-5 are declared here so the week grid is honest about the whole plan,
 * but only Day 1 has exercises built so far.
 */
export const DAYS: Day[] = [
  { id: 1, name: 'Day 1', focus: 'Push & core', exercises: DAY1.map((e) => e.id), usesStack: true },
  { id: 2, name: 'Day 2', focus: 'Pull & arms', exercises: [], usesStack: true },
  { id: 3, name: 'Day 3', focus: 'Legs & core', exercises: [], usesStack: true },
  { id: 4, name: 'Day 4', focus: 'Full body, lighter', exercises: [], usesStack: true },
  { id: 5, name: 'Day 5', focus: 'Move & stretch', exercises: [], usesStack: false },
]

/** Roughly how long a day takes: sets x tempo, plus swapping the pin each turn. */
export function estimateMinutes(exerciseIds: string[], setsPerExercise = 7) {
  if (exerciseIds.length === 0) return 0
  const perSet = 60 // a set at the prescribed tempo
  const pinChange = 10
  return Math.round((exerciseIds.length * setsPerExercise * (perSet + pinChange)) / 60) + WARMUP.minutes
}

/** Pin defaults start deliberately light. Session one is for finding the pin. */
export const DEFAULT_PINS: Record<string, Record<string, number>> = {
  dad: { 'chest-press': 5, 'pec-fly': 4, 'tricep-pushdown': 4, 'kneeling-crunch': 4 },
  son1: { 'chest-press': 2, 'pec-fly': 1, 'tricep-pushdown': 1, 'kneeling-crunch': 2 },
  son2: { 'chest-press': 2, 'pec-fly': 1, 'tricep-pushdown': 1, 'kneeling-crunch': 2 },
}

export const PLATE_LB = 10
export const STACK_PLATES = 15

/**
 * Which day today calls for. The three loaded days land Mon/Wed/Fri so they are
 * never back to back for the boys; Day 5 fills the gaps and Sunday is off.
 */
const WEEKDAY_TO_DAY: Record<number, number | null> = {
  0: null, 1: 1, 2: 5, 3: 2, 4: 5, 5: 3, 6: 4,
}

export function todayDayId(d = new Date()) {
  return WEEKDAY_TO_DAY[d.getDay()]
}

import { DEFAULT_PINS, STACK_PLATES } from '../data/program'
import { PEOPLE } from '../data/people'
import type { Person } from '../types/program'

export const STORAGE_KEY = 'homegym.v1'

export type Store = {
  version: 1
  people: Person[]
  /** 'personId:exerciseId' -> pin position, 1-15. */
  pins: Record<string, number>
  /** isoWeek -> 'personId:dayId' -> ISO date completed. */
  completions: Record<string, Record<string, string>>
  seenSafetyNote: boolean
}

export const pinKey = (personId: string, exerciseId: string) => `${personId}:${exerciseId}`
export const doneKey = (personId: string, dayId: number) => `${personId}:${dayId}`

/**
 * ISO week key, weeks starting Monday. The brief says the home screen shows who
 * has done what "this week" -- without a defined boundary the grid never resets.
 */
export function isoWeek(d = new Date()): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = t.getUTCDay() || 7
  t.setUTCDate(t.getUTCDate() + 4 - day) // Thursday of this week decides the year
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

export function defaultStore(): Store {
  const pins: Record<string, number> = {}
  for (const [personId, byExercise] of Object.entries(DEFAULT_PINS)) {
    for (const [exerciseId, pin] of Object.entries(byExercise)) {
      pins[pinKey(personId, exerciseId)] = pin
    }
  }
  return { version: 1, people: PEOPLE, pins, completions: {}, seenSafetyNote: false }
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStore()
    const parsed = JSON.parse(raw) as Partial<Store>
    if (parsed.version !== 1) return defaultStore()
    return { ...defaultStore(), ...parsed }
  } catch {
    // A cleared or unavailable store is not an error worth showing anyone.
    return defaultStore()
  }
}

export function saveStore(store: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch { /* private mode, quota, or site data blocked -- carry on in memory */ }
}

export const clampPin = (n: number) => Math.min(Math.max(Math.round(n), 1), STACK_PLATES)

import { useCallback, useEffect, useState } from 'react'
import {
  clampPin, doneKey, isoWeek, loadStore, pinKey, saveStore, type Store,
} from './schema'

export function useStore() {
  const [store, setStore] = useState<Store>(loadStore)

  useEffect(() => { saveStore(store) }, [store])

  const getPin = useCallback(
    (personId: string, exerciseId: string) => store.pins[pinKey(personId, exerciseId)] ?? 1,
    [store.pins],
  )

  const setPin = useCallback((personId: string, exerciseId: string, pin: number) => {
    setStore((s) => ({
      ...s,
      pins: { ...s.pins, [pinKey(personId, exerciseId)]: clampPin(pin) },
    }))
  }, [])

  const week = isoWeek()

  const isDone = useCallback(
    (personId: string, dayId: number) =>
      Boolean(store.completions[week]?.[doneKey(personId, dayId)]),
    [store.completions, week],
  )

  /** Tapping a filled cell clears it -- a mis-tap should not be permanent. */
  const toggleDone = useCallback((personId: string, dayId: number) => {
    setStore((s) => {
      const forWeek = { ...(s.completions[week] ?? {}) }
      const key = doneKey(personId, dayId)
      if (forWeek[key]) delete forWeek[key]
      else forWeek[key] = new Date().toISOString()
      return { ...s, completions: { ...s.completions, [week]: forWeek } }
    })
  }, [week])

  const dismissSafetyNote = useCallback(
    () => setStore((s) => ({ ...s, seenSafetyNote: true })), [],
  )

  return { store, getPin, setPin, isDone, toggleDone, dismissSafetyNote }
}

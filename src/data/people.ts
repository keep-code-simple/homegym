import type { Person } from '../types/program'

/** Names are editable in settings; the plate colour is the identity. */
export const PEOPLE: Person[] = [
  { id: 'dad', name: 'Dad', plateColour: 'var(--plate-red)', isAdult: true },
  { id: 'son1', name: 'Son 1', plateColour: 'var(--plate-blue)', isAdult: false },
  { id: 'son2', name: 'Son 2', plateColour: 'var(--plate-yellow)', isAdult: false },
]

export const PLATE_HEX: Record<string, string> = {
  dad: '#d5342f',
  son1: '#2f6fd5',
  son2: '#e8b427',
}

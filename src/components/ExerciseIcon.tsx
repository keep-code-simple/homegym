import { resolveSkeleton } from './figure/kinematics'
import { Figure } from './figure/Figure'
import type { Exercise } from '../types/program'

/**
 * The small static figure the boys navigate by: the peak of the movement,
 * cropped tight to whatever the body actually occupies so every icon fills its
 * box regardless of which station it is on.
 */
export function ExerciseIcon({ exercise, size = 56 }: { exercise: Exercise; size?: number }) {
  const peak = exercise.isHold ? exercise.startPose : exercise.endPose
  const s = resolveSkeleton(peak)
  const pts = Object.values(s)
  const pad = 26
  const minX = Math.min(...pts.map((p) => p.x)) - pad
  const maxX = Math.max(...pts.map((p) => p.x)) + pad
  const minY = Math.min(...pts.map((p) => p.y)) - pad
  const maxY = Math.max(...pts.map((p) => p.y)) + pad
  const side = Math.max(maxX - minX, maxY - minY)
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  return (
    <svg width={size} height={size} aria-hidden="true" focusable="false"
      viewBox={`${cx - side / 2} ${cy - side / 2} ${side} ${side}`}>
      <Figure pose={peak} simple />
    </svg>
  )
}

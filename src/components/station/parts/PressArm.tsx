import type { Point } from '../../../types/pose'

/**
 * The dual-function press arm: a lever pivoting off the frame behind the seat,
 * with the handle where the hand is. Same arm serves the chest press and the
 * butterfly -- only the handle position differs, which is exactly what the two
 * poses already encode.
 */
export function PressArm({ pivot, handle }: { pivot: Point; handle: Point }) {
  const nx = handle.x - pivot.x
  const ny = handle.y - pivot.y
  const len = Math.hypot(nx, ny) || 1
  // A short grip bar across the end of the lever.
  const gx = (-ny / len) * 11
  const gy = (nx / len) * 11
  return (
    <g strokeLinecap="round">
      <circle cx={pivot.x} cy={pivot.y} r={7} fill="var(--machine-dark)" />
      <line x1={pivot.x} y1={pivot.y} x2={handle.x} y2={handle.y}
        stroke="var(--machine)" strokeWidth={8} />
      <line x1={handle.x - gx} y1={handle.y - gy} x2={handle.x + gx} y2={handle.y + gy}
        stroke="var(--steel-edge)" strokeWidth={9} strokeLinecap="round" />
    </g>
  )
}

import type { Point } from '../../../types/pose'

/**
 * The cable is drawn through fixed pulley points to wherever the hand actually
 * is, which is why the figure resolves to world coordinates rather than nested
 * SVG transforms.
 */
export function Cable({ points }: { points: Point[] }) {
  const d = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' ')
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="var(--machine-dark)" strokeWidth={5} />
      <path d={d} stroke="var(--cable)" strokeWidth={2.4} />
    </g>
  )
}

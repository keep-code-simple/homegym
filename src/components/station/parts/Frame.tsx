import { MAT_Y, SHROUD, TOWER } from '../geometry'

/** Uprights, top crossbar and the high pulley. */
export function Frame() {
  return (
    <g>
      <rect x={TOWER.left - 6} y={TOWER.top} width={6} height={MAT_Y - TOWER.top}
        fill="var(--machine-dark)" />
      <rect x={TOWER.right} y={TOWER.top} width={6} height={MAT_Y - TOWER.top}
        fill="var(--machine-dark)" />
      <rect x={SHROUD.left - 8} y={TOWER.top} width={SHROUD.right - SHROUD.left + 16}
        height={10} fill="var(--machine)" />
      <rect x={SHROUD.left - 24} y={MAT_Y - 8} width={SHROUD.right - SHROUD.left + 60}
        height={8} rx={2} fill="var(--machine)" />
      <circle cx={TOWER.pulley.x} cy={TOWER.pulley.y} r={9}
        fill="none" stroke="var(--machine)" strokeWidth={5} />
    </g>
  )
}

/**
 * The wide cambered "W" bar on its strap. Drawn after the shrouded column,
 * since it hangs in front of the machine rather than inside the frame.
 */
export function LatBar({ x = TOWER.pulley.x, y = 86 }: { x?: number; y?: number }) {
  const half = 46
  return (
    <g>
      <line x1={x} y1={TOWER.pulley.y + 8} x2={x} y2={y}
        stroke="var(--cable)" strokeWidth={2.4} />
      <path
        d={`M${x - half} ${y - 11} L${x - half + 14} ${y + 1}` +
           ` L${x + half - 14} ${y + 1} L${x + half} ${y - 11}`}
        fill="none" stroke="var(--steel-edge)" strokeWidth={7}
        strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

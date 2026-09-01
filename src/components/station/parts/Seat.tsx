import { LEG_DEV, MAT_Y, SEAT } from '../geometry'

/** Seat, back pad, and the leg-developer rollers at the front of the seat. */
export function Seat({ facing, backPad = true }: { facing: 1 | -1; backPad?: boolean }) {
  // Just behind the back, with a sliver showing, so contact with the pad --
  // and losing it -- is visible.
  const padX = facing === 1 ? SEAT.x - 4 : SEAT.x + SEAT.width - 8
  return (
    <g>
      <rect x={SEAT.x} y={SEAT.surfaceY} width={SEAT.width} height={12} rx={4}
        fill="var(--machine)" />
      <rect x={SEAT.x + SEAT.width / 2 - 4} y={SEAT.surfaceY + 12} width={8}
        height={MAT_Y - SEAT.surfaceY - 12} fill="var(--machine-dark)" />
      <rect x={SEAT.x + 4} y={MAT_Y - 8} width={SEAT.width - 8} height={8} rx={2}
        fill="var(--machine)" />
      {backPad && (
        <rect x={padX} y={SEAT.padTop} width={12}
          height={SEAT.surfaceY - SEAT.padTop + 6} rx={5} fill="var(--machine)" />
      )}
      <LegDeveloper />
    </g>
  )
}

/**
 * Two roller pairs on a swing arm at the front of the seat. In a side view each
 * pair reads as one cylinder. They are in shot on every seated exercise whether
 * or not the legs are working, which is a large part of what makes the seat read
 * as this machine rather than a bench.
 */
function LegDeveloper() {
  return (
    <g>
      <rect x={LEG_DEV.x - 4} y={SEAT.surfaceY - 6} width={8}
        height={LEG_DEV.lowerY - SEAT.surfaceY + 14} rx={3} fill="var(--machine)" />
      {[LEG_DEV.upperY, LEG_DEV.lowerY].map((y) => (
        <rect key={y} x={LEG_DEV.x - 15} y={y - 8} width={30} height={16} rx={8}
          fill="var(--machine-dark)" />
      ))}
    </g>
  )
}

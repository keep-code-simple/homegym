import { SHROUD, STACK, stackBottom } from '../geometry'

type Props = {
  /** Pin position, 1-15. Everything at and above this plate is lifted. */
  pin: number
  /** How far the selected plates have travelled up, in viewBox units. */
  lift: number
  colour?: string
}

/**
 * The selectorized stack inside its shrouded column, with the red numbered
 * scale down the side that you read to set the pin.
 *
 * Watching the plates rise and fall in time with the movement is what makes the
 * exercise legible, so the window stays wide and the plates stay light against
 * it even though the real ones are black. The plates that move are the ones at
 * and above the pin, exactly as on the machine.
 */
export function WeightStack({ pin, lift, colour }: Props) {
  const pitch = STACK.plateH + STACK.gap
  const selected = Math.min(Math.max(pin, 1), STACK.count)
  const stripX = SHROUD.right - SHROUD.strip - 2

  return (
    <g>
      <defs>
        <clipPath id="stack-window">
          <rect x={STACK.left - 3} y={STACK.top - 40}
            width={STACK.right - STACK.left + 6} height={stackBottom - STACK.top + 44} />
        </clipPath>
      </defs>

      {/* Shroud */}
      <rect x={SHROUD.left} y={SHROUD.top} width={SHROUD.right - SHROUD.left}
        height={stackBottom + 6 - SHROUD.top} rx={2}
        fill="var(--shroud)" stroke="var(--shroud-edge)" strokeWidth={2} />

      {/* Window the plates run behind */}
      <rect x={STACK.left - 3} y={STACK.top - 40}
        width={STACK.right - STACK.left + 6} height={stackBottom - STACK.top + 44}
        fill="var(--shroud-window)" />

      <g clipPath="url(#stack-window)">
        <rect x={STACK.left + 6} y={STACK.top - 40} width={3}
          height={stackBottom - STACK.top + 44} fill="var(--machine-dark)" />
        <rect x={STACK.right - 9} y={STACK.top - 40} width={3}
          height={stackBottom - STACK.top + 44} fill="var(--machine-dark)" />

        {Array.from({ length: STACK.count }, (_, i) => {
          const moves = i < selected
          const y = STACK.top + i * pitch - (moves ? lift : 0)
          return (
            <rect key={i} x={STACK.left} y={y}
              width={STACK.right - STACK.left} height={STACK.plateH} rx={1.5}
              fill={moves ? (colour ?? 'var(--stack)') : 'var(--stack)'}
              opacity={moves ? 1 : 0.82} />
          )
        })}

        <rect x={STACK.right - 6} y={STACK.top + (selected - 1) * pitch + 1.5 - lift}
          width={14} height={4} rx={2} fill="var(--warn)" />
      </g>

      {/* The red numbered scale down the shroud: one mark per plate, with the
          selected pin standing out. At this size the numbers themselves are
          unreadable, so the marks carry it. */}
      <rect x={stripX} y={STACK.top - 2} width={SHROUD.strip}
        height={STACK.count * pitch + 4} rx={1} fill="#f4f1ec" />
      {Array.from({ length: STACK.count }, (_, i) => {
        const isPin = i + 1 === selected
        return (
          <rect key={i} x={stripX + (isPin ? 0 : 1.5)} y={STACK.top + i * pitch + 2}
            width={SHROUD.strip - (isPin ? 0 : 3)} height={STACK.plateH - 3} rx={0.5}
            fill="var(--strip-red)" opacity={isPin ? 1 : 0.3} />
        )
      })}
    </g>
  )
}

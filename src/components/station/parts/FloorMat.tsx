import { MAT_Y, VIEW } from '../geometry'

export function FloorMat() {
  return (
    <g>
      <rect x={20} y={MAT_Y} width={VIEW.w - 40} height={10} rx={3}
        fill="var(--steel-raised)" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={30 + i * 30} y={MAT_Y + 3} width={14} height={2} rx={1}
          fill="var(--mat-line)" />
      ))}
    </g>
  )
}

import { renderToStaticMarkup } from 'react-dom/server'
import { Figure } from '../components/figure/Figure'
import { handOf } from '../components/figure/kinematics'
import { Station } from '../components/station/Station'
import { MAT_Y, SEAT, VIEW } from '../components/station/geometry'
import { DAY1 } from '../data/exercises/day1'
import type { Exercise } from '../types/program'
import type { Pose } from '../types/pose'
import tokensCss from '../styles/tokens.css?raw'

/**
 * Renders every Day 1 pose to one flat SVG, using the real Figure and Station
 * components so what gets checked is what ships. Reference lines come from
 * geometry.ts, so they cannot drift from the machine drawing.
 */
const COLS = 3
const CELL_W = VIEW.w
const CELL_H = VIEW.h + 26

function cell(ex: Exercise, pose: Pose, lift: number, label: string, mistake: boolean, x: number, y: number) {
  const hand = handOf(pose)
  const common = { station: ex.station, hand, lift, pin: 5, facing: pose.facing } as const
  return (
    <g key={`${ex.id}-${label}`} transform={`translate(${x} ${y})`}>
      <rect width={CELL_W} height={VIEW.h} fill="#23282d" stroke="#3d464e" />
      <Station {...common} layer="back" />
      <Figure pose={pose} tone={mistake ? 'mistake' : 'correct'} />
      <Station {...common} layer="front" />
      {/* reference lines: mat and seat surface */}
      <line x1={0} y1={MAT_Y} x2={CELL_W} y2={MAT_Y} stroke="#3fe07a" strokeWidth={0.8} />
      <line x1={SEAT.x} y1={SEAT.surfaceY} x2={SEAT.x + SEAT.width} y2={SEAT.surfaceY}
        stroke="#ff5ec8" strokeWidth={0.8} />
      <text x={8} y={VIEW.h + 17} fill="#b3b8bd" fontSize={15} fontFamily="monospace">
        {ex.name} — {label}
      </text>
    </g>
  )
}

export function renderSheet(only?: string): string {
  const cells: React.ReactNode[] = []
  const list = only ? DAY1.filter((e) => e.id === only) : DAY1
  list.forEach((ex, row) => {
    const variants: [Pose, number, string, boolean][] = [
      [ex.startPose, 0, 'start', false],
      [ex.endPose, ex.stackTravel, 'end', false],
    ]
    if (ex.mistakePose) variants.push([ex.mistakePose, ex.stackTravel, 'mistake', true])
    variants.forEach((v, col) => {
      cells.push(cell(ex, v[0], v[1], v[2], v[3], col * CELL_W, row * CELL_H))
    })
  })

  const w = COLS * CELL_W
  const h = list.length * CELL_H
  // Squared off, because the macOS thumbnailer used to rasterise this always
  // produces a square and would otherwise crop the bottom rows.
  const side = Math.max(w, h)
  const body = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" width={side} height={side}
      viewBox={`0 0 ${side} ${side}`}>
      <rect width={side} height={side} fill="#16181a" />
      <g transform={`translate(${(side - w) / 2} ${(side - h) / 2})`}>{cells}</g>
    </svg>,
  )

  // The app's CSS custom properties do not exist outside the browser, so bake
  // the real token values in. Parsed from tokens.css rather than copied, or a
  // new token silently renders as magenta.
  const tokens = new Map<string, string>()
  for (const [, name, value] of tokensCss.matchAll(/--([a-z-]+):\s*([^;]+);/g)) {
    tokens.set(name, value.trim())
  }
  return body.replace(/var\(--([a-z-]+)\)/g, (_, name) => {
    const hit = tokens.get(name)
    if (!hit) throw new Error(`renderSheet: no token --${name} in tokens.css`)
    return hit
  })
}

import { renderToStaticMarkup } from 'react-dom/server'
import { Figure } from '../components/figure/Figure'
import { resolveSkeleton } from '../components/figure/kinematics'
import { chestPress } from '../data/exercises/day1'
import tokensCss from '../styles/tokens.css?raw'

/**
 * The home-screen icon: the same mannequin the app navigates by, at the top of a
 * press. Drawn from the real Figure so the icon cannot drift from the app.
 *
 * Sized for a maskable icon -- the figure sits inside the middle 62% so a
 * launcher can crop it to a circle or a squircle without clipping a limb.
 */
export function renderIcon(): string {
  const pose = chestPress.endPose
  const pts = Object.values(resolveSkeleton(pose))
  const minX = Math.min(...pts.map((p) => p.x))
  const maxX = Math.max(...pts.map((p) => p.x))
  const minY = Math.min(...pts.map((p) => p.y))
  const maxY = Math.max(...pts.map((p) => p.y))

  const SIZE = 512
  const SAFE = 0.62
  // resolveSkeleton returns joint centres; the drawn body is a stroke-width
  // wider than that on every side, so pad before scaling or a maskable crop
  // clips the head.
  const PAD = 22
  const span = Math.max(maxX - minX, maxY - minY) + PAD * 2
  const scale = (SIZE * SAFE) / span
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  const body = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" width={SIZE} height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <rect width={SIZE} height={SIZE} fill="var(--mat)" />
      {/* A weight plate behind the figure: the app's organising idea. */}
      <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE * 0.3}
        fill="none" stroke="var(--plate-red)" strokeWidth={SIZE * 0.055} />
      <g transform={`translate(${SIZE / 2} ${SIZE / 2}) scale(${scale}) translate(${-cx} ${-cy})`}>
        <Figure pose={pose} />
      </g>
    </svg>,
  )

  const tokens = new Map<string, string>()
  for (const [, name, value] of tokensCss.matchAll(/--([a-z-]+):\s*([^;]+);/g)) {
    tokens.set(name, value.trim())
  }
  return body.replace(/var\(--([a-z-]+)\)/g, (_, name) => {
    const hit = tokens.get(name)
    if (!hit) throw new Error(`renderIcon: no token --${name} in tokens.css`)
    return hit
  })
}

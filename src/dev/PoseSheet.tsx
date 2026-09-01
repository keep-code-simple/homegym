// oxlint-disable react/only-export-components -- a dev-only entry point that
// mounts itself; it has no exports by design and is not in the built app.
import { createRoot } from 'react-dom/client'
import { Figure } from '../components/figure/Figure'
import { handOf } from '../components/figure/kinematics'
import { Station } from '../components/station/Station'
import { VIEW } from '../components/station/geometry'
import { DAY1 } from '../data/exercises/day1'
import type { Exercise } from '../types/program'
import type { Pose } from '../types/pose'
import '../styles/global.css'

/**
 * Dev-only contact sheet for authoring poses. Not part of the built app -- it
 * exists so a new exercise's numbers can be checked at a glance rather than by
 * clicking through the app.
 */
function Cell({ ex, pose, lift, label, mistake }: {
  ex: Exercise; pose: Pose; lift: number; label: string; mistake?: boolean
}) {
  const hand = handOf(pose)
  const common = { station: ex.station, hand, lift, pin: 5, facing: pose.facing } as const
  return (
    <figure style={{ margin: 0 }}>
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} style={{
        width: '100%', background: 'var(--steel)', border: '1px solid var(--steel-edge)',
      }}>
        <Station {...common} layer="back" />
        <Figure pose={pose} tone={mistake ? 'mistake' : 'correct'} />
        <Station {...common} layer="front" />
        {/* ground + eye lines to check the feet actually land on the mat */}
        <line x1={0} y1={272} x2={VIEW.w} y2={272} stroke="#0f0" strokeWidth={0.7} />
      </svg>
      <figcaption style={{ fontSize: 13, color: 'var(--chalk-dim)' }}>{label}</figcaption>
    </figure>
  )
}

function Sheet() {
  return (
    <div style={{ padding: 16 }}>
      {DAY1.map((ex) => (
        <section key={ex.id} style={{ marginBottom: 24 }}>
          <h2 style={{ font: '600 20px Oswald, sans-serif' }}>{ex.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <Cell ex={ex} pose={ex.startPose} lift={0} label="start" />
            <Cell ex={ex} pose={ex.endPose} lift={ex.stackTravel} label="end" />
            {ex.mistakePose && (
              <Cell ex={ex} pose={ex.mistakePose} lift={ex.stackTravel} label="mistake" mistake />
            )}
          </div>
        </section>
      ))}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<Sheet />)

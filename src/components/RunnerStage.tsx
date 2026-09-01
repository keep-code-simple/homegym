import { PHASE_LABEL } from '../anim/tempo'
import type { useSetRunner } from '../anim/useSetRunner'
import type { useDemoLoop } from '../anim/useDemoLoop'

type Props = {
  runner: ReturnType<typeof useSetRunner>
  loop: ReturnType<typeof useDemoLoop>
  /** Whose turn, which set, what pin -- the line under the big number. */
  meta: string
  /** Session mode ends a turn after one set, so it words this differently. */
  doneText?: string
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

/**
 * The scoreboard: the number a person is on and what their body should be doing
 * this second, sized to be read from across the room. Shared by the single
 * exercise runner and the session rotation so the count never looks like two
 * different things in the same room.
 *
 * No elapsed time is shown during a rep set on purpose. A visible clock while
 * you lift invites racing, and the slow lower is the whole point of the tempo.
 * Time only appears where time is the exercise, and while resting.
 */
export function RunnerStage({ runner, loop, meta, doneText }: Props) {
  const { phase } = runner

  return (
    <div className="runner-stage">
      {phase === 'working' && !runner.isHold && (
        <>
          <p className="runner-count stencil">
            {runner.reps}<span className="runner-of">/{runner.targetReps}</span>
          </p>
          <p className="runner-phase stencil">{PHASE_LABEL[loop.phase]}</p>
        </>
      )}

      {phase === 'working' && runner.isHold && (
        <>
          <p className="runner-count stencil">{runner.holdLeft}</p>
          <p className="runner-phase stencil">Hold still</p>
        </>
      )}

      {phase === 'resting' && (
        <>
          <p className="runner-count stencil is-rest">{mmss(runner.restLeft)}</p>
          <p className="runner-phase stencil">Rest — others are lifting</p>
        </>
      )}

      {phase === 'idle' && (
        <p className="runner-ready stencil">
          {runner.isHold
            ? `${runner.holdSeconds} seconds`
            : `${runner.minReps}–${runner.targetReps} reps`}
        </p>
      )}

      {phase === 'done' && (
        <p className="runner-ready stencil">
          {doneText ?? `All ${runner.sets} sets done`}
        </p>
      )}

      <p className="runner-meta">{meta}</p>
    </div>
  )
}

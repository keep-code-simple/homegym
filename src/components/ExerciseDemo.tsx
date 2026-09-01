import { useState } from 'react'
import { lerpPose } from '../anim/interpolate'
import { PHASE_LABEL } from '../anim/tempo'
import { usePrefersReducedMotion, type useDemoLoop } from '../anim/useDemoLoop'
import type { Exercise } from '../types/program'
import type { Pose } from '../types/pose'
import { Figure } from './figure/Figure'
import { handOf } from './figure/kinematics'
import { Station } from './station/Station'
import { VIEW } from './station/geometry'
import './ExerciseDemo.css'

type Props = {
  exercise: Exercise
  /** Shared with the set runner, so figure and rep count stay in step. */
  loop: ReturnType<typeof useDemoLoop>
  pin: number
  plateColour: string
  /** A set is running: the runner owns the tempo and the mistake stays hidden. */
  locked?: boolean
}

function Frame({ exercise, pose, lift, pin, plateColour, mistake }: {
  exercise: Exercise; pose: Pose; lift: number; pin: number
  plateColour: string; mistake: boolean
}) {
  const hand = handOf(pose)
  const common = {
    station: exercise.station, hand, lift, pin,
    facing: pose.facing, plateColour,
  } as const
  return (
    <>
      <Station {...common} layer="back" />
      <Figure pose={pose} tone={mistake ? 'mistake' : 'correct'} />
      <Station {...common} layer="front" />
    </>
  )
}

export function ExerciseDemo({ exercise, loop, pin, plateColour, locked = false }: Props) {
  const [mistake, setMistake] = useState(false)
  const reduced = usePrefersReducedMotion()
  const hasMistake = Boolean(exercise.mistakePose)
  const animates = !exercise.isHold && !reduced

  const showingMistake = mistake && hasMistake && !locked
  const target = showingMistake ? exercise.mistakePose! : exercise.endPose
  const progress = animates ? loop.progress : 1
  const pose = exercise.isHold
    ? (showingMistake ? exercise.mistakePose! : exercise.startPose)
    : lerpPose(exercise.startPose, target, progress)
  const lift = exercise.stackTravel * progress

  const svg = (p: Pose, l: number, label?: string) => (
    <figure className="demo-still">
      <svg viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img"
        aria-label={`${exercise.name}. ${exercise.motionDescription}`}>
        <Frame exercise={exercise} pose={p} lift={l} pin={pin}
          plateColour={plateColour} mistake={showingMistake} />
      </svg>
      {label && <figcaption className="stencil">{label}</figcaption>}
    </figure>
  )

  return (
    <div className={`demo ${showingMistake ? 'is-mistake' : ''}`}>
      {reduced && !exercise.isHold ? (
        <div className="demo-pair">
          {svg(exercise.startPose, 0, 'Start')}
          {svg(target, exercise.stackTravel, showingMistake ? 'Wrong' : 'Finish')}
        </div>
      ) : (
        <div className="demo-stage">
          {svg(pose, lift)}
          {animates && (
            <span className="demo-phase stencil">{PHASE_LABEL[loop.phase]}</span>
          )}
        </div>
      )}

      {showingMistake && (
        <p className="demo-caption">
          <span className="demo-caption-tag stencil">Wrong</span>
          {exercise.mistakeCaption}
        </p>
      )}

      <div className="demo-controls">
        {animates && !locked && (
          <>
            <button onClick={() => loop.setPlaying(!loop.playing)}
              aria-pressed={!loop.playing}>
              {loop.playing ? 'Pause' : 'Play'}
            </button>
            <button onClick={() => loop.setSlow(!loop.slow)} aria-pressed={loop.slow}
              className={loop.slow ? 'is-on' : ''}>
              Half speed
            </button>
          </>
        )}
        {hasMistake && !locked && (
          <button onClick={() => setMistake(!mistake)} aria-pressed={mistake}
            className={`demo-mistake ${mistake ? 'is-on' : ''}`}>
            {mistake ? 'Show it correct' : 'Show the mistake'}
          </button>
        )}
      </div>

      <p className="visually-hidden">{exercise.motionDescription}</p>
    </div>
  )
}

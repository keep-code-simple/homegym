import type { Point } from '../../types/pose'
import type { StationId } from '../../types/program'
import { MAT_Y, STACK, TOWER } from './geometry'
import { Cable } from './parts/Cable'
import { FloorMat } from './parts/FloorMat'
import { Frame, LatBar } from './parts/Frame'
import { PressArm } from './parts/PressArm'
import { Seat } from './parts/Seat'
import { WeightStack } from './parts/WeightStack'

/** Where the press-arm lever pivots off the frame, behind the seat. */
const PRESS_PIVOT: Point = { x: 196, y: 150 }

type Props = {
  station: StationId
  layer: 'back' | 'front'
  /** The working hand, from the figure's own kinematics. */
  hand: Point
  lift: number
  pin: number
  facing: 1 | -1
  plateColour?: string
}

export function Station({ station, layer, hand, lift, pin, facing, plateColour }: Props) {
  if (station === 'floor') {
    return layer === 'back' ? <FloorMat /> : null
  }

  const stackHead = { x: (STACK.left + STACK.right) / 2, y: STACK.top - lift }

  if (station === 'pressArm') {
    if (layer === 'back') {
      return (
        <g>
          <FloorMat />
          <Frame />
          <WeightStack pin={pin} lift={lift} colour={plateColour} />
          <LatBar />
          {/* Post the press arm pivots on, and the cable running along the
              floor from the stack to the foot of it. */}
          <rect x={PRESS_PIVOT.x - 5} y={PRESS_PIVOT.y} width={10}
            height={MAT_Y - PRESS_PIVOT.y} fill="var(--machine-dark)" />
          <Cable points={[
            stackHead,
            { x: stackHead.x, y: MAT_Y - 14 },
            { x: PRESS_PIVOT.x, y: MAT_Y - 14 },
          ]} />
          <Seat facing={facing} />
        </g>
      )
    }
    return <PressArm pivot={PRESS_PIVOT} handle={hand} />
  }

  // High and low pulley both run through the tower; only the pulley differs.
  const pulley = station === 'highPulley'
    ? TOWER.pulley
    : { x: TOWER.pulley.x, y: 250 }

  if (layer === 'back') {
    return (
      <g>
        <FloorMat />
        <Frame />
        <WeightStack pin={pin} lift={lift} colour={plateColour} />
        {/* The bar is in their hands, so it is not also hanging on the frame. */}
        {station !== 'highPulley' && <LatBar />}
      </g>
    )
  }

  return (
    <g>
      <Cable points={[stackHead, pulley, hand]} />
      {/* The bar in the hands. */}
      <line x1={hand.x - 22} y1={hand.y} x2={hand.x + 22} y2={hand.y}
        stroke="var(--steel-edge)" strokeWidth={7} strokeLinecap="round" />
    </g>
  )
}

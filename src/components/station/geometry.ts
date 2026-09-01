/**
 * One shared drawing space for every station, so the figure and the machine are
 * always to the same scale. A standing figure is ~200 units tall.
 *
 * This is a schematic of the MWM-988, not a mechanical drawing: enough of the
 * frame, seat, stack and cable run that it is obvious which part of the real
 * machine you are using.
 */
export const VIEW = { w: 420, h: 300 }

export const MAT_Y = 272

export const TOWER = {
  left: 58,
  right: 112,
  top: 40,
  /** Where the high pulley sits, for the pulldown and push-down cable run. */
  pulley: { x: 85, y: 52 },
}

export const STACK = {
  left: 64,
  right: 106,
  /** Top of the topmost plate when the stack is at rest. */
  top: 148,
  plateH: 7,
  gap: 1,
  count: 15,
}

/** The shrouded column the stack runs inside. */
export const SHROUD = { left: 50, right: 120, top: 58, strip: 7 }

/** Roller pairs at the front of the seat, in shot on every seated exercise. */
export const LEG_DEV = { x: 306, upperY: 222, lowerY: 258 }

export const SEAT = {
  x: 214,
  surfaceY: 219,
  width: 74,
  padTop: 122,
}

export const stackBottom = STACK.top + STACK.count * (STACK.plateH + STACK.gap)

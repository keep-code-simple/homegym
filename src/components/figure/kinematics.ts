import type { Point, Pose, Skeleton } from '../../types/pose'

/**
 * Segment lengths in viewBox units. A standing figure is about 200 tall, which
 * is the number every station drawing is scaled against.
 */
export const SEG = {
  headR: 15,
  neck: 12,
  torsoLower: 34,
  torsoUpper: 34,
  upperArm: 34,
  foreArm: 30,
  hand: 9,
  thigh: 46,
  shin: 44,
  foot: 20,
} as const

export const FIGURE_HEIGHT = SEG.shin + SEG.thigh + SEG.torsoLower + SEG.torsoUpper + SEG.neck + SEG.headR * 2

const RAD = Math.PI / 180

/**
 * A direction from an angle in degrees, measured clockwise from straight up.
 * 0 = up, 90 = forward (to the right), 180 = down.
 */
function dir(deg: number): Point {
  return { x: Math.sin(deg * RAD), y: -Math.cos(deg * RAD) }
}

function step(from: Point, deg: number, len: number): Point {
  const d = dir(deg)
  return { x: from.x + d.x * len, y: from.y + d.y * len }
}

/**
 * Walk the joint chain and return every joint in world space.
 *
 * Poses are authored facing right; a left-facing figure is mirrored here rather
 * than in an SVG transform, so the points that come back are true world
 * coordinates and the cable can simply be drawn to `handR`.
 */
export function resolveSkeleton(pose: Pose): Skeleton {
  const p = { x: 0, y: 0 } // pelvis, local origin

  // Trunk, bottom up.
  const lowerAngle = pose.torso
  const midback = step(p, lowerAngle, SEG.torsoLower)
  const upperAngle = pose.torso + pose.spine
  const shoulders = step(midback, upperAngle, SEG.torsoUpper)
  const neckAngle = upperAngle + pose.neck
  const neckTop = step(shoulders, neckAngle, SEG.neck)
  const head = step(neckTop, neckAngle, SEG.headR)

  // Arms hang along the trunk (upperAngle + 180) and raise forward as the
  // shoulder angle grows, which means rotating back toward 90 -- hence minus.
  const arm = (shoulder: number, elbow: number) => {
    const upper = upperAngle + 180 - shoulder
    const elbowPt = step(shoulders, upper, SEG.upperArm)
    const fore = upper - elbow
    const wrist = step(elbowPt, fore, SEG.foreArm)
    const hand = step(wrist, fore, SEG.hand)
    return { elbow: elbowPt, hand }
  }
  const armL = arm(pose.shoulderL, pose.elbowL)
  const armR = arm(pose.shoulderR, pose.elbowR)

  // Legs hang from the pelvis, following the lower trunk.
  const leg = (hip: number, knee: number, ankle: number) => {
    const thigh = lowerAngle + 180 - hip
    const kneePt = step(p, thigh, SEG.thigh)
    const shin = thigh + knee
    const anklePt = step(kneePt, shin, SEG.shin)
    const toe = step(anklePt, shin - 90 + ankle, SEG.foot)
    return { knee: kneePt, ankle: anklePt, toe }
  }
  const legL = leg(pose.hipL, pose.kneeL, pose.ankleL)
  const legR = leg(pose.hipR, pose.kneeR, pose.ankleR)

  const local: Record<string, Point> = {
    pelvis: p,
    midback,
    shoulders,
    neckTop,
    head,
    elbowL: armL.elbow, handL: armL.hand,
    elbowR: armR.elbow, handR: armR.hand,
    kneeL: legL.knee, ankleL: legL.ankle, toeL: legL.toe,
    kneeR: legR.knee, ankleR: legR.ankle, toeR: legR.toe,
  }

  const out = {} as Skeleton
  for (const key of Object.keys(local)) {
    const q = local[key]
    out[key as keyof Skeleton] = {
      x: pose.root.x + q.x * pose.facing,
      y: pose.root.y + q.y,
    }
  }
  return out
}

/** Where the working hand ended up -- the cable and handle attach here. */
export function handOf(pose: Pose): Point {
  return resolveSkeleton(pose).handR
}

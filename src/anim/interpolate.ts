import type { Pose } from '../types/pose'

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/**
 * Blend two poses. Only the angles move -- root and facing come from the start
 * pose, since a person does not slide across the room mid-rep.
 */
export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  return {
    root: { x: lerp(a.root.x, b.root.x, t), y: lerp(a.root.y, b.root.y, t) },
    facing: a.facing,
    posture: a.posture,
    torso: lerp(a.torso, b.torso, t),
    spine: lerp(a.spine, b.spine, t),
    neck: lerp(a.neck, b.neck, t),
    shoulderL: lerp(a.shoulderL, b.shoulderL, t),
    elbowL: lerp(a.elbowL, b.elbowL, t),
    shoulderR: lerp(a.shoulderR, b.shoulderR, t),
    elbowR: lerp(a.elbowR, b.elbowR, t),
    hipL: lerp(a.hipL, b.hipL, t),
    kneeL: lerp(a.kneeL, b.kneeL, t),
    hipR: lerp(a.hipR, b.hipR, t),
    kneeR: lerp(a.kneeR, b.kneeR, t),
    ankleL: lerp(a.ankleL, b.ankleL, t),
    ankleR: lerp(a.ankleR, b.ankleR, t),
  }
}

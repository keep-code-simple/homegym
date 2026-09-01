import type { Pose } from '../types/pose'

/**
 * Base postures. An exercise overrides only the joints it actually moves, which
 * keeps each exercise file to the handful of numbers that matter.
 */
export const seated: Pose = {
  root: { x: 236, y: 220 },
  facing: 1,
  posture: 'seated',
  torso: 0, spine: 0, neck: 0,
  shoulderL: 0, elbowL: 0, shoulderR: 0, elbowR: 0,
  hipL: 82, kneeL: 88, hipR: 82, kneeR: 88,
  ankleL: 0, ankleR: 0,
}

export const standing: Pose = {
  root: { x: 252, y: 182 },
  facing: -1,
  posture: 'standing',
  torso: 0, spine: 0, neck: 0,
  shoulderL: 0, elbowL: 0, shoulderR: 0, elbowR: 0,
  hipL: 0, kneeL: 4, hipR: 0, kneeR: 4,
  ankleL: 0, ankleR: 0,
}

export const kneeling: Pose = {
  root: { x: 250, y: 226 },
  facing: -1,
  posture: 'kneeling',
  torso: 0, spine: 0, neck: 0,
  shoulderL: 0, elbowL: 0, shoulderR: 0, elbowR: 0,
  hipL: 0, kneeL: 90, hipR: 0, kneeR: 90,
  ankleL: 90, ankleR: 90,
}

/** Elbows and toes on the mat, body in one line above them. */
export const plankBase: Pose = {
  root: { x: 232, y: 244 },
  facing: 1,
  posture: 'prone',
  torso: 85, spine: 0, neck: 0,
  shoulderL: 85, elbowL: 90, shoulderR: 85, elbowR: 90,
  hipL: 0, kneeL: 0, hipR: 0, kneeR: 0,
  ankleL: 11, ankleR: 11,
}

export const pose = (base: Pose, over: Partial<Pose>): Pose => ({ ...base, ...over })

/** Both arms together -- side view, they move as one. */
export const arms = (shoulder: number, elbow: number) => ({
  shoulderL: shoulder, elbowL: elbow, shoulderR: shoulder, elbowR: elbow,
})

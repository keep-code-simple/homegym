/**
 * A pose is nothing but joint angles in degrees, plus where the figure stands.
 * Adding an exercise should be a data edit, not new code -- so all the geometry
 * lives here and in kinematics.ts, and an exercise supplies only two poses.
 *
 * Angle conventions, all in the figure's own facing-right space:
 *   torso     0 = upright, + = leaning forward (chest toward the front)
 *   spine     extra flexion of the upper back on top of `torso`. + = ribs curling
 *             toward the hips. This is what makes a crunch look like a crunch
 *             rather than a hip hinge.
 *   neck      head relative to the upper back. + = chin toward chest.
 *   shoulder  0 = arm hanging along the torso, + = raising it forward.
 *             90 = straight out front, 180 = straight overhead.
 *   elbow     0 = straight, + = flexed (hand travels toward the front).
 *   hip       0 = thigh in line with the torso (standing), + = flexed.
 *             ~90 = seated.
 *   knee      0 = straight, + = flexed (heel toward the backside).
 *   ankle     0 = foot flat and square to the shin, + = toes up.
 *
 * `facing` mirrors the whole figure, so poses are always authored facing right
 * and a station just says which way the person actually stands.
 */
export type Facing = 1 | -1

export type Posture = 'seated' | 'standing' | 'kneeling' | 'prone'

export type Pose = {
  root: { x: number; y: number } // the pelvis, in viewBox units
  facing: Facing
  posture: Posture
  torso: number
  spine: number
  neck: number
  shoulderL: number
  elbowL: number
  shoulderR: number
  elbowR: number
  hipL: number
  kneeL: number
  hipR: number
  kneeR: number
  ankleL: number
  ankleR: number
}

export type JointName =
  | 'pelvis' | 'midback' | 'shoulders' | 'neckTop' | 'head'
  | 'elbowL' | 'handL' | 'elbowR' | 'handR'
  | 'kneeL' | 'ankleL' | 'toeL' | 'kneeR' | 'ankleR' | 'toeR'

export type Point = { x: number; y: number }

/** World-space position of every joint, so the cable can find the hand. */
export type Skeleton = Record<JointName, Point>

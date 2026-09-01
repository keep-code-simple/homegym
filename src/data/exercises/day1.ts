import type { Exercise } from '../../types/program'
import { arms, kneeling, plankBase, pose, seated, standing } from '../poseKit'

/**
 * Day 1 form content is taken verbatim from the family brief -- setup, cues,
 * watch-fors and breathing are not invented here.
 *
 * Every mistake pose is one that is actually visible from the side, since that
 * is the only view the figure has. Elbow flare on the press is a frontal-plane
 * error and would be invisible, so the press shows the arching low back instead
 * -- also on its watch-list, and unmistakable in profile.
 */

const dadReps = { sets: 3, reps: [10, 12] as [number, number] }
const boyReps = { sets: 2, reps: [12, 15] as [number, number] }
const lifting = { dad: dadReps, son1: boyReps, son2: boyReps }

export const chestPress: Exercise = {
  id: 'chest-press',
  name: 'Seated chest press',
  station: 'pressArm',
  stationLabel: 'Press arm',
  target: ['chest', 'shoulders', 'triceps'],
  setup: [
    'Set the seat so the handles sit level with your mid-chest.',
    'Feet flat on the floor.',
    'Back and head against the pad, and keep them there.',
  ],
  cues: [
    'Elbows about 45° from your ribs, not flared out to 90°.',
    'Press forward and slightly together.',
    'Stop just short of locking your elbows.',
    'Lower until the stack almost touches, then go again.',
  ],
  watchOutFor: [
    'Shoulders shrugging up toward your ears.',
    'Low back arching off the pad.',
    'Letting the stack slam down at the bottom.',
  ],
  breathing: 'Breathe out as you press, in as you lower.',
  startPose: pose(seated, arms(-20, 125)),
  endPose: pose(seated, arms(72, 18)),
  mistakePose: pose(seated, {
    ...arms(72, 18),
    // Hips stay on the seat, mid-back bows away from the pad. The hip angle
    // absorbs the torso tilt so the legs do not swing with the trunk.
    torso: 20, spine: -28, hipL: 102, hipR: 102,
  }),
  mistakeCaption: 'Low back arching off the pad. Keep your ribs down and your back flat.',
  stackTravel: 46,
  motionDescription:
    'Seated with your back on the pad, both handles start beside your chest with the elbows behind you, then press forward until the arms are almost straight, and return slowly.',
  prescription: lifting,
}

export const pecFly: Exercise = {
  id: 'pec-fly',
  name: 'Pec fly',
  station: 'pressArm',
  stationLabel: 'Vertical butterfly',
  target: ['chest', 'front of shoulders'],
  setup: [
    'Forearms flat on the pads.',
    'Elbows just below shoulder height.',
  ],
  cues: [
    'Think of hugging a barrel.',
    'The elbow angle stays fixed the whole way.',
    'Squeeze the pads together in front of your chest.',
  ],
  watchOutFor: [
    'Opening so far that your elbows travel behind your shoulders.',
    'Throwing it with momentum instead of squeezing.',
  ],
  breathing: 'Breathe out as you squeeze together, in as you open.',
  startPose: pose(seated, arms(30, 145)),
  endPose: pose(seated, arms(88, 12)),
  mistakePose: pose(seated, { ...arms(88, 12), torso: 24, spine: -10, hipL: 106, hipR: 106 }),
  mistakeCaption: 'Throwing it with a body swing. Sit still and let the chest do the work.',
  stackTravel: 34,
  motionDescription:
    'Seated with forearms on the pads, the arms start open out to the sides and sweep forward until the pads meet in front of the chest, then open slowly.',
  prescription: lifting,
}

export const tricepPushdown: Exercise = {
  id: 'tricep-pushdown',
  name: 'Tricep push-down',
  station: 'highPulley',
  stationLabel: 'High pulley + bar',
  target: ['triceps'],
  setup: [
    'Stand close to the tower, feet under your hips.',
    'Take the bar with your hands about shoulder width.',
  ],
  cues: [
    'Elbows pinned against your ribs.',
    'Only the forearms move.',
    'Straighten your arms all the way.',
    'Return to about 90° under control.',
  ],
  watchOutFor: [
    'Elbows drifting forward, away from your ribs.',
    'Leaning your body weight onto the bar.',
  ],
  breathing: 'Breathe out as you push down, in as it comes back up.',
  startPose: pose(standing, arms(-6, 95)),
  endPose: pose(standing, arms(-6, 6)),
  mistakePose: pose(standing, { ...arms(42, 48), torso: 12, hipL: 12, hipR: 12 }),
  mistakeCaption: 'Elbows have drifted forward and the body is leaning on the bar. Pin the elbows to your ribs.',
  stackTravel: 40,
  motionDescription:
    'Standing at the tower, the elbows stay at your ribs while the forearms push the bar down from a right angle to straight, then return slowly.',
  prescription: lifting,
}

export const kneelingCrunch: Exercise = {
  id: 'kneeling-crunch',
  name: 'Kneeling high-pulley crunch',
  station: 'highPulley',
  stationLabel: 'High pulley + bar',
  target: ['abs'],
  setup: [
    "Kneel facing the tower, an arm's length back from it.",
    'Hold the bar down by the sides of your head.',
  ],
  cues: [
    'Hinge from the ribs, not the hips.',
    'Curl your chest toward your hips.',
    'Hips stay still.',
    'Your arms only hold the bar — they do not pull.',
  ],
  watchOutFor: [
    'Pulling the bar down with your arms.',
    'Hips swinging back as you crunch.',
  ],
  breathing: 'Breathe out as you curl down, in as you come up.',
  startPose: pose(kneeling, arms(148, 105)),
  endPose: pose(kneeling, { ...arms(148, 105), torso: 6, spine: 46, neck: 14 }),
  mistakePose: pose(kneeling, { ...arms(104, 42), torso: -4, spine: 6, hipL: -30, hipR: -30 }),
  mistakeCaption: 'Hips swinging back and the arms doing the pulling. Keep the hips still and curl the ribs.',
  stackTravel: 38,
  motionDescription:
    'Kneeling at the tower with the bar beside your head, the chest curls down toward the hips while the hips stay still, then uncurls slowly.',
  prescription: lifting,
}

export const plank: Exercise = {
  id: 'plank',
  name: 'Plank',
  station: 'floor',
  stationLabel: 'Floor',
  target: ['abs', 'whole trunk'],
  setup: [
    'Elbows on the mat, directly under your shoulders.',
    'Toes tucked under, legs straight.',
  ],
  cues: [
    'Elbows under shoulders.',
    'Ribs down.',
    'Hips level with your shoulders.',
    'Squeeze your glutes.',
  ],
  watchOutFor: [
    'Hips sagging toward the floor.',
    'Hips piked up in the air to make it easier.',
    'Holding your breath.',
  ],
  breathing: 'Keep breathing steadily the whole time. Do not hold your breath.',
  startPose: plankBase,
  endPose: plankBase,
  mistakePose: pose(plankBase, { root: { x: 232, y: 258 }, torso: 76, hipL: -20, hipR: -20 }),
  mistakeCaption: 'Hips sagging toward the floor. Squeeze your glutes and bring the hips back into line.',
  stackTravel: 0,
  isHold: true,
  motionDescription:
    'Held still on your elbows and toes, with head, hips and heels in one straight line.',
  prescription: {
    dad: { sets: 3, holdSeconds: 40 },
    son1: { sets: 2, holdSeconds: 25 },
    son2: { sets: 2, holdSeconds: 25 },
  },
}

export const DAY1 = [chestPress, pecFly, tricepPushdown, kneelingCrunch, plank]

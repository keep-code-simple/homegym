import type { Pose, Skeleton } from '../../types/pose'
import { SEG, resolveSkeleton } from './kinematics'

export type FigureTone = 'correct' | 'mistake'

type Props = {
  pose: Pose
  tone?: FigureTone
  /** Skip the far-side limbs for the small list icons. */
  simple?: boolean
}

const TONES = {
  correct: { near: '#e6e1d8', far: '#a29c92', ink: '#2a2723' },
  mistake: { near: '#e8862a', far: '#a8631f', ink: '#2a1c08' },
}

function L(a: { x: number; y: number }, b: { x: number; y: number }) {
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} L${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

function limb(s: Skeleton, side: 'L' | 'R') {
  return {
    upperArm: L(s.shoulders, s[`elbow${side}`]),
    foreArm: L(s[`elbow${side}`], s[`hand${side}`]),
    thigh: L(s.pelvis, s[`knee${side}`]),
    shin: L(s[`knee${side}`], s[`ankle${side}`]),
    foot: L(s[`ankle${side}`], s[`toe${side}`]),
    hand: s[`hand${side}`],
  }
}

/**
 * A side-view articulated mannequin drawn from a pose. Clean filled shapes with
 * rounded caps -- readable at icon size, not photorealistic. The far-side limbs
 * are drawn in a muted tone underneath so the figure reads as a body rather
 * than a flat stick.
 */
export function Figure({ pose, tone = 'correct', simple = false }: Props) {
  const s = resolveSkeleton(pose)
  const c = TONES[tone]
  const far = limb(s, 'L')
  const near = limb(s, 'R')

  const trunk =
    `M${s.pelvis.x.toFixed(1)} ${s.pelvis.y.toFixed(1)}` +
    ` L${s.midback.x.toFixed(1)} ${s.midback.y.toFixed(1)}` +
    ` L${s.shoulders.x.toFixed(1)} ${s.shoulders.y.toFixed(1)}`

  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      {!simple && (
        <g stroke={c.far}>
          <path d={far.thigh} strokeWidth={18} />
          <path d={far.shin} strokeWidth={15} />
          <path d={far.foot} strokeWidth={9} />
          <path d={far.upperArm} strokeWidth={14} />
          <path d={far.foreArm} strokeWidth={12} />
          <circle cx={far.hand.x} cy={far.hand.y} r={6} fill={c.far} stroke="none" />
        </g>
      )}

      {/* Neck, then trunk over it, then head on top. */}
      <path d={L(s.shoulders, s.neckTop)} stroke={c.near} strokeWidth={16} />
      <path d={trunk} stroke={c.near} strokeWidth={34} />
      <circle cx={s.head.x} cy={s.head.y} r={SEG.headR} fill={c.near} />

      {/* The near arm crosses the trunk in most poses, so it gets a dark
          outline pass first -- without it the limb disappears into the body. */}
      <g stroke={c.ink}>
        <path d={near.thigh} strokeWidth={24} />
        <path d={near.shin} strokeWidth={21} />
        <path d={near.upperArm} strokeWidth={20} />
        <path d={near.foreArm} strokeWidth={18} />
        <circle cx={near.hand.x} cy={near.hand.y} r={9.5} fill={c.ink} stroke="none" />
      </g>
      <g stroke={c.near}>
        <path d={near.thigh} strokeWidth={19} />
        <path d={near.shin} strokeWidth={16} />
        <path d={near.foot} strokeWidth={10} />
        <path d={near.upperArm} strokeWidth={15} />
        <path d={near.foreArm} strokeWidth={13} />
        <circle cx={near.hand.x} cy={near.hand.y} r={7} fill={c.near} stroke="none" />
      </g>
    </g>
  )
}

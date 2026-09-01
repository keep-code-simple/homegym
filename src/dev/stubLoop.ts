import type { useDemoLoop } from '../anim/useDemoLoop'

/**
 * A stopped clock, for rendering a component that wants the demo loop outside a
 * browser. Nothing here ticks: the SSR render is one frame by definition.
 */
export const stubLoop = {
  progress: 0, phase: 'pause', elapsed: 0,
  playing: true, setPlaying: () => {},
  slow: false, setSlow: () => {},
  restart: () => {},
} satisfies ReturnType<typeof useDemoLoop>

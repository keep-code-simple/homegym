# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev                   # vite dev server on :5173
npm run build                 # tsc -b && vite build
npm run lint                  # oxlint
npm run preview

npm run icons                 # regenerate home-screen icons (macOS only)
npm run poses                 # render every Day 1 pose to /tmp/posesheet.svg
npm run poses -- chest-press  # just one exercise
npm run smoke                 # SSR-render every screen; crash check
npm run check                 # rep-timing assertions + every set-runner phase
```

There is no test runner. `smoke` and `check` are the test suite; both run the real
components through Vite's SSR loader (`scripts/*.mjs` → `src/dev/*.tsx`). `check`
exits non-zero on failure, `smoke` prints a report. Add assertions to
`src/dev/checkRunner.tsx` rather than introducing a framework.

## What this is

A coaching app for a dad and two sons training on a **Marcy MWM-988** single-stack
home gym, on a tablet in the workout room. Its primary job is teaching correct body
position — bad form copied off a screen is worse than no app. Read `README.md` for
the product shape.

Hard constraints that are easy to violate accidentally:

- **Every exercise must be performable on the MWM-988 or be pure bodyweight.** The
  stations are the press arm, vertical butterfly, high pulley, low pulley, leg
  developer, and preacher pad, on one 150 lb / 15-plate stack. There are no
  dumbbells, no barbell, no squat rack, no leg press. Do not add exercises needing
  them.
- **Fully offline.** No CDN, no runtime network calls, no external asset downloads.
  Fonts come from npm (`@fontsource/*`) so Vite bundles them. A generated service
  worker (`scripts/make-sw.mjs`, run by `npm run build`) precaches the whole
  build. Adding a remote URL breaks the room this runs in.
- **Every URL must be relative.** The app is served from a project subpath on
  GitHub Pages (`/homegym/`). `base` is `'./'`; the manifest, icons and service
  worker are referenced as `./…`. Any path starting with `/` 404s in production
  but works locally, so it will not show up until it is deployed.
- **Navigation never changes the URL** (`history.pushState` is called without a
  URL argument). That is why no `404.html` fallback is needed. Introducing real
  routes means adding one.

## The animation architecture

An exercise supplies **two poses and a stack travel distance**; nothing else.
Adding an exercise should be a data edit (`src/data/exercises/`), not new code.

```
Pose (joint angles)  →  kinematics.resolveSkeleton()  →  world-space joints
                                    ↓                          ↓
                              Figure.tsx                  Station.tsx
                          (draws the body)         (cable + handle attach
                                                    to the returned hand)
```

- `src/types/pose.ts` — the pose type and, importantly, the **angle conventions**.
  Read it before authoring or editing any pose.
- `src/components/figure/kinematics.ts` — the single source of truth for geometry.
  Walks the joint chain, mirrors for `facing`, returns every joint in world space.
  `handOf()` is what the cable uses.
- `src/components/station/` — the MWM-988 as a schematic. `geometry.ts` holds every
  shared coordinate (mat line, seat surface, stack bounds); parts must derive from
  those constants rather than hardcoding.
- `src/anim/` — `tempo.ts` owns the prescribed tempo (1s up, 1s hold, 2s down,
  0.5s pause) and rep counting; `useDemoLoop` is the rAF clock.

### Pose authoring gotcha

Hip and shoulder angles are **relative to the trunk**. A pose that tilts `torso`
drags the legs and arms with it. Any tilting pose must compensate the hip by the
same amount or the figure slides off the seat. See the chest-press `mistakePose`
in `src/data/exercises/day1.ts` for the pattern.

### Mistake poses must be visible from the side

The rig is strictly sagittal. Frontal-plane errors — elbow flare on a press, grip
width, shoulder-blade squeeze — cannot be shown and must not be chosen as a
`mistakePose`, however prominent they are on the exercise's watch-list. Pick an
error from the same exercise that reads in profile (arching back, rounding, body
swing, elbows drifting forward). The written `watchOutFor` list still names them
all; only the *drawn* mistake is constrained.

### Verifying visual work without a browser

`npm run poses` renders every start/end/mistake pose through the real components
into one SVG with the mat and seat reference lines drawn. Rasterise and look at it:

```sh
npm run poses && qlmanage -t -s 1800 -o /tmp/ql /tmp/posesheet.svg
# then read /tmp/ql/posesheet.svg.png
```

The sheet pads itself square because the macOS thumbnailer always emits a square
and would otherwise crop the bottom rows. `renderSheet.tsx` parses `tokens.css` for
colours and **throws on an unknown token** — a new CSS variable must be added to
`tokens.css`, not to a copy, or the render is wrong.

## One clock

`ExercisePractice` owns a single `useDemoLoop` and hands it to both `ExerciseDemo`
and `useSetRunner`, so the figure on screen is always doing the rep the counter
says it is. Do not give either its own loop.

`useSetRunner` derives everything it can from that clock — current rep, whether the
set is over, rest remaining. The only stored state is what a person chose. That
leaves exactly one effect that mutates state on a clock crossing (end of set), and
it is deliberate; the `set-state-in-effect` lint warning there is the rule's own
documented exception for synchronising with an external system.

A rep counts at the **top of the lift** (when a person says the number out loud),
and a set runs a full cycle per rep so the last slow lower is not cut off.
`npm run check` asserts both.

## Product rules that are code rules

These come from the brief and constrain implementation, not just copy:

- **Never store or display body weight, measurements, calories, or BMI** — the
  storage schema has no place for them and should not grow one.
- **No records, personal bests, or one-rep-max prompts, for anyone.** Reps, sets
  and times deliberately live in memory only; only pin settings and the
  day-completion tick persist (`src/storage/schema.ts`). Persisting durations puts
  a leaderboard one step away.
- **No elapsed clock during a rep set.** A visible timer invites racing and the
  slow eccentric is the point. Time appears only where time *is* the exercise (the
  plank) and during rest.
- **The boys' prescriptions default lighter than the adult's** and no screen
  encourages them to match him.
- Pins are stored as **pin position 1–15**, not pounds — that is what is printed on
  the machine. Pounds are derived (`PLATE_LB`).
- Raising a pin more than one plate in a sitting warns.

## Deliberate departures from the original brief

Do not "fix" these back:

1. **`Figure` renders from computed joint positions, not nested `<g>` transforms.**
   The brief specified nested groups with `transform-origin`. That gives no way to
   find the hand, and the cable and weight stack must attach to it.
2. **Day 1 is ~42 minutes, not 30.** Five exercises × seven sets at the prescribed
   tempo, plus a pin change between every set. `estimateMinutes` computes it rather
   than hardcoding, so it stays honest as the program is edited.

## Still to build

Session mode (a three-person rotation wrapping `useSetRunner` and walking the day's
exercise list) and Days 2–5. `DAYS` in `src/data/program.ts` declares all five; only
Day 1 has exercises.

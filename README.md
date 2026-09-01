# homegym

A coaching app for a dad and two sons training on a **Marcy MWM-988** single-stack
home gym. Runs on a phone or tablet in the workout room. The app is the coach: the
boys open it and run the session themselves.

Its most important job is teaching correct body position, so every exercise carries
an animated side-view demonstration, the cues, and a toggle that replays the same
movement done **wrong**.

## Running it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static, offline-capable dist/
npm run preview
```

No backend, no accounts, no network at runtime. Fonts are bundled from npm, so a
built `dist/` works with the wifi off.

## What is built so far

- **Home** — the five-day week, today promoted, a plate-coloured cell per person
  per day that fills when they finish (tap again to undo).
- **Day 1 (Push & core)** — warm-up, the five exercises, per-person sets and reps.
- **Exercise detail** — animated demo on the prescribed tempo (1s up, 1s hold,
  2s down, 0.5s pause), half-speed toggle, "show the mistake" toggle, setup, cues,
  watch-out-fors, breathing, and a per-person pin control that persists.
- **Set runner** — pick who is lifting, start the set, and the app counts them
  through it: rep number, the phase called out (*press · hold · lower*), set
  number, and their pin. Holds get a countdown instead of reps. A rest clock
  runs after every set.

Not built yet: session mode, and Days 2–5.

## How the animation works

An exercise supplies two poses and a stack travel distance; nothing else. Adding
an exercise is a data edit, not new code.

- `src/types/pose.ts` — a pose is joint angles in degrees. The angle conventions
  are documented there and are worth reading before authoring one.
- `src/components/figure/kinematics.ts` — walks the joint chain and returns every
  joint in world space.
- `src/components/figure/Figure.tsx` — draws the mannequin from those points.
- `src/components/station/` — the MWM-988 as a schematic: frame, seat, stack,
  cable. The plates that move are the ones at and above the pin, as on the machine.
- `src/anim/` — the tempo and the rAF loop.

### Authoring poses

```sh
npm run poses                 # contact sheet of every Day 1 pose -> /tmp/posesheet.svg
npm run poses -- chest-press  # just one exercise
npm run smoke                 # renders every screen as a crash check
npm run check                 # rep-timing assertions + every set-runner phase
```

The contact sheet draws start, end and mistake for each exercise with the mat and
seat lines marked, so you can see whether the feet actually reach the floor.

**One gotcha:** hip and shoulder angles are relative to the trunk. If a pose tilts
the torso, it must compensate the hip by the same amount or the legs swing with
the body. See the chest-press mistake pose for the pattern.

## The set runner

`src/anim/useSetRunner.ts` counts reps off the **same clock that drives the
figure** — `ExercisePractice` owns one `useDemoLoop` and hands it to both — so
the number on screen and the body on screen cannot drift apart. A rep counts at
the top of the lift, which is when a person says the number out loud; the set
ends a full cycle later so the last slow lower is not cut off. `npm run check`
asserts this.

Two rules built into it:

- **No elapsed time during a rep set.** A visible clock while you lift invites
  racing, and the slow lower is the point of the tempo. Time appears only where
  time is the exercise (the plank) and while resting.
- **Nothing is stored.** Reps, sets and times live as long as the screen is
  open. Only the day-completion tick persists. Stored durations are one step
  from a personal best, which this app does not do for anyone.

Session mode becomes a three-person rotation wrapped around this rather than
new machinery.

## The machine drawing

`src/components/station/` is a schematic of the MWM-988, drawn from the product
photos rather than measurements. It carries the landmarks that make it
recognisable at a glance, and stops there:

- the shrouded stack column with the red numbered scale down it, the pin marked;
- the cambered lat bar, hanging under the crossbar when it is not in someone's
  hands;
- the leg-developer rollers at the front of the seat, in shot on every seated
  exercise.

Confirmed from the photos: **the seat faces away from the stack** (back on the
pad, legs forward under the rollers), and **the ankle strap ships with the
machine** — so Day 3's cable hip kickback is safe to build.

Not drawn, deliberately: the individual pulley wheels, the chain at the handle
end, and the real frame geometry. At the size the kids actually look at this, a
faithful frame turns into noise behind the figure.

## Two deliberate departures from the original brief

1. **The figure renders from computed joint positions, not nested `<g>`
   transforms.** The cable and the weight stack have to attach to the hand, and
   nested SVG transforms give no way to find where the hand ended up. The drawing
   is identical; the geometry is now queryable.

2. **The chest-press mistake is the arching low back, not elbow flare.** Elbow
   flare is a frontal-plane error and is invisible in the side view the whole rig
   is built on. Arching is on the same exercise's watch-list and reads clearly in
   profile. The same rule picked the mistake for all five: if you cannot see it
   from the side, it cannot teach anything. The pec fly shows the body swing for
   the same reason.

## Acceptance check 4, revised

The brief targeted 30 minutes. Day 1 is 5 exercises × 7 sets (dad 3, each boy 2).
At the prescribed tempo a 12-rep set is about 55 seconds, plus a pin change between
every set because all three lift different weights — **about 42 minutes**, and the
app says so rather than promising 30. Trimming to four exercises on the loaded days
would buy back the difference if that matters more than the volume.

## Rules the app keeps

- No body weight, measurements, calories or BMI — anywhere, including storage.
- No records, no personal bests, no one-rep-max prompts for anyone.
- The boys' prescriptions default lighter than the adult's.
- Raising a pin more than one plate warns.
- House rules shown once on first launch.

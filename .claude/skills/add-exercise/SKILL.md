---
name: add-exercise
description: Add or edit an exercise in this home-gym app (src/data/exercises/), including authoring its start/end/mistake poses and verifying them visually without a browser. Use whenever a new movement is being added to a day, a day beyond Day 1 is being built out, or an existing exercise's poses, cues, prescription, or pin defaults are being changed.
---

# Adding an exercise

An exercise is **data**, not code: two poses, a stack travel distance, and the
written coaching content. If a change here needs a new component or a new field
on `Exercise`, stop and reconsider — that is usually a sign the pose is being
fought instead of authored.

## 1. Check it is legal before writing anything

- **Station.** It must be performable on the Marcy MWM-988 — press arm, vertical
  butterfly, high pulley, low pulley, leg developer, preacher pad — or be pure
  bodyweight. No dumbbells, barbell, rack, or leg press. `station` must be one of
  the `StationId` values in `src/types/program.ts`; adding a new one means
  drawing new machine parts, which is a much bigger job than a data edit.
- **Content is coaching, not invention.** `setup`, `cues`, `watchOutFor` and
  `breathing` come from the family brief. If the source text is not available,
  ask rather than writing plausible-sounding form cues — bad form copied off a
  screen is worse than no app.
- **No body weight, measurements, calories, BMI, records, or PBs** anywhere in
  what is added, including copy.

## 2. Write the exercise

In `src/data/exercises/<day>.ts`, following `day1.ts`:

- Start from a `poseKit` base (`seated`, `standing`, `kneeling`, `plankBase`) and
  override only the joints that move: `pose(seated, arms(-20, 125))`. Read the
  angle conventions at the top of `src/types/pose.ts` first — every time.
- **Hip and shoulder angles are relative to the trunk.** Any pose that tilts
  `torso` must add the same amount to `hipL`/`hipR` or the legs swing with the
  trunk and the figure slides off the seat. See `chestPress.mistakePose`.
- `stackTravel` is in viewBox units (the figure is ~200 tall, the mat is at
  `MAT_Y`), and `0` for bodyweight. Day 1 uses 34–46; match the scale of the
  real hand travel rather than guessing large.
- `mistakePose` **must read in profile.** The rig is strictly sagittal, so elbow
  flare, grip width and scapular squeeze cannot be drawn. Pick an error from the
  same exercise that shows from the side — arching, rounding, body swing, elbows
  drifting forward — and still name the frontal-plane ones in `watchOutFor`.
- `motionDescription` is the screen-reader and reduced-motion alternative; it
  must describe the whole rep, not the muscle.
- A hold (plank) sets `isHold: true`, uses `holdSeconds` in its prescription, and
  animates nothing.
- **The boys' prescription is lighter than the adult's** and nothing hints they
  should match him.

## 3. Wire it up

- Export it and add it to that day's array (`export const DAY1 = [...]`).
- `src/data/exercises/index.ts` — include the day's array in `EXERCISES`.
- `src/data/program.ts` — list the id in the right `DAYS` entry, and add a pin
  default for every person in `DEFAULT_PINS`. Pins are **positions 1–15**, never
  pounds; start deliberately light (boys 1–2).
- `src/dev/renderSheet.tsx`, `src/dev/smoke.tsx` and `src/dev/checkRunner.tsx`
  each import `DAY1` directly. A new day is invisible to the test suite until
  those imports are widened — do that in the same change, and update the turn
  counts asserted in `checkRunner`.

## 4. Verify — required, in this order

```sh
npm run poses && qlmanage -t -s 1800 -o /tmp/ql /tmp/posesheet.svg
# then read /tmp/ql/posesheet.svg.png
npm run check    # exits non-zero on failure
npm run smoke    # crash check, prints a report
npm run lint && npm run build
```

`npm run poses -- <exercise-id>` renders one exercise while iterating. Actually
**look at the rasterised sheet** — the green line is the mat and the pink line is
the seat surface. Feet must reach the mat and not pass through it, the seated
hips must sit on the pink line, and the hand must land where the cable or handle
attaches. Numbers that typecheck can still be anatomically absurd.

New colours must be added to `src/styles/tokens.css` itself — `renderSheet`
parses that file and throws on an unknown token.

For a focused read of the sheet, hand it to the `pose-critic` agent.

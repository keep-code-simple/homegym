import { useState } from 'react'
import { PLATE_LB, STACK_PLATES } from '../data/program'

/**
 * The pin number is what you actually read off the machine, so it is the hero
 * figure; the pounds are secondary. Going up more than one plate in a sitting
 * gets a warning -- that is how form falls apart.
 */
export function PinControl({ pin, onChange }: { pin: number; onChange: (n: number) => void }) {
  // The pin this person was on when the screen opened.
  const [baseline] = useState(pin)
  const [nudged, setNudged] = useState(false)

  const set = (n: number) => {
    const next = Math.min(Math.max(n, 1), STACK_PLATES)
    setNudged(true)
    onChange(next)
  }

  const jumped = nudged && pin > baseline + 1

  return (
    <div className="pin">
      <div className="pin-row">
        <button className="pin-btn" onClick={() => set(pin - 1)} disabled={pin <= 1}
          aria-label="One plate lighter">−</button>
        <span className="pin-val">
          <span className="pin-num stencil">{pin}</span>
          <span className="pin-lb">{pin * PLATE_LB} lb</span>
        </span>
        <button className="pin-btn" onClick={() => set(pin + 1)} disabled={pin >= STACK_PLATES}
          aria-label="One plate heavier">+</button>
      </div>
      {jumped && (
        <p className="pin-warn">
          That is {pin - baseline} plates up from last time. Add one at a time.
        </p>
      )}
    </div>
  )
}

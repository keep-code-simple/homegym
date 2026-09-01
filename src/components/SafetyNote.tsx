/** Shown once, on first launch. Short and not preachy. */
export function SafetyNote({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="safety" role="dialog" aria-modal="true" aria-labelledby="safety-h">
      <div className="safety-box">
        <h2 className="display" id="safety-h">Four house rules</h2>
        <ul>
          <li>Form before weight. Always.</li>
          <li>An adult is in the room whenever the stack is being used.</li>
          <li>Never a single heavy rep to see what you can do.</li>
          <li>If a joint hurts, stop that exercise for the day.</li>
        </ul>
        <button className="safety-ok" onClick={onDismiss}>Got it</button>
      </div>
    </div>
  )
}

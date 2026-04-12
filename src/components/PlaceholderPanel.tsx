type PlaceholderPanelProps = {
  unitLabel: string
  subtopicLabel: string
  plannedDrills?: string[]
  message?: string
}

export function PlaceholderPanel({
  unitLabel,
  subtopicLabel,
  plannedDrills,
  message,
}: PlaceholderPanelProps) {
  return (
    <div>
      <h3 className="section-title">
        {unitLabel} {'>'} {subtopicLabel}
      </h3>
      <div className="question-box placeholder-card">
        <p className="placeholder-head">
          <span className="placeholder-dot" aria-hidden="true"></span>
          Coming Soon
        </p>
        <p>
          {message ??
            'This subtopic is coming soon. We are preparing exam-style tracing, output prediction, and concept-check drills.'}
        </p>
        {plannedDrills && plannedDrills.length > 0 ? (
          <ul>
            {plannedDrills.map((drill) => (
              <li key={drill}>{drill}</li>
            ))}
          </ul>
        ) : null}
        <p className="small-note">
          More practice sets will be added here in a future update.
        </p>
      </div>
    </div>
  )
}

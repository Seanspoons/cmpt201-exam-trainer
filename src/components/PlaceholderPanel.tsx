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
          Scaffolded Subtopic
        </p>
        <p>
          {message ??
            'This subtopic is coming soon. Planned drills will include exam-style tracing, output prediction, and concept checks.'}
        </p>
        {plannedDrills && plannedDrills.length > 0 ? (
          <ul>
            {plannedDrills.map((drill) => (
              <li key={drill}>{drill}</li>
            ))}
          </ul>
        ) : null}
        <p className="small-note">
          Planned next: add exam-style question generators and step-by-step solutions
          for this subtopic.
        </p>
      </div>
    </div>
  )
}

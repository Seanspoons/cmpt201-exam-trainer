type PlaceholderPanelProps = {
  unitLabel: string
  subtopicLabel: string
}

export function PlaceholderPanel({ unitLabel, subtopicLabel }: PlaceholderPanelProps) {
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
        <p>This subtopic is scaffolded and ready for question templates.</p>
        <p className="small-note">
          Planned next: add exam-style question generators and step-by-step solutions
          for this subtopic.
        </p>
      </div>
    </div>
  )
}

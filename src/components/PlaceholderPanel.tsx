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
      <div className="question-box">
        <p>This subtopic is scaffolded and ready for question templates.</p>
      </div>
    </div>
  )
}

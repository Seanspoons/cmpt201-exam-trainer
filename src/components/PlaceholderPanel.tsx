type PlaceholderPanelProps = {
  unitLabel: string
  subtopicLabel: string
}

export function PlaceholderPanel({ unitLabel, subtopicLabel }: PlaceholderPanelProps) {
  return (
    <div>
      <h2 className="section-title">{unitLabel}</h2>
      <div className="question-box">
        <p>
          <strong>{subtopicLabel}</strong>
        </p>
        <p>This subtopic is scaffolded and ready for question templates.</p>
      </div>
    </div>
  )
}

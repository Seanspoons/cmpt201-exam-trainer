type TopicPathTitleProps = {
  title: string
}

export function TopicPathTitle({ title }: TopicPathTitleProps) {
  const parts = title
    .split('>')
    .map((part) => part.trim())
    .filter(Boolean)

  const unitLabel = parts[0] ?? title
  const subtopicLabel =
    parts.length > 1 ? parts.slice(1).join(' > ') : ''

  return (
    <h3 className="section-title topic-path-title">
      <span className="topic-path-unit">{unitLabel}</span>
      {subtopicLabel ? (
        <>
          <span className="topic-path-divider" aria-hidden="true">
            {'>'}
          </span>
          <span className="topic-path-subtopic">{subtopicLabel}</span>
        </>
      ) : null}
    </h3>
  )
}

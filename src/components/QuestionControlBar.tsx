import { FiRefreshCw, FiRotateCcw } from 'react-icons/fi'

type QuestionControlBarProps = {
  hasQuestion: boolean
  isTransitioning: boolean
  onNewQuestion: () => void
  onResetAnswer: () => void
  disableReset?: boolean
}

export function QuestionControlBar({
  hasQuestion,
  isTransitioning,
  onNewQuestion,
  onResetAnswer,
  disableReset = false,
}: QuestionControlBarProps) {
  return (
    <div className="question-control-bar">
      <button
        className="button-primary question-action-button"
        onClick={onNewQuestion}
        disabled={isTransitioning}
      >
        <FiRefreshCw aria-hidden="true" />
        <span>{hasQuestion ? 'New Question' : 'Generate Question'}</span>
      </button>
      <button
        className="button-secondary question-action-button"
        onClick={onResetAnswer}
        disabled={disableReset || isTransitioning}
      >
        <FiRotateCcw aria-hidden="true" />
        <span>Reset Answer</span>
      </button>
      {isTransitioning ? (
        <span className="question-control-note" role="status" aria-live="polite">
          Loading next question...
        </span>
      ) : null}
    </div>
  )
}

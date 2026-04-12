import { useEffect } from 'react'
import { FiRefreshCw, FiRotateCcw } from 'react-icons/fi'
import { useAllTopicsContext } from './AllTopicsContext'

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
  const { isAllTopicsMode, advanceTopic } = useAllTopicsContext()

  useEffect(() => {
    if (!isAllTopicsMode || hasQuestion || isTransitioning) return
    onNewQuestion()
  }, [hasQuestion, isAllTopicsMode, isTransitioning, onNewQuestion])

  return (
    <div className="question-control-bar">
      <button
        className="button-primary question-action-button"
        onClick={() => {
          if (isAllTopicsMode) {
            advanceTopic()
            return
          }
          onNewQuestion()
        }}
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
        <span>Clear Answer</span>
      </button>
      {isTransitioning ? (
        <span className="question-control-note" role="status" aria-live="polite">
          Loading next question...
        </span>
      ) : null}
    </div>
  )
}

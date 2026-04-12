import type { ReactNode } from 'react'
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
  FiList,
  FiTarget,
} from 'react-icons/fi'

type FeedbackStatus = 'correct' | 'partial' | 'incorrect'

type AnswerFeedbackCardProps = {
  status: FeedbackStatus
  missingConceptLabels?: string[]
  answerContent: ReactNode
  explanationContent: ReactNode
  conceptSummary?: ReactNode
  extraContent?: ReactNode
  onMarkCorrect?: () => void
}

function getStatusLabel(status: FeedbackStatus): string {
  if (status === 'correct') return 'Correct'
  if (status === 'partial') return 'Partially Correct'
  return 'Incorrect'
}

function renderStatusIcon(status: FeedbackStatus) {
  if (status === 'correct') return <FiCheckCircle aria-hidden="true" />
  if (status === 'partial') return <FiAlertTriangle aria-hidden="true" />
  return <FiAlertCircle aria-hidden="true" />
}

export function AnswerFeedbackCard({
  status,
  missingConceptLabels = [],
  answerContent,
  explanationContent,
  conceptSummary,
  extraContent,
  onMarkCorrect,
}: AnswerFeedbackCardProps) {
  return (
    <div className={`answer-feedback answer-feedback--${status}`} role="status" aria-live="polite">
      <div className="answer-feedback-head">
        <span className={`answer-feedback-chip answer-feedback-chip--${status}`}>
          {renderStatusIcon(status)}
          <span>{getStatusLabel(status)}</span>
        </span>
      </div>

      {status === 'partial' && missingConceptLabels.length > 0 ? (
        <div className="answer-feedback-note-row">
          <p className="answer-feedback-note">
            Partially correct — missing key concept:{' '}
            <strong>{missingConceptLabels.join(', ')}</strong>
          </p>
          {onMarkCorrect ? (
            <button className="button-secondary" onClick={onMarkCorrect}>
              I got it correct
            </button>
          ) : null}
        </div>
      ) : null}

      {status === 'incorrect' && onMarkCorrect ? (
        <div className="answer-feedback-note-row">
          <p className="answer-feedback-note">Think your answer was still valid?</p>
          <button className="button-secondary" onClick={onMarkCorrect}>
            I got it correct
          </button>
        </div>
      ) : null}

      <section className="answer-feedback-section">
        <h4 className="answer-feedback-title">
          <FiTarget aria-hidden="true" />
          <span>Expected Answer</span>
        </h4>
        {answerContent}
      </section>

      <section className="answer-feedback-section">
        <h4 className="answer-feedback-title">
          <FiList aria-hidden="true" />
          <span>Explanation</span>
        </h4>
        {explanationContent}
      </section>

      {extraContent ? <section className="answer-feedback-section">{extraContent}</section> : null}

      {conceptSummary ? (
        <p className="answer-feedback-concept">
          <FiInfo aria-hidden="true" />
          <span>{conceptSummary}</span>
        </p>
      ) : null}
    </div>
  )
}

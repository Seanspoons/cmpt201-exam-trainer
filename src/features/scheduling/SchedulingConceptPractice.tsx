import { useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import { QuestionControlBar } from '../../components/QuestionControlBar'
import { useSessionContext } from '../../components/SessionContext'
import { useTopicContext } from '../../components/TopicContext'
import { useQuestionTransition } from '../../components/useQuestionTransition'
import { useResetPulse } from '../../components/useResetPulse'
import type { SchedulingConceptQuestion } from './conceptQuestions'

type SchedulingConceptPracticeProps = {
  title: string
  generateQuestion: () => SchedulingConceptQuestion
}

type CheckResult = {
  status: 'correct' | 'partial' | 'incorrect'
  missingConceptLabels: string[]
}

export function SchedulingConceptPractice({
  title,
  generateQuestion,
}: SchedulingConceptPracticeProps) {
  const [question, setQuestion] = useState<SchedulingConceptQuestion | null>(null)
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null)
  const [matchAnswer, setMatchAnswer] = useState<Record<string, string>>({})
  const [checked, setChecked] = useState(false)
  const [hasCountedAttempt, setHasCountedAttempt] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()
  const { recordAttempt } = useSessionContext()
  const { unitLabel, subtopicLabel } = useTopicContext()

  const resetAnswerInputs = () => {
    setMcqAnswer(null)
    setMatchAnswer({})
    setChecked(false)
    setResult(null)
  }

  const generate = () => {
    transition.runQuestionTransition(() => {
      setQuestion(generateQuestion())
      resetAnswerInputs()
      setHasCountedAttempt(false)
    })
  }

  const resetAnswerOnly = () => {
    if (!question) return
    resetAnswerInputs()
    resetPulse.triggerResetPulse()
  }

  const checkAnswer = () => {
    if (!question) return

    if (question.type === 'mcq') {
      const isCorrect = mcqAnswer === question.correctOption
      if (!hasCountedAttempt) {
        recordAttempt({
          unitLabel,
          subtopicLabel,
          isCorrect,
        })
        setHasCountedAttempt(true)
      }
      setResult({ status: isCorrect ? 'correct' : 'incorrect', missingConceptLabels: [] })
      setChecked(true)
      return
    }

    const missing = question.pairs
      .filter((pair) => (matchAnswer[pair.left] ?? '') !== pair.right)
      .map((pair) => pair.left)
    const status: CheckResult['status'] =
      missing.length === 0
        ? 'correct'
        : missing.length < question.pairs.length
          ? 'partial'
          : 'incorrect'
    setResult({ status, missingConceptLabels: missing })
    if (!hasCountedAttempt) {
      recordAttempt({
        unitLabel,
        subtopicLabel,
        isCorrect: status === 'correct',
      })
      setHasCountedAttempt(true)
    }
    setChecked(true)
  }

  return (
    <div>
      <h3 className="section-title">{title}</h3>
      <QuestionControlBar
        hasQuestion={Boolean(question)}
        isTransitioning={transition.isTransitioning}
        onNewQuestion={generate}
        onResetAnswer={resetAnswerOnly}
        disableReset={!question}
      />

      <div
        className={`question-stage ${
          transition.phase === 'out'
            ? 'question-stage--out'
            : transition.phase === 'in'
              ? 'question-stage--in'
              : ''
        }`}
      >
      {question ? (
        <>
          <div className="question-box">
            <p>{question.prompt}</p>
          </div>

          <div
            className={`answer-input-region ${
              resetPulse.isResetActive ? 'answer-input-region--reset' : ''
            }`}
          >
          {question.type === 'mcq' ? (
            <div className="field">
              <label>Choose one:</label>
              <div className="controls-row">
                {question.options.map((option, index) => (
                  <button
                    key={option}
                    className={mcqAnswer === index ? 'button-primary' : 'button-secondary'}
                    onClick={() => setMcqAnswer(index)}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="field">
              <label>Match each item:</label>
              <div className="table-scroll">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Left</th>
                      <th>Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {question.pairs.map((pair) => (
                      <tr key={pair.left}>
                        <td>{pair.left}</td>
                        <td>
                          <select
                            value={matchAnswer[pair.left] ?? ''}
                            onChange={(event) =>
                              setMatchAnswer((prev) => ({
                                ...prev,
                                [pair.left]: event.target.value,
                              }))
                            }
                          >
                            <option value="">Select...</option>
                            {question.pairs.map((optionPair) => (
                              <option key={optionPair.right} value={optionPair.right}>
                                {optionPair.right}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>

          <div style={{ marginTop: '0.65rem' }}>
            <button
              className="button-primary"
              onClick={checkAnswer}
              disabled={
                question.type === 'mcq'
                  ? mcqAnswer === null
                  : question.pairs.some((pair) => !matchAnswer[pair.left])
              }
            >
              Check Answer
            </button>
          </div>

          {checked && result ? (
            <AnswerFeedbackCard
              status={result.status}
              missingConceptLabels={result.missingConceptLabels}
              answerContent={
                question.type === 'mcq' ? (
                  <p>
                    Correct answer:{' '}
                    <strong>
                      {String.fromCharCode(65 + question.correctOption)}.{' '}
                      {question.options[question.correctOption]}
                    </strong>
                  </p>
                ) : (
                  <div className="table-scroll">
                    <table className="compact-table">
                      <thead>
                        <tr>
                          <th>Left</th>
                          <th>Correct Match</th>
                        </tr>
                      </thead>
                      <tbody>
                        {question.pairs.map((pair) => (
                          <tr key={pair.left}>
                            <td>{pair.left}</td>
                            <td>{pair.right}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              }
              explanationContent={
                <div className="table-scroll">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>Step-by-step explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.explanationSteps.map((step) => (
                        <tr key={step}>
                          <td>{step}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
              conceptSummary={`Concept summary: ${question.conceptSummary}`}
              extraContent={
                question.comparisonTable ? (
                  <div className="table-scroll">
                    <table className="compact-table">
                      <thead>
                        <tr>
                          {question.comparisonTable.headers.map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {question.comparisonTable.rows.map((row) => (
                          <tr key={row.join('|')}>
                            {row.map((cell) => (
                              <td key={cell}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : undefined
              }
            />
          ) : null}
        </>
      ) : (
        <p>Generate a question to start.</p>
      )}
      </div>
    </div>
  )
}

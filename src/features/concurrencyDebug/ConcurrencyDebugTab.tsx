import { useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import { QuestionControlBar } from '../../components/QuestionControlBar'
import { useQuestionTransition } from '../../components/useQuestionTransition'
import { useResetPulse } from '../../components/useResetPulse'
import { gradeByConceptGroups } from '../../lib/semanticGrading'
import { randomPick } from '../../lib/random'
import {
  CONCURRENCY_QUESTIONS,
  type ConcurrencyQuestion,
} from './questions'

type CheckResult = {
  status: 'correct' | 'partial' | 'incorrect'
  missingConceptLabels: string[]
}

export function ConcurrencyDebugTab() {
  const [question, setQuestion] = useState<ConcurrencyQuestion | null>(null)
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()

  const resetAnswerInputs = () => {
    setMcqAnswer(null)
    setTextAnswer('')
    setChecked(false)
    setResult(null)
  }

  const generateQuestion = () => {
    transition.runQuestionTransition(() => {
      setQuestion(randomPick(CONCURRENCY_QUESTIONS))
      resetAnswerInputs()
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
      if (mcqAnswer === null) return
      const isCorrect = mcqAnswer === question.correctOption
      setResult({
        status: isCorrect ? 'correct' : 'incorrect',
        missingConceptLabels: [],
      })
      setAttempts((value) => value + 1)
      if (isCorrect) {
        setCorrect((value) => value + 1)
      }
      setChecked(true)
      return
    }

    const grade = gradeByConceptGroups(
      textAnswer,
      question.requiredConcepts,
    )
    setResult({
      status: grade.status,
      missingConceptLabels: grade.missingConceptLabels,
    })
    setAttempts((value) => value + 1)
    if (grade.status === 'correct') {
      setCorrect((value) => value + 1)
    }
    setChecked(true)
  }

  return (
    <div>
      <h2 className="section-title">Concurrency Debug</h2>
      <QuestionControlBar
        hasQuestion={Boolean(question)}
        isTransitioning={transition.isTransitioning}
        onNewQuestion={generateQuestion}
        onResetAnswer={resetAnswerOnly}
        disableReset={!question}
      />
      <p className="small-note">
        Session score: {correct}/{attempts}
      </p>

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
            {question.code ? (
              <pre className="inline-code-block">{question.code}</pre>
            ) : null}
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
                    onClick={() => setMcqAnswer(index)}
                    style={{
                      borderColor: mcqAnswer === index ? '#222' : '#777',
                      fontWeight: mcqAnswer === index ? 700 : 400,
                    }}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="field">
              <label htmlFor="concurrencyTextAnswer">Your concise explanation</label>
              <textarea
                id="concurrencyTextAnswer"
                value={textAnswer}
                onChange={(event) => setTextAnswer(event.target.value)}
              />
            </div>
          )}
          </div>

          <div style={{ marginTop: '0.65rem' }}>
            <button
              className="button-primary"
              onClick={checkAnswer}
              disabled={
                question.type === 'mcq' ? mcqAnswer === null : !textAnswer.trim()
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
                    Expected answer:{' '}
                    <strong>
                      {String.fromCharCode(65 + question.correctOption)}.{' '}
                      {question.options[question.correctOption]}
                    </strong>
                  </p>
                ) : (
                  <p>
                    Acceptable answer: <strong>{question.sampleAnswer}</strong>
                  </p>
                )
              }
              explanationContent={
                question.type === 'mcq' ? (
                  <>
                  <p>{question.explanation}</p>
                  <div className="table-scroll">
                    <table className="compact-table">
                      <thead>
                        <tr>
                          <th>Choice</th>
                          <th>Why right/wrong</th>
                        </tr>
                      </thead>
                      <tbody>
                        {question.options.map((option, index) => (
                          <tr key={option}>
                            <td>
                              {String.fromCharCode(65 + index)}. {option}
                            </td>
                            <td>{question.wrongReasons[index]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </>
                ) : (
                  <p>{question.explanation}</p>
                )
              }
              conceptSummary={`Bug location/concept: ${question.bugSpot}`}
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

import { useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
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

  const generateQuestion = () => {
    setQuestion(randomPick(CONCURRENCY_QUESTIONS))
    setMcqAnswer(null)
    setTextAnswer('')
    setChecked(false)
    setResult(null)
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
      <div className="controls-row">
        <button className="button-secondary" onClick={generateQuestion}>
          Generate Question
        </button>
        <button className="button-secondary" onClick={generateQuestion}>
          Reset / New Question
        </button>
      </div>
      <p className="small-note">
        Session score: {correct}/{attempts}
      </p>

      {question ? (
        <>
          <div className="question-box">
            <p>{question.prompt}</p>
            {question.code ? (
              <pre className="inline-code-block">{question.code}</pre>
            ) : null}
          </div>

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
  )
}

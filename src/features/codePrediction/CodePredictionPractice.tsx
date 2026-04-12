import { useState } from 'react'
import {
  isPredictionAnswerCorrect,
  type CodePredictionQuestion,
} from './questions'

type CodePredictionPracticeProps = {
  title: string
  generateQuestion: () => CodePredictionQuestion
}

type CheckResult = {
  isCorrect: boolean
}

export function CodePredictionPractice({
  title,
  generateQuestion,
}: CodePredictionPracticeProps) {
  const [question, setQuestion] = useState<CodePredictionQuestion | null>(null)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)

  const generate = () => {
    setQuestion(generateQuestion())
    setAnswer('')
    setChecked(false)
    setResult(null)
  }

  const checkAnswer = () => {
    if (!question) return
    const isCorrect = isPredictionAnswerCorrect(answer, question)
    setResult({ isCorrect })
    setAttempts((value) => value + 1)
    if (isCorrect) {
      setCorrect((value) => value + 1)
    }
    setChecked(true)
  }

  return (
    <div>
      <h3 className="section-title">{title}</h3>
      <div className="controls-row">
        <button className="button-secondary" onClick={generate}>
          Generate Question
        </button>
        <button className="button-secondary" onClick={generate}>
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
            <pre className="inline-code-block">{question.code}</pre>
          </div>
          <div className="field">
            <label htmlFor={`${title}-codeAnswer`}>Your answer</label>
            <input
              id={`${title}-codeAnswer`}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
            <p className="small-note">Checking ignores case and extra spaces.</p>
          </div>
          <div style={{ marginTop: '0.65rem' }}>
            <button className="button-primary" onClick={checkAnswer} disabled={!answer.trim()}>
              Check Answer
            </button>
          </div>

          {checked && result ? (
            <div className="result-box">
              <p className={`status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                {result.isCorrect ? 'Correct' : 'Incorrect'}
              </p>
              <p>Accepted answer(s):</p>
              <ul>
                {question.correctAnswers.map((value) => (
                  <li key={value}>
                    <strong>{value}</strong>
                  </li>
                ))}
              </ul>
              <div className="table-scroll">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Step-by-step execution trace</th>
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
              <p className="small-note">Concepts: {question.concepts.join(', ')}</p>
              {question.nonDeterministicNote ? (
                <p className="small-note">
                  Non-determinism note: {question.nonDeterministicNote}
                </p>
              ) : null}
            </div>
          ) : null}
        </>
      ) : (
        <p>Generate a question to start.</p>
      )}
    </div>
  )
}

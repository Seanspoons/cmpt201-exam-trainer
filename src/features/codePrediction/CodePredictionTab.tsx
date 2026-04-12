import { useState } from 'react'
import { randomPick } from '../../lib/random'
import {
  CODE_PREDICTION_QUESTIONS,
  isPredictionAnswerCorrect,
  type CodePredictionQuestion,
} from './questions'

type CheckResult = {
  isCorrect: boolean
}

export function CodePredictionTab() {
  const [question, setQuestion] = useState<CodePredictionQuestion | null>(null)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)

  const generateQuestion = () => {
    setQuestion(randomPick(CODE_PREDICTION_QUESTIONS))
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
      <h2 className="section-title">Code Output Prediction</h2>
      <div className="controls-row">
        <button onClick={generateQuestion}>Generate Question</button>
        <button onClick={generateQuestion}>Reset / New Question</button>
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
            <label htmlFor="codeAnswer">Your answer</label>
            <textarea
              id="codeAnswer"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </div>
          <div style={{ marginTop: '0.65rem' }}>
            <button onClick={checkAnswer} disabled={!answer.trim()}>
              Check Answer
            </button>
          </div>

          {checked && result ? (
            <div className="result-box">
              <p className={`status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                {result.isCorrect ? 'Correct' : 'Incorrect'}
              </p>
              <p>
                Expected answer(s):{' '}
                <strong>{question.correctAnswers.join(' OR ')}</strong>
              </p>
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
              <p className="small-note">
                Concepts: {question.concepts.join(', ')}
              </p>
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

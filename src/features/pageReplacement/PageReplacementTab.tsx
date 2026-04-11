import { useState } from 'react'
import {
  formatFrames,
  generatePageReplacementQuestion,
  solvePageReplacement,
  type PageReplacementQuestion,
} from './engine'

type CheckResult = {
  isCorrect: boolean
  message: string
}

function parseFrameAnswer(raw: string): number[] | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const values = trimmed
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number(value))

  if (values.some((value) => Number.isNaN(value))) {
    return null
  }

  return values
}

export function PageReplacementTab() {
  const [question, setQuestion] = useState<PageReplacementQuestion | null>(null)
  const [faultAnswer, setFaultAnswer] = useState('')
  const [frameAnswer, setFrameAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)

  const solution = question ? solvePageReplacement(question) : null

  const generateQuestion = () => {
    setQuestion(generatePageReplacementQuestion())
    setFaultAnswer('')
    setFrameAnswer('')
    setChecked(false)
    setResult(null)
  }

  const checkAnswer = () => {
    if (!question || !solution) return

    const parsedFaults = Number(faultAnswer.trim())
    if (Number.isNaN(parsedFaults)) {
      setResult({
        isCorrect: false,
        message: 'Enter a valid number for total page faults.',
      })
      setChecked(true)
      return
    }

    const faultsCorrect = parsedFaults === solution.totalFaults
    const parsedFrames = parseFrameAnswer(frameAnswer)
    const requiresFrameCheck = frameAnswer.trim().length > 0
    let framesCorrect = true

    if (requiresFrameCheck) {
      if (!parsedFrames || parsedFrames.length !== question.frameCount) {
        framesCorrect = false
      } else {
        const expected = solution.finalFrames.map((value) => value ?? -1)
        const actual = parsedFrames.map((value) => value ?? -1)
        framesCorrect = expected.every((value, index) => value === actual[index])
      }
    }

    const isCorrect = faultsCorrect && framesCorrect
    setResult({
      isCorrect,
      message: isCorrect
        ? 'Correct.'
        : 'Not correct yet. Review the table and try again.',
    })
    setAttempts((value) => value + 1)
    if (isCorrect) {
      setCorrect((value) => value + 1)
    }
    setChecked(true)
  }

  return (
    <div>
      <h2 className="section-title">Page Replacement</h2>
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
            <p>
              Using <strong>{question.algorithm}</strong> with{' '}
              <strong>{question.frameCount}</strong> frames, how many page faults
              occur for sequence:
            </p>
            <p className="mono">{question.referenceString.join(', ')}</p>
          </div>

          <div className="field-grid">
            <div className="field">
              <label htmlFor="faultAnswer">Total page faults</label>
              <input
                id="faultAnswer"
                value={faultAnswer}
                onChange={(event) => setFaultAnswer(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="frameAnswer">
                Final frames (optional, comma-separated)
              </label>
              <input
                id="frameAnswer"
                value={frameAnswer}
                onChange={(event) => setFrameAnswer(event.target.value)}
                placeholder={`e.g. ${Array.from(
                  { length: question.frameCount },
                  (_, i) => i + 1,
                ).join(', ')}`}
              />
            </div>
          </div>

          <button onClick={checkAnswer}>Check Answer</button>

          {checked && result && solution ? (
            <div className="result-box">
              <p className={`status ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                {result.isCorrect ? 'Correct' : 'Incorrect'}
              </p>
              <p>{result.message}</p>
              <p>
                Correct total faults: <strong>{solution.totalFaults}</strong>
              </p>
              <p>
                Correct final frames:{' '}
                <strong className="mono">{formatFrames(solution.finalFrames)}</strong>
              </p>

              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Page</th>
                    <th>Frames</th>
                    <th>Fault?</th>
                    <th>Evicted</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {solution.steps.map((step) => (
                    <tr key={step.step}>
                      <td>{step.step}</td>
                      <td>{step.page}</td>
                      <td className="mono">{formatFrames(step.frames)}</td>
                      <td>{step.pageFault ? 'Yes' : 'No'}</td>
                      <td>{step.evictedPage ?? '-'}</td>
                      <td>{step.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </>
      ) : (
        <p>Generate a question to start.</p>
      )}
    </div>
  )
}

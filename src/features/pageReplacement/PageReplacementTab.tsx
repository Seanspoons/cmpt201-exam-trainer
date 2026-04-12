import { useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import {
  formatFrames,
  formatReferenceBits,
  generatePageReplacementQuestion,
  solvePageReplacement,
  type PageReplacementAlgorithm,
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

function formatVictimPointer(pointer: number | undefined): string {
  if (pointer === undefined) return '-'
  return `F${pointer + 1}`
}

export function PageReplacementTab() {
  const [question, setQuestion] = useState<PageReplacementQuestion | null>(null)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    PageReplacementAlgorithm | 'Random'
  >('Random')
  const [faultAnswer, setFaultAnswer] = useState('')
  const [frameAnswer, setFrameAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [correct, setCorrect] = useState(0)

  const solution = question ? solvePageReplacement(question) : null

  const generateQuestion = () => {
    setQuestion(
      generatePageReplacementQuestion(
        selectedAlgorithm === 'Random' ? undefined : selectedAlgorithm,
      ),
    )
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
        ? 'Your answer matches the expected result.'
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
        <label className="inline-control">
          <span>Algorithm:</span>
          <select
            value={selectedAlgorithm}
            onChange={(event) =>
              setSelectedAlgorithm(
                event.target.value as PageReplacementAlgorithm | 'Random',
              )
            }
          >
            <option value="Random">Random</option>
            <option value="FIFO">FIFO</option>
            <option value="LRU">LRU</option>
            <option value="Second Chance">Second Chance</option>
          </select>
        </label>
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

          <button className="button-primary" onClick={checkAnswer}>
            Check Answer
          </button>

          {checked && result && solution ? (
            <AnswerFeedbackCard
              status={result.isCorrect ? 'correct' : 'incorrect'}
              answerContent={
                <>
                  <p>{result.message}</p>
                  <p>
                    Expected total faults: <strong>{solution.totalFaults}</strong>
                  </p>
                  <p>
                    Expected final frames:{' '}
                    <strong className="mono">{formatFrames(solution.finalFrames)}</strong>
                  </p>
                </>
              }
              explanationContent={
                <div className="table-scroll">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>Step</th>
                        <th>Page</th>
                        <th>Frames</th>
                        <th>Ref Bits</th>
                        <th>Victim Ptr</th>
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
                          <td className="mono">{formatReferenceBits(step.referenceBits)}</td>
                          <td className="mono">
                            {formatVictimPointer(step.victimPointer)}
                          </td>
                          <td>{step.pageFault ? 'Yes' : 'No'}</td>
                          <td>{step.evictedPage ?? '-'}</td>
                          <td>{step.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
              conceptSummary={`Algorithm: ${question.algorithm}. Eviction decisions follow algorithm-specific recency/order rules.`}
            />
          ) : null}
        </>
      ) : (
        <p>Generate a question to start.</p>
      )}
    </div>
  )
}

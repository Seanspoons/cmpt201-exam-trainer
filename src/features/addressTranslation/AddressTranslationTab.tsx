import { useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import { QuestionControlBar } from '../../components/QuestionControlBar'
import { useSessionContext } from '../../components/SessionContext'
import { useTopicContext } from '../../components/TopicContext'
import { useQuestionTransition } from '../../components/useQuestionTransition'
import { useResetPulse } from '../../components/useResetPulse'
import {
  binaryMatches,
  generateAddressTranslationQuestion,
  solveAddressTranslation,
  toBinary,
  type AddressTranslationQuestion,
} from './engine'

type CheckResult = {
  isCorrect: boolean
}

export function AddressTranslationTab() {
  const [question, setQuestion] = useState<AddressTranslationQuestion | null>(null)
  const [pageAnswer, setPageAnswer] = useState('')
  const [offsetAnswer, setOffsetAnswer] = useState('')
  const [physicalAnswer, setPhysicalAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [hasCountedAttempt, setHasCountedAttempt] = useState(false)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [result, setResult] = useState<CheckResult | null>(null)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()
  const { recordAttempt, overrideAttemptResult } = useSessionContext()
  const { unitLabel, subtopicLabel } = useTopicContext()

  const solution = question ? solveAddressTranslation(question) : null

  const resetInputs = () => {
    setPageAnswer('')
    setOffsetAnswer('')
    setPhysicalAnswer('')
    setChecked(false)
    setResult(null)
  }

  const resetAnswerOnly = () => {
    if (!question) return
    resetInputs()
    resetPulse.triggerResetPulse()
  }

  const generateQuestion = () => {
    transition.runQuestionTransition(() => {
      setQuestion(generateAddressTranslationQuestion())
      resetInputs()
      setHasCountedAttempt(false)
      setAttemptId(null)
    })
  }

  const checkAnswer = () => {
    if (!solution) return

    const pageCorrect = binaryMatches(pageAnswer, solution.pageBinary)
    const offsetCorrect = binaryMatches(offsetAnswer, solution.offsetBinary)
    const physicalCorrect = binaryMatches(physicalAnswer, solution.physicalBinary)

    const isCorrect = pageCorrect && offsetCorrect && physicalCorrect
    if (!hasCountedAttempt) {
      const id = recordAttempt({
        unitLabel,
        subtopicLabel,
        isCorrect,
      })
      setAttemptId(id)
      setHasCountedAttempt(true)
    }
    setResult({ isCorrect })
    setChecked(true)
  }

  return (
    <div>
      <h2 className="section-title">Address Translation</h2>
      <QuestionControlBar
        hasQuestion={Boolean(question)}
        isTransitioning={transition.isTransitioning}
        onNewQuestion={generateQuestion}
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
      {question && solution ? (
        <>
          <div className="question-box">
            <p>
              Page size is <strong>{question.pageSize}</strong> bytes. Virtual address is{' '}
              <strong className="mono">{solution.virtualBinary}</strong>.
            </p>
            <p>
              Find page number, offset, and physical address (binary). Page table:
            </p>
            <div className="table-scroll">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Page # (bin)</th>
                    <th>Frame # (bin)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(question.pageTable).map(([page, frame]) => (
                    <tr key={page}>
                      <td className="mono">{toBinary(Number(page), question.pageBits)}</td>
                      <td className="mono">{toBinary(frame, question.frameBits)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            className={`answer-input-region ${
              resetPulse.isResetActive ? 'answer-input-region--reset' : ''
            }`}
          >
          <div className="field-grid">
            <div className="field">
              <label htmlFor="pageAnswer">Page number (binary)</label>
              <input
                id="pageAnswer"
                value={pageAnswer}
                onChange={(event) => setPageAnswer(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="offsetAnswer">Offset (binary)</label>
              <input
                id="offsetAnswer"
                value={offsetAnswer}
                onChange={(event) => setOffsetAnswer(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="physicalAnswer">Physical address (binary)</label>
              <input
                id="physicalAnswer"
                value={physicalAnswer}
                onChange={(event) => setPhysicalAnswer(event.target.value)}
              />
            </div>
          </div>
          </div>

          <button className="button-primary" onClick={checkAnswer}>
            Check Answer
          </button>

          {checked && result ? (
            <AnswerFeedbackCard
              status={result.isCorrect ? 'correct' : 'incorrect'}
              onMarkCorrect={
                !result.isCorrect
                  ? () => {
                      if (attemptId !== null) {
                        overrideAttemptResult(attemptId, true)
                      }
                      setResult({ isCorrect: true })
                    }
                  : undefined
              }
              answerContent={
                <>
                  <p>
                    Expected page number:{' '}
                    <strong className="mono">{solution.pageBinary}</strong>
                  </p>
                  <p>
                    Expected offset: <strong className="mono">{solution.offsetBinary}</strong>
                  </p>
                  <p>
                    Expected physical address:{' '}
                    <strong className="mono">{solution.physicalBinary}</strong>
                  </p>
                </>
              }
              explanationContent={
                <>
                  <p className="small-note">
                    Step 1: Page size {question.pageSize} = 2^{question.offsetBits}, so offset
                    uses {question.offsetBits} bits.
                  </p>
                  <p className="small-note">
                    Step 2: Split VA {solution.virtualBinary} into page | offset:
                  </p>
                  <p className="mono">
                    [{solution.pageBinary}] | [{solution.offsetBinary}]
                  </p>
                  <p className="small-note">
                    Step 3: Lookup page {solution.pageBinary} in page table gives frame{' '}
                    {solution.frameBinary}.
                  </p>
                  <p className="small-note">
                    Step 4: Assemble PA = frame bits + offset bits.
                  </p>
                  <p className="mono">
                    [{solution.frameBinary}] + [{solution.offsetBinary}] ={' '}
                    {solution.physicalBinary}
                  </p>
                </>
              }
              conceptSummary="Address translation keeps offset bits unchanged and replaces page bits via the page table."
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

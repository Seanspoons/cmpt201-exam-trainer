import { useRef, useState } from 'react'
import { AnswerFeedbackCard } from '../../components/AnswerFeedbackCard'
import { useConfirmDialog } from '../../components/ConfirmDialogContext'
import { QuestionControlBar } from '../../components/QuestionControlBar'
import { useSessionContext } from '../../components/SessionContext'
import { TopicPathTitle } from '../../components/TopicPathTitle'
import { useTopicContext } from '../../components/TopicContext'
import { useUnitNavigationContext } from '../../components/UnitNavigationContext'
import { useQuestionTransition } from '../../components/useQuestionTransition'
import { useResetPulse } from '../../components/useResetPulse'
import { shuffleChoicesWithCorrectIndex, shuffledIndices } from '../../lib/questionRandomize'
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
  const [matchOptionsOrder, setMatchOptionsOrder] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [hasCountedAttempt, setHasCountedAttempt] = useState(false)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [result, setResult] = useState<CheckResult | null>(null)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()
  const { recordAttempt, overrideAttemptResult } = useSessionContext()
  const { requestConfirm } = useConfirmDialog()
  const { unitLabel, subtopicLabel } = useTopicContext()
  const { hasNextSubtopic, goToNextSubtopic } = useUnitNavigationContext()
  const seenQuestionIdsRef = useRef<Set<string>>(new Set())
  const lastQuestionIdRef = useRef<string | null>(null)

  const resetAnswerInputs = () => {
    setMcqAnswer(null)
    setMatchAnswer({})
    setChecked(false)
    setResult(null)
  }

  const generate = async () => {
    if (transition.isTransitioning) return

    const selectQuestion = () => {
      let fallback = generateQuestion()
      for (let i = 0; i < 24; i += 1) {
        const candidate = generateQuestion()
        fallback = candidate
        const unseen = !seenQuestionIdsRef.current.has(candidate.id)
        const notSameAsLast = candidate.id !== lastQuestionIdRef.current
        if (unseen && notSameAsLast) {
          return { question: candidate, exhausted: false }
        }
      }
      return { question: fallback, exhausted: true }
    }

    let { question: rawQuestion, exhausted } = selectQuestion()
    if (exhausted) {
      const wantsNext = hasNextSubtopic
        ? await requestConfirm({
            title: 'Topic Completed',
            message:
              'You have seen all questions in this topic. Move to the next topic?',
            confirmLabel: 'Move to Next Topic',
            cancelLabel: 'Stay Here',
          })
        : false
      if (wantsNext) {
        goToNextSubtopic()
        return
      }
      seenQuestionIdsRef.current.clear()
      const retry = selectQuestion()
      rawQuestion = retry.question
    }

    seenQuestionIdsRef.current.add(rawQuestion.id)
    lastQuestionIdRef.current = rawQuestion.id

    transition.runQuestionTransition(() => {
      if (rawQuestion.type === 'mcq') {
        const shuffled = shuffleChoicesWithCorrectIndex(
          rawQuestion.options,
          rawQuestion.correctOption,
        )
        setQuestion({
          ...rawQuestion,
          options: shuffled.choices,
          correctOption: shuffled.correctIndex,
        })
        setMatchOptionsOrder([])
      } else {
        setQuestion(rawQuestion)
        const options = rawQuestion.pairs.map((pair) => pair.right)
        const shuffled = shuffledIndices(options.length).map((index) => options[index])
        setMatchOptionsOrder(shuffled)
      }
      resetAnswerInputs()
      setHasCountedAttempt(false)
      setAttemptId(null)
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
        const id = recordAttempt({
          unitLabel,
          subtopicLabel,
          isCorrect,
        })
        setAttemptId(id)
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
      const id = recordAttempt({
        unitLabel,
        subtopicLabel,
        isCorrect: status === 'correct',
      })
      setAttemptId(id)
      setHasCountedAttempt(true)
    }
    setChecked(true)
  }

  return (
    <div>
      <TopicPathTitle title={title} />
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
                            {(matchOptionsOrder.length > 0
                              ? matchOptionsOrder
                              : question.pairs.map((optionPair) => optionPair.right)
                            ).map((option) => (
                              <option key={option} value={option}>
                                {option}
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
              onMarkCorrect={
                result.status !== 'correct'
                  ? () => {
                      if (attemptId !== null) {
                        overrideAttemptResult(attemptId, true)
                      }
                      setResult({ status: 'correct', missingConceptLabels: [] })
                    }
                  : undefined
              }
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

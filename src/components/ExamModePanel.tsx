import { useEffect, useMemo, useRef, useState } from 'react'
import { FiClock, FiPlay, FiTarget, FiX } from 'react-icons/fi'
import type { UnitId } from '../lib/study'
import { UNIT_OPTIONS } from '../lib/study'
import {
  generateExamModeQuestion,
  getDefaultExamUnitIds,
} from '../lib/examModeQuestions'
import type { NetworkingQuestion } from '../features/networkingShared/networkingDrills'
import { calculateAccuracy } from './SessionContext'
import type { ConceptGroup } from '../lib/semanticGrading'
import { gradeByConceptGroups } from '../lib/semanticGrading'
import { shuffleChoicesWithCorrectIndex, shuffledIndices } from '../lib/questionRandomize'
import { useQuestionTransition } from './useQuestionTransition'
import { useResetPulse } from './useResetPulse'

type ActiveExam = {
  id: string
  selectedUnitIds: UnitId[]
  targetQuestions: number
  timed: boolean
  durationMinutes: number
  startedAtMs: number
  endsAtMs: number | null
}

type ExamAttempt = {
  index: number
  question: NetworkingQuestion
  status: 'correct' | 'partial' | 'incorrect'
  missingConceptLabels: string[]
  userAnswerDisplay: string
}

type ExamModePanelProps = {
  onClose?: () => void
}

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

function renderAnswerDisplay(question: NetworkingQuestion): string {
  if (question.kind === 'mcq') {
    return `${String.fromCharCode(65 + question.correctOption)}. ${
      question.options[question.correctOption]
    }`
  }
  if (question.kind === 'text') return question.answerDisplay
  return question.pairs.map((pair) => `${pair.left} -> ${pair.right}`).join(' | ')
}

function gradeTextResponse(answer: string, requiredConcepts: ConceptGroup[]) {
  return gradeByConceptGroups(answer, requiredConcepts)
}

export function ExamModePanel({ onClose }: ExamModePanelProps) {
  const allUnitIds = useMemo(() => getDefaultExamUnitIds(), [])
  const availableUnitOptions = useMemo(
    () =>
      UNIT_OPTIONS.filter((unit) => allUnitIds.includes(unit.id)).map((unit) => ({
        id: unit.id,
        label: unit.label,
      })),
    [allUnitIds],
  )
  const [showConfig, setShowConfig] = useState(true)
  const [selectedUnits, setSelectedUnits] = useState<UnitId[]>(allUnitIds)
  const [timed, setTimed] = useState(true)
  const [durationMinutes, setDurationMinutes] = useState(20)
  const [targetQuestions, setTargetQuestions] = useState(15)
  const [activeExam, setActiveExam] = useState<ActiveExam | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [question, setQuestion] = useState<NetworkingQuestion | null>(null)
  const [mcqAnswer, setMcqAnswer] = useState<number | null>(null)
  const [textAnswer, setTextAnswer] = useState('')
  const [matchAnswer, setMatchAnswer] = useState<Record<string, string>>({})
  const [matchOptionsOrder, setMatchOptionsOrder] = useState<string[]>([])
  const [checkedThisQuestion, setCheckedThisQuestion] = useState(false)
  const [attempts, setAttempts] = useState<ExamAttempt[]>([])
  const seenQuestionIdsRef = useRef<Set<string>>(new Set())
  const lastQuestionIdRef = useRef<string | null>(null)
  const transition = useQuestionTransition()
  const resetPulse = useResetPulse()

  useEffect(() => {
    if (!activeExam?.timed) return
    const id = window.setInterval(() => {
      setNowMs(Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [activeExam?.timed])

  const attemptedInExam = activeExam
    ? attempts.length
    : 0
  const correctInExam = activeExam
    ? attempts.filter((attempt) => attempt.status === 'correct').length
    : 0
  const gradedAttemptCount = attempts.filter(
    (attempt) => attempt.status === 'correct' || attempt.status === 'incorrect',
  ).length
  const accuracyInExam = calculateAccuracy(correctInExam, gradedAttemptCount)
  const remainingQuestions = activeExam
    ? Math.max(0, activeExam.targetQuestions - attemptedInExam)
    : 0
  const secondsRemaining = activeExam?.timed
    ? Math.max(0, Math.floor(((activeExam.endsAtMs ?? nowMs) - nowMs) / 1000))
    : null
  const isTimeUp = activeExam?.timed ? secondsRemaining === 0 : false
  const isQuestionTargetMet = activeExam ? attemptedInExam >= activeExam.targetQuestions : false
  const isExamComplete = Boolean(activeExam) && (isTimeUp || isQuestionTargetMet)

  useEffect(() => {
    if (!activeExam || isExamComplete) return
    if (question) return

    const nextQuestion = pickNextQuestion(activeExam.selectedUnitIds)
    if (nextQuestion) {
      setQuestion(nextQuestion)
    }
  }, [activeExam, isExamComplete, question])

  const resetAnswerInputs = () => {
    setMcqAnswer(null)
    setTextAnswer('')
    setMatchAnswer({})
    setCheckedThisQuestion(false)
  }

  const buildQuestionForDisplay = (rawQuestion: NetworkingQuestion): NetworkingQuestion => {
    if (rawQuestion.kind === 'mcq') {
      const shuffled = shuffleChoicesWithCorrectIndex(
        rawQuestion.options,
        rawQuestion.correctOption,
      )
      return {
        ...rawQuestion,
        options: shuffled.choices,
        correctOption: shuffled.correctIndex,
      }
    }
    return rawQuestion
  }

  const setMatchOrder = (nextQuestion: NetworkingQuestion) => {
    if (nextQuestion.kind !== 'match') {
      setMatchOptionsOrder([])
      return
    }
    const options = nextQuestion.pairs.map((pair) => pair.right)
    setMatchOptionsOrder(shuffledIndices(options.length).map((index) => options[index]))
  }

  const pickNextQuestion = (unitIds: UnitId[]): NetworkingQuestion | null => {
    let fallback: NetworkingQuestion | null = null
    for (let i = 0; i < 36; i += 1) {
      const candidate = generateExamModeQuestion(unitIds)
      if (!candidate) continue
      fallback = candidate
      const unseen = !seenQuestionIdsRef.current.has(candidate.id)
      const notSameAsLast = candidate.id !== lastQuestionIdRef.current
      if (unseen && notSameAsLast) {
        seenQuestionIdsRef.current.add(candidate.id)
        lastQuestionIdRef.current = candidate.id
        return buildQuestionForDisplay(candidate)
      }
    }

    if (!fallback) return null
    seenQuestionIdsRef.current.clear()
    if (fallback.id === lastQuestionIdRef.current) {
      for (let i = 0; i < 24; i += 1) {
        const retry = generateExamModeQuestion(unitIds)
        if (!retry) continue
        if (retry.id !== lastQuestionIdRef.current) {
          seenQuestionIdsRef.current.add(retry.id)
          lastQuestionIdRef.current = retry.id
          return buildQuestionForDisplay(retry)
        }
      }
    }
    seenQuestionIdsRef.current.add(fallback.id)
    lastQuestionIdRef.current = fallback.id
    return buildQuestionForDisplay(fallback)
  }

  const loadNextQuestion = () => {
    if (!activeExam || transition.isTransitioning || isExamComplete) return
    const nextQuestion = pickNextQuestion(activeExam.selectedUnitIds)
    if (!nextQuestion) return
    transition.runQuestionTransition(() => {
      setQuestion(nextQuestion)
      setMatchOrder(nextQuestion)
      resetAnswerInputs()
    })
  }

  const startExam = () => {
    if (selectedUnits.length === 0) return
    const startedAtMs = Date.now()
    setNowMs(startedAtMs)
    setActiveExam({
      id: String(startedAtMs),
      selectedUnitIds: selectedUnits,
      targetQuestions,
      timed,
      durationMinutes,
      startedAtMs,
      endsAtMs: timed ? startedAtMs + durationMinutes * 60_000 : null,
    })
    setAttempts([])
    setQuestion(null)
    setMatchOptionsOrder([])
    setCheckedThisQuestion(false)
    seenQuestionIdsRef.current.clear()
    lastQuestionIdRef.current = null
    setShowConfig(false)
  }

  const stopExam = () => {
    setActiveExam(null)
    setQuestion(null)
    setAttempts([])
    setMatchOptionsOrder([])
    setCheckedThisQuestion(false)
    seenQuestionIdsRef.current.clear()
    lastQuestionIdRef.current = null
    setShowConfig(true)
  }

  const clearAnswer = () => {
    if (!question) return
    resetAnswerInputs()
    resetPulse.triggerResetPulse()
  }

  const disabledCheck =
    !question ||
    checkedThisQuestion ||
    (question.kind === 'mcq' && mcqAnswer === null) ||
    (question.kind === 'text' && !textAnswer.trim()) ||
    (question.kind === 'match' &&
      question.pairs.some((pair) => !matchAnswer[pair.left]))

  const checkAnswer = () => {
    if (!question || checkedThisQuestion) return

    let status: 'correct' | 'partial' | 'incorrect' = 'incorrect'
    let missingConceptLabels: string[] = []
    let userAnswerDisplay = ''

    if (question.kind === 'mcq') {
      const chosen = mcqAnswer
      if (chosen !== null) {
        status = chosen === question.correctOption ? 'correct' : 'incorrect'
        userAnswerDisplay = `${String.fromCharCode(65 + chosen)}. ${question.options[chosen]}`
      }
    } else if (question.kind === 'text') {
      const grade = gradeTextResponse(textAnswer, question.requiredConcepts)
      status = grade.status
      missingConceptLabels = grade.missingConceptLabels
      userAnswerDisplay = textAnswer.trim() || '(empty)'
    } else {
      const matchedAll = question.pairs.every(
        (pair) => normalizeAnswer(matchAnswer[pair.left] ?? '') === normalizeAnswer(pair.right),
      )
      status = matchedAll ? 'correct' : 'incorrect'
      userAnswerDisplay = question.pairs
        .map((pair) => `${pair.left} -> ${matchAnswer[pair.left] || '(blank)'}`)
        .join(' | ')
    }

    setAttempts((prev) => [
      ...prev,
      {
        index: prev.length + 1,
        question,
        status,
        missingConceptLabels,
        userAnswerDisplay,
      },
    ])
    setCheckedThisQuestion(true)
  }

  const renderAnswerInput = () => {
    if (!question) return null
    if (question.kind === 'mcq') {
      return (
        <div className="field">
          <label>Choose one:</label>
          <div className="controls-row">
            {question.options.map((option, index) => (
              <button
                key={`${question.id}-${option}`}
                className={mcqAnswer === index ? 'button-primary' : 'button-secondary'}
                onClick={() => setMcqAnswer(index)}
                disabled={checkedThisQuestion}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
      )
    }

    if (question.kind === 'text') {
      return (
        <div className="field">
          <label htmlFor={`exam-answer-${question.id}`}>Your answer</label>
          <input
            id={`exam-answer-${question.id}`}
            value={textAnswer}
            onChange={(event) => setTextAnswer(event.target.value)}
            disabled={checkedThisQuestion}
          />
          <p className="small-note">Checking ignores case and punctuation differences.</p>
        </div>
      )
    }

    const rightOptions =
      matchOptionsOrder.length > 0
        ? matchOptionsOrder
        : question.pairs.map((pair) => pair.right)
    return (
      <div className="field">
        <label>Match each item:</label>
        <div className="table-scroll">
          <table className="compact-table">
            <thead>
              <tr>
                <th>Left Side</th>
                <th>Select Match</th>
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
                      disabled={checkedThisQuestion}
                    >
                      <option value="">Select...</option>
                      {rightOptions.map((option) => (
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
    )
  }

  return (
    <section className="exam-mode-panel">
      <div className="exam-mode-header">
        <h2 className="session-panel-title">Exam Mode</h2>
        <div className="exam-mode-actions">
          {onClose ? (
            <button className="button-secondary" onClick={onClose}>
              <FiX aria-hidden="true" />
              <span>Back to Units</span>
            </button>
          ) : null}
          <button
            className="button-secondary"
            onClick={() => setShowConfig((value) => !value)}
          >
            <FiTarget aria-hidden="true" />
            <span>{showConfig ? 'Hide Setup' : 'Setup Exam'}</span>
          </button>
          {activeExam ? (
            <button className="button-secondary" onClick={stopExam}>
              <FiX aria-hidden="true" />
              <span>End Exam</span>
            </button>
          ) : (
            <button
              className="button-primary"
              onClick={startExam}
              disabled={selectedUnits.length === 0}
            >
              <FiPlay aria-hidden="true" />
              <span>Start Exam</span>
            </button>
          )}
        </div>
      </div>

      {!activeExam && showConfig ? (
        <div className="exam-mode-config">
          <div className="exam-mode-row">
            <div className="toggle-switch-group">
              <button
                type="button"
                className={`toggle-switch ${timed ? 'toggle-switch--on' : ''}`}
                role="switch"
                aria-checked={timed}
                aria-label="Timed exam mode"
                onClick={() => setTimed((value) => !value)}
              >
                <span className="toggle-switch-knob" />
              </button>
              <span>Timed exam</span>
            </div>
            {timed ? (
              <label className="inline-control">
                <span>Time</span>
                <select
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(Number(event.target.value))}
                >
                  {[10, 15, 20, 30, 45, 60].map((minutes) => (
                    <option key={minutes} value={minutes}>
                      {minutes} min
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="inline-control">
              <span>Question target</span>
              <select
                value={targetQuestions}
                onChange={(event) => setTargetQuestions(Number(event.target.value))}
              >
                {[5, 10, 15, 20, 25, 30].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="exam-mode-row">
            <button
              className="button-secondary"
              onClick={() => setSelectedUnits(allUnitIds)}
            >
              Select all units
            </button>
            <button className="button-secondary" onClick={() => setSelectedUnits([])}>
              Clear units
            </button>
          </div>

          <div className="exam-mode-unit-grid">
            {availableUnitOptions.map((unit) => {
              const checked = selectedUnits.includes(unit.id)
              return (
                <label key={unit.id} className="exam-mode-unit-option">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      setSelectedUnits((prev) => {
                        if (event.target.checked) {
                          if (prev.includes(unit.id)) return prev
                          return [...prev, unit.id]
                        }
                        return prev.filter((value) => value !== unit.id)
                      })
                    }}
                  />
                  <span>{unit.label}</span>
                </label>
              )
            })}
          </div>
        </div>
      ) : null}

      {activeExam ? (
        <>
          <div className="exam-mode-status">
            <p>
              Attempted: <strong>{attemptedInExam}</strong> /{' '}
              <strong>{activeExam.targetQuestions}</strong>
            </p>
            <p>
              Remaining questions: <strong>{remainingQuestions}</strong>
            </p>
            {activeExam.timed ? (
              <p>
                <FiClock aria-hidden="true" /> Time left:{' '}
                <strong>{formatSeconds(secondsRemaining ?? 0)}</strong>
              </p>
            ) : (
              <p>Untimed exam mode is active.</p>
            )}
            {isExamComplete ? (
              <p>
                Score: <strong>{correctInExam}</strong> correct ({accuracyInExam}%)
              </p>
            ) : null}
          </div>

          {isExamComplete ? (
            <>
              <div className="question-box">
                <p>
                  Exam complete. {isTimeUp ? 'Time is up.' : 'Question target reached.'}
                </p>
                <p>
                  Final result: <strong>{correctInExam}</strong> correct out of{' '}
                  <strong>{attemptedInExam}</strong> attempted ({accuracyInExam}%).
                </p>
                <p className="small-note">
                  Review each question below, then start another exam when ready.
                </p>
              </div>

              {attempts.length > 0 ? (
                <div className="table-scroll">
                  <table className="compact-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Prompt</th>
                        <th>Your Answer</th>
                        <th>Expected</th>
                        <th>Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((attempt) => (
                        <tr key={`${attempt.question.id}-${attempt.index}`}>
                          <td>{attempt.index}</td>
                          <td>{attempt.question.prompt}</td>
                          <td>{attempt.userAnswerDisplay}</td>
                          <td>{renderAnswerDisplay(attempt.question)}</td>
                          <td>
                            {attempt.status === 'correct'
                              ? 'Correct'
                              : attempt.status === 'partial'
                                ? 'Partial'
                                : 'Incorrect'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </>
          ) : (
            <div>
              <h3 className="section-title">Exam Mode &gt; Mixed Units</h3>
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
                      {question.code ? <pre className="inline-code-block">{question.code}</pre> : null}
                    </div>

                    <div
                      className={`answer-input-region ${
                        resetPulse.isResetActive ? 'answer-input-region--reset' : ''
                      }`}
                    >
                      {renderAnswerInput()}
                    </div>

                    <div style={{ marginTop: '0.65rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        className="button-primary"
                        onClick={checkedThisQuestion ? loadNextQuestion : checkAnswer}
                        disabled={checkedThisQuestion ? transition.isTransitioning : disabledCheck}
                      >
                        {checkedThisQuestion ? 'Next Question' : 'Check Answer'}
                      </button>
                      <button
                        className="button-secondary"
                        onClick={clearAnswer}
                        disabled={checkedThisQuestion}
                      >
                        Clear Answer
                      </button>
                    </div>

                    {checkedThisQuestion ? (
                      <p className="small-note" style={{ marginTop: '0.6rem' }}>
                        Answer recorded. Move to the next question.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="small-note">Loading exam question...</p>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="small-note">
          Start Exam Mode to drill mixed questions across selected units with optional timer and target count.
        </p>
      )}
    </section>
  )
}

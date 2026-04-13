import { useEffect, useMemo, useRef, useState } from 'react'
import { FiClock, FiPlay, FiTarget, FiX, FiArrowLeft } from 'react-icons/fi'
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
import { useConfirmDialog } from './ConfirmDialogContext'

type ActiveExam = {
  id: string
  selectedUnitIds: UnitId[]
  targetQuestions: number
  timed: boolean
  durationMinutes: number
  startedAtMs: number
  endsAtMs: number | null
}

type ExamQuestionEntry = {
  question: NetworkingQuestion
  matchOptionsOrder: string[]
  mcqAnswer: number | null
  textAnswer: string
  matchAnswer: Record<string, string>
  submitted: boolean
  status: 'correct' | 'partial' | 'incorrect' | null
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

function createExamEntry(rawQuestion: NetworkingQuestion): ExamQuestionEntry {
  let question = rawQuestion
  if (rawQuestion.kind === 'mcq') {
    const shuffled = shuffleChoicesWithCorrectIndex(
      rawQuestion.options,
      rawQuestion.correctOption,
    )
    question = {
      ...rawQuestion,
      options: shuffled.choices,
      correctOption: shuffled.correctIndex,
    }
  }

  const matchOptionsOrder =
    question.kind === 'match'
      ? shuffledIndices(question.pairs.length).map((index) => question.pairs[index].right)
      : []

  return {
    question,
    matchOptionsOrder,
    mcqAnswer: null,
    textAnswer: '',
    matchAnswer: {},
    submitted: false,
    status: null,
    missingConceptLabels: [],
    userAnswerDisplay: '',
  }
}

export function ExamModePanel({ onClose }: ExamModePanelProps) {
  const { requestConfirm } = useConfirmDialog()
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
  const [entries, setEntries] = useState<ExamQuestionEntry[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
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

  const currentEntry = entries[currentIndex] ?? null
  const attemptedInExam = activeExam ? entries.filter((entry) => entry.submitted).length : 0
  const correctInExam = activeExam
    ? entries.filter((entry) => entry.submitted && entry.status === 'correct').length
    : 0
  const gradedAttemptCount = entries.filter(
    (entry) => entry.submitted && (entry.status === 'correct' || entry.status === 'incorrect'),
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
        return candidate
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
          return retry
        }
      }
    }

    seenQuestionIdsRef.current.add(fallback.id)
    lastQuestionIdRef.current = fallback.id
    return fallback
  }

  const startExam = () => {
    if (selectedUnits.length === 0) return
    const startedAtMs = Date.now()
    const firstQuestion = pickNextQuestion(selectedUnits)
    if (!firstQuestion) return

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
    setEntries([createExamEntry(firstQuestion)])
    setCurrentIndex(0)
    setShowConfig(false)
  }

  const stopExam = () => {
    setActiveExam(null)
    setEntries([])
    setCurrentIndex(0)
    seenQuestionIdsRef.current.clear()
    lastQuestionIdRef.current = null
    setShowConfig(true)
  }

  const confirmStopExam = async () => {
    if (!activeExam) return
    const confirmed = await requestConfirm({
      title: 'End Current Exam?',
      message: 'Your active exam will end now. Do you want to continue?',
      confirmLabel: 'End Exam',
      cancelLabel: 'Keep Exam',
    })
    if (!confirmed) return
    stopExam()
  }

  const updateCurrentEntry = (
    updater: (entry: ExamQuestionEntry) => ExamQuestionEntry,
  ) => {
    setEntries((prev) => {
      if (!prev[currentIndex]) return prev
      const next = [...prev]
      next[currentIndex] = updater(prev[currentIndex])
      return next
    })
  }

  const clearAnswer = () => {
    if (!currentEntry) return
    updateCurrentEntry((entry) => ({
      ...entry,
      mcqAnswer: null,
      textAnswer: '',
      matchAnswer: {},
      submitted: false,
      status: null,
      missingConceptLabels: [],
      userAnswerDisplay: '',
    }))
    resetPulse.triggerResetPulse()
  }

  const disabledSubmit =
    !currentEntry ||
    (currentEntry.question.kind === 'mcq' && currentEntry.mcqAnswer === null) ||
    (currentEntry.question.kind === 'text' && !currentEntry.textAnswer.trim()) ||
    (currentEntry.question.kind === 'match' &&
      currentEntry.question.pairs.some((pair) => !currentEntry.matchAnswer[pair.left]))

  const submitAndAdvance = () => {
    if (!activeExam || !currentEntry || disabledSubmit || isExamComplete) return

    let status: 'correct' | 'partial' | 'incorrect' = 'incorrect'
    let missingConceptLabels: string[] = []
    let userAnswerDisplay = ''

    if (currentEntry.question.kind === 'mcq') {
      const chosen = currentEntry.mcqAnswer
      if (chosen !== null) {
        status = chosen === currentEntry.question.correctOption ? 'correct' : 'incorrect'
        userAnswerDisplay = `${String.fromCharCode(65 + chosen)}. ${
          currentEntry.question.options[chosen]
        }`
      }
    } else if (currentEntry.question.kind === 'text') {
      const grade = gradeTextResponse(
        currentEntry.textAnswer,
        currentEntry.question.requiredConcepts,
      )
      status = grade.status
      missingConceptLabels = grade.missingConceptLabels
      userAnswerDisplay = currentEntry.textAnswer.trim() || '(empty)'
    } else {
      const matchedAll = currentEntry.question.pairs.every(
        (pair) =>
          normalizeAnswer(currentEntry.matchAnswer[pair.left] ?? '') ===
          normalizeAnswer(pair.right),
      )
      status = matchedAll ? 'correct' : 'incorrect'
      userAnswerDisplay = currentEntry.question.pairs
        .map((pair) => `${pair.left} -> ${currentEntry.matchAnswer[pair.left] || '(blank)'}`)
        .join(' | ')
    }

    const nextEntries = [...entries]
    nextEntries[currentIndex] = {
      ...currentEntry,
      submitted: true,
      status,
      missingConceptLabels,
      userAnswerDisplay,
    }

    const nextAttempted = nextEntries.filter((entry) => entry.submitted).length
    if (nextAttempted >= activeExam.targetQuestions) {
      setEntries(nextEntries)
      return
    }

    if (currentIndex < nextEntries.length - 1) {
      setEntries(nextEntries)
      transition.runQuestionTransition(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, nextEntries.length - 1))
      })
      return
    }

    const nextQuestion = pickNextQuestion(activeExam.selectedUnitIds)
    if (!nextQuestion) {
      setEntries(nextEntries)
      return
    }
    const appendedEntries = [...nextEntries, createExamEntry(nextQuestion)]
    setEntries(appendedEntries)
    transition.runQuestionTransition(() => {
      setCurrentIndex(appendedEntries.length - 1)
    })
  }

  const goBack = () => {
    if (currentIndex <= 0 || transition.isTransitioning) return
    transition.runQuestionTransition(() => {
      setCurrentIndex((prev) => Math.max(0, prev - 1))
    })
  }

  const renderAnswerInput = () => {
    if (!currentEntry) return null
    const { question } = currentEntry
    if (question.kind === 'mcq') {
      return (
        <div className="field">
          <label>Choose one:</label>
          <div className="controls-row">
            {question.options.map((option, index) => (
              <button
                key={`${question.id}-${option}`}
                className={
                  currentEntry.mcqAnswer === index ? 'button-primary' : 'button-secondary'
                }
                onClick={() => updateCurrentEntry((entry) => ({ ...entry, mcqAnswer: index }))}
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
            value={currentEntry.textAnswer}
            onChange={(event) =>
              updateCurrentEntry((entry) => ({ ...entry, textAnswer: event.target.value }))
            }
          />
          <p className="small-note">Checking ignores case and punctuation differences.</p>
        </div>
      )
    }

    const rightOptions =
      currentEntry.matchOptionsOrder.length > 0
        ? currentEntry.matchOptionsOrder
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
                      value={currentEntry.matchAnswer[pair.left] ?? ''}
                      onChange={(event) =>
                        updateCurrentEntry((entry) => ({
                          ...entry,
                          matchAnswer: {
                            ...entry.matchAnswer,
                            [pair.left]: event.target.value,
                          },
                        }))
                      }
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
          {activeExam ? (
            <button className="button-secondary" onClick={confirmStopExam}>
              <FiX aria-hidden="true" />
              <span>End Exam</span>
            </button>
          ) : (
            <>
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
              <button
                className="button-primary"
                onClick={startExam}
                disabled={selectedUnits.length === 0}
              >
                <FiPlay aria-hidden="true" />
                <span>Start Exam</span>
              </button>
            </>
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
            <button className="button-secondary" onClick={() => setSelectedUnits(allUnitIds)}>
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
              Attempted: <strong>{attemptedInExam}</strong> / <strong>{activeExam.targetQuestions}</strong>
            </p>
            <p>
              Correct:{' '}
              <strong>
                {isExamComplete ? `${correctInExam} (${accuracyInExam}%)` : 'Hidden until review'}
              </strong>
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
          </div>

          {isExamComplete ? (
            <>
              <div className="question-box">
                <p>Exam complete. {isTimeUp ? 'Time is up.' : 'Question target reached.'}</p>
                <p>
                  Final result: <strong>{correctInExam}</strong> correct out of{' '}
                  <strong>{attemptedInExam}</strong> attempted ({accuracyInExam}%).
                </p>
                <p className="small-note">Review each question below, then start another exam when ready.</p>
              </div>

              {entries.length > 0 ? (
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
                      {entries
                        .filter((entry) => entry.submitted)
                        .map((entry, index) => (
                          <tr key={`${entry.question.id}-${index}`}>
                            <td>{index + 1}</td>
                            <td>{entry.question.prompt}</td>
                            <td>{entry.userAnswerDisplay}</td>
                            <td>{renderAnswerDisplay(entry.question)}</td>
                            <td>
                              {entry.status === 'correct'
                                ? 'Correct'
                                : entry.status === 'partial'
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
            <div className="exam-question-area">
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
                {currentEntry ? (
                  <>
                    <div className="question-box">
                      <p>{currentEntry.question.prompt}</p>
                      {currentEntry.question.code ? (
                        <pre className="inline-code-block">{currentEntry.question.code}</pre>
                      ) : null}
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
                        className="button-secondary exam-nav-button"
                        onClick={goBack}
                        disabled={currentIndex === 0 || transition.isTransitioning}
                      >
                        <FiArrowLeft aria-hidden="true" />
                        <span>Back</span>
                      </button>
                      <button
                        className="button-primary"
                        onClick={submitAndAdvance}
                        disabled={disabledSubmit || transition.isTransitioning}
                      >
                        Submit Answer
                      </button>
                      <button className="button-secondary" onClick={clearAnswer}>
                        Clear Answer
                      </button>
                    </div>
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

import { useEffect, useMemo, useState } from 'react'
import { FiClock, FiPlay, FiTarget, FiX } from 'react-icons/fi'
import type { UnitId } from '../lib/study'
import { UNIT_OPTIONS } from '../lib/study'
import {
  generateExamModeQuestion,
  getDefaultExamUnitIds,
} from '../lib/examModeQuestions'
import { NetworkingDrillPractice } from '../features/networkingShared/networkingDrills'
import { calculateAccuracy, useSessionContext } from './SessionContext'

type ActiveExam = {
  id: string
  selectedUnitIds: UnitId[]
  targetQuestions: number
  timed: boolean
  durationMinutes: number
  startedAtMs: number
  endsAtMs: number | null
  baseAttempted: number
  baseCorrect: number
}

function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function ExamModePanel() {
  const { state } = useSessionContext()
  const allUnitIds = useMemo(() => getDefaultExamUnitIds(), [])
  const availableUnitOptions = useMemo(
    () =>
      UNIT_OPTIONS.filter((unit) => allUnitIds.includes(unit.id)).map((unit) => ({
        id: unit.id,
        label: unit.label,
      })),
    [allUnitIds],
  )
  const [isExpanded, setIsExpanded] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [selectedUnits, setSelectedUnits] = useState<UnitId[]>(allUnitIds)
  const [timed, setTimed] = useState(true)
  const [durationMinutes, setDurationMinutes] = useState(20)
  const [targetQuestions, setTargetQuestions] = useState(15)
  const [activeExam, setActiveExam] = useState<ActiveExam | null>(null)
  const [nowMs, setNowMs] = useState(() => Date.now())

  useEffect(() => {
    if (!activeExam?.timed) return
    const id = window.setInterval(() => {
      setNowMs(Date.now())
    }, 1000)
    return () => window.clearInterval(id)
  }, [activeExam?.timed])

  useEffect(() => {
    if (activeExam) {
      setIsExpanded(true)
    }
  }, [activeExam])

  const attemptedInExam = activeExam
    ? Math.max(0, state.totalQuestionsAttempted - activeExam.baseAttempted)
    : 0
  const correctInExam = activeExam
    ? Math.max(0, state.totalCorrect - activeExam.baseCorrect)
    : 0
  const accuracyInExam = calculateAccuracy(correctInExam, attemptedInExam)
  const remainingQuestions = activeExam
    ? Math.max(0, activeExam.targetQuestions - attemptedInExam)
    : 0
  const secondsRemaining = activeExam?.timed
    ? Math.max(0, Math.floor(((activeExam.endsAtMs ?? nowMs) - nowMs) / 1000))
    : null
  const isTimeUp = activeExam?.timed ? secondsRemaining === 0 : false
  const isQuestionTargetMet = activeExam ? attemptedInExam >= activeExam.targetQuestions : false
  const isExamComplete = Boolean(activeExam) && (isTimeUp || isQuestionTargetMet)

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
      baseAttempted: state.totalQuestionsAttempted,
      baseCorrect: state.totalCorrect,
    })
  }

  const stopExam = () => {
    setActiveExam(null)
  }

  const shouldShowBody = isExpanded || Boolean(activeExam)

  return (
    <section
      className={`exam-mode-panel ${
        shouldShowBody ? 'exam-mode-panel--expanded' : 'exam-mode-panel--collapsed'
      }`}
    >
      <div className="exam-mode-header">
        <h2 className="session-panel-title">Exam Mode</h2>
        <div className="exam-mode-actions">
          {!activeExam ? (
            <button
              className="button-secondary"
              onClick={() => {
                setIsExpanded((value) => !value)
                if (isExpanded) {
                  setShowConfig(false)
                }
              }}
            >
              <FiTarget aria-hidden="true" />
              <span>{shouldShowBody ? 'Hide Exam Mode' : 'Open Exam Mode'}</span>
            </button>
          ) : null}
          <button
            className="button-secondary"
            disabled={!shouldShowBody}
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

      {!shouldShowBody ? (
        <p className="small-note">
          Hidden until needed. Open Exam Mode when you want a timed or targeted mixed-unit run.
        </p>
      ) : null}

      {shouldShowBody && showConfig ? (
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

      {shouldShowBody && activeExam ? (
        <>
          <div className="exam-mode-status">
            <p>
              Attempted: <strong>{attemptedInExam}</strong> /{' '}
              <strong>{activeExam.targetQuestions}</strong> &nbsp; Correct:{' '}
              <strong>{correctInExam}</strong> ({accuracyInExam}%)
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
            <div className="question-box">
              <p>
                Exam complete. {isTimeUp ? 'Time is up.' : 'Question target reached.'}
              </p>
              <p>
                Final result: <strong>{correctInExam}</strong> correct out of{' '}
                <strong>{attemptedInExam}</strong> attempted ({accuracyInExam}%).
              </p>
              <p className="small-note">
                You can start another exam with different units, time, or question target.
              </p>
            </div>
          ) : (
            <NetworkingDrillPractice
              key={`exam-mode-${activeExam.id}`}
              title="Exam Mode > Mixed Units"
              generateQuestion={() =>
                generateExamModeQuestion(activeExam.selectedUnitIds) ??
                {
                  id: 'exam-mode-empty',
                  kind: 'mcq',
                  prompt: 'No questions available for selected units.',
                  options: ['OK'],
                  correctOption: 0,
                  explanationSteps: [
                    'Select at least one implemented unit with available question generators.',
                  ],
                  conceptSummary: 'Exam mode requires units with question generators.',
                }
              }
            />
          )}
        </>
      ) : shouldShowBody ? (
        <p className="small-note">
          Start Exam Mode to drill mixed questions across selected units with optional timer and target count.
        </p>
      ) : null}
    </section>
  )
}

import { useMemo, useState } from 'react'
import { FiBarChart2, FiNavigation, FiRotateCcw, FiTarget } from 'react-icons/fi'
import { IoFlame } from 'react-icons/io5'
import { calculateAccuracy, useSessionContext } from './SessionContext'
import { UNIT_NAVIGATE_EVENT } from '../lib/navigation'
import type { UnitId } from '../lib/study'

type RankedEntry = {
  label: string
  attempted: number
  correct: number
  accuracy: number
}

type RankedSubtopicEntry = RankedEntry & {
  unitLabel: string
  subtopicLabel: string
}

const UNIT_LABEL_TO_ID: Record<string, UnitId> = {
  'Tour of Computer Systems': 'tour-computer-systems',
  'sleep()': 'sleep',
  'fork() and exec()': 'fork-exec',
  'wait() and errno': 'wait-errno',
  Signals: 'signals',
  Scheduling: 'scheduling',
  'Memory Management': 'memory-management',
  'Virtual Memory': 'virtual-memory',
  Threads: 'threads',
  'Synchronization: Mutex': 'sync-mutex',
  'Synchronization: Patterns': 'sync-patterns',
  'File I/O: Calls': 'file-io',
  'File I/O: File Systems': 'filesystems',
  'Networking: Sockets': 'networking-sockets',
  'Networking: AF_INET': 'networking-af-inet',
  'Networking: Multiple Clients': 'networking-multiple-clients',
  'IPC: Pipes': 'ipc-pipes',
  'IPC: Shared Memory': 'ipc-shared-memory',
  'Cryptography: Algorithms': 'crypto-algorithms',
  'Cryptography: Applications': 'crypto-applications',
}

type SessionProgressPanelProps = {
  onOpenExamMode?: () => void
}

export function SessionProgressPanel({ onOpenExamMode }: SessionProgressPanelProps) {
  const { state, resetSession } = useSessionContext()
  const [showReview, setShowReview] = useState(false)

  const overallAccuracy = calculateAccuracy(state.totalCorrect, state.totalQuestionsAttempted)
  const isFreshSession = state.totalQuestionsAttempted === 0

  const rankedUnits = useMemo(() => {
    const entries: RankedEntry[] = Object.entries(state.byUnit).map(([label, bucket]) => ({
      label,
      attempted: bucket.attempted,
      correct: bucket.correct,
      accuracy: calculateAccuracy(bucket.correct, bucket.attempted),
    }))
    return entries.sort((a, b) => b.accuracy - a.accuracy)
  }, [state.byUnit])

  const strongUnits = rankedUnits.filter((entry) => entry.attempted > 0).slice(0, 3)
  const strongLabels = new Set(strongUnits.map((entry) => entry.label))
  const weakUnits = [...rankedUnits]
    .filter((entry) => entry.attempted > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .filter((entry) => !strongLabels.has(entry.label))
    .slice(0, 3)

  const rankedSubtopics = useMemo<RankedSubtopicEntry[]>(() => {
    return Object.values(state.bySubtopic)
      .map((bucket) => ({
        unitLabel: bucket.unitLabel,
        subtopicLabel: bucket.subtopicLabel,
        label: `${bucket.unitLabel} > ${bucket.subtopicLabel}`,
        attempted: bucket.attempted,
        correct: bucket.correct,
        accuracy: calculateAccuracy(bucket.correct, bucket.attempted),
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
  }, [state.bySubtopic])

  const weakestSubtopics = useMemo(() => {
    return Object.values(state.bySubtopic)
      .filter((bucket) => bucket.attempted > 0)
      .map((bucket) => ({
        unitLabel: bucket.unitLabel,
        subtopicLabel: bucket.subtopicLabel,
        attempted: bucket.attempted,
        accuracy: calculateAccuracy(bucket.correct, bucket.attempted),
      }))
      .sort((a, b) => {
        if (a.accuracy !== b.accuracy) return a.accuracy - b.accuracy
        return b.attempted - a.attempted
      })
      .slice(0, 2)
  }, [state.bySubtopic])

  const drillWeakestSubtopics = () => {
    const first = weakestSubtopics[0]
    if (!first || typeof window === 'undefined') return
    const unitId = UNIT_LABEL_TO_ID[first.unitLabel]
    if (!unitId) return
    window.localStorage.setItem(
      `cmpt201.nav.subtopic.${first.unitLabel}`,
      first.subtopicLabel,
    )
    window.dispatchEvent(
      new CustomEvent(UNIT_NAVIGATE_EVENT, {
        detail: { unitId },
      }),
    )
    setShowReview(false)
  }

  return (
    <section className="session-panel">
      <div className="session-panel-top">
        <div>
          <h2 className="session-panel-title">Session Progress</h2>
          <p className="session-panel-stats">
            <strong>
              {state.totalCorrect} / {state.totalQuestionsAttempted}
            </strong>{' '}
            correct ({overallAccuracy}%)
          </p>
          <p className="session-panel-streak">
            <span className="session-streak-icon" aria-hidden="true">
              <IoFlame />
            </span>{' '}
            Streak: <strong>{state.currentStreak}</strong> &nbsp; Best:{' '}
            <strong>{state.bestStreak}</strong>
          </p>
        </div>
        <div className="session-panel-actions">
          <button
            className="button-secondary"
            onClick={() => setShowReview((value) => !value)}
          >
            <FiBarChart2 aria-hidden="true" />
            <span>{showReview ? 'Hide Review' : 'Review Session'}</span>
          </button>
          <button className="button-secondary" onClick={resetSession}>
            <FiRotateCcw aria-hidden="true" />
            <span>Reset Session</span>
          </button>
          {onOpenExamMode ? (
            <button className="button-secondary" onClick={onOpenExamMode}>
              <FiTarget aria-hidden="true" />
              <span>Setup Exam</span>
            </button>
          ) : null}
          <button
            className="button-secondary"
            onClick={drillWeakestSubtopics}
            disabled={weakestSubtopics.length === 0}
          >
            <FiNavigation aria-hidden="true" />
            <span>Drill weakest 2 subtopics now</span>
          </button>
        </div>
      </div>
      {weakestSubtopics.length > 0 ? (
        <p className="small-note">
          Weak targets: {weakestSubtopics.map((entry) => `${entry.unitLabel} > ${entry.subtopicLabel}`).join('  |  ')}
        </p>
      ) : null}

      {showReview ? (
        <div className="session-review-grid">
          <div className="session-review-card">
            <h3>Overall</h3>
            <p>Total attempted: {state.totalQuestionsAttempted}</p>
            <p>Total correct: {state.totalCorrect}</p>
            <p>Total incorrect: {state.totalIncorrect}</p>
            <p>Accuracy: {overallAccuracy}%</p>
            <p>Best streak: {state.bestStreak}</p>
          </div>
          <div className="session-review-card">
            <h3>Strong Units</h3>
            {strongUnits.length === 0 ? (
              <p>{isFreshSession ? 'No attempts yet.' : 'None yet.'}</p>
            ) : (
              <ul>
                {strongUnits.map((entry) => (
                  <li key={entry.label}>
                    {entry.label} ({entry.accuracy}%)
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="session-review-card">
            <h3>Weak Units</h3>
            {weakUnits.length === 0 ? (
              <p>{isFreshSession ? 'No attempts yet.' : 'None yet.'}</p>
            ) : (
              <ul>
                {weakUnits.map((entry) => (
                  <li key={entry.label}>
                    {entry.label} ({entry.accuracy}%)
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="session-review-card session-review-card-wide">
            <h3>Subtopic Breakdown</h3>
            {rankedSubtopics.length === 0 ? (
              <p>No attempts yet.</p>
            ) : (
              <div className="table-scroll">
                <table className="compact-table">
                  <thead>
                    <tr>
                      <th>Subtopic</th>
                      <th>Correct</th>
                      <th>Attempted</th>
                      <th>Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedSubtopics.map((entry) => (
                      <tr key={entry.label}>
                        <td>{entry.label}</td>
                        <td>{entry.correct}</td>
                        <td>{entry.attempted}</td>
                        <td>{entry.accuracy}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  )
}

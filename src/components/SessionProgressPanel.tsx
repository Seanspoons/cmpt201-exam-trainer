import { useMemo, useState } from 'react'
import { FiBarChart2, FiRotateCcw } from 'react-icons/fi'
import { calculateAccuracy, useSessionContext } from './SessionContext'

type RankedEntry = {
  label: string
  attempted: number
  correct: number
  accuracy: number
}

export function SessionProgressPanel() {
  const { state, resetSession } = useSessionContext()
  const [showReview, setShowReview] = useState(false)

  const overallAccuracy = calculateAccuracy(state.totalCorrect, state.totalQuestionsAttempted)

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
  const weakUnits = [...rankedUnits]
    .filter((entry) => entry.attempted > 0)
    .reverse()
    .slice(0, 3)

  const rankedSubtopics = useMemo(() => {
    return Object.values(state.bySubtopic)
      .map((bucket) => ({
        label: `${bucket.unitLabel} > ${bucket.subtopicLabel}`,
        attempted: bucket.attempted,
        correct: bucket.correct,
        accuracy: calculateAccuracy(bucket.correct, bucket.attempted),
      }))
      .sort((a, b) => b.accuracy - a.accuracy)
  }, [state.bySubtopic])

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
            🔥 Streak: <strong>{state.currentStreak}</strong> &nbsp; Best:{' '}
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
        </div>
      </div>

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
              <p>No attempts yet.</p>
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
              <p>No attempts yet.</p>
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


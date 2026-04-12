import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type ScoreBucket = {
  attempted: number
  correct: number
}

type SubtopicBucket = ScoreBucket & {
  unitLabel: string
  subtopicLabel: string
}

type SessionState = {
  totalQuestionsAttempted: number
  totalCorrect: number
  totalIncorrect: number
  currentStreak: number
  bestStreak: number
  byUnit: Record<string, ScoreBucket>
  bySubtopic: Record<string, SubtopicBucket>
}

type SessionContextValue = {
  state: SessionState
  recordAttempt: (params: {
    unitLabel: string
    subtopicLabel: string
    isCorrect: boolean
  }) => void
  resetSession: () => void
}

const initialState: SessionState = {
  totalQuestionsAttempted: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  currentStreak: 0,
  bestStreak: 0,
  byUnit: {},
  bySubtopic: {},
}

const SessionContext = createContext<SessionContextValue>({
  state: initialState,
  recordAttempt: () => undefined,
  resetSession: () => undefined,
})

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState)

  const recordAttempt: SessionContextValue['recordAttempt'] = ({
    unitLabel,
    subtopicLabel,
    isCorrect,
  }) => {
    setState((prev) => {
      const nextAttempted = prev.totalQuestionsAttempted + 1
      const nextCorrect = prev.totalCorrect + (isCorrect ? 1 : 0)
      const nextIncorrect = prev.totalIncorrect + (isCorrect ? 0 : 1)
      const nextCurrentStreak = isCorrect ? prev.currentStreak + 1 : 0
      const nextBestStreak = Math.max(prev.bestStreak, nextCurrentStreak)

      const nextByUnit = { ...prev.byUnit }
      const unitBucket = nextByUnit[unitLabel] ?? { attempted: 0, correct: 0 }
      nextByUnit[unitLabel] = {
        attempted: unitBucket.attempted + 1,
        correct: unitBucket.correct + (isCorrect ? 1 : 0),
      }

      const subtopicKey = `${unitLabel}::${subtopicLabel}`
      const nextBySubtopic = { ...prev.bySubtopic }
      const subtopicBucket = nextBySubtopic[subtopicKey] ?? {
        unitLabel,
        subtopicLabel,
        attempted: 0,
        correct: 0,
      }
      nextBySubtopic[subtopicKey] = {
        unitLabel,
        subtopicLabel,
        attempted: subtopicBucket.attempted + 1,
        correct: subtopicBucket.correct + (isCorrect ? 1 : 0),
      }

      return {
        totalQuestionsAttempted: nextAttempted,
        totalCorrect: nextCorrect,
        totalIncorrect: nextIncorrect,
        currentStreak: nextCurrentStreak,
        bestStreak: nextBestStreak,
        byUnit: nextByUnit,
        bySubtopic: nextBySubtopic,
      }
    })
  }

  const value = useMemo(
    () => ({
      state,
      recordAttempt,
      resetSession: () => setState(initialState),
    }),
    [state],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSessionContext() {
  return useContext(SessionContext)
}

export function calculateAccuracy(correct: number, attempted: number): number {
  if (attempted === 0) return 0
  return Math.round((correct / attempted) * 100)
}


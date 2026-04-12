import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type ScoreBucket = {
  attempted: number
  correct: number
}

type SubtopicBucket = ScoreBucket & {
  unitLabel: string
  subtopicLabel: string
}

type AttemptRecord = {
  id: number
  unitLabel: string
  subtopicLabel: string
  isCorrect: boolean
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
  }) => number
  overrideAttemptResult: (attemptId: number, isCorrect: boolean) => void
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
  recordAttempt: () => -1,
  overrideAttemptResult: () => undefined,
  resetSession: () => undefined,
})

const SESSION_STORAGE_KEY = 'cmpt201.session.attempts.v1'

function loadAttemptsFromStorage(): AttemptRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as AttemptRecord[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item) => {
      return (
        typeof item?.id === 'number' &&
        typeof item?.unitLabel === 'string' &&
        typeof item?.subtopicLabel === 'string' &&
        typeof item?.isCorrect === 'boolean'
      )
    })
  } catch {
    return []
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [attempts, setAttempts] = useState<AttemptRecord[]>(() => loadAttemptsFromStorage())
  const nextAttemptId = useRef(
    attempts.reduce((max, attempt) => Math.max(max, attempt.id), 0) + 1,
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(attempts))
  }, [attempts])

  const recordAttempt: SessionContextValue['recordAttempt'] = ({
    unitLabel,
    subtopicLabel,
    isCorrect,
  }) => {
    const id = nextAttemptId.current
    nextAttemptId.current += 1
    setAttempts((prev) => [...prev, { id, unitLabel, subtopicLabel, isCorrect }])
    return id
  }

  const overrideAttemptResult: SessionContextValue['overrideAttemptResult'] = (
    attemptId,
    isCorrect,
  ) => {
    setAttempts((prev) =>
      prev.map((attempt) =>
        attempt.id === attemptId ? { ...attempt, isCorrect } : attempt,
      ),
    )
  }

  const state = useMemo<SessionState>(() => {
    let totalCorrect = 0
    let totalIncorrect = 0
    let currentStreak = 0
    let bestStreak = 0
    const byUnit: Record<string, ScoreBucket> = {}
    const bySubtopic: Record<string, SubtopicBucket> = {}

    attempts.forEach((attempt) => {
      if (attempt.isCorrect) {
        totalCorrect += 1
        currentStreak += 1
      } else {
        totalIncorrect += 1
        currentStreak = 0
      }
      bestStreak = Math.max(bestStreak, currentStreak)

      const unitBucket = byUnit[attempt.unitLabel] ?? { attempted: 0, correct: 0 }
      byUnit[attempt.unitLabel] = {
        attempted: unitBucket.attempted + 1,
        correct: unitBucket.correct + (attempt.isCorrect ? 1 : 0),
      }

      const subtopicKey = `${attempt.unitLabel}::${attempt.subtopicLabel}`
      const subtopicBucket = bySubtopic[subtopicKey] ?? {
        unitLabel: attempt.unitLabel,
        subtopicLabel: attempt.subtopicLabel,
        attempted: 0,
        correct: 0,
      }
      bySubtopic[subtopicKey] = {
        unitLabel: attempt.unitLabel,
        subtopicLabel: attempt.subtopicLabel,
        attempted: subtopicBucket.attempted + 1,
        correct: subtopicBucket.correct + (attempt.isCorrect ? 1 : 0),
      }
    })

    return {
      totalQuestionsAttempted: attempts.length,
      totalCorrect,
      totalIncorrect,
      currentStreak,
      bestStreak,
      byUnit,
      bySubtopic,
    }
  }, [attempts])

  const value = useMemo(
    () => ({
      state,
      recordAttempt,
      overrideAttemptResult,
      resetSession: () => {
        setAttempts([])
        nextAttemptId.current = 1
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(SESSION_STORAGE_KEY)
        }
      },
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

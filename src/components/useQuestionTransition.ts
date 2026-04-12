import { useEffect, useRef, useState } from 'react'

const TRANSITION_OUT_MS = 140
const TRANSITION_IN_MS = 160

export type QuestionTransitionPhase = 'idle' | 'out' | 'in'

export function useQuestionTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [phase, setPhase] = useState<QuestionTransitionPhase>('idle')
  const outTimerRef = useRef<number | null>(null)
  const inTimerRef = useRef<number | null>(null)

  const clearTimers = () => {
    if (outTimerRef.current !== null) {
      window.clearTimeout(outTimerRef.current)
      outTimerRef.current = null
    }
    if (inTimerRef.current !== null) {
      window.clearTimeout(inTimerRef.current)
      inTimerRef.current = null
    }
  }

  useEffect(() => clearTimers, [])

  const runQuestionTransition = (swapQuestion: () => void) => {
    if (isTransitioning) return
    clearTimers()
    setIsTransitioning(true)
    setPhase('out')

    outTimerRef.current = window.setTimeout(() => {
      swapQuestion()
      setPhase('in')
      inTimerRef.current = window.setTimeout(() => {
        setPhase('idle')
        setIsTransitioning(false)
      }, TRANSITION_IN_MS)
    }, TRANSITION_OUT_MS)
  }

  return {
    isTransitioning,
    phase,
    runQuestionTransition,
  }
}

import { useEffect, useRef, useState } from 'react'

const RESET_PULSE_MS = 130

export function useResetPulse() {
  const [isResetActive, setIsResetActive] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => clearTimer, [])

  const triggerResetPulse = () => {
    clearTimer()
    setIsResetActive(true)
    timerRef.current = window.setTimeout(() => {
      setIsResetActive(false)
    }, RESET_PULSE_MS)
  }

  return { isResetActive, triggerResetPulse }
}

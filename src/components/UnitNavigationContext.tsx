import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type UnitNavigationContextValue = {
  hasNextSubtopic: boolean
  goToNextSubtopic: () => void
}

const UnitNavigationContext = createContext<UnitNavigationContextValue>({
  hasNextSubtopic: false,
  goToNextSubtopic: () => undefined,
})

export function UnitNavigationProvider({
  value,
  children,
}: {
  value: UnitNavigationContextValue
  children: ReactNode
}) {
  return (
    <UnitNavigationContext.Provider value={value}>
      {children}
    </UnitNavigationContext.Provider>
  )
}

export function useUnitNavigationContext() {
  return useContext(UnitNavigationContext)
}


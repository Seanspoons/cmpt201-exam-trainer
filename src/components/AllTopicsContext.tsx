import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type AllTopicsContextValue = {
  isAllTopicsMode: boolean
  advanceTopic: () => void
}

const NOOP = () => {}

const AllTopicsContext = createContext<AllTopicsContextValue>({
  isAllTopicsMode: false,
  advanceTopic: NOOP,
})

export function AllTopicsProvider({
  value,
  children,
}: {
  value: AllTopicsContextValue
  children: ReactNode
}) {
  return <AllTopicsContext.Provider value={value}>{children}</AllTopicsContext.Provider>
}

export function useAllTopicsContext() {
  return useContext(AllTopicsContext)
}

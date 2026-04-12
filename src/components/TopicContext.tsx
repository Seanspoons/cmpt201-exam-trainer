import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type TopicContextValue = {
  unitLabel: string
  subtopicLabel: string
}

const TopicContext = createContext<TopicContextValue>({
  unitLabel: 'General',
  subtopicLabel: 'General',
})

export function TopicProvider({
  value,
  children,
}: {
  value: TopicContextValue
  children: ReactNode
}) {
  return <TopicContext.Provider value={value}>{children}</TopicContext.Provider>
}

export function useTopicContext() {
  return useContext(TopicContext)
}


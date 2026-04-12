import { useState } from 'react'
import { PlaceholderPanel } from '../../components/PlaceholderPanel'
import { TabNav } from '../../components/TabNav'
import { ConcurrencyDebugTab } from '../concurrencyDebug/ConcurrencyDebugTab'

type SynchronizationSubtopic =
  | 'mutex'
  | 'condition-variables'
  | 'semaphores'
  | 'deadlock'

const SUBTOPIC_OPTIONS: Array<{ id: SynchronizationSubtopic; label: string }> = [
  { id: 'mutex', label: 'Mutex' },
  { id: 'condition-variables', label: 'Condition Variables' },
  { id: 'semaphores', label: 'Semaphores' },
  { id: 'deadlock', label: 'Deadlock' },
]

export function SynchronizationUnit() {
  const [subtopic, setSubtopic] = useState<SynchronizationSubtopic>('deadlock')

  return (
    <div>
      <h2 className="section-title">Synchronization</h2>
      <TabNav
        options={SUBTOPIC_OPTIONS}
        activeTab={subtopic}
        onChange={setSubtopic}
        variant="subtopic"
      />
      {subtopic === 'deadlock' ? <ConcurrencyDebugTab key="sync-deadlock" /> : null}
      {subtopic === 'mutex' ? (
        <PlaceholderPanel unitLabel="Synchronization" subtopicLabel="Mutex" />
      ) : null}
      {subtopic === 'condition-variables' ? (
        <PlaceholderPanel
          unitLabel="Synchronization"
          subtopicLabel="Condition Variables"
        />
      ) : null}
      {subtopic === 'semaphores' ? (
        <PlaceholderPanel unitLabel="Synchronization" subtopicLabel="Semaphores" />
      ) : null}
    </div>
  )
}

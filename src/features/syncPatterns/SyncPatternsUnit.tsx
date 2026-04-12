import { UnitScaffold } from '../../components/UnitScaffold'
import { ConcurrencyDebugTab } from '../concurrencyDebug/ConcurrencyDebugTab'

export function SyncPatternsUnit() {
  return (
    <UnitScaffold
      unitLabel="Synchronization: Patterns"
      subtopics={[
        {
          id: 'sync-condition-variables',
          label: 'Condition Variables',
          render: () => <ConcurrencyDebugTab key="sync-patterns-cv" />,
        },
        {
          id: 'sync-semaphores',
          label: 'Semaphores',
          render: () => <ConcurrencyDebugTab key="sync-patterns-semaphore" />,
        },
        {
          id: 'sync-deadlock-patterns',
          label: 'Deadlock Patterns',
          render: () => <ConcurrencyDebugTab key="sync-patterns-deadlock" />,
        },
      ]}
    />
  )
}

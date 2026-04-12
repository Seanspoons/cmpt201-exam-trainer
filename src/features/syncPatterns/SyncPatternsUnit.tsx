import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateBoundedBufferQuestion,
  generateConditionUsageRulesQuestion,
  generateConditionVariableQuestion,
  generateDiningPhilosophersQuestion,
  generateProducerConsumerQuestion,
  generateReadWriteLockQuestion,
  generateSemaphoreQuestion,
} from './questions'

export function SyncPatternsUnit() {
  return (
    <UnitScaffold
      unitLabel="Synchronization: Patterns"
      subtopics={[
        {
          id: 'producer-consumer-pattern',
          label: 'Producer-Consumer Pattern',
          render: () => (
            <NetworkingDrillPractice
              key="sync-patterns-producer-consumer"
              title="Synchronization: Patterns > Producer-Consumer Pattern"
              generateQuestion={generateProducerConsumerQuestion}
            />
          ),
        },
        {
          id: 'condition-variables',
          label: 'Condition Variables',
          render: () => (
            <NetworkingDrillPractice
              key="sync-patterns-condition-variables"
              title="Synchronization: Patterns > Condition Variables"
              generateQuestion={generateConditionVariableQuestion}
            />
          ),
        },
        {
          id: 'condition-variable-usage-rules',
          label: 'Condition Variable Usage Rules',
          render: () => (
            <NetworkingDrillPractice
              key="sync-patterns-condition-usage"
              title="Synchronization: Patterns > Condition Variable Usage Rules"
              generateQuestion={generateConditionUsageRulesQuestion}
            />
          ),
        },
        {
          id: 'semaphores',
          label: 'Semaphores',
          render: () => (
            <NetworkingDrillPractice
              key="sync-patterns-semaphores"
              title="Synchronization: Patterns > Semaphores"
              generateQuestion={generateSemaphoreQuestion}
            />
          ),
        },
        {
          id: 'read-write-locks',
          label: 'Read-Write Locks',
          render: () => (
            <NetworkingDrillPractice
              key="sync-patterns-rwlocks"
              title="Synchronization: Patterns > Read-Write Locks"
              generateQuestion={generateReadWriteLockQuestion}
            />
          ),
        },
        {
          id: 'dining-philosophers',
          label: 'Dining Philosophers',
          render: () => (
            <NetworkingDrillPractice
              key="sync-patterns-dining-philosophers"
              title="Synchronization: Patterns > Dining Philosophers"
              generateQuestion={generateDiningPhilosophersQuestion}
            />
          ),
        },
        {
          id: 'bounded-circular-buffer',
          label: 'Bounded / Circular Buffer',
          render: () => (
            <NetworkingDrillPractice
              key="sync-patterns-bounded-buffer"
              title="Synchronization: Patterns > Bounded / Circular Buffer"
              generateQuestion={generateBoundedBufferQuestion}
            />
          ),
        },
      ]}
    />
  )
}

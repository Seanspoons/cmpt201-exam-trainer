import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateCriticalAtomicityQuestion,
  generateDeadlockPreventionQuestion,
  generateDeadlockQuestion,
  generateLivelockQuestion,
  generateLockApiQuestion,
  generateMutexMutualExclusionQuestion,
  generateSafetyReentrancyQuestion,
  generateSyncBasicsQuestion,
} from './questions'

export function SyncMutexUnit() {
  return (
    <UnitScaffold
      unitLabel="Synchronization: Mutex"
      subtopics={[
        {
          id: 'sync-basics',
          label: 'Synchronization Basics',
          render: () => (
            <NetworkingDrillPractice
              key="sync-mutex-basics"
              title="Synchronization: Mutex > Synchronization Basics"
              generateQuestion={generateSyncBasicsQuestion}
            />
          ),
        },
        {
          id: 'mutex-mutual-exclusion',
          label: 'Mutex and Mutual Exclusion',
          render: () => (
            <NetworkingDrillPractice
              key="sync-mutex-mutual-exclusion"
              title="Synchronization: Mutex > Mutex and Mutual Exclusion"
              generateQuestion={generateMutexMutualExclusionQuestion}
            />
          ),
        },
        {
          id: 'critical-section-atomicity',
          label: 'Critical Sections and Atomicity',
          render: () => (
            <NetworkingDrillPractice
              key="sync-mutex-critical-atomicity"
              title="Synchronization: Mutex > Critical Sections and Atomicity"
              generateQuestion={generateCriticalAtomicityQuestion}
            />
          ),
        },
        {
          id: 'lock-api-behavior',
          label: 'Lock Behavior and Lock APIs',
          render: () => (
            <NetworkingDrillPractice
              key="sync-mutex-lock-api"
              title="Synchronization: Mutex > Lock Behavior and APIs"
              generateQuestion={generateLockApiQuestion}
            />
          ),
        },
        {
          id: 'thread-safe-vs-reentrant',
          label: 'Thread Safety vs Reentrancy',
          render: () => (
            <NetworkingDrillPractice
              key="sync-mutex-safety-reentrancy"
              title="Synchronization: Mutex > Thread Safety vs Reentrancy"
              generateQuestion={generateSafetyReentrancyQuestion}
            />
          ),
        },
        {
          id: 'deadlock',
          label: 'Deadlock',
          render: () => (
            <NetworkingDrillPractice
              key="sync-mutex-deadlock"
              title="Synchronization: Mutex > Deadlock"
              generateQuestion={generateDeadlockQuestion}
            />
          ),
        },
        {
          id: 'deadlock-prevention',
          label: 'Deadlock Prevention',
          render: () => (
            <NetworkingDrillPractice
              key="sync-mutex-deadlock-prevention"
              title="Synchronization: Mutex > Deadlock Prevention"
              generateQuestion={generateDeadlockPreventionQuestion}
            />
          ),
        },
        {
          id: 'livelock',
          label: 'Livelock',
          render: () => (
            <NetworkingDrillPractice
              key="sync-mutex-livelock"
              title="Synchronization: Mutex > Livelock"
              generateQuestion={generateLivelockQuestion}
            />
          ),
        },
      ]}
    />
  )
}

import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateDataRaceQuestion,
  generatePthreadBasicsQuestion,
  generateSharedVsPerThreadQuestion,
  generateThreadDefinitionQuestion,
  generateThreadLifecycleQuestion,
  generateThreadVsProcessQuestion,
} from './questions'

export function ThreadsUnit() {
  return (
    <UnitScaffold
      unitLabel="Threads"
      subtopics={[
        {
          id: 'threads-what-is-thread',
          label: 'What is a Thread?',
          render: () => (
            <NetworkingDrillPractice
              key="threads-what-is-thread"
              title="Threads > What is a Thread?"
              generateQuestion={generateThreadDefinitionQuestion}
            />
          ),
        },
        {
          id: 'threads-vs-processes',
          label: 'Threads vs Processes',
          render: () => (
            <NetworkingDrillPractice
              key="threads-vs-processes"
              title="Threads > Threads vs Processes"
              generateQuestion={generateThreadVsProcessQuestion}
            />
          ),
        },
        {
          id: 'threads-shared-vs-per-thread',
          label: 'Shared vs Per-Thread State',
          render: () => (
            <NetworkingDrillPractice
              key="threads-shared-vs-per-thread"
              title="Threads > Shared vs Per-Thread State"
              generateQuestion={generateSharedVsPerThreadQuestion}
            />
          ),
        },
        {
          id: 'threads-pthread-basics',
          label: 'pthread Basics',
          render: () => (
            <NetworkingDrillPractice
              key="threads-pthread-basics"
              title="Threads > pthread Basics"
              generateQuestion={generatePthreadBasicsQuestion}
            />
          ),
        },
        {
          id: 'threads-lifecycle',
          label: 'Thread Lifecycle',
          render: () => (
            <NetworkingDrillPractice
              key="threads-lifecycle"
              title="Threads > Thread Lifecycle"
              generateQuestion={generateThreadLifecycleQuestion}
            />
          ),
        },
        {
          id: 'threads-data-races',
          label: 'Data Races and Non-Determinism',
          render: () => (
            <NetworkingDrillPractice
              key="threads-data-races"
              title="Threads > Data Races and Non-Determinism"
              generateQuestion={generateDataRaceQuestion}
            />
          ),
        },
      ]}
    />
  )
}

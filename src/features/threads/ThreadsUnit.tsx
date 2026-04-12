import { UnitScaffold } from '../../components/UnitScaffold'

export function ThreadsUnit() {
  return (
    <UnitScaffold
      unitLabel="Threads"
      subtopics={[
        {
          id: 'threads-basics',
          label: 'Thread Lifecycle',
          plannedDrills: ['Predict thread creation/join behavior', 'Track shared vs local state in traces'],
        },
        {
          id: 'threads-shared-state',
          label: 'Shared State',
          plannedDrills: ['Identify data races in short snippets', 'Reason about interleavings'],
        },
      ]}
    />
  )
}

import { UnitScaffold } from '../../components/UnitScaffold'

export function SyncMutexUnit() {
  return (
    <UnitScaffold
      unitLabel="Synchronization: Mutex"
      subtopics={[
        {
          id: 'mutex-critical-sections',
          label: 'Critical Sections',
          plannedDrills: ['Mark code that must be mutually exclusive', 'Spot missing lock boundaries'],
        },
        {
          id: 'mutex-race-conditions',
          label: 'Race Conditions',
          plannedDrills: ['Explain race outcomes with simple traces', 'Pick correct lock placement'],
        },
        {
          id: 'mutex-locking-patterns',
          label: 'Locking Patterns',
          plannedDrills: ['Evaluate lock granularity tradeoffs', 'Find lock order hazards'],
        },
      ]}
    />
  )
}

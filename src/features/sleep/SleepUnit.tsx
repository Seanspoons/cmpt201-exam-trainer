import { UnitScaffold } from '../../components/UnitScaffold'

export function SleepUnit() {
  return (
    <UnitScaffold
      unitLabel="sleep()"
      subtopics={[
        {
          id: 'sleep-blocking-behavior',
          label: 'Blocking Behavior',
          plannedDrills: ['Predict process states during sleep', 'Compare busy-wait vs sleep'],
        },
        {
          id: 'sleep-interruptions',
          label: 'Interruption and Signals',
          plannedDrills: ['Reason about interrupted sleep calls', 'Interpret return values and retries'],
        },
      ]}
    />
  )
}

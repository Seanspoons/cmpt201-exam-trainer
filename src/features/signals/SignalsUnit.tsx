import { UnitScaffold } from '../../components/UnitScaffold'

export function SignalsUnit() {
  return (
    <UnitScaffold
      unitLabel="Signals"
      subtopics={[
        {
          id: 'signals-delivery',
          label: 'Signal Delivery',
          plannedDrills: ['Determine which process receives a signal', 'Predict default signal actions'],
        },
        {
          id: 'signals-handlers',
          label: 'Handlers',
          plannedDrills: ['Find unsafe operations in handlers', 'Trace signal handler execution order'],
        },
        {
          id: 'signals-blocking',
          label: 'Blocking and Masks',
          plannedDrills: ['Reason about blocked signal sets', 'Analyze pending signal behavior'],
        },
      ]}
    />
  )
}

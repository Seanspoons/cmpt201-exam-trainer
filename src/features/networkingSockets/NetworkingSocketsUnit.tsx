import { UnitScaffold } from '../../components/UnitScaffold'

export function NetworkingSocketsUnit() {
  return (
    <UnitScaffold
      unitLabel="Networking: Sockets"
      subtopics={[
        {
          id: 'sockets-lifecycle',
          label: 'Socket Lifecycle',
          plannedDrills: ['Order socket/bind/listen/accept calls correctly', 'Identify missing error checks'],
        },
        {
          id: 'sockets-blocking',
          label: 'Blocking Behavior',
          plannedDrills: ['Predict when accept/read/write block', 'Reason about non-blocking alternatives'],
        },
      ]}
    />
  )
}

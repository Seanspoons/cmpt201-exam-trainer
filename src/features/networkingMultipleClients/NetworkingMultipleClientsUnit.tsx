import { UnitScaffold } from '../../components/UnitScaffold'

export function NetworkingMultipleClientsUnit() {
  return (
    <UnitScaffold
      unitLabel="Networking: Multiple Clients"
      subtopics={[
        {
          id: 'multi-clients-concurrency',
          label: 'Concurrent Clients',
          plannedDrills: ['Compare threaded vs process-per-client models', 'Identify shared-state hazards in servers'],
        },
        {
          id: 'multi-clients-select',
          label: 'Multiplexing',
          plannedDrills: ['Trace select/poll readiness behavior', 'Reason about fairness and starvation'],
        },
      ]}
    />
  )
}

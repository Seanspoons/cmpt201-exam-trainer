import { UnitScaffold } from '../../components/UnitScaffold'

export function MemoryManagementUnit() {
  return (
    <UnitScaffold
      unitLabel="Memory Management"
      subtopics={[
        {
          id: 'mm-layout',
          label: 'Process Memory Layout',
          plannedDrills: ['Classify stack/heap/global/segment memory usage', 'Spot lifetime bugs by region'],
        },
        {
          id: 'mm-allocation',
          label: 'Dynamic Allocation',
          plannedDrills: ['Track malloc/free correctness', 'Detect leaks and double-free errors'],
        },
      ]}
    />
  )
}

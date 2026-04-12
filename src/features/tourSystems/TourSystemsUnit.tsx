import { UnitScaffold } from '../../components/UnitScaffold'

export function TourSystemsUnit() {
  return (
    <UnitScaffold
      unitLabel="Tour of Computer Systems"
      subtopics={[
        {
          id: 'tour-system-layers',
          label: 'System Layers',
          plannedDrills: ['Map user code to kernel interactions', 'Identify process/memory boundaries'],
        },
        {
          id: 'tour-cpu-memory-io',
          label: 'CPU, Memory, I/O',
          plannedDrills: ['Trace data flow across hardware/software layers', 'Predict bottlenecks by subsystem'],
        },
        {
          id: 'tour-c-toolchain',
          label: 'C to Machine Path',
          plannedDrills: ['Compilation and linking checkpoints', 'Runtime loading checkpoints'],
        },
      ]}
    />
  )
}

import { UnitScaffold } from '../../components/UnitScaffold'

export function SchedulingUnit() {
  return (
    <UnitScaffold
      unitLabel="Scheduling"
      subtopics={[
        {
          id: 'scheduling-policies',
          label: 'Policies',
          plannedDrills: ['Compare FCFS, RR, and priority outcomes', 'Compute turnaround/wait time quickly'],
        },
        {
          id: 'scheduling-context-switching',
          label: 'Context Switching',
          plannedDrills: ['Identify context-switch overhead effects', 'Trace scheduling timeline events'],
        },
      ]}
    />
  )
}

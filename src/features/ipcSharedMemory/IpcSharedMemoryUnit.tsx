import { UnitScaffold } from '../../components/UnitScaffold'

export function IpcSharedMemoryUnit() {
  return (
    <UnitScaffold
      unitLabel="IPC: Shared Memory"
      subtopics={[
        {
          id: 'shm-setup',
          label: 'Shared memory setup',
          plannedDrills: ['Trace shm creation/attach/detach lifecycle', 'Spot missing cleanup calls'],
        },
        {
          id: 'shm-synchronization',
          label: 'Synchronization with shared memory',
          plannedDrills: ['Choose mutex/semaphore placement for shared regions', 'Analyze race conditions in shared data'],
        },
      ]}
    />
  )
}

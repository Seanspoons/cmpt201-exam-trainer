import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateCleanupDetailsQuestion,
  generateFileVsAnonymousMappingsQuestion,
  generateMappingComparisonQuestion,
  generateMemoryMappingBasicsQuestion,
  generateMmapApiQuestion,
  generateParentChildSharedMemoryQuestion,
  generateSharedPrivateMappingsQuestion,
  generateUnrelatedSharedMemoryQuestion,
} from './questions'

export function IpcSharedMemoryUnit() {
  return (
    <UnitScaffold
      unitLabel="IPC: Shared Memory"
      subtopics={[
        {
          id: 'memory-mapping-basics',
          label: 'Memory Mapping Basics',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-shm-memory-mapping-basics"
              title="IPC: Shared Memory > Memory Mapping Basics"
              generateQuestion={generateMemoryMappingBasicsQuestion}
            />
          ),
        },
        {
          id: 'mmap-api',
          label: 'mmap()',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-shm-mmap-api"
              title="IPC: Shared Memory > mmap()"
              generateQuestion={generateMmapApiQuestion}
            />
          ),
        },
        {
          id: 'shared-vs-private-mappings',
          label: 'Shared vs Private Mappings',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-shm-shared-private"
              title="IPC: Shared Memory > Shared vs Private Mappings"
              generateQuestion={generateSharedPrivateMappingsQuestion}
            />
          ),
        },
        {
          id: 'file-vs-anonymous-mappings',
          label: 'File vs Anonymous Mappings',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-shm-file-vs-anon"
              title="IPC: Shared Memory > File vs Anonymous Mappings"
              generateQuestion={generateFileVsAnonymousMappingsQuestion}
            />
          ),
        },
        {
          id: 'parent-child-shared-memory',
          label: 'Parent-Child Shared Memory',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-shm-parent-child"
              title="IPC: Shared Memory > Parent-Child Shared Memory"
              generateQuestion={generateParentChildSharedMemoryQuestion}
            />
          ),
        },
        {
          id: 'unrelated-process-shared-memory',
          label: 'Shared Memory for Unrelated Processes',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-shm-unrelated"
              title="IPC: Shared Memory > Unrelated Process Workflow"
              generateQuestion={generateUnrelatedSharedMemoryQuestion}
            />
          ),
        },
        {
          id: 'cleanup-lifecycle',
          label: 'shm_open/ftruncate/mmap/munmap/shm_unlink',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-shm-cleanup"
              title="IPC: Shared Memory > Setup and Cleanup Lifecycle"
              generateQuestion={generateCleanupDetailsQuestion}
            />
          ),
        },
        {
          id: 'mapping-type-comparisons',
          label: 'Mapping Type Comparisons',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-shm-comparisons"
              title="IPC: Shared Memory > Mapping Type Comparisons"
              generateQuestion={generateMappingComparisonQuestion}
            />
          ),
        },
      ]}
    />
  )
}

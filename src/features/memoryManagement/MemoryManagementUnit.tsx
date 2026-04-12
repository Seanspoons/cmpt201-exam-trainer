import { UnitScaffold } from '../../components/UnitScaffold'
import { MemoryStrategyPractice } from './MemoryStrategyPractice'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateAllocationProcessQuestion,
  generateCoalescingQuestion,
  generateFragmentationQuestion,
  generateFreeListQuestion,
  generateHeapProgramBreakQuestion,
  generateMallocFreeQuestion,
  generateMemoryLayoutQuestion,
  generateBestFitQuestion,
  generateFirstFitQuestion,
  generateFitStrategyComparisonQuestion,
  generateRandomAllocationStrategyQuestion,
  generateWorstFitQuestion,
} from './questions'

export function MemoryManagementUnit() {
  return (
    <UnitScaffold
      unitLabel="Memory Management"
      subtopics={[
        {
          id: 'mm-memory-layout',
          label: 'Memory Layout',
          render: () => (
            <NetworkingDrillPractice
              key="mm-memory-layout"
              title="Memory Management > Memory Layout"
              generateQuestion={generateMemoryLayoutQuestion}
            />
          ),
        },
        {
          id: 'mm-heap-program-break',
          label: 'Heap and Program Break',
          render: () => (
            <NetworkingDrillPractice
              key="mm-heap-program-break"
              title="Memory Management > Heap and Program Break"
              generateQuestion={generateHeapProgramBreakQuestion}
            />
          ),
        },
        {
          id: 'mm-malloc-free',
          label: 'malloc() and free()',
          render: () => (
            <NetworkingDrillPractice
              key="mm-malloc-free"
              title="Memory Management > malloc() and free()"
              generateQuestion={generateMallocFreeQuestion}
            />
          ),
        },
        {
          id: 'mm-free-list',
          label: 'Free List (Linked List)',
          render: () => (
            <NetworkingDrillPractice
              key="mm-free-list"
              title="Memory Management > Free List (Linked List)"
              generateQuestion={generateFreeListQuestion}
            />
          ),
        },
        {
          id: 'mm-allocation-strategy-drills',
          label: 'Allocation Strategy Drills',
          render: () => (
            <MemoryStrategyPractice
              key="mm-allocation-strategy-drills"
              title="Memory Management > Allocation Strategy Drills"
              generators={{
                random: generateRandomAllocationStrategyQuestion,
                allocationTrace: generateAllocationProcessQuestion,
                firstFit: generateFirstFitQuestion,
                bestFit: generateBestFitQuestion,
                worstFit: generateWorstFitQuestion,
                strategyCompare: generateFitStrategyComparisonQuestion,
              }}
            />
          ),
        },
        {
          id: 'mm-fragmentation',
          label: 'Fragmentation',
          render: () => (
            <NetworkingDrillPractice
              key="mm-fragmentation"
              title="Memory Management > Fragmentation"
              generateQuestion={generateFragmentationQuestion}
            />
          ),
        },
        {
          id: 'mm-coalescing',
          label: 'Coalescing',
          render: () => (
            <NetworkingDrillPractice
              key="mm-coalescing"
              title="Memory Management > Coalescing"
              generateQuestion={generateCoalescingQuestion}
            />
          ),
        },
      ]}
    />
  )
}

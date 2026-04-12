import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateAllocationProcessQuestion,
  generateBestFitQuestion,
  generateCoalescingQuestion,
  generateFirstFitQuestion,
  generateFitStrategyComparisonQuestion,
  generateFragmentationQuestion,
  generateFreeListQuestion,
  generateHeapProgramBreakQuestion,
  generateMallocFreeQuestion,
  generateMemoryLayoutQuestion,
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
          id: 'mm-allocation-process',
          label: 'Allocation Process',
          render: () => (
            <NetworkingDrillPractice
              key="mm-allocation-process"
              title="Memory Management > Allocation Process"
              generateQuestion={generateAllocationProcessQuestion}
            />
          ),
        },
        {
          id: 'mm-first-fit',
          label: 'First Fit',
          render: () => (
            <NetworkingDrillPractice
              key="mm-first-fit"
              title="Memory Management > First Fit"
              generateQuestion={generateFirstFitQuestion}
            />
          ),
        },
        {
          id: 'mm-best-fit',
          label: 'Best Fit',
          render: () => (
            <NetworkingDrillPractice
              key="mm-best-fit"
              title="Memory Management > Best Fit"
              generateQuestion={generateBestFitQuestion}
            />
          ),
        },
        {
          id: 'mm-worst-fit',
          label: 'Worst Fit',
          render: () => (
            <NetworkingDrillPractice
              key="mm-worst-fit"
              title="Memory Management > Worst Fit"
              generateQuestion={generateWorstFitQuestion}
            />
          ),
        },
        {
          id: 'mm-fit-strategy-comparison',
          label: 'Fit Strategy Comparison',
          render: () => (
            <NetworkingDrillPractice
              key="mm-fit-strategy-comparison"
              title="Memory Management > Fit Strategy Comparison"
              generateQuestion={generateFitStrategyComparisonQuestion}
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

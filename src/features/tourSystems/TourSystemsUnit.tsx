import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateCompilationInterpretationQuestion,
  generateHardwareBasicsQuestion,
  generateKernelPrivilegeQuestion,
  generateMemoryHierarchyQuestion,
  generateOsStackQuestion,
  generatePointerAddressQuestion,
  generatePosixAbiQuestion,
  generateSystemsProgrammingQuestion,
  generateVirtualizationQuestion,
} from './questions'

export function TourSystemsUnit() {
  return (
    <UnitScaffold
      unitLabel="Tour of Computer Systems"
      subtopics={[
        {
          id: 'tour-os-stack',
          label: 'OS Stack',
          render: () => (
            <NetworkingDrillPractice
              key="tour-os-stack"
              title="Tour of Computer Systems > OS Stack"
              generateQuestion={generateOsStackQuestion}
            />
          ),
        },
        {
          id: 'tour-systems-programming',
          label: 'Systems Programming',
          render: () => (
            <NetworkingDrillPractice
              key="tour-systems-programming"
              title="Tour of Computer Systems > Systems Programming"
              generateQuestion={generateSystemsProgrammingQuestion}
            />
          ),
        },
        {
          id: 'tour-hardware-basics',
          label: 'Hardware Basics',
          render: () => (
            <NetworkingDrillPractice
              key="tour-hardware-basics"
              title="Tour of Computer Systems > Hardware Basics"
              generateQuestion={generateHardwareBasicsQuestion}
            />
          ),
        },
        {
          id: 'tour-memory-hierarchy',
          label: 'Memory Hierarchy',
          render: () => (
            <NetworkingDrillPractice
              key="tour-memory-hierarchy"
              title="Tour of Computer Systems > Memory Hierarchy"
              generateQuestion={generateMemoryHierarchyQuestion}
            />
          ),
        },
        {
          id: 'tour-pointers-address-size',
          label: 'Pointers and Address Size',
          render: () => (
            <NetworkingDrillPractice
              key="tour-pointers-address-size"
              title="Tour of Computer Systems > Pointers and Address Size"
              generateQuestion={generatePointerAddressQuestion}
            />
          ),
        },
        {
          id: 'tour-kernel-privilege',
          label: 'Kernel and Privilege Modes',
          render: () => (
            <NetworkingDrillPractice
              key="tour-kernel-privilege"
              title="Tour of Computer Systems > Kernel and Privilege Modes"
              generateQuestion={generateKernelPrivilegeQuestion}
            />
          ),
        },
        {
          id: 'tour-apps-compile-interpret',
          label: 'Applications, Compilation, and Interpretation',
          render: () => (
            <NetworkingDrillPractice
              key="tour-apps-compile-interpret"
              title="Tour of Computer Systems > Applications, Compilation, and Interpretation"
              generateQuestion={generateCompilationInterpretationQuestion}
            />
          ),
        },
        {
          id: 'tour-posix-abi',
          label: 'POSIX and ABI',
          render: () => (
            <NetworkingDrillPractice
              key="tour-posix-abi"
              title="Tour of Computer Systems > POSIX and ABI"
              generateQuestion={generatePosixAbiQuestion}
            />
          ),
        },
        {
          id: 'tour-virtualization-containers',
          label: 'Virtualization and Containers',
          render: () => (
            <NetworkingDrillPractice
              key="tour-virtualization-containers"
              title="Tour of Computer Systems > Virtualization and Containers"
              generateQuestion={generateVirtualizationQuestion}
            />
          ),
        },
      ]}
    />
  )
}

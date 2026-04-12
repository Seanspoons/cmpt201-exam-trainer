import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const OS_STACK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'tour-os-stack-layers',
    kind: 'match',
    prompt: 'Match each OS stack layer to its role.',
    pairs: [
      { left: 'Hardware', right: 'Provides CPU, memory, and device resources' },
      { left: 'Kernel', right: 'Manages resources and protection/isolation' },
      { left: 'Applications', right: 'Run user programs using OS services' },
    ],
    explanationSteps: [
      'Applications usually cannot touch hardware directly.',
      'Kernel mediates access through controlled interfaces.',
      'Hardware executes instructions and stores/transfers data.',
    ],
    conceptSummary: 'Core stack: hardware -> kernel -> applications.',
  },
  {
    id: 'tour-syscall-interface',
    kind: 'mcq',
    prompt: 'What is the syscall interface in this stack?',
    options: [
      'The boundary where applications request kernel services',
      'A hardware bus between CPU and RAM',
      'A compiler optimization pass',
      'An API only for container runtimes',
    ],
    correctOption: 0,
    explanationSteps: [
      'User programs run in user mode and request privileged operations via syscalls.',
      'Kernel validates and executes those operations in kernel mode.',
      'This boundary enforces protection.',
    ],
    conceptSummary: 'Syscalls are the app-to-kernel service interface.',
  },
]

const SYSTEMS_PROGRAMMING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'tour-what-is-systems-programming',
    kind: 'text',
    prompt: 'What is systems programming?',
    requiredConcepts: [
      { label: 'Low-level focus', keywords: ['low-level', 'close to hardware', 'system level'] },
      { label: 'OS/hardware interaction', keywords: ['os', 'hardware', 'kernel'] },
      { label: 'System calls/direct control', keywords: ['system calls', 'direct interaction', 'resource control'] },
    ],
    answerDisplay:
      'Systems programming is low-level programming that interacts directly with OS and hardware resources, often through system calls.',
    explanationSteps: [
      'It focuses on performance, control, and resource management.',
      'Typical tasks include process, memory, file, and IPC operations.',
      'Common languages include C, C++, and Rust.',
    ],
    conceptSummary: 'Systems programming emphasizes direct OS/hardware control.',
  },
  {
    id: 'tour-systems-languages',
    kind: 'mcq',
    prompt: 'Which language set is most associated with systems programming in this course context?',
    options: ['C/C++/Rust', 'HTML/CSS/SQL', 'R/Matlab/SAS', 'Lua/TypeScript only'],
    correctOption: 0,
    explanationSteps: [
      'These languages provide lower-level control and systems APIs.',
      'They are common in OS/runtime and performance-critical software.',
      'Course systems examples center around C/POSIX style interfaces.',
    ],
    conceptSummary: 'C, C++, and Rust are common systems languages.',
  },
]

const HARDWARE_MEMORY_HIERARCHY_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'tour-von-neumann-basics',
    kind: 'mcq',
    prompt: 'Which statement best describes von Neumann-style execution basics?',
    options: [
      'CPU fetches instructions/data from memory and executes them',
      'CPU executes programs directly from SSD blocks without memory',
      'Kernel and hardware are identical layers',
      'Programs run only in cache and never in RAM',
    ],
    correctOption: 0,
    explanationSteps: [
      'CPU performs fetch/decode/execute cycles using memory-resident instructions/data.',
      'Storage persists data, but execution works through memory hierarchy.',
      'This model underpins modern general-purpose systems.',
    ],
    conceptSummary: 'Computation path is CPU + memory driven.',
  },
  {
    id: 'tour-memory-hierarchy-order',
    kind: 'match',
    prompt: 'Match memory/storage levels from fastest-smallest to slower-larger.',
    pairs: [
      { left: 'Registers', right: 'Fastest and smallest, volatile' },
      { left: 'Cache (L1/L2/L3)', right: 'Very fast, small, bridges CPU and RAM' },
      { left: 'RAM', right: 'Main memory, larger and slower than cache' },
      { left: 'SSD/HDD/Tape', right: 'Persistent storage, slowest and largest' },
    ],
    explanationSteps: [
      'Higher speed tiers are smaller and costlier per byte.',
      'Lower speed tiers provide larger capacity and persistence.',
      'Hierarchy exists to balance speed, size, cost, and persistence.',
    ],
    conceptSummary: 'Memory hierarchy is a speed-size-cost-persistence tradeoff ladder.',
  },
]

const POINTER_ADDRESS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'tour-pointer-definition',
    kind: 'text',
    prompt: 'What is a pointer?',
    requiredConcepts: [
      { label: 'Stores address', keywords: ['address', 'memory address', 'location'] },
      { label: 'Variable holding address', keywords: ['variable', 'stores', 'pointer variable'] },
    ],
    answerDisplay: 'A pointer is a variable that stores a memory address.',
    explanationSteps: [
      'Pointer value is an address, not the pointed data itself.',
      'Dereferencing follows that address to access target object.',
      'Incorrect pointer use can cause crashes/undefined behavior.',
    ],
    conceptSummary: 'Pointer = address-valued variable.',
  },
  {
    id: 'tour-pointer-size-arch',
    kind: 'mcq',
    prompt: 'On one architecture, are `int*` and `char*` typically different sizes?',
    options: [
      'No, pointer size is usually architecture-dependent, not pointee-type dependent',
      'Yes, `int*` is always 4x larger than `char*`',
      'Yes, size depends only on variable name',
      'No, all pointers are always 4 bytes on every system',
    ],
    correctOption: 0,
    explanationSteps: [
      'Pointers encode addresses in a given address-space format.',
      'Address width follows architecture/register size conventions.',
      'Pointee type affects dereference interpretation, not pointer storage width.',
    ],
    conceptSummary: 'Pointer width tracks architecture/address width.',
  },
  {
    id: 'tour-32-vs-64-address-space',
    kind: 'mcq',
    prompt: 'Conceptually, how many bytes can a 32-bit pointer address?',
    options: ['2^32 bytes', '2^16 bytes', '2^64 bytes', '2^8 bytes'],
    correctOption: 0,
    explanationSteps: [
      '32 address bits encode 2^32 distinct byte addresses in a byte-addressed model.',
      '64-bit systems conceptually scale to 2^64 addressable bytes.',
      'Practical limits can be lower than conceptual maximums.',
    ],
    conceptSummary: 'Address-space capacity scales exponentially with address bits.',
  },
]

const KERNEL_PRIVILEGE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'tour-kernel-user-mode',
    kind: 'mcq',
    prompt: 'Which statement about privilege modes is correct?',
    options: [
      'Kernel mode can execute privileged operations; user mode is restricted for safety',
      'User mode can load page tables directly',
      'Kernel mode cannot access devices',
      'Privilege mode only affects compilation speed',
    ],
    correctOption: 0,
    explanationSteps: [
      'User mode isolation protects system integrity.',
      'Privileged instructions are reserved for kernel mode.',
      'Applications use syscalls to request privileged work safely.',
    ],
    conceptSummary: 'Privilege separation enables protection and isolation.',
  },
  {
    id: 'tour-root-vs-kernel-mode',
    kind: 'mcq',
    prompt: 'Is root user equivalent to kernel mode?',
    options: ['No. Root is still a user-mode process with high permissions', 'Yes. Root processes always run in kernel mode', 'Only during exec()', 'Only on 32-bit systems'],
    correctOption: 0,
    explanationSteps: [
      'Privilege level (user vs kernel mode) is CPU execution mode.',
      'Root affects authorization policy, not CPU mode directly.',
      'Even root user code transitions via syscalls for privileged kernel actions.',
    ],
    conceptSummary: 'Root privileges and kernel mode are different concepts.',
  },
]

const APPS_POSIX_ABI_VIRT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'tour-compilation-vs-interpretation',
    kind: 'mcq',
    prompt: 'Which tradeoff statement is generally accurate?',
    options: [
      'Compiled code is often faster at runtime; interpreted approaches can improve portability/flexibility',
      'Interpreted code is always faster than compiled machine code',
      'Compilation removes need for executable loading',
      'Interpretation means no runtime overhead ever',
    ],
    correctOption: 0,
    explanationSteps: [
      'Compilation translates ahead-of-time to machine code.',
      'Interpretation/JIT choices trade setup/runtime characteristics and portability.',
      'Exact performance depends on implementation but general trend remains.',
    ],
    conceptSummary: 'Compilation vs interpretation is a performance-flexibility tradeoff.',
  },
  {
    id: 'tour-posix-vs-abi',
    kind: 'text',
    prompt: 'What is the difference between POSIX and ABI?',
    requiredConcepts: [
      { label: 'POSIX portability API standard', keywords: ['posix', 'api', 'portable', 'standard interface'] },
      { label: 'ABI binary-level compatibility', keywords: ['abi', 'binary', 'calling convention', 'low-level interoperability'] },
    ],
    answerDisplay:
      'POSIX is a source-level portability/API standard; ABI defines binary-level compatibility rules (calling conventions, binary interfaces) for a specific platform.',
    explanationSteps: [
      'APIs define what functions/interfaces developers call.',
      'ABIs define how compiled binaries interoperate at low level.',
      'Binary portability depends on matching ABI/OS expectations.',
    ],
    conceptSummary: 'API is source-level contract; ABI is binary-level contract.',
  },
  {
    id: 'tour-vm-vs-container',
    kind: 'mcq',
    prompt: 'Which statement correctly compares VMs and containers?',
    options: [
      'VMs include a guest OS/kernel; containers share the host kernel',
      'Containers always include separate guest kernels',
      'VMs cannot run on hardware virtualization',
      'Containers are identical to hypervisors',
    ],
    correctOption: 0,
    explanationSteps: [
      'Hypervisor-based VMs virtualize machine/OS stack with guest kernels.',
      'Containers isolate processes while reusing host kernel.',
      'Containers are lighter but not full machine virtualization.',
    ],
    conceptSummary: 'Containerization shares host kernel; VM encapsulates guest kernel.',
  },
]

export function generateOsStackQuestion(): NetworkingQuestion {
  return randomPick(OS_STACK_QUESTIONS)
}

export function generateSystemsProgrammingQuestion(): NetworkingQuestion {
  return randomPick(SYSTEMS_PROGRAMMING_QUESTIONS)
}

export function generateHardwareBasicsQuestion(): NetworkingQuestion {
  return randomPick(HARDWARE_MEMORY_HIERARCHY_QUESTIONS)
}

export function generateMemoryHierarchyQuestion(): NetworkingQuestion {
  return randomPick(HARDWARE_MEMORY_HIERARCHY_QUESTIONS)
}

export function generatePointerAddressQuestion(): NetworkingQuestion {
  return randomPick(POINTER_ADDRESS_QUESTIONS)
}

export function generateKernelPrivilegeQuestion(): NetworkingQuestion {
  return randomPick(KERNEL_PRIVILEGE_QUESTIONS)
}

export function generateCompilationInterpretationQuestion(): NetworkingQuestion {
  return randomPick(APPS_POSIX_ABI_VIRT_QUESTIONS)
}

export function generatePosixAbiQuestion(): NetworkingQuestion {
  return randomPick([APPS_POSIX_ABI_VIRT_QUESTIONS[1]])
}

export function generateVirtualizationQuestion(): NetworkingQuestion {
  return randomPick([APPS_POSIX_ABI_VIRT_QUESTIONS[2]])
}

export const TOUR_SYSTEMS_QUESTION_COUNT = 14

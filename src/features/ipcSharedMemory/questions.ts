import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const MEMORY_MAPPING_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'shm-mmap-purpose',
    kind: 'mcq',
    prompt: 'What is mmap() mainly used for in this IPC context?',
    options: [
      'Create memory mappings for file-backed or anonymous memory access',
      'Create anonymous pipes only',
      'Launch a new process and attach stdio',
      'Automatically lock shared data structures',
    ],
    correctOption: 0,
    explanationSteps: [
      'mmap maps memory regions into process address space.',
      'Mappings may be file-backed or anonymous.',
      'For mapped files, pointer access can replace read/write loops.',
    ],
    conceptSummary: 'mmap creates mapped memory regions returned as pointers.',
  },
  {
    id: 'shm-mmap-return',
    kind: 'mcq',
    prompt: 'What does successful mmap() return?',
    options: [
      'A pointer to the mapped memory region',
      'A pipe file descriptor',
      'A thread ID',
      'A semaphore count',
    ],
    correctOption: 0,
    explanationSteps: [
      'mmap returns an address suitable for pointer-based access.',
      'It is memory mapping, not descriptor-only stream I/O.',
      'Failure is indicated by MAP_FAILED.',
    ],
    conceptSummary: 'mmap returns memory address, not a pipe-like stream endpoint.',
  },
]

const MMAP_API_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'shm-mmap-file-io-replacement',
    kind: 'text',
    prompt: 'How does memory-mapped file access differ from read()/write() style file I/O?',
    requiredConcepts: [
      { label: 'Pointer-based access', keywords: ['pointer access', 'direct memory access', 'load/store'] },
      { label: 'Mapped file region', keywords: ['mapped file', 'memory mapping', 'mmap region'] },
    ],
    answerDisplay:
      'Mapped file I/O uses pointer loads/stores on mapped memory rather than explicit read()/write() calls.',
    explanationSteps: [
      'mmap maps file bytes into virtual memory.',
      'Program reads/writes via normal memory operations.',
      'This can simplify some data-access patterns.',
    ],
    conceptSummary: 'mmap turns file content access into memory access semantics.',
  },
]

const SHARED_PRIVATE_TYPES_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'shm-mapping-type-match',
    kind: 'match',
    prompt: 'Match mapping type to behavior.',
    pairs: [
      { left: 'Private file mapping', right: 'Private copy-style view of file contents' },
      { left: 'Shared file mapping', right: 'Changes visible to other shared mappings and file view' },
      { left: 'Private anonymous mapping', right: 'Private allocated memory, not file-backed' },
      { left: 'Shared anonymous mapping', right: 'Memory shared across related processes after fork' },
    ],
    explanationSteps: [
      'Mapping modes combine two dimensions: file-vs-anonymous and shared-vs-private.',
      'Private mappings isolate modifications from peers.',
      'Shared mappings propagate visibility among participants.',
    ],
    conceptSummary: 'Understand 2x2 mapping matrix: file/anonymous × shared/private.',
    comparisonTable: {
      headers: ['Type', 'Backed By', 'Visibility'],
      rows: [
        ['Private file', 'File', 'Private copy behavior'],
        ['Shared file', 'File', 'Shared updates'],
        ['Private anonymous', 'No file', 'Private memory'],
        ['Shared anonymous', 'No file', 'Shared among related processes'],
      ],
    },
  },
  {
    id: 'shm-temp-copy-choice',
    kind: 'mcq',
    prompt:
      'Which mapping type best matches “temporary private copy-style access to file contents”?',
    options: [
      'Private file mapping',
      'Shared file mapping',
      'Shared anonymous mapping',
      'Unnamed pipe',
    ],
    correctOption: 0,
    explanationSteps: [
      'Private file mappings are file-backed but with private-copy semantics.',
      'Shared file mapping would expose modifications more broadly.',
      'Anonymous mapping has no file backing.',
    ],
    conceptSummary: 'Choose private file mapping for copy-like temporary file memory view.',
  },
]

const FILE_VS_ANONYMOUS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'shm-file-vs-anon',
    kind: 'mcq',
    prompt: 'Which statement best distinguishes file-backed and anonymous mappings?',
    options: [
      'File-backed maps file content; anonymous mapping is not backed by a file',
      'Anonymous mapping always persists as a normal file',
      'File-backed mapping cannot be shared',
      'Anonymous mapping cannot be used with fork',
    ],
    correctOption: 0,
    explanationSteps: [
      'File-backed mappings refer to file data source.',
      'Anonymous mappings allocate memory region without file backing.',
      'Sharing/private behavior is controlled by mapping flags.',
    ],
    conceptSummary: 'Backing source and sharing mode are separate mapping dimensions.',
  },
]

const PARENT_CHILD_SHARED_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'shm-parent-child-before-fork',
    kind: 'text',
    prompt: 'When can parent and child share a mapping directly?',
    requiredConcepts: [
      { label: 'Mapping created before fork', keywords: ['before fork', 'create mapping then fork'] },
      { label: 'Shared mapping mode', keywords: ['shared mapping', 'map shared', 'map_shared'] },
    ],
    answerDisplay:
      'Create a shared mapping before fork; child inherits mapping references and can share updates.',
    explanationSteps: [
      'fork duplicates process memory mappings metadata into child.',
      'Shared mapping allows both sides to observe same underlying memory.',
      'Private mapping would not provide that direct shared update behavior.',
    ],
    conceptSummary: 'Pre-fork shared mappings enable parent-child shared-memory communication.',
  },
  {
    id: 'shm-shared-anon-flags',
    kind: 'mcq',
    prompt:
      'Which high-level mmap mode is typical for parent-child shared anonymous region?',
    options: [
      'Anonymous + Shared',
      'Anonymous + Private only',
      'File-backed + Private only',
      'Pipe-backed + Shared',
    ],
    correctOption: 0,
    explanationSteps: [
      'Anonymous removes file dependency.',
      'Shared enables visibility across related processes.',
      'This pattern is common for parent-child shared region after fork.',
    ],
    conceptSummary: 'Parent-child shared anonymous memory uses anonymous+shared mapping mode.',
  },
]

const UNRELATED_PROCESS_SHARED_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'shm-when-shm-open',
    kind: 'text',
    prompt: 'When do we need shm_open() for shared memory?',
    requiredConcepts: [
      { label: 'Unrelated processes', keywords: ['unrelated processes', 'not parent child', 'separate processes'] },
      { label: 'Named shared memory object', keywords: ['named shared memory', 'shm object', 'name'] },
    ],
    answerDisplay:
      'Use shm_open for unrelated processes that need to rendezvous on a named shared memory object.',
    explanationSteps: [
      'Parent-child can often share inherited mappings.',
      'Unrelated processes need a discoverable named IPC object.',
      'shm_open provides that named object entry point.',
    ],
    conceptSummary: 'shm_open is the named shared-memory rendezvous for unrelated processes.',
  },
  {
    id: 'shm-workflow-sequence',
    kind: 'match',
    prompt: 'Match each shared-memory workflow step to purpose.',
    pairs: [
      { left: 'shm_open', right: 'Create/open named shared memory object' },
      { left: 'ftruncate', right: 'Set object size (often initially 0)' },
      { left: 'mmap', right: 'Map object into process address space' },
      { left: 'munmap', right: 'Unmap address region from process' },
      { left: 'shm_unlink', right: 'Remove shared memory object name' },
    ],
    explanationSteps: [
      'Named shared memory setup needs open + size + map steps.',
      'Cleanup has two layers: unmap current process and unlink shared name.',
      'Processes still mapped may continue until they unmap/exit.',
    ],
    conceptSummary: 'Know shm_open → ftruncate → mmap lifecycle and cleanup calls.',
  },
  {
    id: 'shm-ftruncate-why',
    kind: 'text',
    prompt: 'Why is ftruncate() typically needed after shm_open()?',
    requiredConcepts: [
      { label: 'Set size', keywords: ['set size', 'size', 'length'] },
      { label: 'Object often starts at 0', keywords: ['starts at 0', 'initial size zero', 'default size'] },
    ],
    answerDisplay:
      'ftruncate sets shared memory object size, since newly created objects are commonly size 0.',
    explanationSteps: [
      'Mapping length must correspond to object size constraints.',
      'New object without sizing is insufficient for intended data region.',
      'ftruncate establishes usable capacity.',
    ],
    conceptSummary: 'Size configuration is an explicit shared-memory setup step.',
  },
]

const CLEANUP_AND_DETAILS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'shm-unlink-active-users',
    kind: 'mcq',
    prompt:
      'What is true if shm_unlink() is called while other processes still have mapping open?',
    options: [
      'Name is removed; existing mappings can continue until unmapped/closed',
      'All mappings immediately crash and terminate',
      'shm_unlink automatically calls munmap in all processes',
      'Object becomes a FIFO in /tmp',
    ],
    correctOption: 0,
    explanationSteps: [
      'Unlink removes name reference, like removing directory entry conceptually.',
      'Existing users with active references can continue temporarily.',
      'Final cleanup occurs when references are fully gone.',
    ],
    conceptSummary: 'shm_unlink removes name, not instant forced eviction of active mappings.',
  },
  {
    id: 'shm-location',
    kind: 'mcq',
    prompt: 'Where do named shared memory objects typically appear on Linux systems?',
    options: ['/dev/shm', '/proc/self/maps only', '/etc/shm.conf', '/var/log/shm'],
    correctOption: 0,
    explanationSteps: [
      'POSIX shared memory objects are represented under /dev/shm in common Linux setups.',
      'This is an implementation-facing namespace location.',
      'Access still uses shm_open/mmap APIs.',
    ],
    conceptSummary: 'Named shared memory commonly surfaces under /dev/shm.',
  },
]

const MAPPING_COMPARISON_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'shm-vs-pipe-choice',
    kind: 'mcq',
    prompt: 'Which IPC mechanism best fits direct shared mutable data structures?',
    options: [
      'Shared memory mapping',
      'Single anonymous pipe stream only',
      'stdout redirection',
      'PIPE_BUF tuning',
    ],
    correctOption: 0,
    explanationSteps: [
      'Pipes are byte streams for transfer.',
      'Shared memory gives both parties direct access to same region.',
      'Synchronization is still needed to coordinate access.',
    ],
    conceptSummary: 'Shared memory is preferred for shared-structure style IPC.',
  },
]

export function generateMemoryMappingBasicsQuestion(): NetworkingQuestion {
  return randomPick(MEMORY_MAPPING_BASICS_QUESTIONS)
}

export function generateMmapApiQuestion(): NetworkingQuestion {
  return randomPick(MMAP_API_QUESTIONS)
}

export function generateSharedPrivateMappingsQuestion(): NetworkingQuestion {
  return randomPick(SHARED_PRIVATE_TYPES_QUESTIONS)
}

export function generateFileVsAnonymousMappingsQuestion(): NetworkingQuestion {
  return randomPick(FILE_VS_ANONYMOUS_QUESTIONS)
}

export function generateParentChildSharedMemoryQuestion(): NetworkingQuestion {
  return randomPick(PARENT_CHILD_SHARED_QUESTIONS)
}

export function generateUnrelatedSharedMemoryQuestion(): NetworkingQuestion {
  return randomPick(UNRELATED_PROCESS_SHARED_QUESTIONS)
}

export function generateCleanupDetailsQuestion(): NetworkingQuestion {
  return randomPick(CLEANUP_AND_DETAILS_QUESTIONS)
}

export function generateMappingComparisonQuestion(): NetworkingQuestion {
  return randomPick(MAPPING_COMPARISON_QUESTIONS)
}

export const IPC_SHARED_MEMORY_QUESTION_COUNT = 14


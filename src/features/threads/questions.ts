import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const WHAT_IS_A_THREAD_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'threads-definition',
    kind: 'text',
    prompt: 'What is a thread?',
    requiredConcepts: [
      { label: 'Unit of execution', keywords: ['unit of execution', 'execution unit', 'runs instructions'] },
      { label: 'Within a process', keywords: ['inside process', 'within process', 'process'] },
    ],
    answerDisplay: 'A thread is a unit of execution inside a process.',
    explanationSteps: [
      'A process owns resources and address space.',
      'Threads are execution flows that run within that process context.',
      'A process always has at least one thread (main thread).',
    ],
    conceptSummary: 'Thread = execution context; process = resource/address-space container.',
  },
  {
    id: 'threads-main-thread',
    kind: 'mcq',
    prompt: 'Which thread does every process always have?',
    options: [
      'A main thread',
      'A detached worker thread',
      'A kernel-only thread pair',
      'No threads until pthread_create()',
    ],
    correctOption: 0,
    explanationSteps: [
      'Program execution starts with one thread of control.',
      'Additional threads are optional and created explicitly.',
      'So every process has at least the main thread.',
    ],
    conceptSummary: 'Processes start with one main thread by default.',
  },
]

const THREADS_VS_PROCESSES_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'threads-vs-process-memory',
    kind: 'mcq',
    prompt: 'What is the biggest memory-related difference between threads and processes?',
    options: [
      'Threads in one process share address space; separate processes do not',
      'Threads always get separate heaps per thread',
      'Processes always share one global stack',
      'Threads cannot access global variables',
    ],
    correctOption: 0,
    explanationSteps: [
      'Threads in the same process share heap/globals/text.',
      'Different processes normally have separate virtual address spaces.',
      'This is a key speed/safety tradeoff.',
    ],
    conceptSummary: 'Shared address space is the defining memory distinction.',
    comparisonTable: {
      headers: ['Property', 'Threads (same process)', 'Separate Processes'],
      rows: [
        ['Address space', 'Shared', 'Separate'],
        ['Creation overhead', 'Lower', 'Higher'],
        ['Isolation', 'Lower', 'Higher'],
      ],
    },
  },
  {
    id: 'threads-lightweight-why',
    kind: 'text',
    prompt: 'Why are threads often called lightweight compared to processes?',
    requiredConcepts: [
      { label: 'Shared address space/resources', keywords: ['share address space', 'share memory', 'shared resources'] },
      { label: 'Lower overhead/faster create-switch', keywords: ['less overhead', 'lighter', 'faster to create', 'faster context switch'] },
    ],
    answerDisplay:
      'Threads share process resources, so creation and switching typically have less overhead than processes.',
    explanationSteps: [
      'Creating a process usually needs heavier duplication/setup.',
      'Threads reuse the same process memory/resources.',
      'This typically reduces creation and context-switch overhead.',
    ],
    conceptSummary: 'Threads trade isolation for lower overhead.',
  },
]

const SHARED_VS_PER_THREAD_STATE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'threads-shared-vs-private-match',
    kind: 'match',
    prompt: 'Match each item to Shared across threads or Per-thread.',
    pairs: [
      { left: 'Heap', right: 'Shared across threads' },
      { left: 'Global variables', right: 'Shared across threads' },
      { left: 'Code/text segment', right: 'Shared across threads' },
      { left: 'stdout file/resource', right: 'Shared across threads' },
      { left: 'Stack', right: 'Per-thread' },
      { left: 'Registers + program counter', right: 'Per-thread' },
      { left: 'Thread-local errno', right: 'Per-thread' },
    ],
    explanationSteps: [
      'Threads share process-level memory/resources like heap/globals/text/open resources.',
      'Each thread keeps its own execution context (stack, PC, registers).',
      'Thread-local data such as errno is per-thread.',
    ],
    conceptSummary: 'Know exactly what is shared vs private in thread exams.',
  },
  {
    id: 'threads-own-stack',
    kind: 'mcq',
    prompt: 'Does each thread get its own stack or its own heap?',
    options: [
      'Each thread has its own stack; heap is shared in-process',
      'Each thread has its own heap; stack is shared',
      'Both stack and heap are per-thread',
      'Neither stack nor heap is accessible to threads',
    ],
    correctOption: 0,
    explanationSteps: [
      'Stack holds local call frames for one execution flow.',
      'Heap is process memory shared by threads in that process.',
      'This is why stack locals are private but heap objects are shared.',
    ],
    conceptSummary: 'Stack is per-thread, heap is process-shared.',
  },
]

const PTHREAD_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'threads-pthread-create',
    kind: 'mcq',
    prompt: 'Which statement about pthread_create() is true?',
    options: [
      'It creates a new thread, stores thread ID, and starts a function with void* arg',
      'It creates a new process and waits for completion',
      'It blocks until the thread finishes',
      'It only works when called from main thread',
    ],
    correctOption: 0,
    explanationSteps: [
      'pthread_create launches a new thread of execution.',
      'Caller provides start routine and one void* argument.',
      'It returns immediately after creation success/failure.',
    ],
    conceptSummary: 'pthread_create starts a thread; it does not join/wait.',
  },
  {
    id: 'threads-pthread-join',
    kind: 'text',
    prompt: 'What does pthread_join() do?',
    requiredConcepts: [
      { label: 'Waits/blocks', keywords: ['wait', 'blocks', 'waits'] },
      { label: 'For target thread', keywords: ['thread', 'target thread', 'that thread'] },
      { label: 'Until it exits/finishes', keywords: ['finish', 'terminate', 'exit'] },
    ],
    answerDisplay: 'pthread_join waits for a specified thread to finish/terminate.',
    explanationSteps: [
      'pthread_join synchronizes with thread completion.',
      'Caller blocks until target thread exits.',
      'Thread return value can optionally be collected.',
    ],
    conceptSummary: 'create starts; join waits for completion.',
  },
  {
    id: 'threads-pthread-exit-return-detach-self',
    kind: 'match',
    prompt: 'Match each pthread call/behavior to its purpose.',
    pairs: [
      { left: 'pthread_exit()', right: 'Terminates the calling thread' },
      { left: 'return from thread function', right: 'Implicitly exits that thread' },
      { left: 'pthread_self()', right: 'Returns calling thread ID' },
      { left: 'pthread_detach()', right: 'Marks thread as not joinable later' },
    ],
    explanationSteps: [
      'Thread function return acts like thread exit for that thread.',
      'pthread_self identifies current thread.',
      'Detached threads release resources on exit without join.',
    ],
    conceptSummary: 'Know lifecycle API roles: create, self, exit/return, join, detach.',
  },
]

const THREAD_LIFECYCLE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'threads-create-does-not-wait',
    kind: 'mcq',
    prompt: 'True or False: pthread_create() waits for the new thread to finish before returning.',
    options: ['True', 'False'],
    correctOption: 1,
    explanationSteps: [
      'pthread_create starts thread execution and returns quickly.',
      'Waiting behavior is done by pthread_join, not pthread_create.',
      'So parent and new thread can run concurrently after creation.',
    ],
    conceptSummary: 'Thread creation and waiting are separate operations.',
  },
]

const DATA_RACE_AND_NONDETERMINISM_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'threads-plus-plus-not-atomic',
    kind: 'text',
    prompt: 'Why is ++count not atomic with multiple threads?',
    requiredConcepts: [
      { label: 'Read step', keywords: ['read', 'load'] },
      { label: 'Modify/increment step', keywords: ['increment', 'modify', 'add'] },
      { label: 'Write step', keywords: ['write', 'store'] },
      { label: 'Interleaving causes lost updates', keywords: ['interleave', 'lost update', 'overwrite', 'race'] },
    ],
    answerDisplay:
      '++count is read-modify-write, so thread interleavings can overwrite updates (not atomic).',
    explanationSteps: [
      'Increment commonly compiles to separate load/modify/store operations.',
      'Two threads can read same old value before either stores.',
      'One update can overwrite the other, producing wrong counts.',
    ],
    conceptSummary: 'Non-atomic read/modify/write causes data-race outcomes.',
    comparisonTable: {
      headers: ['Operation', 'Thread A', 'Thread B'],
      rows: [
        ['Read count=5', 'Yes', 'Yes'],
        ['Compute next=6', 'Yes', 'Yes'],
        ['Store 6', 'Yes', 'Yes'],
      ],
    },
  },
  {
    id: 'threads-data-race-vs-race-condition',
    kind: 'mcq',
    prompt: 'Which statement best distinguishes data race vs race condition?',
    options: [
      'Data race: unsynchronized concurrent access/update to shared data; race condition: correctness depends on timing/order',
      'They are exactly the same term with no distinction',
      'Data race only happens across processes, not threads',
      'Race condition only refers to mutex deadlock',
    ],
    correctOption: 0,
    explanationSteps: [
      'Data race focuses on conflicting shared-memory access concurrency.',
      'Race condition is broader: result depends on relative timing/order.',
      'Threaded programs often exhibit non-deterministic outcomes due to scheduling.',
    ],
    conceptSummary: 'Data race is a specific shared-data hazard; race condition is the broader timing-dependence concept.',
  },
  {
    id: 'threads-nondeterministic-output',
    kind: 'text',
    prompt: 'Why can the same multithreaded program produce different outputs across runs?',
    requiredConcepts: [
      { label: 'Scheduler/interleaving differences', keywords: ['scheduler', 'interleaving', 'timing', 'order'] },
      { label: 'Concurrent shared-state effects', keywords: ['concurrent', 'shared data', 'race', 'different execution order'] },
    ],
    answerDisplay:
      'Thread scheduling/interleavings vary between runs, so shared-state operations can occur in different orders.',
    explanationSteps: [
      'Thread execution order is not fixed across runs.',
      'Small timing changes alter interleavings.',
      'If program correctness depends on order, outputs can differ.',
    ],
    conceptSummary: 'Thread scheduling makes many outcomes non-deterministic unless synchronized.',
  },
]

export function generateThreadDefinitionQuestion(): NetworkingQuestion {
  return randomPick(WHAT_IS_A_THREAD_QUESTIONS)
}

export function generateThreadVsProcessQuestion(): NetworkingQuestion {
  return randomPick(THREADS_VS_PROCESSES_QUESTIONS)
}

export function generateSharedVsPerThreadQuestion(): NetworkingQuestion {
  return randomPick(SHARED_VS_PER_THREAD_STATE_QUESTIONS)
}

export function generatePthreadBasicsQuestion(): NetworkingQuestion {
  return randomPick(PTHREAD_BASICS_QUESTIONS)
}

export function generateThreadLifecycleQuestion(): NetworkingQuestion {
  return randomPick(THREAD_LIFECYCLE_QUESTIONS)
}

export function generateDataRaceQuestion(): NetworkingQuestion {
  return randomPick(DATA_RACE_AND_NONDETERMINISM_QUESTIONS)
}

export const THREADS_QUESTION_COUNT = 12


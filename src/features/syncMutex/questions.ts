import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const SYNC_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mutex-sync-meaning',
    kind: 'text',
    prompt: 'What does synchronization mean in multithreaded programming?',
    requiredConcepts: [
      { label: 'Coordination between threads', keywords: ['coordinate', 'coordination', 'order threads', 'among threads'] },
      { label: 'Correct shared access/progress', keywords: ['shared data', 'correctness', 'avoid races', 'progress'] },
    ],
    answerDisplay:
      'Synchronization coordinates thread execution so shared data/resource access remains correct.',
    explanationSteps: [
      'Multiple threads can run in overlapping time windows.',
      'Without coordination, accesses can interleave incorrectly.',
      'Synchronization enforces safe ordering/exclusion rules.',
    ],
    conceptSummary: 'Synchronization is about coordinating thread interactions for correctness.',
  },
  {
    id: 'mutex-race-hard-debug',
    kind: 'mcq',
    prompt: 'Why are race bugs often difficult to debug?',
    options: [
      'They may appear only under specific interleavings and timing',
      'They always fail deterministically at startup',
      'The compiler always prevents race bugs',
      'Races only happen with more than 100 threads',
    ],
    correctOption: 0,
    explanationSteps: [
      'Race manifestations depend on timing/scheduling.',
      'A bug can disappear or reappear across runs.',
      'Reasoning must consider multiple thread interleavings.',
    ],
    conceptSummary: 'Races are timing-dependent and often non-deterministic.',
  },
]

const MUTEX_AND_EXCLUSION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mutex-mutual-exclusion-definition',
    kind: 'mcq',
    prompt: 'What does mutual exclusion mean for a mutex-protected region?',
    options: [
      'At most one thread executes that protected region at a time',
      'All threads execute it simultaneously for fairness',
      'Only kernel threads can execute it',
      'Threads skip the region when lock is free',
    ],
    correctOption: 0,
    explanationSteps: [
      'Mutex lock grants exclusive ownership.',
      'Other threads block/continue waiting on the same mutex.',
      'This prevents overlapping critical-region execution.',
    ],
    conceptSummary: 'Mutex enforces one-holder-at-a-time access.',
  },
  {
    id: 'mutex-lock-order-nondeterministic',
    kind: 'mcq',
    prompt: 'When two threads contend for the same mutex, what is guaranteed?',
    options: [
      'Only one holds it at a time, but who acquires first is generally non-deterministic',
      'Lower thread ID always acquires first',
      'Both can hold it if critical section is short',
      'pthread automatically alternates lock ownership perfectly',
    ],
    correctOption: 0,
    explanationSteps: [
      'Mutual exclusion guarantees single ownership.',
      'Scheduler timing determines acquisition order.',
      'Order is typically not deterministic across runs.',
    ],
    conceptSummary: 'Mutex provides exclusion, not deterministic acquisition order.',
  },
]

const CRITICAL_SECTION_AND_ATOMICITY_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mutex-critical-section',
    kind: 'text',
    prompt: 'What is a critical section?',
    requiredConcepts: [
      { label: 'Accesses shared data/resource', keywords: ['shared data', 'shared resource', 'shared variable'] },
      { label: 'Must not run concurrently', keywords: ['one thread at a time', 'not concurrently', 'mutual exclusion'] },
    ],
    answerDisplay:
      'A critical section is code that accesses shared data/resource and must not run concurrently.',
    explanationSteps: [
      'Critical sections are where unsafe interleavings can break correctness.',
      'Synchronization protects these regions.',
      'Goal: one thread at a time for the protected operation.',
    ],
    conceptSummary: 'Protect shared-state code regions from concurrent execution.',
  },
  {
    id: 'mutex-cnt-plus-plus',
    kind: 'mcq',
    prompt: 'Why is `cnt++` dangerous without synchronization in two threads?',
    options: [
      'It is read-modify-write, so updates can interleave and be lost',
      'Increment is always atomic in C',
      'Only decrement can race, not increment',
      'It is safe if both threads run on different cores',
    ],
    correctOption: 0,
    explanationSteps: [
      'Increment is conceptually multiple steps: read, modify, write.',
      'Two threads can read same old value and overwrite each other.',
      'This causes lost updates/data races.',
    ],
    conceptSummary: 'Non-atomic compound operations can race on shared variables.',
    comparisonTable: {
      headers: ['Sub-operation', 'Meaning'],
      rows: [
        ['Read', 'Load shared value'],
        ['Modify', 'Compute incremented value'],
        ['Write', 'Store back shared value'],
      ],
    },
  },
  {
    id: 'mutex-serialization-meaning',
    kind: 'mcq',
    prompt: 'What does serialization mean with mutex locking?',
    options: [
      'Threads take turns through the protected section instead of overlapping',
      'Thread execution order becomes globally fixed forever',
      'Only one thread can exist in the process',
      'Serialized data is written to disk',
    ],
    correctOption: 0,
    explanationSteps: [
      'Locking queues contending threads on a shared critical section.',
      'Protected execution becomes one-at-a-time.',
      'That one-at-a-time behavior is serialized access.',
    ],
    conceptSummary: 'Mutex turns concurrent access into ordered one-at-a-time access.',
  },
]

const LOCK_BEHAVIOR_AND_API_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mutex-api-which-acquires',
    kind: 'mcq',
    prompt: 'Which API call acquires a pthread mutex?',
    options: [
      'pthread_mutex_lock(&m)',
      'pthread_mutex_unlock(&m)',
      'pthread_join(tid, NULL)',
      'pthread_exit(NULL)',
    ],
    correctOption: 0,
    explanationSteps: [
      'lock acquires ownership; unlock releases ownership.',
      'join/exit are thread lifecycle APIs, not mutex acquisition APIs.',
      'Correct lock/unlock pairing is required.',
    ],
    conceptSummary: 'Use pthread_mutex_lock / pthread_mutex_unlock for mutex ownership.',
  },
  {
    id: 'mutex-init-and-blocking',
    kind: 'match',
    prompt: 'Match each mutex-related API/statement to behavior.',
    pairs: [
      {
        left: 'pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER',
        right: 'Static initializer for a mutex object',
      },
      {
        left: 'pthread_mutex_lock(&m) on locked mutex',
        right: 'Blocks until mutex becomes available',
      },
      {
        left: 'pthread_mutex_unlock(&m)',
        right: 'Releases mutex ownership',
      },
      {
        left: 'pthread_mutex_trylock(&m)',
        right: 'Returns immediately if lock is unavailable',
      },
      {
        left: 'pthread_mutex_timedlock(&m, ...)',
        right: 'Waits with timeout limit',
      },
    ],
    explanationSteps: [
      'lock is blocking by default when mutex is held.',
      'trylock/timedlock support non-blocking or bounded waiting style behavior.',
      'unlock makes mutex available to another waiting thread.',
    ],
    conceptSummary: 'Know blocking vs immediate/timeout lock acquisition APIs.',
  },
  {
    id: 'mutex-independent-locks',
    kind: 'mcq',
    prompt:
      'Why might a program use multiple mutexes for independent resources instead of one global mutex?',
    options: [
      'To reduce contention and allow more parallel progress',
      'Because one mutex cannot protect shared state',
      'To make deadlock impossible automatically',
      'Because pthread requires at least two mutexes',
    ],
    correctOption: 0,
    explanationSteps: [
      'One global lock can serialize unrelated work unnecessarily.',
      'Separate locks can protect independent resources concurrently.',
      'This can improve throughput but increases lock-order design complexity.',
    ],
    conceptSummary: 'Lock granularity balances safety and performance/contension.',
  },
]

const THREAD_SAFETY_AND_REENTRANCY_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mutex-thread-safe-vs-reentrant',
    kind: 'mcq',
    prompt: 'Which statement is correct?',
    options: [
      'A function can be thread-safe but not reentrant',
      'Thread-safe always implies reentrant',
      'Reentrant always implies mutex usage',
      'Reentrant means safe only for one thread',
    ],
    correctOption: 0,
    explanationSteps: [
      'Thread-safe means correct under concurrent thread calls.',
      'Reentrant is stricter: safe when interrupted/re-entered before prior call completes.',
      'Mutex-based protection can block re-entry and therefore may be non-reentrant.',
    ],
    conceptSummary: 'Thread safety and reentrancy are related but not identical.',
  },
  {
    id: 'mutex-swap-variants',
    kind: 'match',
    prompt: 'Match each swap helper design to classification.',
    pairs: [
      {
        left: 'Uses global tmp with no lock',
        right: 'Not thread-safe and not reentrant',
      },
      {
        left: 'Uses global tmp protected by mutex',
        right: 'Thread-safe but not reentrant',
      },
      {
        left: 'Uses local tmp on stack',
        right: 'Thread-safe and reentrant (for that concern)',
      },
    ],
    explanationSteps: [
      'Global mutable temp without lock races.',
      'Mutex removes concurrent thread race but re-entry in same thread context can still be problematic.',
      'Local temp removes shared mutable temporary state.',
    ],
    conceptSummary: 'Global mutable state harms safety/reentrancy unless carefully designed.',
  },
  {
    id: 'mutex-caller-allocates',
    kind: 'text',
    prompt: 'How can a caller-allocates style help reentrancy?',
    requiredConcepts: [
      { label: 'Caller provides storage/buffer', keywords: ['caller provides', 'caller allocates', 'passes buffer'] },
      { label: 'Avoid shared global temporary state', keywords: ['avoid global', 'no shared temp', 'no global buffer'] },
    ],
    answerDisplay:
      'Caller-allocates passes storage from the caller, avoiding shared global temp state and improving reentrancy.',
    explanationSteps: [
      'Reentrant functions should avoid static/global mutable intermediates.',
      'If caller provides output/temp storage, each invocation uses separate memory.',
      'This reduces interference across overlapping invocations.',
    ],
    conceptSummary: 'Caller-supplied storage is a common reentrancy technique.',
  },
]

const DEADLOCK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mutex-deadlock-definition',
    kind: 'text',
    prompt: 'What is deadlock?',
    requiredConcepts: [
      { label: 'Waiting forever/no progress', keywords: ['wait forever', 'stuck', 'no progress', 'blocked forever'] },
      { label: 'Hold/wait on resources', keywords: ['holds lock and waits', 'resource held by another', 'circular wait'] },
    ],
    answerDisplay:
      'Deadlock is when threads wait forever for resources held by each other, so progress stops.',
    explanationSteps: [
      'Each participant holds some resource/lock.',
      'Each waits on another resource in a dependency cycle.',
      'No thread can proceed to release what others need.',
    ],
    conceptSummary: 'Deadlock is permanent waiting caused by cyclic resource dependencies.',
  },
  {
    id: 'mutex-deadlock-conditions',
    kind: 'mcq',
    prompt: 'Which list gives the four necessary deadlock conditions?',
    options: [
      'Mutual exclusion, hold-and-wait, no preemption, circular wait',
      'Mutual exclusion, fairness, timeout, circular wait',
      'No preemption, bounded waiting, semaphores, starvation',
      'Race condition, livelock, deadlock, priority inversion',
    ],
    correctOption: 0,
    explanationSteps: [
      'All four conditions must hold for classic deadlock possibility.',
      'Breaking any one condition can prevent deadlock.',
      'Lock-order rules specifically target circular wait.',
    ],
    conceptSummary: 'Deadlock prevention strategy often breaks one necessary condition.',
  },
]

const DEADLOCK_PREVENTION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mutex-prevention-lock-order',
    kind: 'mcq',
    prompt: 'How does acquiring multiple locks in a consistent global order help?',
    options: [
      'It breaks circular wait and prevents one key deadlock condition',
      'It removes mutual exclusion',
      'It guarantees deterministic scheduling',
      'It makes lock operations non-blocking',
    ],
    correctOption: 0,
    explanationSteps: [
      'If all threads follow same lock order, cycles in wait-for graph are avoided.',
      'No cycle means circular wait condition is broken.',
      'Therefore classical deadlock from lock ordering is prevented.',
    ],
    conceptSummary: 'Consistent lock ordering is a practical deadlock-prevention rule.',
  },
  {
    id: 'mutex-prevention-all-at-once',
    kind: 'text',
    prompt:
      'Why can grabbing all required locks at once prevent deadlock in many designs?',
    requiredConcepts: [
      { label: 'Break hold-and-wait', keywords: ['hold and wait', 'break hold', 'no partial hold'] },
      { label: 'No waiting while holding partial resources', keywords: ['all at once', 'atomic acquisition', 'acquire all required locks'] },
    ],
    answerDisplay:
      'Acquiring all needed locks together avoids holding one lock while waiting for another, breaking hold-and-wait.',
    explanationSteps: [
      'Deadlock needs hold-and-wait among its conditions.',
      'If thread cannot hold partial set while waiting, that condition is weakened/broken.',
      'All-at-once acquisition is one prevention pattern.',
    ],
    conceptSummary: 'Prevent partial lock holding while waiting for additional locks.',
  },
]

const LIVELOCK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'mutex-livelock-definition',
    kind: 'text',
    prompt: 'What is livelock, and how is it different from deadlock?',
    requiredConcepts: [
      { label: 'Threads keep running', keywords: ['still running', 'active', 'keep executing'] },
      { label: 'No real progress', keywords: ['no progress', 'not completing', 'stuck behavior'] },
      { label: 'Deadlock is blocked waiting', keywords: ['deadlock blocked', 'waiting forever', 'stopped'] },
    ],
    answerDisplay:
      'Livelock means threads stay active but keep failing to make progress; deadlock is blocked waiting with no execution progress.',
    explanationSteps: [
      'Deadlock: participants are stuck waiting.',
      'Livelock: participants continue changing state/retrying.',
      'Despite activity in livelock, useful work still does not complete.',
    ],
    conceptSummary: 'Deadlock = blocked; livelock = active but futile.',
    comparisonTable: {
      headers: ['Condition', 'Deadlock', 'Livelock'],
      rows: [
        ['Threads active?', 'Usually no (blocked)', 'Yes'],
        ['System progress?', 'No', 'No'],
      ],
    },
  },
  {
    id: 'mutex-identify-pattern',
    kind: 'mcq',
    prompt:
      'Two threads repeatedly detect conflict, release, retry, and collide again forever. Best classification?',
    options: ['Livelock', 'Deadlock', 'Reentrant success', 'Deterministic serialization'],
    correctOption: 0,
    explanationSteps: [
      'Threads are not permanently blocked; they keep reacting/retrying.',
      'But useful forward progress never happens.',
      'That behavior is livelock, not deadlock.',
    ],
    conceptSummary: 'Repeated active retries without progress indicate livelock.',
  },
]

export function generateSyncBasicsQuestion(): NetworkingQuestion {
  return randomPick(SYNC_BASICS_QUESTIONS)
}

export function generateMutexMutualExclusionQuestion(): NetworkingQuestion {
  return randomPick(MUTEX_AND_EXCLUSION_QUESTIONS)
}

export function generateCriticalAtomicityQuestion(): NetworkingQuestion {
  return randomPick(CRITICAL_SECTION_AND_ATOMICITY_QUESTIONS)
}

export function generateLockApiQuestion(): NetworkingQuestion {
  return randomPick(LOCK_BEHAVIOR_AND_API_QUESTIONS)
}

export function generateSafetyReentrancyQuestion(): NetworkingQuestion {
  return randomPick(THREAD_SAFETY_AND_REENTRANCY_QUESTIONS)
}

export function generateDeadlockQuestion(): NetworkingQuestion {
  return randomPick(DEADLOCK_QUESTIONS)
}

export function generateDeadlockPreventionQuestion(): NetworkingQuestion {
  return randomPick(DEADLOCK_PREVENTION_QUESTIONS)
}

export function generateLivelockQuestion(): NetworkingQuestion {
  return randomPick(LIVELOCK_QUESTIONS)
}

export const SYNC_MUTEX_QUESTION_COUNT = 19


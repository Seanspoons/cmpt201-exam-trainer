import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const PRODUCER_CONSUMER_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sp-prod-cons-basics',
    kind: 'mcq',
    prompt: 'What best describes the producer-consumer synchronization pattern?',
    options: [
      'Producers add shared work/data, consumers remove it safely with coordination',
      'One thread always produces and consumes its own private data only',
      'It is only about preventing deadlock with two mutexes',
      'It means all threads must run one at a time',
    ],
    correctOption: 0,
    explanationSteps: [
      'Producer-consumer centers on shared produced-but-not-yet-consumed data.',
      'Multiple threads coordinate access and availability state.',
      'Correctness requires both mutual exclusion and waiting/signaling logic.',
    ],
    conceptSummary: 'Producer-consumer coordinates shared work handoff between producer and consumer roles.',
  },
  {
    id: 'sp-prod-cons-busy-loop-ineff',
    kind: 'mcq',
    prompt:
      'Why is a mutex-only consumer loop like `while (avail == 0) { lock; check; unlock; }` inefficient?',
    code: `while (1) {
  pthread_mutex_lock(&m);
  if (avail > 0) { consume(); avail--; }
  pthread_mutex_unlock(&m);
}`,
    options: [
      'Consumer busy-polls and wastes CPU while waiting for work',
      'pthread_mutex_lock automatically sleeps until avail > 0',
      'Busy loops are fine because mutexes remove all overhead',
      'It is impossible for this to run without deadlock',
    ],
    correctOption: 0,
    explanationSteps: [
      'The loop repeatedly acquires/releases lock even when no work is ready.',
      'This consumes CPU cycles with no useful progress.',
      'Condition variables let waiters sleep efficiently until state changes.',
    ],
    conceptSummary: 'Busy polling is correctable but inefficient; condition variables solve waiting efficiency.',
  },
]

const CONDITION_VARIABLE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sp-condvar-purpose',
    kind: 'text',
    prompt: 'What is the purpose of a condition variable?',
    requiredConcepts: [
      { label: 'Signal state change', keywords: ['signal state change', 'state changed', 'notify condition'] },
      { label: 'Wait/sleep without busy CPU loop', keywords: ['wait', 'sleep', 'block without cpu', 'no busy loop'] },
      { label: 'Used with mutex', keywords: ['with mutex', 'paired with mutex', 'same mutex'] },
    ],
    answerDisplay:
      'A condition variable lets threads sleep until a state change is signaled, typically while coordinating with a mutex.',
    explanationSteps: [
      'A waiter blocks until condition predicate may be true.',
      'A signaler indicates state update.',
      'Mutex protects predicate and shared state around wait/signal.',
    ],
    conceptSummary: 'Condition variables coordinate waiting on state changes efficiently.',
  },
  {
    id: 'sp-condwait-semantics',
    kind: 'mcq',
    prompt: 'What does `pthread_cond_wait(&cond, &m)` do?',
    options: [
      'Atomically releases mutex and waits; on wake, re-acquires mutex before returning',
      'Waits while continuing to hold mutex the whole time',
      'Signals all waiting threads and returns immediately',
      'Creates a new thread to wait on behalf of caller',
    ],
    correctOption: 0,
    explanationSteps: [
      'Release-and-wait is atomic to avoid missed state windows.',
      'After wakeup, function re-acquires mutex before returning.',
      'This preserves safe predicate checks under lock.',
    ],
    conceptSummary: 'cond_wait = atomic unlock+sleep, then re-lock on wake.',
  },
  {
    id: 'sp-cond-signal-vs-broadcast',
    kind: 'match',
    prompt: 'Match condition-variable operation to behavior.',
    pairs: [
      { left: 'pthread_cond_signal', right: 'Wake one waiting thread' },
      { left: 'pthread_cond_broadcast', right: 'Wake all waiting threads' },
      { left: 'Signal when no waiters', right: 'No queued credit; signal is effectively lost' },
      { left: 'Use with one mutex', right: 'Condition and predicate must be protected consistently' },
    ],
    explanationSteps: [
      'signal wakes one waiter, broadcast wakes all.',
      'Condition variables are not counting semaphores; missed waiters do not accumulate credits.',
      'A given condition predicate should be guarded by one consistent mutex.',
    ],
    conceptSummary: 'Choose signal/broadcast based on how many waiters should respond.',
  },
]

const CONDITION_USAGE_RULES_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sp-cond-while-not-if',
    kind: 'text',
    prompt: 'Why should condition waiting use `while` instead of `if` around pthread_cond_wait()?',
    requiredConcepts: [
      { label: 'Must recheck predicate', keywords: ['recheck', 'check again', 'predicate loop', 'while'] },
      { label: 'Another thread may consume/change state first', keywords: ['another thread', 'other consumer', 'state changed', 'consume first'] },
    ],
    answerDisplay:
      'Use while so the predicate is rechecked after wakeup, since another thread may have changed/consumed the state first.',
    explanationSteps: [
      'Wakeup means condition might be true, not guaranteed to remain true.',
      'Other threads can run and change predicate before this thread resumes.',
      'while-loop predicate check preserves correctness.',
    ],
    conceptSummary: 'Condition waits need predicate loops, not one-shot checks.',
  },
  {
    id: 'sp-cond-signal-unlock-order',
    kind: 'mcq',
    prompt:
      'Why is signaling often done after unlocking the mutex in producer-consumer code?',
    options: [
      'To reduce waking a thread that immediately blocks on the same mutex',
      'Because signaling requires mutex to be destroyed first',
      'Because signaling before unlock always loses wakeups',
      'Because cond_signal unlocks the mutex automatically forever',
    ],
    correctOption: 0,
    explanationSteps: [
      'If signaled thread wakes but mutex is still held, it may block right away.',
      'Unlock-then-signal can reduce immediate contention in common patterns.',
      'Key requirement remains correct predicate protection under same mutex.',
    ],
    conceptSummary: 'Unlock-before-signal is a practical contention reduction pattern.',
  },
  {
    id: 'sp-cond-wrong-mutex',
    kind: 'mcq',
    prompt: 'What is wrong with using one condition variable with different mutexes for the same predicate?',
    options: [
      'It breaks consistent predicate protection and can cause incorrect behavior',
      'It improves fairness by design',
      'pthread_cond_wait automatically merges mutexes',
      'It is required for broadcast to work',
    ],
    correctOption: 0,
    explanationSteps: [
      'Predicate and condition must be observed/updated under one consistent lock.',
      'Multiple mutexes for same condition can create race windows.',
      'Correctness depends on shared invariant protection discipline.',
    ],
    conceptSummary: 'Use a condition variable consistently with the mutex guarding its predicate.',
  },
]

const SEMAPHORE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sp-semaphore-definition',
    kind: 'text',
    prompt: 'What is a semaphore?',
    requiredConcepts: [
      { label: 'Count/resource availability', keywords: ['count', 'resource count', 'availability'] },
      { label: 'wait decrements or blocks, post increments', keywords: ['sem_wait', 'sem_post', 'decrement', 'increment', 'blocks at zero'] },
    ],
    answerDisplay:
      'A semaphore is a counting synchronization primitive: wait decrements (or blocks at 0), post increments.',
    explanationSteps: [
      'Semaphore tracks how many units of a resource/event are available.',
      'sem_wait consumes one unit or blocks if none available.',
      'sem_post releases/adds one unit.',
    ],
    conceptSummary: 'Semaphores are count-based synchronization primitives.',
  },
  {
    id: 'sp-semaphore-api-basics',
    kind: 'match',
    prompt: 'Match semaphore API call to behavior.',
    pairs: [
      { left: 'sem_init(&s, ..., n)', right: 'Initialize semaphore count to n' },
      { left: 'sem_wait(&s) with count 0', right: 'Blocks until count becomes positive' },
      { left: 'sem_wait(&s) with count > 0', right: 'Decrements count and continues' },
      { left: 'sem_post(&s)', right: 'Increments count and may wake waiter' },
      { left: 'sem_init(..., 1)', right: 'Acts like basic mutex-style binary availability' },
    ],
    explanationSteps: [
      'Count represents available units/tokens.',
      'wait consumes token; post produces token.',
      'Initial count 1 gives binary-availability behavior similar to basic mutex use.',
    ],
    conceptSummary: 'Know sem_init/sem_wait/sem_post transitions.',
  },
  {
    id: 'sp-semaphore-why-mutex-too',
    kind: 'mcq',
    prompt: 'In bounded-buffer designs, why use semaphore(s) plus a mutex?',
    options: [
      'Semaphores track slot counts; mutex protects actual buffer structure updates',
      'Semaphores already protect structure and counts, mutex is always useless',
      'Mutex tracks counts while semaphores protect pointers only',
      'Both are required only for single-threaded programs',
    ],
    correctOption: 0,
    explanationSteps: [
      'Counting semaphores model availability constraints (full/empty slots).',
      'Mutex serializes critical updates to shared indices/array cells.',
      'Both roles are complementary in classic bounded buffer.',
    ],
    conceptSummary: 'Counts and data-structure integrity are separate synchronization concerns.',
  },
]

const READ_WRITE_LOCK_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sp-rwlock-core',
    kind: 'mcq',
    prompt: 'What concurrency policy does a read-write lock provide?',
    options: [
      'Many readers or one writer',
      'Many writers and many readers simultaneously',
      'Exactly one reader only',
      'No readers while unlocked',
    ],
    correctOption: 0,
    explanationSteps: [
      'Read lock allows shared access among readers when no writer holds lock.',
      'Write lock is exclusive.',
      'Useful in read-heavy workloads.',
    ],
    conceptSummary: 'RW-locks increase reader concurrency while preserving writer exclusivity.',
  },
  {
    id: 'sp-rwlock-api',
    kind: 'match',
    prompt: 'Match read-write lock API to role.',
    pairs: [
      { left: 'pthread_rwlock_rdlock', right: 'Acquire shared read lock' },
      { left: 'pthread_rwlock_wrlock', right: 'Acquire exclusive write lock' },
      { left: 'pthread_rwlock_unlock', right: 'Release held read/write lock' },
    ],
    explanationSteps: [
      'rdlock can coexist with other readers if no writer owns lock.',
      'wrlock excludes all other readers/writers.',
      'unlock releases whichever mode caller holds.',
    ],
    conceptSummary: 'Know rdlock vs wrlock semantics for exam comparisons.',
  },
]

const DINING_PHILOSOPHERS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sp-dining-big-lock',
    kind: 'mcq',
    prompt: 'Why does one big lock solve deadlock in dining philosophers but hurt performance?',
    options: [
      'It removes circular wait but serializes everyone, reducing concurrency',
      'It enables two philosophers to always eat together safely',
      'It prevents starvation and maximizes throughput simultaneously',
      'It allows lock-free fork access',
    ],
    correctOption: 0,
    explanationSteps: [
      'One global lock permits only one philosopher into fork-acquisition logic at once.',
      'No circular wait on per-fork resources can form there.',
      'But parallelism is heavily reduced.',
    ],
    conceptSummary: 'Big-lock approach trades concurrency for simpler deadlock avoidance.',
  },
  {
    id: 'sp-dining-per-fork-deadlock',
    kind: 'text',
    prompt: 'Why can one-lock-per-fork dining philosophers deadlock?',
    requiredConcepts: [
      { label: 'Each holds one and waits for another', keywords: ['hold one fork', 'wait for other fork', 'hold and wait'] },
      { label: 'Circular wait / no progress', keywords: ['circular wait', 'cycle', 'deadlock', 'no progress'] },
    ],
    answerDisplay:
      'If each philosopher grabs one fork and waits for the next, circular wait forms and everyone can deadlock.',
    explanationSteps: [
      'Independent fork locks allow partial acquisition.',
      'All participants can hold one fork simultaneously.',
      'Waiting on neighbors creates a cycle with no progress.',
    ],
    conceptSummary: 'Per-resource locking can deadlock under circular acquisition patterns.',
  },
  {
    id: 'sp-dining-avoidance-options',
    kind: 'mcq',
    prompt:
      'Which approach can break deadlock risk but may introduce livelock/starvation concerns?',
    options: [
      'trylock/retry strategy with backoff-style retries',
      'Always locking left then right identically for everyone',
      'Removing all locks entirely',
      'Replacing forks with one shared global integer',
    ],
    correctOption: 0,
    explanationSteps: [
      'trylock avoids blocking hold-and-wait in some designs.',
      'Repeated retries can cause active no-progress patterns (livelock) or unfairness/starvation.',
      'Design must balance safety and progress/fairness.',
    ],
    conceptSummary: 'Deadlock avoidance strategy can trade into livelock/starvation risk.',
  },
]

const BOUNDED_BUFFER_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sp-bounded-buffer-basics',
    kind: 'mcq',
    prompt: 'What is a bounded (circular) buffer?',
    options: [
      'A fixed-size ring structure where producer/consumer indices wrap around',
      'An unbounded queue that never blocks',
      'A buffer that only supports one producer and zero consumers',
      'A lock-free structure that never needs synchronization',
    ],
    correctOption: 0,
    explanationSteps: [
      'Bounded means finite slot capacity.',
      'Circular/ring indexing wraps to start after end.',
      'Need wait logic when full/empty constraints are hit.',
    ],
    conceptSummary: 'Bounded buffer is finite-capacity producer-consumer queue with wrap-around indices.',
  },
  {
    id: 'sp-bounded-full-empty-rules',
    kind: 'match',
    prompt: 'Match bounded-buffer condition to required behavior.',
    pairs: [
      { left: 'Buffer full', right: 'Producer must wait' },
      { left: 'Buffer empty', right: 'Consumer must wait' },
      { left: 'Item inserted', right: 'filled count increases' },
      { left: 'Item removed', right: 'available/free count increases' },
    ],
    explanationSteps: [
      'Full/empty are capacity-state predicates.',
      'Producer/consumer must block on violating capacity preconditions.',
      'Semaphore counts are natural representation for these capacities.',
    ],
    conceptSummary: 'Correct bounded-buffer logic ties wait behavior to full/empty state.',
  },
  {
    id: 'sp-bounded-semaphore-mutex-why',
    kind: 'text',
    prompt: 'Why is semaphore + mutex an elegant bounded-buffer solution?',
    requiredConcepts: [
      { label: 'Semaphores track filled/free counts', keywords: ['filled', 'available', 'count slots', 'count resources', 'empty/full count'] },
      { label: 'Mutex protects shared indices/data', keywords: ['mutex protects buffer', 'protect shared indices', 'protect data structure'] },
    ],
    answerDisplay:
      'Semaphores model filled/free slot counts, while a mutex protects shared buffer indices and array updates.',
    explanationSteps: [
      'Count constraints (how many can proceed) are separate from structure mutation safety.',
      'Semaphores gate producer/consumer entry by capacity.',
      'Mutex serializes critical updates to ring metadata/data.',
    ],
    conceptSummary: 'Bounded buffer combines counting synchronization with critical-section protection.',
  },
]

export function generateProducerConsumerQuestion(): NetworkingQuestion {
  return randomPick(PRODUCER_CONSUMER_QUESTIONS)
}

export function generateConditionVariableQuestion(): NetworkingQuestion {
  return randomPick(CONDITION_VARIABLE_QUESTIONS)
}

export function generateConditionUsageRulesQuestion(): NetworkingQuestion {
  return randomPick(CONDITION_USAGE_RULES_QUESTIONS)
}

export function generateSemaphoreQuestion(): NetworkingQuestion {
  return randomPick(SEMAPHORE_QUESTIONS)
}

export function generateReadWriteLockQuestion(): NetworkingQuestion {
  return randomPick(READ_WRITE_LOCK_QUESTIONS)
}

export function generateDiningPhilosophersQuestion(): NetworkingQuestion {
  return randomPick(DINING_PHILOSOPHERS_QUESTIONS)
}

export function generateBoundedBufferQuestion(): NetworkingQuestion {
  return randomPick(BOUNDED_BUFFER_QUESTIONS)
}

export const SYNC_PATTERNS_QUESTION_COUNT = 20


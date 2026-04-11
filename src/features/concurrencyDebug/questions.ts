export type ConcurrencyQuestion =
  | {
      id: string
      type: 'mcq'
      prompt: string
      code?: string
      options: string[]
      correctOption: number
      explanation: string
      wrongReasons: string[]
      bugSpot: string
    }
  | {
      id: string
      type: 'short'
      prompt: string
      code?: string
      acceptedPatterns: RegExp[]
      sampleAnswer: string
      explanation: string
      bugSpot: string
    }

export const CONCURRENCY_QUESTIONS: ConcurrencyQuestion[] = [
  {
    id: 'race-counter',
    type: 'mcq',
    prompt: 'What is the main bug in this code?',
    code: `int counter = 0;
void* worker(void*) {
  for (int i = 0; i < 100000; i++) {
    counter++;
  }
  return NULL;
}`,
    options: [
      'Data race on counter causes lost updates',
      'Deadlock due to recursive lock',
      'Thread leak because return NULL is missing',
      'No bug; increment is always atomic in C',
    ],
    correctOption: 0,
    explanation:
      'counter++ is read-modify-write and is not atomic without synchronization. Multiple threads can overwrite each other.',
    wrongReasons: [
      'Correct: this is the actual issue.',
      'No lock is used at all, so this is not a deadlock case.',
      'The function returns correctly; this is unrelated.',
      'False: plain integer increment is not guaranteed atomic.',
    ],
    bugSpot: 'The line `counter++;` inside a shared loop.',
  },
  {
    id: 'deadlock-order',
    type: 'mcq',
    prompt: 'Two threads run these functions. What bug can occur?',
    code: `// Thread A
lock(m1);
lock(m2);

// Thread B
lock(m2);
lock(m1);`,
    options: [
      'Deadlock from opposite lock acquisition order',
      'Starvation caused by condition variable',
      'Race condition due to unlock before lock',
      'No issue because two mutexes are independent',
    ],
    correctOption: 0,
    explanation:
      'If A holds m1 and waits for m2 while B holds m2 and waits for m1, both block forever.',
    wrongReasons: [
      'Correct: lock ordering inversion causes deadlock.',
      'No condition variable is involved.',
      'There is no unlock shown before lock.',
      'They are shared and dependent by acquisition sequence.',
    ],
    bugSpot: 'Opposite ordering: A uses m1->m2, B uses m2->m1.',
  },
  {
    id: 'cond-if',
    type: 'short',
    prompt: 'Is this condition-variable usage thread-safe? Explain the bug concisely.',
    code: `pthread_mutex_lock(&m);
if (count == 0) {
  pthread_cond_wait(&cv, &m);
}
item = buffer[--count];
pthread_mutex_unlock(&m);`,
    acceptedPatterns: [/while/, /spurious|wake/, /recheck|check.*again/],
    sampleAnswer:
      'Use while, not if, around pthread_cond_wait. Wakeups can be spurious or another thread can consume first.',
    explanation:
      'Condition waits must re-check predicate in a loop. A single if can proceed with count==0 after wakeup.',
    bugSpot: 'Using `if (count == 0)` instead of `while (count == 0)`.',
  },
  {
    id: 'semaphore-init',
    type: 'short',
    prompt: 'Semaphore used like a mutex is initialized to 2. What bug can happen?',
    code: `sem_t lock;
sem_init(&lock, 0, 2); // used for critical section`,
    acceptedPatterns: [/two|multiple/, /critical section|mutual exclusion|mutex/, /race/],
    sampleAnswer:
      'It allows 2 threads into the critical section at once, so mutual exclusion is broken and races can occur.',
    explanation:
      'A mutex-like semaphore must start at 1. Value 2 permits concurrent entry.',
    bugSpot: 'Incorrect initialization value in `sem_init(..., 2)`.',
  },
]

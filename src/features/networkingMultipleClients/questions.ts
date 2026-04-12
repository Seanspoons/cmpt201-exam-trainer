import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const ACCEPT_CLIENT_SOCKET_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'accept-return-drill',
    kind: 'text',
    prompt: 'What does accept() return on a TCP server?',
    acceptedAnswers: [
      'a new socket file descriptor for that client connection',
      'a new connected socket for the accepted client',
      'a new file descriptor representing the client socket',
    ],
    answerDisplay: 'A new connected socket/file descriptor for that client.',
    explanationSteps: [
      'The listening socket stays open to accept more clients.',
      'Each accept call returns a new connected socket for one client.',
      'Server performs per-client I/O on the returned connected socket.',
    ],
    conceptSummary: 'accept creates one connected socket per client while listener remains passive.',
  },
  {
    id: 'per-client-socket-usage',
    kind: 'mcq',
    prompt:
      'Why does a server need separate client sockets returned by accept()?',
    options: [
      'To communicate independently with each connected client',
      'Because bind() only works once per process',
      'Because TCP does not allow read() on listening sockets ever',
      'To replace the need for close()',
    ],
    correctOption: 0,
    explanationSteps: [
      'Listening socket is for accepting new connection requests.',
      'Connected sockets carry data for each individual client.',
      'This separation enables multiple concurrent clients.',
    ],
    conceptSummary: 'One listener, many connected client sockets.',
  },
]

const THREAD_PER_CONNECTION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'thread-per-connection-benefit-cost',
    kind: 'mcq',
    prompt:
      'Which server design is easiest to organize but can use more RAM and kernel resources?',
    options: [
      'Thread per connection',
      'Non-blocking busy loop over sockets',
      'epoll-based event loop',
      'Single blocking accept without any client handling',
    ],
    correctOption: 0,
    explanationSteps: [
      'Thread-per-client maps naturally to independent client handlers.',
      'Large client counts mean many stacks/threads and scheduling overhead.',
      'This increases memory and kernel resource use.',
    ],
    conceptSummary: 'Thread-per-connection trades simplicity for resource overhead.',
  },
  {
    id: 'thread-overhead-why',
    kind: 'text',
    prompt: 'Why can thread-per-client servers become expensive at large scale?',
    acceptedAnswers: [
      'many threads increase memory and scheduling overhead',
      'each client thread adds stack memory and context switching cost',
      'too many threads consume kernel resources and cpu time for scheduling',
    ],
    answerDisplay:
      'Many client threads add stack memory usage, scheduler overhead, and context-switch cost.',
    explanationSteps: [
      'Each thread allocates stack and metadata.',
      'Scheduler must manage runnable/waiting threads.',
      'High connection counts can saturate resources before network throughput does.',
    ],
    conceptSummary: 'Thread count growth directly impacts memory and scheduler cost.',
  },
]

const NON_BLOCKING_LOOP_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'nonblocking-wastes-cpu',
    kind: 'mcq',
    prompt:
      'Which server design wastes CPU by repeatedly checking sockets in a loop?',
    options: [
      'Non-blocking I/O loop / polling',
      'Thread per connection',
      'epoll-based event notification',
      'Blocking accept with one client',
    ],
    correctOption: 0,
    explanationSteps: [
      'Busy polling repeatedly checks readiness even when nothing is ready.',
      'Those repeated checks burn CPU cycles.',
      'Event notification models reduce unnecessary work.',
    ],
    conceptSummary: 'Busy-wait polling wastes CPU when no socket is ready.',
  },
  {
    id: 'busy-wait-explain',
    kind: 'text',
    prompt: 'Why does busy polling in a non-blocking loop waste CPU?',
    acceptedAnswers: [
      'the loop repeatedly checks sockets even when no data is ready',
      'it keeps running instead of sleeping and waiting for readiness events',
      'constant polling does work without useful progress',
    ],
    answerDisplay:
      'It repeatedly checks sockets even when no events are ready, doing work without progress.',
    explanationSteps: [
      'Non-blocking calls return quickly instead of sleeping.',
      'A tight loop keeps spinning and re-checking descriptors.',
      'CPU time is spent on repeated checks rather than useful handling.',
    ],
    conceptSummary: 'Polling loops need event mechanisms or sleeps to avoid spin-waste.',
  },
]

const EPOLL_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'epoll-drill',
    kind: 'mcq',
    prompt:
      'Which approach lets the kernel notify the program when monitored sockets are ready?',
    options: ['Thread per connection', 'Non-blocking busy loop', 'epoll / I/O multiplexing', 'Repeated connect() attempts'],
    correctOption: 2,
    explanationSteps: [
      'epoll registers interests in socket readiness events.',
      'epoll_wait blocks until events are available.',
      'Program wakes only when useful I/O work exists.',
    ],
    conceptSummary: 'epoll is event-driven kernel notification for many sockets.',
  },
  {
    id: 'epoll-wait-purpose',
    kind: 'text',
    prompt: 'What is epoll_wait() doing in a multi-client server?',
    acceptedAnswers: [
      'it waits for readiness events on monitored file descriptors',
      'it blocks until registered sockets become ready for io',
      'it returns sockets that are ready after kernel event notification',
    ],
    answerDisplay:
      'It blocks until monitored descriptors are ready, then returns ready events.',
    explanationSteps: [
      'epoll_create creates an event instance.',
      'epoll_ctl registers/modifies interest in descriptors.',
      'epoll_wait returns the set of descriptors that are ready.',
    ],
    conceptSummary: 'epoll_wait is the efficient event gate in event-driven servers.',
  },
]

const TRADEOFF_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'strategy-matching',
    kind: 'match',
    prompt: 'Match each strategy to its common drawback.',
    pairs: [
      {
        left: 'Non-blocking I/O loop',
        right: 'Can waste CPU time by repeated checking',
      },
      {
        left: 'epoll / I/O multiplexing',
        right: 'More complex code and state management',
      },
      {
        left: 'Thread per connection',
        right: 'Higher memory and kernel resource overhead',
      },
    ],
    explanationSteps: [
      'Thread-per-client is conceptually simple but scales resource usage with clients.',
      'Busy polling loops can consume CPU with little useful work.',
      'epoll scales efficiently but requires careful event/state orchestration.',
    ],
    conceptSummary: 'Server strategies differ mainly in complexity vs resource efficiency tradeoff.',
    comparisonTable: {
      headers: ['Strategy', 'Typical Strength', 'Typical Cost'],
      rows: [
        ['Thread per connection', 'Simple per-client flow', 'More memory/scheduler overhead'],
        ['Non-blocking loop', 'Single-thread control', 'CPU waste if busy polling'],
        ['epoll', 'Scales to many sockets efficiently', 'Higher implementation complexity'],
      ],
    },
  },
]

export function generateMultipleClientsAcceptQuestion(): NetworkingQuestion {
  return randomPick(ACCEPT_CLIENT_SOCKET_QUESTIONS)
}

export function generateMultipleClientsThreadQuestion(): NetworkingQuestion {
  return randomPick(THREAD_PER_CONNECTION_QUESTIONS)
}

export function generateMultipleClientsLoopQuestion(): NetworkingQuestion {
  return randomPick(NON_BLOCKING_LOOP_QUESTIONS)
}

export function generateMultipleClientsEpollQuestion(): NetworkingQuestion {
  return randomPick(EPOLL_QUESTIONS)
}

export function generateMultipleClientsTradeoffQuestion(): NetworkingQuestion {
  return randomPick(TRADEOFF_QUESTIONS)
}

import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const ANONYMOUS_PIPE_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'pipes-fd-ends',
    kind: 'mcq',
    prompt: 'After `pipe(filedes)`, which end is read and which is write?',
    options: [
      'filedes[0] is read end, filedes[1] is write end',
      'filedes[0] is write end, filedes[1] is read end',
      'Both ends are bidirectional',
      'Both ends are read-only',
    ],
    correctOption: 0,
    explanationSteps: [
      'pipe() creates two descriptors connected by a kernel buffer.',
      'By convention/API: index 0 reads, index 1 writes.',
      'Data flow is one-way through this single pipe object.',
    ],
    conceptSummary: 'Anonymous pipe endpoints are fixed read/write descriptors.',
  },
  {
    id: 'pipes-unidirectional',
    kind: 'mcq',
    prompt: 'Is one anonymous pipe bidirectional between two processes?',
    options: [
      'No, one pipe is unidirectional byte stream',
      'Yes, both sides can read/write the same single pipe equally',
      'Only on Linux kernels newer than 5.x',
      'Only when PIPE_BUF is large enough',
    ],
    correctOption: 0,
    explanationSteps: [
      'A pipe carries bytes from write end to read end in one direction.',
      'Bidirectional conversation typically uses two separate pipes.',
      'Directionality is fundamental to standard pipe semantics.',
    ],
    conceptSummary: 'Single pipe means one-direction data flow.',
  },
]

const PARENT_CHILD_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'pipes-before-fork',
    kind: 'text',
    prompt: 'Why is `pipe()` usually called before `fork()` for parent-child IPC?',
    requiredConcepts: [
      { label: 'fork copies/inherits FDs', keywords: ['fork copies file descriptors', 'child inherits fd', 'inherit descriptors'] },
      { label: 'both processes share same pipe ends', keywords: ['same pipe', 'both can access', 'shared endpoints'] },
    ],
    answerDisplay:
      'fork inherits descriptor table entries, so both parent and child can access the same pipe ends created before fork.',
    explanationSteps: [
      'pipe creates kernel pipe object and FDs in current process.',
      'fork duplicates descriptor table references into child.',
      'Both processes can then close unused ends and communicate.',
    ],
    conceptSummary: 'Create pipe pre-fork so both parent/child inherit it.',
  },
  {
    id: 'pipes-two-pipes-bidir',
    kind: 'mcq',
    prompt: 'How do parent and child usually implement bidirectional pipe communication?',
    options: [
      'Use two pipes, one for each direction',
      'Use one pipe and alternate read/write mode dynamically',
      'Use mkfifo() on the same anonymous descriptor',
      'Use only dup2() without extra descriptors',
    ],
    correctOption: 0,
    explanationSteps: [
      'Each standard pipe is one-directional.',
      'Two-way request/response needs one channel each way.',
      'Thus two pipes are the common pattern.',
    ],
    conceptSummary: 'Bidirectional pipe IPC generally needs two separate pipes.',
  },
]

const PIPE_SEMANTICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'pipes-byte-stream',
    kind: 'mcq',
    prompt: 'What data model does a pipe provide?',
    options: [
      'Byte stream (no inherent message boundaries)',
      'Structured prioritized messages by default',
      'Key-value map shared between processes',
      'Random-access array with seek',
    ],
    correctOption: 0,
    explanationSteps: [
      'Pipe read/write APIs move bytes, not framed messages.',
      'Applications must define framing/protocol themselves if needed.',
      'Message queues are the IPC mechanism with native message boundaries.',
    ],
    conceptSummary: 'Pipes are stream-oriented, not message-oriented.',
  },
  {
    id: 'pipes-pipebuf-atomicity',
    kind: 'mcq',
    prompt: 'What does PIPE_BUF guarantee (in typical lecture assumptions)?',
    options: [
      'Small writes up to PIPE_BUF are atomic; larger writes may interleave',
      'All writes to a pipe are always atomic regardless of size',
      'Reads are atomic but writes are never atomic',
      'PIPE_BUF controls only open() blocking behavior',
    ],
    correctOption: 0,
    explanationSteps: [
      'Kernel guarantees atomicity for sufficiently small writes.',
      'Larger writes can be split/interleaved across writers.',
      'Atomicity guarantee is size-dependent.',
    ],
    conceptSummary: 'PIPE_BUF describes important write atomicity boundary behavior.',
  },
]

const CLOSING_ENDS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'pipes-close-unused-ends',
    kind: 'mcq',
    prompt: 'Why should each process close pipe ends it does not use?',
    options: [
      'To avoid leaks and ensure EOF/SIGPIPE semantics work correctly',
      'To make pipe become bidirectional',
      'Because open ends reduce PIPE_BUF size to zero',
      'Because close() is required before every read()',
    ],
    correctOption: 0,
    explanationSteps: [
      'Unused descriptors waste resources.',
      'Keeping extra write ends open can prevent readers from seeing EOF.',
      'Descriptor discipline is essential for correct blocking/termination behavior.',
    ],
    conceptSummary: 'Close unused ends for both correctness and resource hygiene.',
  },
  {
    id: 'pipes-eof-sigpipe',
    kind: 'match',
    prompt: 'Match closure scenario to behavior.',
    pairs: [
      { left: 'All write FDs closed (after buffer drained)', right: 'read() returns 0 (EOF)' },
      { left: 'All read FDs closed, writer writes', right: 'Writer gets SIGPIPE (or EPIPE if handled)' },
      { left: 'Extra write FD accidentally left open', right: 'Reader may block waiting for EOF' },
    ],
    explanationSteps: [
      'EOF on pipe read requires no remaining writers.',
      'Writes with no readers trigger broken-pipe behavior.',
      'Leaked FDs frequently cause confusing hangs.',
    ],
    conceptSummary: 'Pipe closure patterns directly determine EOF and SIGPIPE behavior.',
  },
]

const DUP2_REDIR_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'pipes-dup2-stdout',
    kind: 'mcq',
    prompt: 'What does `dup2(filedes[1], STDOUT_FILENO)` do?',
    options: [
      'Redirects standard output to the pipe write end',
      'Redirects standard input from pipe read end',
      'Closes both pipe ends and restores terminal',
      'Converts pipe into named FIFO',
    ],
    correctOption: 0,
    explanationSteps: [
      'dup2 replaces STDOUT descriptor target with filedes[1] target.',
      'Subsequent stdout writes flow into pipe.',
      'Commonly used before exec in pipeline setups.',
    ],
    conceptSummary: 'dup2 remaps standard descriptors onto pipe endpoints.',
  },
  {
    id: 'pipes-dup2-stdin',
    kind: 'mcq',
    prompt: 'What does `dup2(filedes[0], STDIN_FILENO)` do?',
    options: [
      'Redirects standard input to read from pipe read end',
      'Redirects standard output to write to pipe read end',
      'Turns stdin into message queue',
      'Guarantees non-blocking reads on stdin',
    ],
    correctOption: 0,
    explanationSteps: [
      'STDIN now references same kernel object as filedes[0].',
      'Reads from stdin pull bytes from pipe.',
      'This is the typical consumer side of pipeline redirection.',
    ],
    conceptSummary: 'dup2 can feed stdin from a pipe read endpoint.',
  },
]

const FIFO_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'pipes-fifo-vs-anon',
    kind: 'mcq',
    prompt: 'How does a FIFO (named pipe) differ from an anonymous pipe?',
    options: [
      'FIFO has pathname and can connect unrelated processes',
      'FIFO is bidirectional while anonymous pipe is not',
      'FIFO bypasses kernel buffers',
      'FIFO requires no file descriptors',
    ],
    correctOption: 0,
    explanationSteps: [
      'Anonymous pipes are typically inherited in related-process setups.',
      'FIFO exists in filesystem namespace with a name/path.',
      'Unrelated processes can open same FIFO path to communicate.',
    ],
    conceptSummary: 'FIFOs add a named endpoint for unrelated-process pipe-style IPC.',
  },
  {
    id: 'pipes-mkfifo-open-block',
    kind: 'text',
    prompt: 'What does `mkfifo()` do, and why can opening a FIFO block?',
    requiredConcepts: [
      { label: 'Creates named pipe node', keywords: ['create fifo', 'named pipe', 'mkfifo creates'] },
      { label: 'Open blocks until counterpart opens', keywords: ['blocks until other side', 'reader/writer open', 'both sides open'] },
    ],
    answerDisplay:
      'mkfifo creates a named pipe. Opening can block until the corresponding reader/writer side is opened by another process.',
    explanationSteps: [
      'FIFO endpoint is created in filesystem namespace.',
      'Communication still needs both producer/consumer participants.',
      'Open synchronization can block until other side connects.',
    ],
    conceptSummary: 'FIFOs provide named rendezvous behavior for unrelated processes.',
  },
]

const MQ_CONTRAST_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'pipes-mq-contrast',
    kind: 'mcq',
    prompt: 'Why might message queues be preferred over pipes in some designs?',
    options: [
      'They preserve message boundaries and support priorities',
      'They are always faster and lock-free',
      'They require no kernel involvement',
      'They avoid all blocking semantics by default',
    ],
    correctOption: 0,
    explanationSteps: [
      'Pipes expose byte stream semantics with no inherent message framing.',
      'Message queues keep messages discrete and can prioritize delivery.',
      'API goals differ: stream transport vs structured message passing.',
    ],
    conceptSummary: 'Message queues provide structured prioritized messaging unlike raw byte streams.',
  },
  {
    id: 'pipes-vs-shm-contrast',
    kind: 'mcq',
    prompt: 'Which IPC mechanism is best fit for direct shared data structures between processes?',
    options: [
      'Shared memory (mapped region)',
      'Single anonymous pipe only',
      'stderr redirection',
      'PIPE_BUF tuning alone',
    ],
    correctOption: 0,
    explanationSteps: [
      'Pipes are stream transfer channels.',
      'Shared memory lets both processes access same mapped memory directly.',
      'Choice depends on data model and synchronization design.',
    ],
    conceptSummary: 'Use shared memory for direct shared structures; pipes for stream transfer.',
  },
]

export function generateAnonymousPipeQuestion(): NetworkingQuestion {
  return randomPick(ANONYMOUS_PIPE_QUESTIONS)
}

export function generateParentChildPipeQuestion(): NetworkingQuestion {
  return randomPick(PARENT_CHILD_QUESTIONS)
}

export function generatePipeSemanticsQuestion(): NetworkingQuestion {
  return randomPick(PIPE_SEMANTICS_QUESTIONS)
}

export function generateClosingPipeEndsQuestion(): NetworkingQuestion {
  return randomPick(CLOSING_ENDS_QUESTIONS)
}

export function generateDup2RedirectionQuestion(): NetworkingQuestion {
  return randomPick(DUP2_REDIR_QUESTIONS)
}

export function generateFifoQuestion(): NetworkingQuestion {
  return randomPick(FIFO_QUESTIONS)
}

export function generateMqContrastQuestion(): NetworkingQuestion {
  return randomPick(MQ_CONTRAST_QUESTIONS)
}

export const IPC_PIPES_QUESTION_COUNT = 14


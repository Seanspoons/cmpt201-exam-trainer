import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const SIGNAL_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'signals-what-is-signal',
    kind: 'text',
    prompt: 'What is a signal in operating systems?',
    requiredConcepts: [
      { label: 'Notification/message', keywords: ['notification', 'message', 'alert'] },
      { label: 'Kernel/process context', keywords: ['kernel', 'process', 'between processes'] },
    ],
    answerDisplay:
      'A signal is an asynchronous notification delivered to a process by the kernel or another process.',
    explanationSteps: [
      'Signals encode specific events (e.g., interrupt, fault, termination request).',
      'They are delivered asynchronously relative to normal program flow.',
      'Process behavior depends on default action or installed handler.',
    ],
    conceptSummary: 'Signal = asynchronous process notification with defined meaning.',
  },
  {
    id: 'signals-async-meaning',
    kind: 'mcq',
    prompt: 'In signals, what does “asynchronous” mean?',
    options: [
      'Delivery can occur at unpredictable times relative to normal code flow',
      'Signal handlers always run only after main() returns',
      'Signals are delivered only in fixed polling intervals',
      'Signals require synchronous function calls between processes',
    ],
    correctOption: 0,
    explanationSteps: [
      'Signal arrival is not tied to the exact next source line in your program.',
      'Handler may run when process is interrupted by delivery.',
      'This makes reasoning about safe operations important.',
    ],
    conceptSummary: 'Asynchronous means out-of-band relative to sequential control flow.',
  },
]

const ASYNC_COMMUNICATION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'signals-parent-child-notify',
    kind: 'mcq',
    prompt: 'A child process wants to notify its parent of an event quickly. Which mechanism fits this unit best?',
    options: ['kill(parentPid, SIGUSR1) with a parent handler', 'Busy-loop shared file polling', 'printf from child only', 'Reboot the parent process'],
    correctOption: 0,
    explanationSteps: [
      'Signals are lightweight async notifications.',
      'Child can send signal to parent PID with kill().',
      'Parent handles notification in registered signal handler.',
    ],
    conceptSummary: 'Signals are commonly used for async parent/child notifications.',
  },
]

const SIGNAL_HANDLERS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'signals-fill-blank-safe-write',
    kind: 'text',
    prompt: 'Fill in the blank with a signal-safe output call.',
    code: `void handler(int signum) {
  _____(1, "Signal\\n", 7);
}`,
    requiredConcepts: [
      { label: 'write()', keywords: ['write', 'write()'] },
    ],
    answerDisplay: '`write`',
    explanationSteps: [
      'Signal handlers should use async-signal-safe functions.',
      'write is a standard safe option for simple output.',
      'stdio calls like printf are unsafe in handlers.',
    ],
    conceptSummary: 'Code-completion: prefer write in signal handlers.',
  },
  {
    id: 'signals-handler-definition',
    kind: 'text',
    prompt: 'What is a signal handler, and when does it run?',
    requiredConcepts: [
      { label: 'Function', keywords: ['function', 'callback', 'routine'] },
      { label: 'Runs on signal delivery', keywords: ['when signal received', 'signal arrives', 'on delivery'] },
      { label: 'Must be registered', keywords: ['register', 'installed', 'sigaction'] },
    ],
    answerDisplay:
      'A signal handler is a registered function that executes when its signal is delivered.',
    explanationSteps: [
      'Without registration, default signal action applies.',
      'Installed handler replaces default behavior for supported signals.',
      'Handler code must be minimal and signal-safe.',
    ],
    conceptSummary: 'Handlers are registered callbacks triggered by signal delivery.',
  },
  {
    id: 'signals-handler-printf-bug',
    kind: 'mcq',
    prompt: 'What is wrong with this handler?',
    code: `void handler(int signum) {
  printf("Signal received\\n");
}`,
    options: [
      'printf is not async-signal-safe inside a signal handler',
      'Handler must return int, not void',
      'signum must be a global variable',
      'Handlers are only allowed for SIGKILL',
    ],
    correctOption: 0,
    explanationSteps: [
      'Many stdio functions are not safe in signal context.',
      'Reentrancy and internal locks can cause undefined behavior.',
      'Prefer async-signal-safe functions like write().',
    ],
    conceptSummary: 'Classic bug: calling non-signal-safe functions in handlers.',
  },
]

const SIGACTION_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'signals-complete-sa-handler-line',
    kind: 'text',
    prompt: 'Complete the `sigaction` setup line.',
    code: `struct sigaction sa;
sa._____ = handler;`,
    requiredConcepts: [
      { label: 'sa_handler', keywords: ['sa_handler'] },
    ],
    answerDisplay: '`sa_handler`',
    explanationSteps: [
      'sa_handler holds the function pointer callback.',
      'sigaction reads this structure to install behavior.',
      'Correct field selection is key for handler registration.',
    ],
    conceptSummary: 'Signal setup completion: handler pointer goes in sa_handler.',
  },
  {
    id: 'signals-sigaction-purpose',
    kind: 'mcq',
    prompt: 'What is sigaction() primarily used for?',
    options: [
      'Registering/changing how a process handles a signal',
      'Allocating stack for signal handlers',
      'Sending a signal to another process',
      'Masking all signals forever',
    ],
    correctOption: 0,
    explanationSteps: [
      'sigaction configures signal disposition/handler behavior.',
      'It is preferred over older signal() interface for robust control.',
      'It can also control mask and flags during handler execution.',
    ],
    conceptSummary: 'sigaction is the standard API for installing signal handlers.',
  },
  {
    id: 'signals-sigaction-second-arg-type',
    kind: 'text',
    prompt: 'What is the data type of the second argument to sigaction()?',
    requiredConcepts: [
      { label: 'Pointer to struct sigaction', keywords: ['struct sigaction*', 'pointer to struct sigaction', 'sigaction structure pointer'] },
      { label: 'Contains function pointer fields', keywords: ['function pointer', 'handler pointer', 'sa_handler'] },
    ],
    answerDisplay:
      'A pointer to `struct sigaction` (the structure that stores handler function pointer, flags, and mask).',
    explanationSteps: [
      'Prototype uses const struct sigaction *act as second parameter.',
      'act describes new signal action including handler and options.',
      'This is how OS learns which function pointer to invoke.',
    ],
    conceptSummary: 'Key signature detail: second arg is struct sigaction pointer.',
  },
  {
    id: 'signals-sigaction-fields',
    kind: 'match',
    prompt: 'Match each `struct sigaction` field to its role.',
    pairs: [
      { left: 'sa_handler', right: 'Function pointer for signal handler' },
      { left: 'sa_flags', right: 'Behavior flags for signal handling' },
      { left: 'sa_mask', right: 'Signals blocked while handler runs' },
    ],
    explanationSteps: [
      'sa_handler selects handler routine.',
      'sa_flags tweaks delivery/handler semantics.',
      'sa_mask prevents selected signals from interrupting handler region.',
    ],
    conceptSummary: 'Know what each sigaction field controls.',
  },
]

const SENDING_SIGNALS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'signals-kill-vs-raise',
    kind: 'match',
    prompt: 'Match each signal-sending call to its typical target.',
    pairs: [
      { left: 'kill(pid, sig)', right: 'Send signal to target process ID (or process group forms)' },
      { left: 'raise(sig)', right: 'Send signal to calling process itself' },
    ],
    explanationSteps: [
      'kill is a general send API using a PID argument.',
      'raise is shorthand for signaling the current process.',
      'A process can signal itself with either style.',
    ],
    conceptSummary: 'kill targets by PID; raise targets self.',
  },
  {
    id: 'signals-can-self-signal',
    kind: 'mcq',
    prompt: 'Can a process send a signal to itself?',
    options: ['Yes, e.g. with raise() or kill(getpid(), sig)', 'No, only kernel can self-signal process', 'Only for SIGKILL', 'Only if parent approves'],
    correctOption: 0,
    explanationSteps: [
      'Self-signaling is valid and common in tests/control flows.',
      'raise(sig) explicitly targets current process.',
      'kill(getpid(), sig) is also possible.',
    ],
    conceptSummary: 'Processes may signal themselves.',
  },
]

const FUNCTION_POINTER_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'signals-function-pointer-why',
    kind: 'text',
    prompt: 'Why are function pointers used in signal handling APIs?',
    requiredConcepts: [
      { label: 'Store callback handler', keywords: ['callback', 'handler function', 'function pointer'] },
      { label: 'OS/runtime invokes your function', keywords: ['os calls', 'runtime calls', 'invoke handler'] },
    ],
    answerDisplay:
      'Function pointers let you register a handler callback so the OS can invoke your function when the signal arrives.',
    explanationSteps: [
      'API must know which function to execute on delivery.',
      'Function pointer stores executable target address/type.',
      'This decouples event delivery from normal function call path.',
    ],
    conceptSummary: 'Handler registration is callback-style via function pointers.',
  },
]

const SIGNAL_SAFETY_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'signals-safe-vs-unsafe-call',
    kind: 'mcq',
    prompt: 'Which function is generally safe to use directly in a signal handler?',
    options: ['write()', 'printf()', 'malloc()', 'sprintf()'],
    correctOption: 0,
    explanationSteps: [
      'write is async-signal-safe on POSIX safe lists.',
      'stdio and many libc helpers are not safe due to internal state/locks.',
      'Handlers should do minimal, safe work only.',
    ],
    conceptSummary: 'Prefer async-signal-safe operations in handlers.',
  },
  {
    id: 'signals-why-printf-unsafe',
    kind: 'text',
    prompt: 'Why is printf() unsafe inside a signal handler?',
    requiredConcepts: [
      { label: 'Not async-signal-safe', keywords: ['not signal-safe', 'not async-signal-safe', 'unsafe in handler'] },
      { label: 'Internal shared state/locks', keywords: ['internal lock', 'global state', 'reentrancy', 'buffer state'] },
    ],
    answerDisplay:
      'printf is not async-signal-safe; it may use internal shared state/locks and cause undefined behavior if interrupted/re-entered.',
    explanationSteps: [
      'Signal can interrupt code already using stdio internals.',
      'Re-entering non-reentrant stdio path can corrupt state or deadlock.',
      'Use write for minimal handler output instead.',
    ],
    conceptSummary: 'Handler safety is about reentrancy and async-signal-safe API guarantees.',
  },
]

const COMMON_SIGNALS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'signals-common-signal-meanings',
    kind: 'match',
    prompt: 'Match each common signal to a typical meaning.',
    pairs: [
      { left: 'SIGINT', right: 'Interrupt from terminal (e.g., Ctrl+C)' },
      { left: 'SIGKILL', right: 'Immediate termination that cannot be caught/ignored' },
      { left: 'SIGSEGV', right: 'Invalid memory access (segmentation fault)' },
    ],
    explanationSteps: [
      'SIGINT usually comes from interactive terminal interrupt.',
      'SIGKILL forces termination without handler override.',
      'SIGSEGV indicates invalid memory reference at runtime.',
    ],
    conceptSummary: 'Know meanings and constraints of common exam signal names.',
  },
]

export function generateSignalBasicsQuestion(): NetworkingQuestion {
  return randomPick(SIGNAL_BASICS_QUESTIONS)
}

export function generateAsyncCommunicationQuestion(): NetworkingQuestion {
  return randomPick(ASYNC_COMMUNICATION_QUESTIONS)
}

export function generateSignalHandlerQuestion(): NetworkingQuestion {
  return randomPick(SIGNAL_HANDLERS_QUESTIONS)
}

export function generateSigactionQuestion(): NetworkingQuestion {
  return randomPick(SIGACTION_QUESTIONS)
}

export function generateSendingSignalsQuestion(): NetworkingQuestion {
  return randomPick(SENDING_SIGNALS_QUESTIONS)
}

export function generateFunctionPointerSignalQuestion(): NetworkingQuestion {
  return randomPick(FUNCTION_POINTER_QUESTIONS)
}

export function generateSignalSafetyQuestion(): NetworkingQuestion {
  return randomPick(SIGNAL_SAFETY_QUESTIONS)
}

export function generateCommonSignalsQuestion(): NetworkingQuestion {
  return randomPick(COMMON_SIGNALS_QUESTIONS)
}

export const SIGNALS_QUESTION_COUNT = 15

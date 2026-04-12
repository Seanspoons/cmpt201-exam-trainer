import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const WAIT_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'waiterrno-fill-blank-waitpid-status',
    kind: 'text',
    prompt: 'Fill in the blank so waitpid can store child status.',
    code: `int wstatus;
waitpid(pid, _____, 0);`,
    requiredConcepts: [
      { label: '&wstatus', keywords: ['&wstatus', 'wstatus address', '& wstatus'] },
    ],
    answerDisplay: '`&wstatus`',
    explanationSteps: [
      'waitpid expects pointer for output status storage.',
      'Passing value instead of address prevents write-back.',
      'This is a classic output-parameter pattern.',
    ],
    conceptSummary: 'Code-completion: waitpid status argument should be an address.',
  },
  {
    id: 'waiterrno-why-wait',
    kind: 'mcq',
    prompt: 'Why should a parent call wait()/waitpid() after creating children?',
    options: [
      'To reap child status and avoid zombies',
      'To force child to share parent variables',
      'To make child run before parent always',
      'To convert child into thread',
    ],
    correctOption: 0,
    explanationSteps: [
      'Terminated children keep exit metadata until parent reaps it.',
      'wait/waitpid collects that status and releases kernel bookkeeping.',
      'Without it, zombie entries can accumulate.',
    ],
    conceptSummary: 'wait/waitpid provide synchronization + child cleanup.',
  },
  {
    id: 'waiterrno-waitpid-args',
    kind: 'match',
    prompt: 'Match each waitpid argument to its role.',
    pairs: [
      { left: 'pid', right: 'Which child to wait on (or -1 for any child)' },
      { left: '&wstatus', right: 'Output parameter for child status information' },
      { left: 'options', right: 'Behavior flags (e.g., blocking vs WNOHANG)' },
    ],
    explanationSteps: [
      'pid controls selection scope.',
      'wstatus receives termination/state details.',
      'options adjust wait behavior semantics.',
    ],
    conceptSummary: 'Know waitpid(pid, &status, options) parameter responsibilities.',
  },
]

const WSTATUS_OUTPUT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'waiterrno-complete-status-check',
    kind: 'text',
    prompt: 'Complete this normal-exit check with the correct macro.',
    code: `if (_____(wstatus)) {
  printf("exit=%d\\n", WEXITSTATUS(wstatus));
}`,
    requiredConcepts: [
      { label: 'WIFEXITED', keywords: ['wifexited', 'WIFEXITED'] },
    ],
    answerDisplay: '`WIFEXITED`',
    explanationSteps: [
      'Status must be decoded via guard macro first.',
      'WEXITSTATUS is valid only when WIFEXITED is true.',
      'Using extraction macro without guard can be incorrect.',
    ],
    conceptSummary: 'Use WIFEXITED before reading WEXITSTATUS.',
  },
  {
    id: 'waiterrno-why-address-wstatus',
    kind: 'text',
    prompt: 'Why do we pass `&wstatus` to waitpid() instead of just `wstatus`?',
    requiredConcepts: [
      { label: 'Output parameter write-back', keywords: ['output parameter', 'write status', 'store result'] },
      { label: 'Address/pointer required', keywords: ['address', 'pointer', '&wstatus'] },
      { label: 'Child termination info', keywords: ['exit status', 'termination info', 'child status'] },
    ],
    answerDisplay:
      'waitpid needs the address so it can write child termination information back into caller memory.',
    explanationSteps: [
      'C arguments are passed by value.',
      'To mutate caller-visible data, API needs pointer to storage.',
      'wstatus stores encoded child state for macros.',
    ],
    conceptSummary: 'wstatus is classic output-parameter usage.',
  },
  {
    id: 'waiterrno-status-macros',
    kind: 'match',
    prompt: 'Match each status macro to what it checks/extracts.',
    pairs: [
      { left: 'WIFEXITED(status)', right: 'Child terminated normally via exit/return' },
      { left: 'WEXITSTATUS(status)', right: 'Numeric exit code when WIFEXITED is true' },
      { left: 'WIFSIGNALED(status)', right: 'Child terminated due to a signal' },
      { left: 'WTERMSIG(status)', right: 'Signal number that terminated child' },
    ],
    explanationSteps: [
      'First check normal vs signal termination type.',
      'Then extract specific code/signal with corresponding macro.',
      'Using macros avoids bit-level manual decoding mistakes.',
    ],
    conceptSummary: 'Use WIF*/W*STATUS macros as intended sequence.',
  },
]

const CHILD_EXIT_REASONING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'waiterrno-exit-vs-signal',
    kind: 'mcq',
    prompt: 'Which is correct status-handling logic?',
    options: [
      'Check WIFEXITED first, else check WIFSIGNALED and inspect WTERMSIG',
      'Call WEXITSTATUS always without checking anything',
      'Use errno to get child exit code',
      'waitpid return value itself is always child exit code',
    ],
    correctOption: 0,
    explanationSteps: [
      'status field encodes multiple state types.',
      'Macro guards (WIF...) tell which interpretation is valid.',
      'Then extraction macro (WEXITSTATUS/WTERMSIG) is meaningful.',
    ],
    conceptSummary: 'Decode child status in guarded steps, not blindly.',
  },
]

const ZOMBIE_ORPHAN_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'waiterrno-zombie-definition',
    kind: 'text',
    prompt: 'What is a zombie process?',
    requiredConcepts: [
      { label: 'Child already terminated', keywords: ['child terminated', 'finished child', 'dead child'] },
      { label: 'Parent did not wait/reap', keywords: ['parent did not wait', 'not reaped', 'missing wait'] },
    ],
    answerDisplay:
      'A zombie is a terminated child whose parent has not yet waited/reaped its exit status.',
    explanationSteps: [
      'Child execution is over.',
      'Kernel retains minimal status entry for parent collection.',
      'wait/waitpid reaps and removes zombie entry.',
    ],
    conceptSummary: 'Zombie = dead child + unreaped status entry.',
  },
  {
    id: 'waiterrno-orphan-definition',
    kind: 'text',
    prompt: 'What is an orphan process, and what happens on Linux?',
    requiredConcepts: [
      { label: 'Child still running', keywords: ['child still running', 'running child', 'alive child'] },
      { label: 'Parent terminated', keywords: ['parent terminated', 'parent died', 'parent exited'] },
      { label: 'Reparenting to init/system process', keywords: ['reparent', 'init', 'pid 1', 'adopted'] },
    ],
    answerDisplay:
      'An orphan is a still-running child whose parent exited; it is reparented (e.g., to init/PID 1), which can later reap it.',
    explanationSteps: [
      'Orphan is about parent lifetime relationship.',
      'Zombie is about unreaped terminated child status.',
      'Linux reparents orphans to a system process for eventual cleanup handling.',
    ],
    conceptSummary: 'Orphan and zombie are different process states.',
  },
  {
    id: 'waiterrno-zombie-bug-code',
    kind: 'mcq',
    prompt: 'What bug exists here?',
    code: `pid_t rc = fork();
if (rc == 0) {
  _exit(0);
}
sleep(30); // parent never calls wait`,
    options: [
      'Zombie child can remain until parent exits',
      'Creates an orphan immediately',
      'fork always fails here',
      'sleep reaps child automatically',
    ],
    correctOption: 0,
    explanationSteps: [
      'Child exits quickly.',
      'Parent delays and never reaps child during that interval.',
      'Child status remains as zombie until reaped or parent exits.',
    ],
    conceptSummary: 'Missing wait after child exit is common zombie bug.',
  },
  {
    id: 'waiterrno-bug-ignoring-wait',
    kind: 'mcq',
    prompt: 'What is the main bug in this parent path?',
    code: `pid_t pid = fork();
if (pid > 0) {
  // parent does other work forever
  while (1) { /* work */ }
}`,
    options: [
      'Parent never waits/reaps child, so terminated child can become zombie',
      'fork always blocks parent until child exits',
      'Child automatically reaps parent, so no issue',
      'This creates only orphans, never zombies',
    ],
    correctOption: 0,
    explanationSteps: [
      'If child exits and parent never waits, zombie entry can persist.',
      'Long-running parent can accumulate zombie children over time.',
      'Fix: wait/waitpid (or SIGCHLD handling) in parent lifecycle.',
    ],
    conceptSummary: 'Bug-fix pattern: parent must reap children.',
  },
]

const ERRNO_PERROR_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'waiterrno-what-is-errno',
    kind: 'text',
    prompt: 'What is errno and when should you read it?',
    requiredConcepts: [
      { label: 'Integer error code variable', keywords: ['integer', 'error code', 'errno variable'] },
      { label: 'Read after failure', keywords: ['on error', 'after failure', 'when syscall returns -1'] },
      { label: 'Defined in errno.h', keywords: ['errno.h', 'header'] },
    ],
    answerDisplay:
      'errno is an integer error code set on call failure; check it after an error return (e.g., -1), and it is declared via <errno.h>.',
    explanationSteps: [
      'Successful calls should not be interpreted via stale errno.',
      'Always gate errno checks on API-documented failure indicator.',
      'Different error values explain failure reason categories.',
    ],
    conceptSummary: 'errno is meaningful only in proper failure-check flow.',
  },
  {
    id: 'waiterrno-perror-purpose',
    kind: 'mcq',
    prompt: 'What does perror("fork") do after a failed fork()?',
    options: [
      'Prints message prefix and human-readable text for current errno',
      'Retries fork automatically',
      'Returns child PID on success',
      'Clears errno and suppresses logs',
    ],
    correctOption: 0,
    explanationSteps: [
      'perror reads current errno value.',
      'It formats a readable diagnostic with provided prefix.',
      'Useful quick error path instrumentation in systems code.',
    ],
    conceptSummary: 'perror maps errno to readable diagnostics.',
  },
  {
    id: 'waiterrno-fork-failure-pattern',
    kind: 'mcq',
    prompt: 'Which error-handling pattern is correct for fork()?',
    code: `pid_t rc = fork();
if (rc < 0) {
  perror("fork");
  // handle error
}`,
    options: [
      'Check `rc < 0`, then inspect/report errno (e.g., perror)',
      'Ignore return value and check errno first',
      'Call waitpid before checking fork result',
      'If rc==0 then failure occurred',
    ],
    correctOption: 0,
    explanationSteps: [
      'API return value is primary success/failure indicator.',
      'On failure, errno explains reason (e.g., EAGAIN/ENOMEM categories).',
      'Error path should run before child/parent branch logic.',
    ],
    conceptSummary: 'Correct order: check return -> then errno/perror on failure.',
  },
]

export function generateWaitBasicsQuestion(): NetworkingQuestion {
  return randomPick(WAIT_BASICS_QUESTIONS)
}

export function generateWstatusQuestion(): NetworkingQuestion {
  return randomPick(WSTATUS_OUTPUT_QUESTIONS)
}

export function generateChildExitStatusQuestion(): NetworkingQuestion {
  return randomPick(CHILD_EXIT_REASONING_QUESTIONS)
}

export function generateZombieQuestion(): NetworkingQuestion {
  return randomPick(ZOMBIE_ORPHAN_QUESTIONS)
}

export function generateErrnoQuestion(): NetworkingQuestion {
  return randomPick(ERRNO_PERROR_QUESTIONS)
}

export const WAIT_ERRNO_QUESTION_COUNT = 15

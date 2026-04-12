import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const FORK_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'forkexec-fill-blank-fork-call',
    kind: 'text',
    prompt: 'Fill in the blank with the correct process-creation call.',
    code: `pid_t pid = _____();`,
    requiredConcepts: [
      { label: 'fork()', keywords: ['fork', 'fork()'] },
    ],
    answerDisplay: '`fork()`',
    explanationSteps: [
      'fork() creates a child process by cloning current process context.',
      'Return value differs in parent/child and should be checked.',
      'This is the standard process-creation call in this unit.',
    ],
    conceptSummary: 'Fill-blank core API recall: process creation uses fork().',
  },
  {
    id: 'forkexec-fork-return-values',
    kind: 'text',
    prompt: 'What does fork() return in the parent, child, and on failure?',
    requiredConcepts: [
      { label: 'Parent gets child PID', keywords: ['child pid', 'pid of child', 'parent gets pid'] },
      { label: 'Child gets 0', keywords: ['0', 'child gets 0'] },
      { label: 'Failure is -1', keywords: ['-1', 'failure', 'error'] },
    ],
    answerDisplay:
      'Parent gets child PID, child gets 0, and failure returns -1.',
    explanationSteps: [
      'fork clones current process execution context.',
      'Both processes continue from same next instruction.',
      'Return value distinguishes parent vs child branches and errors.',
    ],
    conceptSummary: 'fork is called once but returns twice on success.',
    comparisonTable: {
      headers: ['Context', 'fork() return'],
      rows: [
        ['Parent', 'child PID (>0)'],
        ['Child', '0'],
        ['Error', '-1'],
      ],
    },
  },
  {
    id: 'forkexec-address-space-isolation',
    kind: 'mcq',
    prompt: 'After fork(), which statement about memory is correct?',
    options: [
      'Parent and child have separate address spaces; writes in one do not mutate the other variable copy',
      'Parent and child share one writable stack and heap by default',
      'Pointers in child can directly dereference parent stack frames',
      'Global variables are always synchronized live between parent and child',
    ],
    correctOption: 0,
    explanationSteps: [
      'Each process has its own virtual memory space.',
      'Same variable names/addresses are in separate process spaces.',
      'Mutating one process copy does not alter other process copy.',
    ],
    conceptSummary: 'fork duplicates process image into separate address spaces.',
  },
]

const PARENT_CHILD_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'forkexec-branch-identification',
    kind: 'mcq',
    prompt: 'Given `pid_t rc = fork(); if (rc == 0) {...} else {...}`, which branch runs in child?',
    options: ['`if (rc == 0)` branch', '`else` branch only', 'Neither branch', 'Both branches in each process'],
    correctOption: 0,
    explanationSteps: [
      'Child sees return value 0 from fork.',
      'So condition `rc == 0` is true in child.',
      'Parent sees positive child PID and takes else branch.',
    ],
    conceptSummary: 'Use fork return value to separate parent/child logic.',
  },
  {
    id: 'forkexec-parent-child-output-mix',
    kind: 'mcq',
    prompt: 'Why can parent/child outputs appear in different orders after fork()?',
    options: [
      'They execute independently and scheduler interleaving is non-deterministic',
      'fork forces deterministic parent-first ordering',
      'Child cannot write to terminal after fork',
      'Both outputs are buffered into one fixed sequence by kernel',
    ],
    correctOption: 0,
    explanationSteps: [
      'Two runnable processes compete for CPU scheduling.',
      'Relative ordering of prints can vary between runs.',
      'Counts may be deterministic while ordering is not.',
    ],
    conceptSummary: 'fork tracing often has deterministic count but non-deterministic order.',
  },
]

const PROCESS_COUNT_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'forkexec-process-count-one-fork',
    kind: 'mcq',
    prompt: 'How many processes exist after exactly one successful fork() from one process?',
    options: ['2', '1', '3', '4'],
    correctOption: 0,
    explanationSteps: [
      'Start with one process.',
      'One successful fork creates one additional child.',
      'Total becomes two processes.',
    ],
    conceptSummary: 'Each successful fork doubles participants of that execution path.',
  },
  {
    id: 'forkexec-process-count-two-forks',
    kind: 'mcq',
    prompt: 'How many total processes result from two sequential successful forks (no conditionals)?',
    code: `fork();
fork();`,
    options: ['4', '2', '3', '8'],
    correctOption: 0,
    explanationSteps: [
      'After first fork: 2 processes.',
      'Both execute second fork, each creating one child.',
      'Total = 4 processes.',
    ],
    conceptSummary: 'Sequential fork growth can be exponential.',
  },
  {
    id: 'forkexec-count-prints',
    kind: 'mcq',
    prompt: 'How many times does "X" print?',
    code: `fork();
printf("X\\n");`,
    options: ['2', '1', '4', 'Depends only on PID'],
    correctOption: 0,
    explanationSteps: [
      'fork creates two processes.',
      'Both continue to execute printf line.',
      'So output count is two (order may vary).',
    ],
    conceptSummary: 'Post-fork statements run in both parent and child.',
  },
  {
    id: 'forkexec-fork-bomb-concept',
    kind: 'text',
    prompt: 'Why can repeatedly forking in a loop become dangerous (fork bomb behavior)?',
    requiredConcepts: [
      { label: 'Exponential growth', keywords: ['exponential', 'doubles', 'rapid growth'] },
      { label: 'Resource exhaustion', keywords: ['resources', 'cpu', 'pid table', 'memory', 'system overload'] },
    ],
    answerDisplay:
      'Because process count can grow exponentially, quickly exhausting system resources (CPU, memory, process table).',
    explanationSteps: [
      'Each generation can spawn more children.',
      'Growth accelerates rapidly.',
      'System may become unresponsive due to resource exhaustion.',
    ],
    conceptSummary: 'Unbounded fork loops are operationally dangerous.',
  },
]

const OUTPUT_TRACING_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'forkexec-trace-a-b',
    kind: 'mcq',
    prompt: 'How many times does B print?',
    code: `printf("A\\n");
fork();
printf("B\\n");`,
    options: ['2', '1', '3', '0'],
    correctOption: 0,
    explanationSteps: [
      'A executes before fork so it prints once.',
      'fork creates parent and child.',
      'Both execute B print, so B appears twice.',
    ],
    conceptSummary: 'Pre-fork lines run once; post-fork lines run in both processes.',
  },
  {
    id: 'forkexec-local-variable-trace',
    kind: 'mcq',
    prompt: 'What values can be printed for x?',
    code: `int x = 5;
pid_t rc = fork();
if (rc == 0) {
  x += 1;
  printf("%d\\n", x);
} else {
  x += 2;
  printf("%d\\n", x);
}`,
    options: ['6 and 7', 'Only 8', 'Only 6', 'Only 7'],
    correctOption: 0,
    explanationSteps: [
      'Parent and child each start with their own copy x=5.',
      'Child path prints 6, parent path prints 7.',
      'Ordering may vary, but value set is {6,7}.',
    ],
    conceptSummary: 'Separate address spaces produce independent variable updates.',
  },
]

const EXEC_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'forkexec-fill-blank-exec-call',
    kind: 'text',
    prompt: 'Complete the child branch with an exec-family call.',
    code: `if (pid == 0) {
  _____("/bin/echo", "echo", "Hi", NULL);
  perror("exec failed");
}`,
    requiredConcepts: [
      { label: 'execl()', keywords: ['execl', 'execl()'] },
    ],
    answerDisplay: '`execl` (any valid exec-family call is conceptually acceptable)',
    explanationSteps: [
      'Child commonly calls an exec-family function after fork.',
      'exec success replaces process image and does not return.',
      'perror line is failure-path handling if exec returns.',
    ],
    conceptSummary: 'Fork+exec pattern uses exec-family call in child branch.',
  },
  {
    id: 'forkexec-what-exec-does',
    kind: 'text',
    prompt: 'What does exec() do to the calling process?',
    requiredConcepts: [
      { label: 'Replaces current process image', keywords: ['replace', 'current process', 'process image'] },
      { label: 'Loads new program', keywords: ['new program', 'different executable', 'load executable'] },
      { label: 'No return on success', keywords: ['does not return', 'code after does not run', 'on success no return'] },
    ],
    answerDisplay:
      'exec replaces the current process image with a new program; on success it does not return to old code.',
    explanationSteps: [
      'fork creates a new process; exec transforms an existing process.',
      'Address space/code/data are replaced by target program image.',
      'If exec succeeds, old post-exec lines are never executed.',
    ],
    conceptSummary: 'fork creates; exec replaces.',
  },
  {
    id: 'forkexec-code-after-exec',
    kind: 'mcq',
    prompt: 'Given successful exec call, what happens to code immediately after it?',
    code: `execl("/bin/echo", "echo", "Hi", NULL);
printf("After exec\\n");`,
    options: [
      'It does not run on success',
      'It always runs after child exits',
      'It runs only in parent thread',
      'It runs before /bin/echo',
    ],
    correctOption: 0,
    explanationSteps: [
      'Successful exec never returns to caller image.',
      'Control transfers to new program entry point.',
      'Only failed exec returns (with -1).',
    ],
    conceptSummary: 'Post-exec code is effectively failure-handling path.',
  },
]

const EXEC_FLAVORS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'forkexec-exec-flavors-match',
    kind: 'match',
    prompt: 'Match exec suffix letters to meaning.',
    pairs: [
      { left: 'l', right: 'Arguments passed as list (varargs)' },
      { left: 'v', right: 'Arguments passed as vector/array' },
      { left: 'p', right: 'Search executable in PATH' },
      { left: 'e', right: 'Provide explicit environment array' },
    ],
    explanationSteps: [
      'l vs v decides argument passing style.',
      'p controls PATH search behavior.',
      'e variants supply custom environment.',
    ],
    conceptSummary: 'Remember exec letter semantics for quick API-choice questions.',
  },
  {
    id: 'forkexec-arg0-duplicate',
    kind: 'text',
    prompt: 'Why does `execl("/bin/ls", "ls", "-l", NULL)` include program name again as the first argument string?',
    requiredConcepts: [
      { label: 'arg0 convention', keywords: ['arg0', 'argv[0]', 'first argument'] },
      { label: 'Program name representation', keywords: ['program name', 'process name', 'display name'] },
    ],
    answerDisplay:
      'The second argument becomes argv[0] (arg0), conventionally the program name shown to the new process.',
    explanationSteps: [
      'exec path identifies executable file to load.',
      'Argument list is separate and starts at argv[0].',
      'Convention is argv[0] names the program (often same as command).',
    ],
    conceptSummary: 'Executable path and argv[0] are related but distinct.',
  },
]

const FORK_EXEC_COMBINED_FLOW_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'forkexec-bug-missing-exit-after-exec-fail',
    kind: 'mcq',
    prompt: 'Identify the bug risk in this child path.',
    code: `if (pid == 0) {
  execl("/bin/ls", "ls", NULL);
  perror("exec failed");
  // missing line
}`,
    options: [
      'Child should exit after exec failure to avoid falling through parent-oriented logic',
      'perror must be removed because exec never fails',
      'execl must always be called in parent branch only',
      'No issue; child should continue exactly like parent',
    ],
    correctOption: 0,
    explanationSteps: [
      'If exec fails, child returns to same program image.',
      'Without explicit exit/error return, child may run unintended code paths.',
      'Typical pattern: report error then `_exit(1)` in child.',
    ],
    conceptSummary: 'Common bug: missing child termination on exec failure path.',
  },
  {
    id: 'forkexec-combined-pattern',
    kind: 'mcq',
    prompt: 'In the common pattern `fork(); if(child) exec(...); else parent continues;`, what is true?',
    options: [
      'Child typically becomes new program via exec while parent keeps running original code',
      'Parent and child are both replaced by one exec call in child',
      'exec creates an extra grandchild process',
      'fork waits for exec completion before returning',
    ],
    correctOption: 0,
    explanationSteps: [
      'fork produces parent+child.',
      'exec in child replaces child image only.',
      'Parent retains original image and usually later calls wait/waitpid.',
    ],
    conceptSummary: 'fork+exec pattern separates spawning from program replacement.',
  },
  {
    id: 'forkexec-combined-output-reasoning',
    kind: 'mcq',
    prompt: 'Which output behavior is plausible here?',
    code: `pid_t rc = fork();
if (rc == 0) {
  execl("/bin/echo", "echo", "CHILD", NULL);
  printf("exec failed\\n");
} else {
  printf("PARENT\\n");
}`,
    options: [
      '"PARENT" once and "CHILD" once (order may vary)',
      '"exec failed" always prints after CHILD',
      'Only "PARENT" can print',
      'Both parent and child print "PARENT"',
    ],
    correctOption: 0,
    explanationSteps: [
      'Parent branch prints PARENT once.',
      'Child successful exec runs echo CHILD.',
      'exec failed line executes only if exec returns with error.',
    ],
    conceptSummary: 'Success-path exec suppresses post-exec fallback prints.',
  },
]

export function generateForkBasicsQuestion(): NetworkingQuestion {
  return randomPick(FORK_BASICS_QUESTIONS)
}

export function generateParentChildQuestion(): NetworkingQuestion {
  return randomPick(PARENT_CHILD_QUESTIONS)
}

export function generateProcessCountQuestion(): NetworkingQuestion {
  return randomPick(PROCESS_COUNT_QUESTIONS)
}

export function generateOutputTracingQuestion(): NetworkingQuestion {
  return randomPick(OUTPUT_TRACING_QUESTIONS)
}

export function generateExecBasicsQuestion(): NetworkingQuestion {
  return randomPick(EXEC_BASICS_QUESTIONS)
}

export function generateExecFlavorsQuestion(): NetworkingQuestion {
  return randomPick(EXEC_FLAVORS_QUESTIONS)
}

export function generateForkExecCombinedQuestion(): NetworkingQuestion {
  return randomPick(FORK_EXEC_COMBINED_FLOW_QUESTIONS)
}

export const FORK_EXEC_QUESTION_COUNT = 19

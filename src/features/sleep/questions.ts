import { randomPick } from '../../lib/random'
import type { NetworkingQuestion } from '../networkingShared/networkingDrills'

const PROCESS_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sleep-program-vs-process',
    kind: 'mcq',
    prompt: 'Which statement correctly contrasts a program and a process?',
    options: [
      'A program is executable code on disk; a process is that program running in memory',
      'A process is just source code; a program is runtime state',
      'Program and process always mean exactly the same thing',
      'A process cannot exist without loading all programs in system',
    ],
    correctOption: 0,
    explanationSteps: [
      'Program is static artifact (binary/executable).',
      'Process is dynamic execution instance created by OS.',
      'Each process gets runtime state like memory mappings and registers.',
    ],
    conceptSummary: 'Program = file; process = running instance.',
  },
  {
    id: 'sleep-why-memory-not-disk',
    kind: 'text',
    prompt: 'Why must code be loaded into memory before CPU executes it?',
    requiredConcepts: [
      { label: 'CPU executes from memory', keywords: ['memory', 'ram', 'instructions in memory'] },
      { label: 'Disk is storage not direct execute stream', keywords: ['disk', 'secondary storage', 'load first'] },
    ],
    answerDisplay:
      'CPU fetches instructions from memory, so executable code must be loaded from disk into memory before execution.',
    explanationSteps: [
      'Disk stores program persistently.',
      'Execution fetch/decode happens from mapped memory pages.',
      'OS loader maps code/data into process address space first.',
    ],
    conceptSummary: 'Execution path is memory-centric, not direct disk execution.',
  },
]

const SLEEP_BASICS_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sleep-what-does-sleep-do',
    kind: 'mcq',
    prompt: 'What does sleep() do?',
    options: [
      'Suspends the calling process/thread for at least the specified time',
      'Terminates process after specified time',
      'Yields once and immediately resumes',
      'Creates a child process that waits',
    ],
    correctOption: 0,
    explanationSteps: [
      'sleep is a delay primitive.',
      'Caller blocks/suspends for requested duration (subject to interruption).',
      'Useful for simple timing and polling gaps.',
    ],
    conceptSummary: 'sleep pauses execution; it does not fork or terminate.',
  },
  {
    id: 'sleep-true-false-busy-wait',
    kind: 'mcq',
    prompt: 'True or False: Using sleep() in a waiting loop can reduce CPU waste compared to busy waiting.',
    options: ['True', 'False'],
    correctOption: 0,
    explanationSteps: [
      'Busy loops repeatedly consume CPU cycles while checking condition.',
      'sleep yields execution for a time interval.',
      'This often lowers unnecessary CPU usage in simple waits.',
    ],
    conceptSummary: 'sleep can be an easy CPU-friendly wait strategy.',
  },
]

const MAN_PAGES_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sleep-man-section',
    kind: 'mcq',
    prompt: 'For CMPT 201 syscall/function documentation habits, which section meaning is correct?',
    options: [
      '1=commands, 2=syscalls, 3=library functions',
      '1=syscalls, 2=commands, 3=device files',
      '1=kernel logs, 2=networking, 3=permissions',
      'Section numbers are random and not meaningful',
    ],
    correctOption: 0,
    explanationSteps: [
      'man section number disambiguates topic category.',
      'Section 2 is kernel syscall interface docs.',
      'Section 3 is libc/library routine docs.',
    ],
    conceptSummary: 'Know man sections: 1 commands, 2 syscalls, 3 library calls.',
  },
  {
    id: 'sleep-man-page-learning-flow',
    kind: 'match',
    prompt: 'Match each man-page part to why it matters for learning a new call.',
    pairs: [
      { left: 'Synopsis', right: 'Function signature and required headers' },
      { left: 'Return Value', right: 'Success/error conventions and outputs' },
      { left: 'Errors', right: 'Failure codes and errno cases' },
      { left: 'Description', right: 'Behavior and semantics of the call' },
    ],
    explanationSteps: [
      'Synopsis tells how to call it correctly.',
      'Return/Errors explain how to detect and interpret failures.',
      'Description provides semantic behavior expectations.',
    ],
    conceptSummary: 'Use man pages systematically: signature, semantics, return, errors.',
  },
]

const OUTPUT_POINTER_REVIEW_QUESTIONS: NetworkingQuestion[] = [
  {
    id: 'sleep-output-parameter-pointer',
    kind: 'text',
    prompt: 'Why do output parameters use pointers (e.g., `int *out`) in C APIs?',
    requiredConcepts: [
      { label: 'Write back to caller memory', keywords: ['write back', 'modify caller', 'store result'] },
      { label: 'Pass address', keywords: ['address', 'pointer', 'reference'] },
    ],
    answerDisplay:
      'The function needs the caller’s address so it can write output data back into caller-owned memory.',
    explanationSteps: [
      'C passes arguments by value.',
      'To mutate caller-visible data, pass pointer to that storage.',
      'Many system APIs use this for status/output values.',
    ],
    conceptSummary: 'Output parameters are pointer-based write-back channels.',
  },
]

export function generateSleepProcessBasicsQuestion(): NetworkingQuestion {
  return randomPick(PROCESS_BASICS_QUESTIONS)
}

export function generateSleepBasicsQuestion(): NetworkingQuestion {
  return randomPick(SLEEP_BASICS_QUESTIONS)
}

export function generateSleepManPagesQuestion(): NetworkingQuestion {
  return randomPick(MAN_PAGES_QUESTIONS)
}

export function generateSleepPointerReviewQuestion(): NetworkingQuestion {
  return randomPick(OUTPUT_POINTER_REVIEW_QUESTIONS)
}

export const SLEEP_QUESTION_COUNT = 7

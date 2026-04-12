import { randomPick } from '../../lib/random'

export type SchedulingConceptQuestion =
  | {
      id: string
      type: 'mcq'
      prompt: string
      options: string[]
      correctOption: number
      explanationSteps: string[]
      conceptSummary: string
      comparisonTable?: {
        headers: string[]
        rows: string[][]
      }
    }
  | {
      id: string
      type: 'match'
      prompt: string
      pairs: Array<{ left: string; right: string }>
      explanationSteps: string[]
      conceptSummary: string
      comparisonTable?: {
        headers: string[]
        rows: string[][]
      }
    }

const SCHEDULING_METRICS_QUESTIONS: SchedulingConceptQuestion[] = [
  {
    id: 'fcfs-convoy',
    type: 'mcq',
    prompt:
      'Which FCFS issue occurs when a long CPU-bound job arrives before many short jobs?',
    options: [
      'Convoy effect (short jobs wait behind long job)',
      'Quantum thrashing',
      'Priority inversion',
      'Deadlock cycle',
    ],
    correctOption: 0,
    explanationSteps: [
      'FCFS is non-preemptive and respects arrival order.',
      'A long first job can delay many short jobs behind it.',
      'This inflates average waiting time for later short jobs.',
    ],
    conceptSummary: 'FCFS can suffer convoy effect and poor response for short jobs.',
  },
  {
    id: 'rr-quantum-behavior',
    type: 'mcq',
    prompt: 'What happens when Round Robin quantum is very large?',
    options: [
      'Behavior approaches FCFS',
      'Context switches explode',
      'It becomes equivalent to SRTF',
      'No process can finish',
    ],
    correctOption: 0,
    explanationSteps: [
      'Large quantum means each process often runs to completion in one turn.',
      'Queue rotation becomes infrequent.',
      'Execution resembles FCFS ordering.',
    ],
    conceptSummary: 'RR with very large quantum approximates FCFS.',
  },
  {
    id: 'rr-small-quantum',
    type: 'mcq',
    prompt: 'What is the main drawback of very small Round Robin quantum?',
    options: [
      'High context-switch overhead',
      'No fairness across processes',
      'CPU always idle',
      'Starvation of long jobs only',
    ],
    correctOption: 0,
    explanationSteps: [
      'Tiny quantum causes very frequent preemption.',
      'Each switch adds scheduler/context overhead.',
      'Throughput can drop despite good responsiveness.',
    ],
    conceptSummary: 'Small RR quantum improves responsiveness but increases switching cost.',
  },
  {
    id: 'sjf-advantage',
    type: 'mcq',
    prompt: 'Which algorithm is known for minimizing average waiting time (ideal case)?',
    options: ['SJF', 'FCFS', 'Round Robin', 'Random scheduling'],
    correctOption: 0,
    explanationSteps: [
      'SJF favors shortest jobs first among arrived jobs.',
      'This generally reduces accumulated waiting in ideal workloads.',
      'Its practical challenge is knowing future burst lengths.',
    ],
    conceptSummary: 'SJF gives strong average-wait performance when burst estimates are accurate.',
  },
]

const MULTILEVEL_QUEUE_QUESTIONS: SchedulingConceptQuestion[] = [
  {
    id: 'mlq-definition',
    type: 'mcq',
    prompt: 'What best describes a Multilevel Queue scheduler?',
    options: [
      'Separate ready queues by class/priority with fixed queue assignment',
      'Single queue sorted only by burst time',
      'One thread per process always',
      'Random queue migration each time slice',
    ],
    correctOption: 0,
    explanationSteps: [
      'MLQ partitions processes into multiple ready queues by class.',
      'Each queue may use a different internal policy (for example RR vs FCFS).',
      'Inter-queue scheduling gives higher queues preference.',
    ],
    conceptSummary: 'MLQ uses fixed queue classes and inter-queue priority policy.',
    comparisonTable: {
      headers: ['Queue', 'Example Policy'],
      rows: [
        ['Interactive queue', 'Round Robin, smaller quantum'],
        ['Batch queue', 'FCFS or longer quantum'],
      ],
    },
  },
  {
    id: 'mlq-match',
    type: 'match',
    prompt: 'Match each MLQ idea to its description.',
    pairs: [
      {
        left: 'Multiple queues',
        right: 'Different process classes can have separate policies',
      },
      {
        left: 'Fixed queue assignment',
        right: 'Process typically stays in its designated queue',
      },
      {
        left: 'Inter-queue priority',
        right: 'Higher-priority queues can run before lower ones',
      },
    ],
    explanationSteps: [
      'MLQ separates process classes into distinct queues.',
      'Policies can differ per queue.',
      'Queue-level priority controls CPU distribution.',
    ],
    conceptSummary: 'MLQ design combines class separation with queue-priority arbitration.',
  },
]

const MLFQ_QUESTIONS: SchedulingConceptQuestion[] = [
  {
    id: 'mlfq-core',
    type: 'mcq',
    prompt: 'What is the key behavior of Multilevel Feedback Queue (MLFQ)?',
    options: [
      'Processes can move between queues based on observed behavior',
      'Processes are permanently fixed in one queue',
      'Only one queue exists but with many priorities',
      'No time quantum is used',
    ],
    correctOption: 0,
    explanationSteps: [
      'MLFQ adjusts process priority over time.',
      'CPU-heavy jobs are often demoted; interactive jobs can stay higher.',
      'This improves responsiveness while still making progress on long jobs.',
    ],
    conceptSummary: 'MLFQ is dynamic queue migration based on runtime behavior.',
  },
  {
    id: 'mlfq-cfs-light',
    type: 'mcq',
    prompt: 'Which statement is most aligned with CFS (conceptual light view)?',
    options: [
      'It tracks virtual runtime to approximate fair CPU sharing',
      'It always picks shortest remaining time exactly',
      'It never preempts running tasks',
      'It requires a fixed Round Robin quantum only',
    ],
    correctOption: 0,
    explanationSteps: [
      'CFS models fairness using virtual runtime accounting.',
      'Tasks that ran more tend to get less immediate preference.',
      'It is not the same rule as strict SJF/SRTF.',
    ],
    conceptSummary: 'CFS aims fair CPU time via virtual runtime heuristics.',
  },
  {
    id: 'mlfq-match',
    type: 'match',
    prompt: 'Match each MLFQ behavior to its effect.',
    pairs: [
      {
        left: 'Long CPU bursts',
        right: 'Can move process to lower-priority queue',
      },
      {
        left: 'Interactive short bursts',
        right: 'Can keep process in higher-priority queue',
      },
      {
        left: 'Different queue quantums',
        right: 'Higher queues often get shorter RR quanta',
      },
    ],
    explanationSteps: [
      'MLFQ uses feedback from runtime behavior.',
      'Queue movement is dynamic, unlike fixed MLQ assignment.',
      'Queue-specific RR settings shape responsiveness and throughput.',
    ],
    conceptSummary: 'MLFQ balances responsiveness and fairness through queue feedback rules.',
    comparisonTable: {
      headers: ['Algorithm', 'Queue Movement'],
      rows: [
        ['MLQ', 'Usually fixed assignment'],
        ['MLFQ', 'Dynamic feedback-driven movement'],
      ],
    },
  },
]

export function generateSchedulingMetricsConceptQuestion(): SchedulingConceptQuestion {
  return randomPick(SCHEDULING_METRICS_QUESTIONS)
}

export function generateMultilevelQueueQuestion(): SchedulingConceptQuestion {
  return randomPick(MULTILEVEL_QUEUE_QUESTIONS)
}

export function generateMlfqQuestion(): SchedulingConceptQuestion {
  return randomPick(MLFQ_QUESTIONS)
}

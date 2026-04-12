import { randomInt, randomPick } from '../../lib/random'
import {
  simulateFcfs,
  simulatePriority,
  simulateRoundRobin,
  simulateSjf,
  simulateSrtf,
  type SchedulingAlgorithm,
  type SchedulingProcess,
  type SchedulingSimulation,
} from './engine'

export type SchedulingSimulationQuestion = {
  id: string
  title: string
  algorithm: SchedulingAlgorithm
  processes: SchedulingProcess[]
  quantum?: number
  preemptivePriority?: boolean
  simulation: SchedulingSimulation
  prompt: string
  timelineChoices?: string[]
  correctTimelineChoice?: number
}

function createRandomProcesses(count: number, includePriority = false): SchedulingProcess[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `P${index + 1}`,
    arrivalTime: randomInt(0, 4),
    burstTime: randomInt(1, 6),
    priority: includePriority ? randomInt(1, 5) : undefined,
  }))
}

function ensureArrivalSpread(processes: SchedulingProcess[]): SchedulingProcess[] {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
  if (sorted.every((process) => process.arrivalTime === sorted[0].arrivalTime)) {
    sorted[sorted.length - 1].arrivalTime += 1
  }
  return sorted
}

function asOrderString(simulation: SchedulingSimulation): string {
  return simulation.executionOrder.join(' -> ')
}

function asGanttLabel(simulation: SchedulingSimulation): string {
  return simulation.segments
    .map((segment) => `${segment.pid}[${segment.start}-${segment.end}]`)
    .join(' | ')
}

function buildTimelineChoices(correct: string): { choices: string[]; correctIndex: number } {
  const parts = correct.split(' | ')
  const reverse = [...parts].reverse().join(' | ')
  const shifted =
    parts.length > 2
      ? [parts[1], parts[0], ...parts.slice(2)].join(' | ')
      : parts.join(' | ')

  const choices = [correct, reverse, shifted]
  return {
    choices,
    correctIndex: 0,
  }
}

function createQuestionFromSimulation(
  title: string,
  simulation: SchedulingSimulation,
  quantum?: number,
  preemptivePriority?: boolean,
): SchedulingSimulationQuestion {
  const gantt = asGanttLabel(simulation)
  const timeline = buildTimelineChoices(gantt)
  const processTableSummary = simulation.processes
    .map((process) => {
      const priorityLabel =
        process.priority !== undefined ? `, priority=${process.priority}` : ''
      return `${process.id}(arrival=${process.arrivalTime}, burst=${process.burstTime}${priorityLabel})`
    })
    .join('; ')

  return {
    id: `${simulation.algorithm}-${Date.now()}-${Math.random()}`,
    title,
    algorithm: simulation.algorithm,
    processes: simulation.processes,
    quantum,
    preemptivePriority,
    simulation,
    prompt: `Given processes ${processTableSummary}, determine execution order, total wait time, average wait time, and pick the correct Gantt timeline.`,
    timelineChoices: timeline.choices,
    correctTimelineChoice: timeline.correctIndex,
  }
}

export function generateFcfsQuestion(): SchedulingSimulationQuestion {
  const processes = ensureArrivalSpread(createRandomProcesses(randomPick([3, 4])))
  const simulation = simulateFcfs(processes)
  return createQuestionFromSimulation('FCFS Drill', simulation)
}

export function generateSjfQuestion(): SchedulingSimulationQuestion {
  const processes = ensureArrivalSpread(createRandomProcesses(randomPick([3, 4])))
  const simulation = simulateSjf(processes)
  return createQuestionFromSimulation('SJF Drill', simulation)
}

export function generateSrtfQuestion(): SchedulingSimulationQuestion {
  const processes = ensureArrivalSpread(createRandomProcesses(randomPick([3, 4])))
  const simulation = simulateSrtf(processes)
  return createQuestionFromSimulation('SRTF Drill', simulation)
}

export function generateRoundRobinQuestion(): SchedulingSimulationQuestion {
  const processes = ensureArrivalSpread(createRandomProcesses(randomPick([3, 4])))
  const quantum = randomPick([2, 3])
  const simulation = simulateRoundRobin(processes, quantum)
  return createQuestionFromSimulation('Round Robin Drill', simulation, quantum)
}

export function generatePriorityQuestion(): SchedulingSimulationQuestion {
  const processes = ensureArrivalSpread(createRandomProcesses(randomPick([3, 4]), true))
  const preemptive = randomPick([true, false])
  const simulation = simulatePriority(processes, preemptive)
  return createQuestionFromSimulation(
    preemptive ? 'Priority Drill (Preemptive)' : 'Priority Drill (Non-Preemptive)',
    simulation,
    undefined,
    preemptive,
  )
}

export function buildSchedulingReasoning(
  question: SchedulingSimulationQuestion,
): string[] {
  const steps: string[] = []
  const rule =
    question.algorithm === 'FCFS'
      ? 'Choose earliest-arrived ready process and run to completion.'
      : question.algorithm === 'SJF'
        ? 'Choose shortest burst among arrived processes; run non-preemptively.'
        : question.algorithm === 'SRTF'
          ? 'At each time unit choose process with shortest remaining time (preemptive).'
          : question.algorithm === 'RR'
            ? `Run each ready process for quantum=${question.quantum} and rotate queue.`
            : question.preemptivePriority
              ? 'Choose highest priority ready process (lower number = higher priority), preemptively.'
              : 'Choose highest priority ready process (lower number = higher priority), non-preemptively.'

  steps.push(`Rule: ${rule}`)

  question.simulation.segments.forEach((segment) => {
    if (segment.pid === 'IDLE') {
      steps.push(`Time ${segment.start}-${segment.end}: CPU idle (no arrived ready process).`)
    } else {
      steps.push(
        `Time ${segment.start}-${segment.end}: ${segment.pid} runs by ${question.algorithm} selection rule.`,
      )
    }
  })

  question.simulation.processes.forEach((process) => {
    const metric = question.simulation.metrics[process.id]
    steps.push(
      `${process.id}: wait=${metric.waitTime}, turnaround=${metric.turnaroundTime}, completion=${metric.completionTime}.`,
    )
  })

  return steps
}

export function formatExecutionOrder(simulation: SchedulingSimulation): string {
  return asOrderString(simulation)
}

export function formatGantt(simulation: SchedulingSimulation): string {
  return asGanttLabel(simulation)
}

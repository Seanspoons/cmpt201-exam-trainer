export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'SRTF' | 'RR' | 'PRIORITY'

export type SchedulingProcess = {
  id: string
  arrivalTime: number
  burstTime: number
  priority?: number
}

export type GanttSegment = {
  pid: string
  start: number
  end: number
}

export type ProcessMetrics = {
  completionTime: number
  turnaroundTime: number
  waitTime: number
}

export type SchedulingSimulation = {
  algorithm: SchedulingAlgorithm
  quantum?: number
  preemptivePriority?: boolean
  processes: SchedulingProcess[]
  segments: GanttSegment[]
  metrics: Record<string, ProcessMetrics>
  executionOrder: string[]
  totalWaitTime: number
  averageWaitTime: number
  totalTurnaroundTime: number
  averageTurnaroundTime: number
}

type ProcessState = {
  id: string
  arrivalTime: number
  burstTime: number
  remaining: number
  priority: number
}

function processIdNumber(id: string): number {
  const match = id.match(/\d+/)
  return match ? Number.parseInt(match[0], 10) : Number.MAX_SAFE_INTEGER
}

function tieBreak(a: ProcessState, b: ProcessState): number {
  if (a.arrivalTime !== b.arrivalTime) return a.arrivalTime - b.arrivalTime
  return processIdNumber(a.id) - processIdNumber(b.id)
}

function cloneState(processes: SchedulingProcess[]): ProcessState[] {
  return processes.map((process) => ({
    id: process.id,
    arrivalTime: process.arrivalTime,
    burstTime: process.burstTime,
    remaining: process.burstTime,
    priority: process.priority ?? 3,
  }))
}

function addSegment(segments: GanttSegment[], pid: string, start: number, end: number) {
  if (start === end) return
  const last = segments[segments.length - 1]
  if (last && last.pid === pid && last.end === start) {
    last.end = end
    return
  }
  segments.push({ pid, start, end })
}

function finalizeSimulation(
  algorithm: SchedulingAlgorithm,
  states: ProcessState[],
  segments: GanttSegment[],
  quantum?: number,
  preemptivePriority?: boolean,
): SchedulingSimulation {
  const completionTimeById: Record<string, number> = {}

  states.forEach((state) => {
    let completionTime = 0
    for (let index = segments.length - 1; index >= 0; index -= 1) {
      const segment = segments[index]
      if (segment.pid === state.id) {
        completionTime = segment.end
        break
      }
    }
    completionTimeById[state.id] = completionTime
  })

  const metrics: Record<string, ProcessMetrics> = {}
  let totalWaitTime = 0
  let totalTurnaroundTime = 0

  states.forEach((state) => {
    const completionTime = completionTimeById[state.id]
    const turnaroundTime = completionTime - state.arrivalTime
    const waitTime = turnaroundTime - state.burstTime
    metrics[state.id] = {
      completionTime,
      turnaroundTime,
      waitTime,
    }
    totalWaitTime += waitTime
    totalTurnaroundTime += turnaroundTime
  })

  const executionOrder = segments
    .filter((segment) => segment.pid !== 'IDLE')
    .map((segment) => segment.pid)

  return {
    algorithm,
    quantum,
    preemptivePriority,
    processes: states.map((state) => ({
      id: state.id,
      arrivalTime: state.arrivalTime,
      burstTime: state.burstTime,
      priority: state.priority,
    })),
    segments,
    metrics,
    executionOrder,
    totalWaitTime,
    averageWaitTime: Number((totalWaitTime / states.length).toFixed(2)),
    totalTurnaroundTime,
    averageTurnaroundTime: Number((totalTurnaroundTime / states.length).toFixed(2)),
  }
}

export function simulateFcfs(processes: SchedulingProcess[]): SchedulingSimulation {
  const states = cloneState(processes).sort(tieBreak)
  const segments: GanttSegment[] = []
  let time = 0

  states.forEach((state) => {
    if (time < state.arrivalTime) {
      addSegment(segments, 'IDLE', time, state.arrivalTime)
      time = state.arrivalTime
    }
    addSegment(segments, state.id, time, time + state.burstTime)
    state.remaining = 0
    time += state.burstTime
  })

  return finalizeSimulation('FCFS', states, segments)
}

export function simulateSjf(processes: SchedulingProcess[]): SchedulingSimulation {
  const states = cloneState(processes)
  const segments: GanttSegment[] = []
  let completed = 0
  let time = 0

  while (completed < states.length) {
    const ready = states
      .filter((state) => state.remaining > 0 && state.arrivalTime <= time)
      .sort((a, b) => {
        if (a.burstTime !== b.burstTime) return a.burstTime - b.burstTime
        return tieBreak(a, b)
      })

    if (ready.length === 0) {
      const nextArrival = Math.min(
        ...states.filter((state) => state.remaining > 0).map((state) => state.arrivalTime),
      )
      addSegment(segments, 'IDLE', time, nextArrival)
      time = nextArrival
      continue
    }

    const chosen = ready[0]
    addSegment(segments, chosen.id, time, time + chosen.remaining)
    time += chosen.remaining
    chosen.remaining = 0
    completed += 1
  }

  return finalizeSimulation('SJF', states, segments)
}

export function simulateSrtf(processes: SchedulingProcess[]): SchedulingSimulation {
  const states = cloneState(processes)
  const segments: GanttSegment[] = []
  let completed = 0
  let time = 0

  while (completed < states.length) {
    const ready = states
      .filter((state) => state.remaining > 0 && state.arrivalTime <= time)
      .sort((a, b) => {
        if (a.remaining !== b.remaining) return a.remaining - b.remaining
        return tieBreak(a, b)
      })

    if (ready.length === 0) {
      const nextArrival = Math.min(
        ...states.filter((state) => state.remaining > 0).map((state) => state.arrivalTime),
      )
      addSegment(segments, 'IDLE', time, nextArrival)
      time = nextArrival
      continue
    }

    const chosen = ready[0]
    addSegment(segments, chosen.id, time, time + 1)
    chosen.remaining -= 1
    time += 1
    if (chosen.remaining === 0) {
      completed += 1
    }
  }

  return finalizeSimulation('SRTF', states, segments)
}

export function simulateRoundRobin(
  processes: SchedulingProcess[],
  quantum: number,
): SchedulingSimulation {
  const states = cloneState(processes).sort(tieBreak)
  const segments: GanttSegment[] = []
  const queue: ProcessState[] = []
  let time = 0
  let completed = 0
  let arrivalIndex = 0

  while (completed < states.length) {
    while (arrivalIndex < states.length && states[arrivalIndex].arrivalTime <= time) {
      queue.push(states[arrivalIndex])
      arrivalIndex += 1
    }

    if (queue.length === 0) {
      const nextArrival = states[arrivalIndex]?.arrivalTime ?? time
      addSegment(segments, 'IDLE', time, nextArrival)
      time = nextArrival
      continue
    }

    const current = queue.shift()!
    const runFor = Math.min(quantum, current.remaining)

    for (let tick = 0; tick < runFor; tick += 1) {
      addSegment(segments, current.id, time, time + 1)
      current.remaining -= 1
      time += 1
      while (arrivalIndex < states.length && states[arrivalIndex].arrivalTime <= time) {
        queue.push(states[arrivalIndex])
        arrivalIndex += 1
      }
      if (current.remaining === 0) break
    }

    if (current.remaining === 0) {
      completed += 1
    } else {
      queue.push(current)
    }
  }

  return finalizeSimulation('RR', states, segments, quantum)
}

export function simulatePriority(
  processes: SchedulingProcess[],
  preemptive: boolean,
): SchedulingSimulation {
  const states = cloneState(processes)
  const segments: GanttSegment[] = []
  let completed = 0
  let time = 0

  while (completed < states.length) {
    const ready = states
      .filter((state) => state.remaining > 0 && state.arrivalTime <= time)
      .sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority
        if (preemptive && a.remaining !== b.remaining) return a.remaining - b.remaining
        return tieBreak(a, b)
      })

    if (ready.length === 0) {
      const nextArrival = Math.min(
        ...states.filter((state) => state.remaining > 0).map((state) => state.arrivalTime),
      )
      addSegment(segments, 'IDLE', time, nextArrival)
      time = nextArrival
      continue
    }

    const chosen = ready[0]

    if (preemptive) {
      addSegment(segments, chosen.id, time, time + 1)
      chosen.remaining -= 1
      time += 1
      if (chosen.remaining === 0) completed += 1
    } else {
      addSegment(segments, chosen.id, time, time + chosen.remaining)
      time += chosen.remaining
      chosen.remaining = 0
      completed += 1
    }
  }

  return finalizeSimulation('PRIORITY', states, segments, undefined, preemptive)
}

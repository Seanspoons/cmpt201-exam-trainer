import { UnitScaffold } from '../../components/UnitScaffold'
import { SchedulingConceptPractice } from './SchedulingConceptPractice'
import { SchedulingSimulationPractice } from './SchedulingSimulationPractice'
import {
  generateMlfqQuestion,
  generateMultilevelQueueQuestion,
  generateSchedulingMetricsConceptQuestion,
} from './conceptQuestions'
import {
  generateFcfsQuestion,
  generatePriorityQuestion,
  generateRoundRobinQuestion,
  generateSjfQuestion,
  generateSrtfQuestion,
} from './simulationQuestions'

export function SchedulingUnit() {
  return (
    <UnitScaffold
      unitLabel="Scheduling"
      subtopics={[
        {
          id: 'fcfs',
          label: 'FCFS (First Come First Served)',
          render: () => (
            <SchedulingSimulationPractice
              key="sched-fcfs"
              title="Scheduling > FCFS (First Come First Served)"
              generateQuestion={generateFcfsQuestion}
            />
          ),
        },
        {
          id: 'sjf',
          label: 'SJF (Shortest Job First)',
          render: () => (
            <SchedulingSimulationPractice
              key="sched-sjf"
              title="Scheduling > SJF (non-preemptive)"
              generateQuestion={generateSjfQuestion}
            />
          ),
        },
        {
          id: 'srtf',
          label: 'SRTF (Shortest Remaining Time First)',
          render: () => (
            <SchedulingSimulationPractice
              key="sched-srtf"
              title="Scheduling > SRTF (preemptive)"
              generateQuestion={generateSrtfQuestion}
            />
          ),
        },
        {
          id: 'round-robin',
          label: 'Round Robin',
          render: () => (
            <SchedulingSimulationPractice
              key="sched-rr"
              title="Scheduling > Round Robin"
              generateQuestion={generateRoundRobinQuestion}
            />
          ),
        },
        {
          id: 'priority-scheduling',
          label: 'Priority Scheduling',
          render: () => (
            <SchedulingSimulationPractice
              key="sched-priority"
              title="Scheduling > Priority Scheduling"
              generateQuestion={generatePriorityQuestion}
            />
          ),
        },
        {
          id: 'multilevel-queue',
          label: 'Multilevel Queue (conceptual)',
          render: () => (
            <SchedulingConceptPractice
              key="sched-mlq"
              title="Scheduling > Multilevel Queue"
              generateQuestion={generateMultilevelQueueQuestion}
            />
          ),
        },
        {
          id: 'mlfq',
          label: 'Multilevel Feedback Queue (conceptual)',
          render: () => (
            <SchedulingConceptPractice
              key="sched-mlfq"
              title="Scheduling > Multilevel Feedback Queue"
              generateQuestion={generateMlfqQuestion}
            />
          ),
        },
        {
          id: 'scheduling-metrics',
          label: 'Scheduling Metrics',
          render: () => (
            <SchedulingConceptPractice
              key="sched-metrics"
              title="Scheduling > Scheduling Metrics"
              generateQuestion={generateSchedulingMetricsConceptQuestion}
            />
          ),
        },
      ]}
    />
  )
}

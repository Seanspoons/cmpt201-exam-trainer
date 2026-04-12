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
  generateRandomSchedulingQuestion,
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
          id: 'scheduling-drills',
          label: 'Scheduling Drills',
          render: () => (
            <SchedulingSimulationPractice
              key="sched-drills"
              title="Scheduling > Algorithm Drills"
              generators={{
                random: generateRandomSchedulingQuestion,
                fcfs: generateFcfsQuestion,
                sjf: generateSjfQuestion,
                srtf: generateSrtfQuestion,
                roundRobin: generateRoundRobinQuestion,
                priority: generatePriorityQuestion,
              }}
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

import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateExecBasicsQuestion,
  generateExecFlavorsQuestion,
  generateForkBasicsQuestion,
  generateForkExecCombinedQuestion,
  generateOutputTracingQuestion,
  generateParentChildQuestion,
  generateProcessCountQuestion,
} from './questions'

export function ForkExecUnit() {
  return (
    <UnitScaffold
      unitLabel="fork() and exec()"
      subtopics={[
        {
          id: 'fork-basics',
          label: 'fork() Basics',
          render: () => (
            <NetworkingDrillPractice
              key="fork-exec-fork"
              title="fork() and exec() > fork() Basics"
              generateQuestion={generateForkBasicsQuestion}
            />
          ),
        },
        {
          id: 'parent-vs-child',
          label: 'Parent vs Child',
          render: () => (
            <NetworkingDrillPractice
              key="fork-exec-parent-child"
              title="fork() and exec() > Parent vs Child"
              generateQuestion={generateParentChildQuestion}
            />
          ),
        },
        {
          id: 'process-counting',
          label: 'Process Counting',
          render: () => (
            <NetworkingDrillPractice
              key="fork-exec-counting"
              title="fork() and exec() > Process Counting"
              generateQuestion={generateProcessCountQuestion}
            />
          ),
        },
        {
          id: 'output-tracing',
          label: 'Output Tracing',
          render: () => (
            <NetworkingDrillPractice
              key="fork-exec-output-tracing"
              title="fork() and exec() > Output Tracing"
              generateQuestion={generateOutputTracingQuestion}
            />
          ),
        },
        {
          id: 'exec-basics',
          label: 'exec() Basics',
          render: () => (
            <NetworkingDrillPractice
              key="fork-exec-basics"
              title="fork() and exec() > exec() Basics"
              generateQuestion={generateExecBasicsQuestion}
            />
          ),
        },
        {
          id: 'exec-flavors-args',
          label: 'exec() Flavors and Arguments',
          render: () => (
            <NetworkingDrillPractice
              key="fork-exec-flavors-args"
              title="fork() and exec() > exec() Flavors and Arguments"
              generateQuestion={generateExecFlavorsQuestion}
            />
          ),
        },
        {
          id: 'fork-exec-combined-flow',
          label: 'fork() + exec() Combined Flow',
          render: () => (
            <NetworkingDrillPractice
              key="fork-exec-combined-flow"
              title="fork() and exec() > fork() + exec() Combined Flow"
              generateQuestion={generateForkExecCombinedQuestion}
            />
          ),
        },
      ]}
    />
  )
}

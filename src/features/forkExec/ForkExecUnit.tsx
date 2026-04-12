import { UnitScaffold } from '../../components/UnitScaffold'
import { CodePredictionPractice } from '../codePrediction/CodePredictionPractice'
import {
  generateExecQuestion,
  generateForkQuestion,
} from '../codePrediction/questions'

export function ForkExecUnit() {
  return (
    <UnitScaffold
      unitLabel="fork() and exec()"
      subtopics={[
        {
          id: 'fork-basics',
          label: 'fork basics',
          render: () => (
            <CodePredictionPractice
              key="fork-exec-fork"
              title="fork() and exec() > fork basics"
              generateQuestion={generateForkQuestion}
            />
          ),
        },
        {
          id: 'exec-replacement',
          label: 'exec replacement',
          render: () => (
            <CodePredictionPractice
              key="fork-exec-exec"
              title="fork() and exec() > exec replacement"
              generateQuestion={generateExecQuestion}
            />
          ),
        },
        {
          id: 'fork-exec-patterns',
          label: 'fork + exec patterns',
          render: () => (
            <CodePredictionPractice
              key="fork-exec-patterns"
              title="fork() and exec() > fork + exec patterns"
              generateQuestion={generateExecQuestion}
            />
          ),
        },
      ]}
    />
  )
}

import { UnitScaffold } from '../../components/UnitScaffold'
import { CodePredictionPractice } from '../codePrediction/CodePredictionPractice'
import {
  generateErrnoQuestion,
  generateWaitQuestion,
} from '../codePrediction/questions'

export function WaitErrnoUnit() {
  return (
    <UnitScaffold
      unitLabel="wait() and errno"
      subtopics={[
        {
          id: 'wait-basics',
          label: 'wait basics',
          render: () => (
            <CodePredictionPractice
              key="wait-errno-wait"
              title="wait() and errno > wait basics"
              generateQuestion={generateWaitQuestion}
            />
          ),
        },
        {
          id: 'zombies-and-reaping',
          label: 'zombies and reaping',
          render: () => (
            <CodePredictionPractice
              key="wait-errno-zombies"
              title="wait() and errno > zombies and reaping"
              generateQuestion={generateWaitQuestion}
            />
          ),
        },
        {
          id: 'errno-checking',
          label: 'errno checks',
          render: () => (
            <CodePredictionPractice
              key="wait-errno-errno"
              title="wait() and errno > errno checks"
              generateQuestion={generateErrnoQuestion}
            />
          ),
        },
      ]}
    />
  )
}

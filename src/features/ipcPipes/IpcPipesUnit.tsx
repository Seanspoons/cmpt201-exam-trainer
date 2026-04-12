import { UnitScaffold } from '../../components/UnitScaffold'
import { CodePredictionPractice } from '../codePrediction/CodePredictionPractice'
import { generatePipeQuestion } from '../codePrediction/questions'

export function IpcPipesUnit() {
  return (
    <UnitScaffold
      unitLabel="IPC: Pipes"
      subtopics={[
        {
          id: 'pipes-basic-usage',
          label: 'Basic pipe usage',
          render: () => (
            <CodePredictionPractice
              key="ipc-pipes-basic"
              title="IPC: Pipes > Basic pipe usage"
              generateQuestion={generatePipeQuestion}
            />
          ),
        },
        {
          id: 'pipes-parent-child',
          label: 'Parent/child communication',
          render: () => (
            <CodePredictionPractice
              key="ipc-pipes-parent-child"
              title="IPC: Pipes > Parent/child communication"
              generateQuestion={generatePipeQuestion}
            />
          ),
        },
        {
          id: 'pipes-blocking-close',
          label: 'Blocking and closing ends',
          render: () => (
            <CodePredictionPractice
              key="ipc-pipes-blocking"
              title="IPC: Pipes > Blocking and closing ends"
              generateQuestion={generatePipeQuestion}
            />
          ),
        },
      ]}
    />
  )
}

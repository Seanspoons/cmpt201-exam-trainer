import { UnitScaffold } from '../../components/UnitScaffold'
import { CodePredictionPractice } from '../codePrediction/CodePredictionPractice'
import { generateFileIoQuestion } from '../codePrediction/questions'

export function FileIoUnit() {
  return (
    <UnitScaffold
      unitLabel="File I/O"
      subtopics={[
        {
          id: 'fileio-read-write',
          label: 'read/write',
          plannedDrills: ['Trace byte counts from read/write calls', 'Spot partial read/write handling bugs'],
        },
        {
          id: 'fileio-buffering',
          label: 'buffering',
          render: () => (
            <CodePredictionPractice
              key="file-io-buffering"
              title="File I/O > buffering"
              generateQuestion={generateFileIoQuestion}
            />
          ),
        },
        {
          id: 'fileio-fd-basics',
          label: 'file descriptors',
          plannedDrills: ['Track descriptor ownership across fork', 'Identify descriptor leaks and misuse'],
        },
      ]}
    />
  )
}

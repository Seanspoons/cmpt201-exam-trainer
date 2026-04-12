import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateSleepBasicsQuestion,
  generateSleepManPagesQuestion,
  generateSleepPointerReviewQuestion,
  generateSleepProcessBasicsQuestion,
} from './questions'

export function SleepUnit() {
  return (
    <UnitScaffold
      unitLabel="sleep()"
      subtopics={[
        {
          id: 'sleep-process-basics',
          label: 'Process Basics',
          render: () => (
            <NetworkingDrillPractice
              key="sleep-process-basics"
              title="sleep() > Process Basics"
              generateQuestion={generateSleepProcessBasicsQuestion}
            />
          ),
        },
        {
          id: 'sleep-basics',
          label: 'sleep() Basics',
          render: () => (
            <NetworkingDrillPractice
              key="sleep-basics"
              title="sleep() > sleep() Basics"
              generateQuestion={generateSleepBasicsQuestion}
            />
          ),
        },
        {
          id: 'sleep-man-pages',
          label: 'Using man Pages',
          render: () => (
            <NetworkingDrillPractice
              key="sleep-man-pages"
              title="sleep() > Using man Pages"
              generateQuestion={generateSleepManPagesQuestion}
            />
          ),
        },
        {
          id: 'sleep-output-params',
          label: 'Output Parameters / Pointer Review',
          render: () => (
            <NetworkingDrillPractice
              key="sleep-output-params"
              title="sleep() > Output Parameters / Pointer Review"
              generateQuestion={generateSleepPointerReviewQuestion}
            />
          ),
        },
      ]}
    />
  )
}

import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateChildExitStatusQuestion,
  generateErrnoQuestion,
  generateWaitBasicsQuestion,
  generateWstatusQuestion,
  generateZombieQuestion,
} from './questions'

export function WaitErrnoUnit() {
  return (
    <UnitScaffold
      unitLabel="wait() and errno"
      subtopics={[
        {
          id: 'waitpid-basics',
          label: 'wait() / waitpid() Basics',
          render: () => (
            <NetworkingDrillPractice
              key="wait-errno-wait"
              title="wait() and errno > wait() / waitpid() Basics"
              generateQuestion={generateWaitBasicsQuestion}
            />
          ),
        },
        {
          id: 'wstatus-output-params',
          label: 'wstatus and Output Parameters',
          render: () => (
            <NetworkingDrillPractice
              key="wait-errno-wstatus"
              title="wait() and errno > wstatus and Output Parameters"
              generateQuestion={generateWstatusQuestion}
            />
          ),
        },
        {
          id: 'child-exit-status',
          label: 'Child Exit Status',
          render: () => (
            <NetworkingDrillPractice
              key="wait-errno-child-exit-status"
              title="wait() and errno > Child Exit Status"
              generateQuestion={generateChildExitStatusQuestion}
            />
          ),
        },
        {
          id: 'zombies-orphans',
          label: 'Zombies and Orphans',
          render: () => (
            <NetworkingDrillPractice
              key="wait-errno-zombies-orphans"
              title="wait() and errno > Zombies and Orphans"
              generateQuestion={generateZombieQuestion}
            />
          ),
        },
        {
          id: 'errno-perror-patterns',
          label: 'errno and perror()',
          render: () => (
            <NetworkingDrillPractice
              key="wait-errno-errno-perror"
              title="wait() and errno > errno and perror()"
              generateQuestion={generateErrnoQuestion}
            />
          ),
        },
      ]}
    />
  )
}

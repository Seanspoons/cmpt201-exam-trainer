import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateAnonymousPipeQuestion,
  generateClosingPipeEndsQuestion,
  generateDup2RedirectionQuestion,
  generateFifoQuestion,
  generateMqContrastQuestion,
  generateParentChildPipeQuestion,
  generatePipeSemanticsQuestion,
} from './questions'

export function IpcPipesUnit() {
  return (
    <UnitScaffold
      unitLabel="IPC: Pipes"
      subtopics={[
        {
          id: 'anonymous-pipes',
          label: 'Anonymous Pipes',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-pipes-anonymous"
              title="IPC: Pipes > Anonymous Pipes"
              generateQuestion={generateAnonymousPipeQuestion}
            />
          ),
        },
        {
          id: 'parent-child-communication',
          label: 'Parent/child communication',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-pipes-parent-child"
              title="IPC: Pipes > Parent-Child Communication"
              generateQuestion={generateParentChildPipeQuestion}
            />
          ),
        },
        {
          id: 'pipe-semantics',
          label: 'Pipe Semantics',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-pipes-semantics"
              title="IPC: Pipes > Pipe Semantics"
              generateQuestion={generatePipeSemanticsQuestion}
            />
          ),
        },
        {
          id: 'closing-pipe-ends',
          label: 'Closing Pipe Ends',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-pipes-closing-ends"
              title="IPC: Pipes > Closing Pipe Ends"
              generateQuestion={generateClosingPipeEndsQuestion}
            />
          ),
        },
        {
          id: 'dup2-redirection',
          label: 'dup2() and Redirection',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-pipes-dup2"
              title="IPC: Pipes > dup2() and Redirection"
              generateQuestion={generateDup2RedirectionQuestion}
            />
          ),
        },
        {
          id: 'fifo-named-pipes',
          label: 'FIFOs (Named Pipes)',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-pipes-fifo"
              title="IPC: Pipes > FIFOs (Named Pipes)"
              generateQuestion={generateFifoQuestion}
            />
          ),
        },
        {
          id: 'message-queue-contrast',
          label: 'Message Queues (Conceptual Contrast)',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-pipes-mq-contrast"
              title="IPC: Pipes > Message Queue Contrast"
              generateQuestion={generateMqContrastQuestion}
            />
          ),
        },
      ]}
    />
  )
}

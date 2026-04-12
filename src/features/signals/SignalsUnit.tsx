import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateAsyncCommunicationQuestion,
  generateCommonSignalsQuestion,
  generateFunctionPointerSignalQuestion,
  generateSendingSignalsQuestion,
  generateSigactionQuestion,
  generateSignalBasicsQuestion,
  generateSignalHandlerQuestion,
  generateSignalSafetyQuestion,
} from './questions'

export function SignalsUnit() {
  return (
    <UnitScaffold
      unitLabel="Signals"
      subtopics={[
        {
          id: 'signals-basics',
          label: 'Signal Basics',
          render: () => (
            <NetworkingDrillPractice
              key="signals-basics"
              title="Signals > Signal Basics"
              generateQuestion={generateSignalBasicsQuestion}
            />
          ),
        },
        {
          id: 'signals-async-communication',
          label: 'Asynchronous Communication',
          render: () => (
            <NetworkingDrillPractice
              key="signals-async-communication"
              title="Signals > Asynchronous Communication"
              generateQuestion={generateAsyncCommunicationQuestion}
            />
          ),
        },
        {
          id: 'signals-handlers',
          label: 'Signal Handlers',
          render: () => (
            <NetworkingDrillPractice
              key="signals-handlers"
              title="Signals > Signal Handlers"
              generateQuestion={generateSignalHandlerQuestion}
            />
          ),
        },
        {
          id: 'signals-sigaction',
          label: 'sigaction()',
          render: () => (
            <NetworkingDrillPractice
              key="signals-sigaction"
              title="Signals > sigaction()"
              generateQuestion={generateSigactionQuestion}
            />
          ),
        },
        {
          id: 'signals-sending',
          label: 'Sending Signals (kill / raise)',
          render: () => (
            <NetworkingDrillPractice
              key="signals-sending"
              title="Signals > Sending Signals (kill / raise)"
              generateQuestion={generateSendingSignalsQuestion}
            />
          ),
        },
        {
          id: 'signals-function-pointers',
          label: 'Function Pointers (for handlers)',
          render: () => (
            <NetworkingDrillPractice
              key="signals-function-pointers"
              title="Signals > Function Pointers (for handlers)"
              generateQuestion={generateFunctionPointerSignalQuestion}
            />
          ),
        },
        {
          id: 'signals-safety',
          label: 'Signal Safety',
          render: () => (
            <NetworkingDrillPractice
              key="signals-safety"
              title="Signals > Signal Safety"
              generateQuestion={generateSignalSafetyQuestion}
            />
          ),
        },
        {
          id: 'signals-common',
          label: 'Common Signals',
          render: () => (
            <NetworkingDrillPractice
              key="signals-common"
              title="Signals > Common Signals"
              generateQuestion={generateCommonSignalsQuestion}
            />
          ),
        },
      ]}
    />
  )
}

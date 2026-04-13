import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import { generateIpcNetworkingMixedQuestion } from '../mixedDrills/clusterQuestions'
import {
  generateSocketsRoleQuestion,
  generateSocketsStackBasicsQuestion,
  generateSocketsTcpSequenceQuestion,
  generateSocketsUdpSequenceQuestion,
} from './questions'

export function NetworkingSocketsUnit() {
  return (
    <UnitScaffold
      unitLabel="Networking: Sockets"
      subtopics={[
        {
          id: 'ipc-networking-final-exam-mixed',
          label: 'Final Exam Mixed Drill (IPC + Networking)',
          render: () => (
            <NetworkingDrillPractice
              key="ipc-networking-final-exam-mixed"
              title="IPC + Networking > Final Exam Mixed Drill"
              generateQuestion={generateIpcNetworkingMixedQuestion}
            />
          ),
        },
        {
          id: 'stack-basics',
          label: 'Networking Stack Basics',
          render: () => (
            <NetworkingDrillPractice
              key="net-sockets-stack"
              title="Networking: Sockets > Networking Stack Basics"
              generateQuestion={generateSocketsStackBasicsQuestion}
            />
          ),
        },
        {
          id: 'tcp-call-sequence',
          label: 'TCP Socket Call Sequence',
          render: () => (
            <NetworkingDrillPractice
              key="net-sockets-tcp"
              title="Networking: Sockets > TCP Socket Call Sequence"
              generateQuestion={generateSocketsTcpSequenceQuestion}
            />
          ),
        },
        {
          id: 'udp-call-sequence',
          label: 'UDP Socket Call Sequence',
          render: () => (
            <NetworkingDrillPractice
              key="net-sockets-udp"
              title="Networking: Sockets > UDP Socket Call Sequence"
              generateQuestion={generateSocketsUdpSequenceQuestion}
            />
          ),
        },
        {
          id: 'socket-role-identification',
          label: 'Socket Role Identification',
          render: () => (
            <NetworkingDrillPractice
              key="net-sockets-role"
              title="Networking: Sockets > Socket Role Identification"
              generateQuestion={generateSocketsRoleQuestion}
            />
          ),
        },
      ]}
    />
  )
}

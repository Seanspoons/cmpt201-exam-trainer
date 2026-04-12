import { UnitScaffold } from '../../components/UnitScaffold'
import { NetworkingDrillPractice } from '../networkingShared/networkingDrills'
import {
  generateMultipleClientsAcceptQuestion,
  generateMultipleClientsEpollQuestion,
  generateMultipleClientsLoopQuestion,
  generateMultipleClientsThreadQuestion,
  generateMultipleClientsTradeoffQuestion,
} from './questions'

export function NetworkingMultipleClientsUnit() {
  return (
    <UnitScaffold
      unitLabel="Networking: Multiple Clients"
      subtopics={[
        {
          id: 'accept-per-client-sockets',
          label: 'accept() and Per-Client Sockets',
          render: () => (
            <NetworkingDrillPractice
              key="net-multi-accept"
              title="Networking: Multiple Clients > accept() and Per-Client Sockets"
              generateQuestion={generateMultipleClientsAcceptQuestion}
            />
          ),
        },
        {
          id: 'thread-per-connection',
          label: 'Thread per Connection',
          render: () => (
            <NetworkingDrillPractice
              key="net-multi-thread"
              title="Networking: Multiple Clients > Thread per Connection"
              generateQuestion={generateMultipleClientsThreadQuestion}
            />
          ),
        },
        {
          id: 'non-blocking-socket-loops',
          label: 'Non-Blocking Socket Loops',
          render: () => (
            <NetworkingDrillPractice
              key="net-multi-loop"
              title="Networking: Multiple Clients > Non-Blocking Socket Loops"
              generateQuestion={generateMultipleClientsLoopQuestion}
            />
          ),
        },
        {
          id: 'epoll-multiplexing',
          label: 'epoll()/I/O Multiplexing',
          render: () => (
            <NetworkingDrillPractice
              key="net-multi-epoll"
              title="Networking: Multiple Clients > epoll()/I/O Multiplexing"
              generateQuestion={generateMultipleClientsEpollQuestion}
            />
          ),
        },
        {
          id: 'tradeoffs-resource-costs',
          label: 'Tradeoffs and Resource Costs',
          render: () => (
            <NetworkingDrillPractice
              key="net-multi-tradeoffs"
              title="Networking: Multiple Clients > Tradeoffs and Resource Costs"
              generateQuestion={generateMultipleClientsTradeoffQuestion}
            />
          ),
        },
      ]}
    />
  )
}
